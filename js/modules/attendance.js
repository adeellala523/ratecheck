/* Attendance module: mark, register, defaulters */
Object.assign(I18N.en,{
  at_tab_mark:"Mark Attendance", at_tab_register:"Register", at_tab_defaulters:"Defaulters",
  at_date:"Date", at_class:"Class", at_section:"Section", at_all_sections:"All Sections",
  at_save:"Save Attendance", at_month:"Month", at_pct:"Present %",
  at_p:"P", at_a:"A", at_l:"L",
  at_present:"Present", at_absent:"Absent", at_leave:"Leave",
  at_roll:"Roll No", at_name:"Name",
  at_no_students:"No students in this class/section",
  at_no_records:"No attendance records for this month",
  at_no_defaulters:"All students are above 75% — great!",
  at_defaulter_sub:"below 75% attendance this month",
  at_select_required:"Please select class and section",
  at_day:"Day",
});
Object.assign(I18N.ur,{
  at_tab_mark:"حاضری لگائیں", at_tab_register:"حاضری رجسٹر", at_tab_defaulters:"کم حاضری والے",
  at_date:"تاریخ", at_class:"جماعت", at_section:"سیکشن", at_all_sections:"تمام سیکشنز",
  at_save:"حاضری محفوظ کریں", at_month:"مہینہ", at_pct:"حاضری ٪",
  at_p:"ح", at_a:"غ", at_l:"ر",
  at_present:"حاضر", at_absent:"غیر حاضر", at_leave:"رخصت",
  at_roll:"رول نمبر", at_name:"نام",
  at_no_students:"اس جماعت/سیکشن میں کوئی طالب علم نہیں",
  at_no_records:"اس مہینے کا کوئی حاضری ریکارڈ نہیں",
  at_no_defaulters:"تمام طلبہ کی حاضری 75% سے زائد ہے — شاباش!",
  at_defaulter_sub:"اس ماہ 75% سے کم حاضری",
  at_select_required:"براہ کرم جماعت اور سیکشن منتخب کریں",
  at_day:"دن",
});

const AT = {
  tab:'mark',
  date:todayISO(), classId:'', sectionId:'', marks:{},
  regMonth:todayISO().slice(0,7), regClass:'', regSection:'ALL',
  defMonth:todayISO().slice(0,7), defClass:'', defSection:'ALL',
};

function atSections(classId){ return DB.get('sections').filter(s=>!classId||!s.classId||s.classId===classId); }
function atStudents(classId,sectionId){
  return DB.get('students').filter(s=>(!classId||s.classId===classId)&&(!sectionId||sectionId==='ALL'||s.sectionId===sectionId));
}
function atDaysInMonth(ym){ const p=ym.split('-'); return new Date(Number(p[0]),Number(p[1]),0).getDate(); }
function atMonthLabel(ym){ const p=ym.split('-'); const d=new Date(Number(p[0]),Number(p[1])-1,1); return d.toLocaleDateString(LANG==='ur'?'ur-PK':'en-PK',{month:'long',year:'numeric'}); }

/* default marks for the mark screen: today's saved values, else previous day's, else P */
function atDefaultMarks(date,classId,sectionId,students){
  const docs=DB.get('attendance').filter(d=>d.classId===classId&&d.sectionId===sectionId);
  const cur=docs.find(d=>d.date===date);
  const prev=docs.filter(d=>d.date<date).sort((a,b)=>b.date.localeCompare(a.date))[0];
  const marks={};
  students.forEach(s=>{
    marks[s.id]=(cur&&cur.records&&cur.records[s.id])||(prev&&prev.records&&prev.records[s.id])||'P';
  });
  return marks;
}

function atRender(el){
  const classes=DB.get('classes');
  const tabs=[['mark',t('at_tab_mark')],['register',t('at_tab_register')],['defaulters',t('at_tab_defaulters')]];
  el.innerHTML='<div class="tabs">'+tabs.map(x=>'<button data-tab="'+x[0]+'" class="'+(AT.tab===x[0]?'active':'')+'">'+esc(x[1])+'</button>').join('')+'</div><div id="at-body"></div>'
    +'<style>.attc{font-weight:700;font-size:12px;text-align:center;min-width:24px}.attc.p{color:#15803d}.attc.a{color:#b91c1c}.attc.l{color:#b45309}.attc.n{color:#cbd5e1}</style>';
  el.querySelectorAll('.tabs button').forEach(b=>{ b.onclick=()=>{ AT.tab=b.dataset.tab; App.refresh(); }; });
  const body=el.querySelector('#at-body');
  if(AT.tab==='mark') atRenderMark(body,classes);
  else if(AT.tab==='register') atRenderRegister(body,classes);
  else atRenderDefaulters(body,classes);
}

