/* App shell: boot, first-run wizard, login (school + role + PIN), router, helpers */
const App = {
  modules: {}, order: [], user: null, current: null, _pin: '', _role: null, _schoolId: null,

  /* ---------- module registry ---------- */
  register(id, def){ this.modules[id] = def; if(!this.order.includes(id)) this.order.push(id); },
  visibleModules(){
    const role = this.user && this.user.role;
    return this.order.filter(id => this.modules[id].roles.includes(role));
  },
  navigate(id){
    if(!this.modules[id]) return;
    this.current = id;
    document.querySelectorAll('.sidenav button, .bottomnav button').forEach(b=>b.classList.toggle('active', b.dataset.mod===id));
    const el = document.getElementById('view');
    el.innerHTML = '';
    try { this.modules[id].render(el); } catch(e){ el.innerHTML = '<div class="card"><h3>Error</h3><p>'+esc(String(e.message||e))+'</p></div>'; }
    window.scrollTo(0,0);
  },
  refresh(){ if(this.current) this.navigate(this.current); },

  /* ---------- helpers ---------- */
  toast(msg){
    const r = document.getElementById('toast-root');
    const d = document.createElement('div'); d.className='toast'; d.textContent = msg;
    r.appendChild(d); setTimeout(()=>{ d.style.opacity='0'; setTimeout(()=>d.remove(),300); }, 2200);
  },
  confirm(message){
    return new Promise(res=>{
      const r = document.getElementById('modal-root');
      r.innerHTML = '<div class="modal"><p style="font-size:15px">'+esc(message)+'</p><div class="btnrow" style="justify-content:flex-end"><button class="btn btn-ghost" id="m-no">'+t('msg_no')+'</button><button class="btn btn-danger" id="m-yes">'+t('msg_yes')+'</button></div></div>';
      r.classList.add('show');
      const done = v => { r.classList.remove('show'); r.innerHTML=''; res(v); };
      document.getElementById('m-yes').onclick = ()=>done(true);
      document.getElementById('m-no').onclick = ()=>done(false);
    });
  },
  modal(html){
    const r = document.getElementById('modal-root');
    r.innerHTML = '<div class="modal" style="max-width:560px;max-height:88vh;overflow:auto">'+html+'</div>';
    r.classList.add('show');
  },
  closeModal(){ const r=document.getElementById('modal-root'); r.classList.remove('show'); r.innerHTML=''; },
  print(html, title){
    const pr = document.getElementById('print-root');
    pr.innerHTML = '<div class="print-doc">'+html+'</div>';
    document.body.classList.add('printing');
    setTimeout(()=>{ window.print(); }, 60);
  },
  download(filename, content, mime){
    const b = new Blob([content], {type: mime||'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = filename; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
  },

  /* ---------- boot ---------- */
  boot(){
    document.documentElement.lang = LANG;
    document.documentElement.dir = (LANG==='ur') ? 'rtl' : 'ltr';
    try{
      if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
    }catch(e){}
    const reg = this.registry();
    if(!reg.length) this.wizard(0, {});
    else this.loginScreen();
    this.netWatch();
  },
  registry(){
    try { return JSON.parse(localStorage.getItem('sams_registry')||'[]'); } catch(e){ return []; }
  },
  saveRegistry(r){ localStorage.setItem('sams_registry', JSON.stringify(r)); },

  /* ---------- first-run wizard ---------- */
  wizard(step, d){
    const app = document.getElementById('app');
    const steps = [0,1,2,3];
    let body = '';
    if(step===0) body = '<div class="form-group"><label>'+t('wz_school')+'</label><input type="text" id="wz-name" placeholder="'+t('ph_school_name')+'" value="'+esc(d.name||'')+'"></div>'
      + '<div class="form-group"><label>'+t('wz_logo')+'</label><input type="file" id="wz-logo" accept="image/*"></div>';
    if(step===1) body = '<div class="form-group"><label>'+t('wz_session')+'</label><input type="text" id="wz-session" placeholder="'+t('ph_session')+'" value="'+esc(d.session||'')+'"></div>';
    if(step===2) body = '<div class="form-group"><label>'+t('wz_pin_super')+'</label><input type="password" id="wz-p0" inputmode="numeric" maxlength="8"></div>'
      + '<div class="form-group"><label>'+t('wz_pin_admin')+'</label><input type="password" id="wz-p1" inputmode="numeric" maxlength="8"></div>'
      + '<div class="form-group"><label>'+t('wz_pin_teacher')+'</label><input type="password" id="wz-p2" inputmode="numeric" maxlength="8"></div>'
      + '<div class="form-group"><label>'+t('wz_pin_exam')+'</label><input type="password" id="wz-p3" inputmode="numeric" maxlength="8"></div>';
    if(step===3) body = '<p>🏫 <b>'+esc(d.name||'')+'</b><br>📅 '+esc(d.session||'')+'</p><p style="color:var(--muted);font-size:13px">'+t('demo_notice')+'</p>';
    app.innerHTML = '<div class="centerwrap"><div class="authcard"><div class="logo-big">🏫</div><h2>'+t('setup_wizard')+'</h2>'
      + '<div class="steps">'+steps.map(s=>'<i class="'+(s<=step?'on':'')+'"></i>').join('')+'</div>'
      + body
      + '<div class="btnrow" style="justify-content:space-between">'
      + (step>0 ? '<button class="btn btn-ghost" id="wz-back">'+t('btn_back')+'</button>' : '<span></span>')
      + '<button class="btn btn-primary" id="wz-next">'+(step===3?t('btn_finish'):t('btn_next'))+'</button></div>'
      + '<div style="margin-top:10px"><button class="iconbtn" style="color:var(--navy);background:#eef3fa" onclick="setLang(LANG===\'ur\'?\'en\':\'ur\')">'+t('lang_name')+'</button></div>'
      + '</div></div>';
    const next = document.getElementById('wz-next'), back = document.getElementById('wz-back');
    if(back) back.onclick = ()=>this.wizard(step-1, this._collectWz(step,d));
    next.onclick = ()=>{
      const nd = this._collectWz(step,d);
      if(step===0 && !nd.name){ this.toast(t('msg_required')); return; }
      if(step===2){
        const pins=[nd.p0,nd.p1,nd.p2,nd.p3];
        if(pins.some(p=>!p || p.length<4)){ this.toast(t('msg_required')); return; }
      }
      if(step===3){ this._finishWizard(nd); return; }
      // logo file
      const lf = document.getElementById('wz-logo');
      if(step===0 && lf && lf.files[0]){
        const r = new FileReader();
        r.onload = ()=>{ nd.logo = r.result; this.wizard(step+1, nd); };
        r.readAsDataURL(lf.files[0]); return;
      }
      this.wizard(step+1, nd);
    };
  },
  _collectWz(step,d){
    const v = id => { const e=document.getElementById(id); return e?e.value.trim():''; };
    if(step===0){ d.name=v('wz-name'); }
    if(step===1){ d.session=v('wz-session'); }
    if(step===2){ d.p0=v('wz-p0'); d.p1=v('wz-p1'); d.p2=v('wz-p2'); d.p3=v('wz-p3'); }
    return d;
  },
  _finishWizard(d){
    const id = 'sch_' + Date.now().toString(36);
    DB.init(id);
    DB.data.meta = { name:d.name, logo:d.logo||'', session:d.session||'',
      pins:{ superadmin:d.p0, principal:d.p1, teacher:d.p2, exam:d.p3 }, created:Date.now() };
    DB.add('sessions', { name:d.session||'', active:true });
    Seed.run();
    DB.save();
    const reg = this.registry(); reg.push({id, name:d.name}); this.saveRegistry(reg);
    this._schoolId = id; this.loginScreen();
    this.toast(t('msg_saved'));
  },

  /* ---------- login ---------- */
  loginScreen(){
    const reg = this.registry();
    const app = document.getElementById('app');
    if(!this._schoolId && reg.length) this._schoolId = reg[0].id;
    const roles = [['superadmin','🛡️'],['principal','👔'],['teacher','👩‍🏫'],['exam','📝']];
    app.innerHTML = '<div class="centerwrap"><div class="authcard"><div class="logo-big">🏫</div>'
      + '<h2>'+t('app_name')+'</h2><p style="color:var(--muted);margin-top:-8px">'+t('app_tag')+'</p>'
      + (reg.length>1 ? '<div class="form-group" style="text-align:start"><label>'+t('select_school')+'</label><select id="li-school">'+reg.map(s=>'<option value="'+s.id+'"'+(s.id===this._schoolId?' selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select></div>' : '')
      + '<p style="font-weight:700;color:var(--navy)">'+t('select_role')+'</p>'
      + '<div class="rolegrid">' + roles.map(r=>'<div class="rolecard" data-role="'+r[0]+'"><div class="ic">'+r[1]+'</div><div style="font-size:13px;font-weight:700">'+t('role_'+r[0])+'</div></div>').join('') + '</div>'
      + '<div id="pinzone" style="display:none"><p style="font-weight:700;color:var(--navy)">'+t('enter_pin')+'</p><div class="pindots" id="pindots"></div><div class="pinpad">'
      + [1,2,3,4,5,6,7,8,9,'⌫',0,'✔'].map(k=>'<button data-k="'+k+'">'+k+'</button>').join('') + '</div></div>'
      + '<div class="btnrow" style="justify-content:center;margin-top:14px"><button class="btn btn-ghost btn-sm" id="li-addschool">+ '+t('btn_add_school')+'</button> '
      + '<button class="iconbtn" style="color:var(--navy);background:#eef3fa" onclick="setLang(LANG===\'ur\'?\'en\':\'ur\')">'+t('lang_name')+'</button></div>'
      + '</div></div>';
    const sc = document.getElementById('li-school');
    if(sc) sc.onchange = ()=>{ this._schoolId = sc.value; };
    document.querySelectorAll('.rolecard').forEach(c=>{
      c.onclick = ()=>{
        document.querySelectorAll('.rolecard').forEach(x=>x.classList.remove('sel'));
        c.classList.add('sel'); this._role = c.dataset.role; this._pin='';
        document.getElementById('pinzone').style.display='block';
        this._drawPin();
      };
    });
    document.querySelectorAll('.pinpad button').forEach(b=>{
      b.onclick = ()=>{
        const k = b.dataset.k;
        if(!this._role) return;
        if(k==='⌫') this._pin = this._pin.slice(0,-1);
        else if(k==='✔') this._tryLogin();
        else if(this._pin.length<8) this._pin += k;
        this._drawPin();
      };
    });
    document.getElementById('li-addschool').onclick = ()=>this.wizard(0,{});
  },
  _drawPin(){ const d=document.getElementById('pindots'); if(d) d.textContent = '●'.repeat(this._pin.length); },
  _tryLogin(){
    DB.init(this._schoolId);
    const pins = DB.meta().pins || {};
    if(pins[this._role] && this._pin === String(pins[this._role])){
      this.user = { schoolId:this._schoolId, role:this._role };
      this._pin=''; this.shell();
    } else {
      this.toast(t('wrong_pin')); this._pin=''; this._drawPin();
    }
  },

  /* ---------- main shell ---------- */
  shell(){
    const m = DB.meta();
    const app = document.getElementById('app');
    const mods = this.visibleModules();
    const navBtn = id => { const d=this.modules[id]; return '<button data-mod="'+id+'"><span class="ic">'+d.icon+'</span><span>'+t(d.titleKey)+'</span></button>'; };
    app.innerHTML =
      '<div class="topbar"><div class="logo">'+(m.logo?'<img src="'+m.logo+'" alt="">':'🏫')+'</div>'
      + '<div class="titles"><b>'+esc(m.name)+'</b><span>'+t('role_'+this.user.role)+' · '+esc(m.session||'')+'<span class="netdot" id="netdot" title="net"></span></span></div>'
      + '<button class="iconbtn" id="lang-toggle" onclick="setLang(LANG===\'ur\'?\'en\':\'ur\')">'+t('lang_name')+'</button>'
      + '<button class="iconbtn" id="btn-logout" title="'+t('btn_logout')+'">⏻</button></div>'
      + '<div class="shell"><nav class="sidenav">'+mods.map(navBtn).join('')+'</nav>'
      + '<main class="mainview" id="view"></main></div>'
      + '<nav class="bottomnav">'+mods.map(navBtn).join('')+'</nav>';
    document.querySelectorAll('[data-mod]').forEach(b=>{ b.onclick=()=>this.navigate(b.dataset.mod); });
    document.getElementById('btn-logout').onclick = ()=>{ this.user=null; this.current=null; this.loginScreen(); };
    document.getElementById('lang-toggle').textContent = t('lang_name');
    this.navigate(mods.includes('dashboard') ? 'dashboard' : mods[0]);
  },
  netWatch(){
    const up = ()=>{ const d=document.getElementById('netdot'); if(d){ d.classList.toggle('off', !navigator.onLine); d.title = navigator.onLine? t('online'):t('offline'); } };
    window.addEventListener('online', up); window.addEventListener('offline', up);
    setTimeout(up, 500);
  }
};

/* globals */
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function todayISO(){ return new Date().toISOString().slice(0,10); }
function fmtDate(iso){ if(!iso) return '—'; try{ return new Date(iso+'T00:00:00').toLocaleDateString(LANG==='ur'?'ur-PK':'en-PK',{day:'numeric',month:'short',year:'numeric'}); }catch(e){ return iso; } }
function fmtNum(n){ return Number(n||0).toLocaleString(LANG==='ur'?'ur-PK':'en-PK'); }