/* ---------------- MARK ---------------- */
function atRenderMark(body,classes){
  const secs=atSections(AT.classId);
  const students=(AT.classId&&AT.sectionId)?atStudents(AT.classId,AT.sectionId):[];
  if(students.length && !Object.keys(AT.marks).length) AT.marks=atDefaultMarks(AT.date,AT.classId,AT.sectionId,students);

  body.innerHTML='<div class="card"><div class="row">'
    +'<div class="form-group"><label>'+t('at_date')+'</label><input type="date" id="at-date" value="'+AT.date+'"></div>'
    +'<div class="form-group"><label>'+t('at_class')+'</label><select id="at-class"><option value="">—</option>'+classes.map(c=>'<option value="'+c.id+'"'+(AT.classId===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('at_section')+'</label><select id="at-sec"><option value="">—</option>'+secs.map(s=>'<option value="'+s.id+'"'+(AT.sectionId===s.id?' selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select></div>'
    +'</div></div>'
    +'<div class="card">'
    +((!AT.classId||!AT.sectionId)?'<div class="empty"><div class="ic">📋</div><p>'+t('at_select_required')+'</p></div>'
      :!students.length?'<div class="empty"><div class="ic">👥</div><p>'+t('at_no_students')+'</p></div>'
      :'<div class="att-grid">'+students.map(s=>{
          const cur=AT.marks[s.id]||'P';
          return '<div class="att-row"><div class="nm"><b>'+esc(s.name)+'</b><br><small style="color:var(--muted)">'+esc(s.rollNo||'')+'</small></div>'
          +'<div class="seg">'
          +[['P',t('at_p'),t('at_present'),'on-p'],['A',t('at_a'),t('at_absent'),'on-a'],['L',t('at_l'),t('at_leave'),'on-l']].map(x=>'<button data-sid="'+s.id+'" data-v="'+x[0]+'" title="'+esc(x[2])+'" class="'+(cur===x[0]?x[3]:'')+'">'+esc(x[1])+'</button>').join('')
          +'</div></div>'; }).join('')
      +'</div><div class="btnrow" style="margin-top:12px"><button class="btn btn-primary" id="at-save">💾 '+t('at_save')+'</button></div>')
    +'</div>';

  document.getElementById('at-date').onchange=e=>{ AT.date=e.target.value; AT.marks={}; App.refresh(); };
  document.getElementById('at-class').onchange=e=>{ AT.classId=e.target.value; AT.sectionId=''; AT.marks={}; App.refresh(); };
  document.getElementById('at-sec').onchange=e=>{ AT.sectionId=e.target.value; AT.marks={}; App.refresh(); };
  body.querySelectorAll('.seg button').forEach(b=>{
    b.onclick=()=>{
      const sid=b.dataset.sid, v=b.dataset.v;
      AT.marks[sid]=v;
      b.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('on-p','on-a','on-l'));
      b.classList.add(v==='P'?'on-p':v==='A'?'on-a':'on-l');
    };
  });
  const sv=document.getElementById('at-save');
  if(sv) sv.onclick=()=>{
    if(!AT.classId||!AT.sectionId){ App.toast(t('at_select_required')); return; }
    const records={}; students.forEach(s=>{ records[s.id]=AT.marks[s.id]||'P'; });
    const ex=DB.get('attendance').find(d=>d.date===AT.date&&d.classId===AT.classId&&d.sectionId===AT.sectionId);
    if(ex) DB.update('attendance',ex.id,{records:records});
    else DB.add('attendance',{date:AT.date,classId:AT.classId,sectionId:AT.sectionId,records:records});
    App.toast(t('msg_saved'));
  };
}

/* ---------------- REGISTER ---------------- */
function atRenderRegister(body,classes){
  const secs=atSections(AT.regClass);
  const students=AT.regClass?atStudents(AT.regClass,AT.regSection):[];
  const days=atDaysInMonth(AT.regMonth);
  const docs=DB.get('attendance').filter(d=>d.date.startsWith(AT.regMonth)&&d.classId===AT.regClass&&(!AT.regSection||AT.regSection==='ALL'||d.sectionId===AT.regSection));
  const byDate={}; docs.forEach(d=>{ byDate[d.date]=d.records||{}; });

  const pctOf=sid=>{
    let p=0,m=0;
    for(let d=1;d<=days;d++){
      const key=AT.regMonth+'-'+String(d).padStart(2,'0');
      const rec=byDate[key]; if(!rec||!rec[sid]) continue;
      m++; if(rec[sid]==='P') p++;
    }
    return m?{pct:p/m*100,p:p,m:m}:null;
  };

  body.innerHTML='<div class="card"><div class="row">'
    +'<div class="form-group"><label>'+t('at_month')+'</label><input type="month" id="atr-month" value="'+AT.regMonth+'"></div>'
    +'<div class="form-group"><label>'+t('at_class')+'</label><select id="atr-class"><option value="">—</option>'+classes.map(c=>'<option value="'+c.id+'"'+(AT.regClass===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('at_section')+'</label><select id="atr-sec"><option value="ALL">'+t('at_all_sections')+'</option>'+secs.map(s=>'<option value="'+s.id+'"'+(AT.regSection===s.id?' selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select></div>'
    +'</div></div>'
    +'<div class="card">'
    +(!AT.regClass?'<div class="empty"><div class="ic">📋</div><p>'+t('at_select_required')+'</p></div>'
      :!students.length?'<div class="empty"><div class="ic">👥</div><p>'+t('at_no_students')+'</p></div>'
      :!docs.length?'<div class="empty"><div class="ic">📋</div><p>'+t('at_no_records')+'</p></div>'
      :'<div style="margin-bottom:8px"><b>'+esc(atMonthLabel(AT.regMonth))+'</b></div>'
      +'<div class="table-wrap"><table class="tbl"><thead><tr><th>'+t('at_roll')+'</th><th>'+t('at_name')+'</th>'
      +Array.from({length:days},(_,i)=>'<th>'+(i+1)+'</th>').join('')
      +'<th>'+t('at_pct')+'</th></tr></thead><tbody>'
      +students.map(s=>{
          const pc=pctOf(s.id);
          let cells='';
          for(let d=1;d<=days;d++){
            const key=AT.regMonth+'-'+String(d).padStart(2,'0');
            const rec=byDate[key]; const v=rec?rec[s.id]:null;
            const cls=v==='P'?'p':v==='A'?'a':v==='L'?'l':'n';
            cells+='<td><div class="attc '+cls+'">'+(v||'·')+'</div></td>';
          }
          return '<tr><td>'+esc(s.rollNo||'—')+'</td><td>'+esc(s.name)+'</td>'+cells
            +'<td>'+(pc?'<b>'+pc.pct.toFixed(0)+'%</b> <small style="color:var(--muted)">('+pc.p+'/'+pc.m+')</small>':'—')+'</td></tr>';
        }).join('')
      +'</tbody></table></div>')
    +'</div>';

  document.getElementById('atr-month').onchange=e=>{ AT.regMonth=e.target.value; App.refresh(); };
  document.getElementById('atr-class').onchange=e=>{ AT.regClass=e.target.value; AT.regSection='ALL'; App.refresh(); };
  document.getElementById('atr-sec').onchange=e=>{ AT.regSection=e.target.value; App.refresh(); };
}

/* ---------------- DEFAULTERS ---------------- */
function atRenderDefaulters(body,classes){
  const secs=atSections(AT.defClass);
  const students=AT.defClass?atStudents(AT.defClass,AT.defSection):[];
  const days=atDaysInMonth(AT.defMonth);
  const docs=DB.get('attendance').filter(d=>d.date.startsWith(AT.defMonth)&&d.classId===AT.defClass&&(!AT.defSection||AT.defSection==='ALL'||d.sectionId===AT.defSection));
  const byDate={}; docs.forEach(d=>{ byDate[d.date]=d.records||{}; });

  const defs=[];
  students.forEach(s=>{
    let p=0,m=0;
    for(let d=1;d<=days;d++){
      const key=AT.defMonth+'-'+String(d).padStart(2,'0');
      const rec=byDate[key]; if(!rec||!rec[s.id]) continue;
      m++; if(rec[s.id]==='P') p++;
    }
    if(m>0){ const pct=p/m*100; if(pct<75) defs.push({s:s,pct:pct,p:p,m:m}); }
  });
  defs.sort((a,b)=>a.pct-b.pct);

  body.innerHTML='<div class="card"><div class="row">'
    +'<div class="form-group"><label>'+t('at_month')+'</label><input type="month" id="atd-month" value="'+AT.defMonth+'"></div>'
    +'<div class="form-group"><label>'+t('at_class')+'</label><select id="atd-class"><option value="">—</option>'+classes.map(c=>'<option value="'+c.id+'"'+(AT.defClass===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('at_section')+'</label><select id="atd-sec"><option value="ALL">'+t('at_all_sections')+'</option>'+secs.map(s=>'<option value="'+s.id+'"'+(AT.defSection===s.id?' selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select></div>'
    +'</div><p style="color:var(--muted);font-size:13px">⚠️ '+t('at_defaulter_sub')+'</p></div>'
    +'<div class="card">'
    +(!AT.defClass?'<div class="empty"><div class="ic">📋</div><p>'+t('at_select_required')+'</p></div>'
      :!defs.length?'<div class="empty"><div class="ic">✅</div><p>'+t('at_no_defaulters')+'</p></div>'
      :'<div class="table-wrap"><table class="tbl"><thead><tr><th>'+t('at_roll')+'</th><th>'+t('at_name')+'</th><th>'+t('at_pct')+'</th></tr></thead><tbody>'
      +defs.map(x=>'<tr><td>'+esc(x.s.rollNo||'—')+'</td><td>'+esc(x.s.name)+'</td><td><span class="badge b-red">'+x.pct.toFixed(0)+'%</span> <small style="color:var(--muted)">('+x.p+'/'+x.m+')</small></td></tr>').join('')
      +'</tbody></table></div>')
    +'</div>';

  document.getElementById('atd-month').onchange=e=>{ AT.defMonth=e.target.value; App.refresh(); };
  document.getElementById('atd-class').onchange=e=>{ AT.defClass=e.target.value; AT.defSection='ALL'; App.refresh(); };
  document.getElementById('atd-sec').onchange=e=>{ AT.defSection=e.target.value; App.refresh(); };
}

App.register('attendance',{titleKey:'nav_attendance',icon:'📋',roles:['superadmin','principal','teacher'],render:atRender});
