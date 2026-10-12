/* ===== Paper Checking (checking) — enter per-question marks per student ===== */
Object.assign(I18N.en,{
  ck_queue_title:"Papers to check", ck_not_started:"Not started", ck_checked_fmt:"{x}/{y} checked",
  ck_start:"Start", ck_continue:"Continue", ck_back:"Back",
  ck_class:"Class", ck_section:"Section", ck_select_cs:"Select class and section first.",
  ck_no_students:"No students in this class / section.",
  ck_no_questions:"This paper has no questions yet.",
  ck_save_row:"Save", ck_save_all:"Save All", ck_saved:"Marks saved",
  ck_total:"Total", ck_grade:"Grade", ck_max:"max",
  ck_empty_queue:"No papers yet — generate one from the Paper Generator.",
});
Object.assign(I18N.ur,{
  ck_queue_title:"چیک کرنے والے پیپرز", ck_not_started:"شروع نہیں ہوا", ck_checked_fmt:"{x}/{y} چیک شدہ",
  ck_start:"شروع کریں", ck_continue:"جاری رکھیں", ck_back:"واپس",
  ck_class:"جماعت", ck_section:"سیکشن", ck_select_cs:"پہلے جماعت اور سیکشن منتخب کریں۔",
  ck_no_students:"اس جماعت / سیکشن میں کوئی طالب علم نہیں۔",
  ck_no_questions:"اس پیپر میں ابھی کوئی سوال نہیں۔",
  ck_save_row:"محفوظ کریں", ck_save_all:"سب محفوظ کریں", ck_saved:"نمبرات محفوظ ہو گئے",
  ck_total:"کل", ck_grade:"گریڈ", ck_max:"زیادہ سے زیادہ",
  ck_empty_queue:"ابھی کوئی پیپر نہیں — پیپر جنریٹر سے بنائیں۔",
});

var CK={paperId:null, classId:'', sectionId:'', draft:{}};
function ckFmt(key,x,y){ return t(key).split('{x}').join(x).split('{y}').join(y); }
function ckGrade(p){ return p>=90?'A+':p>=80?'A':p>=70?'B':p>=60?'C':p>=50?'D':'F'; }
function ckGradeBadge(g){
  var c=g==='A+'||g==='A'?'b-green':(g==='B'||g==='C')?'b-blue':g==='D'?'b-orange':'b-red';
  return '<span class="badge '+c+'">'+g+'</span>';
}
function ckFindRec(paperId, classId, sectionId){
  return DB.get('checkings').find(function(c){return c.paperId===paperId&&c.classId===classId&&c.sectionId===sectionId;});
}

App.register('checking',{titleKey:'nav_checking', icon:'✅', roles:['superadmin','principal','teacher','exam'], render:function(el){
  if(CK.paperId) ckSession(el); else ckQueue(el);
}});

/* ---------- Queue ---------- */
function ckQueue(el){
  var papers=DB.get('papers').slice().sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);});
  if(!papers.length){ el.innerHTML='<div class="empty"><div class="ic">✅</div>'+t('ck_empty_queue')+'</div>'; return; }
  var students=DB.get('students'), checks=DB.get('checkings');
  var rows=papers.map(function(p){
    var recs=checks.filter(function(c){return c.paperId===p.id;});
    var stuIds={}, doneIds={};
    recs.forEach(function(r){
      students.forEach(function(s){ if(s.classId===r.classId&&(!r.sectionId||s.sectionId===r.sectionId)) stuIds[s.id]=1; });
      (r.entries||[]).forEach(function(e){ if((+e.total||0)>0) doneIds[e.studentId]=1; });
    });
    var y=Object.keys(stuIds).length, x=Object.keys(doneIds).length;
    var badge=(x===0)?'<span class="badge b-gray">'+t('ck_not_started')+'</span>'
      :(x>=y&&y>0)?'<span class="badge b-green">'+ckFmt('ck_checked_fmt',fmtNum(x),fmtNum(y))+'</span>'
      :'<span class="badge b-orange">'+ckFmt('ck_checked_fmt',fmtNum(x),fmtNum(y))+'</span>';
    return '<tr><td><b>'+esc(p.title)+'</b><br><span style="font-size:12px;color:var(--muted)">'+esc(DB.className(p.classId))+' / '+esc(DB.subjectName(p.subjectId))+' · '+fmtDate(p.date||'')+'</span></td>'
      +'<td>'+badge+'</td>'
      +'<td style="white-space:nowrap"><button class="btn btn-primary btn-sm" data-ck="'+p.id+'">'+(recs.length?t('ck_continue'):t('ck_start'))+'</button></td></tr>';
  }).join('');
  el.innerHTML='<div class="card"><h3 style="margin-top:0">✅ '+t('ck_queue_title')+'</h3>'
    +'<div class="table-wrap"><table class="tbl"><tbody>'+rows+'</tbody></table></div></div>';
  el.querySelectorAll('button[data-ck]').forEach(function(b){
    b.onclick=function(){
      CK.paperId=b.dataset.ck;
      var recs=DB.get('checkings').filter(function(c){return c.paperId===CK.paperId;}).sort(function(a,c){return (c.updatedAt||0)-(a.updatedAt||0);});
      CK.classId=recs.length?recs[0].classId:''; CK.sectionId=recs.length?recs[0].sectionId:''; CK.draft={};
      App.refresh();
    };
  });
}

/* ---------- Checking session ---------- */
function ckSession(el){
  var p=DB.find('papers',CK.paperId);
  if(!p){ CK.paperId=null; App.refresh(); return; }
  var qs=p.questions||[];
  var maxTotal=qs.reduce(function(s,q){return s+(+q.marks||0);},0);
  var classes=DB.get('classes');
  var sections=DB.get('sections').filter(function(s){return !CK.classId||s.classId===CK.classId;});

  var h='<div class="card"><div class="toolbar"><button class="btn btn-ghost btn-sm" id="ck-back">← '+t('ck_back')+'</button>'
    +'<b>'+esc(p.title)+'</b><span class="chip">'+t('ck_total')+': '+fmtNum(maxTotal)+'</span></div>'
    +'<div class="row"><div class="form-group"><label>'+t('ck_class')+'</label><select id="ck-class"><option value="">'+t('pp_select')+'</option>'
    +classes.map(function(c){return '<option value="'+c.id+'"'+(CK.classId===c.id?' selected':'')+'>'+esc(c.name)+'</option>';}).join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('ck_section')+'</label><select id="ck-sec"><option value="">'+t('pp_select')+'</option>'
    +sections.map(function(s){return '<option value="'+s.id+'"'+(CK.sectionId===s.id?' selected':'')+'>'+esc(s.name)+'</option>';}).join('')+'</select></div></div></div>';

  if(!CK.classId||!CK.sectionId){
    el.innerHTML=h+'<div class="empty"><div class="ic">👥</div>'+t('ck_select_cs')+'</div>';
    ckBindSelects(el); return;
  }
  if(!qs.length){ el.innerHTML=h+'<div class="empty"><div class="ic">📝</div>'+t('ck_no_questions')+'</div>'; ckBindSelects(el); return; }
  var students=DB.get('students').filter(function(s){return s.classId===CK.classId&&s.sectionId===CK.sectionId;})
    .sort(function(a,b){return String(a.rollNo||a.name).localeCompare(String(b.rollNo||b.name));});
  if(!students.length){ el.innerHTML=h+'<div class="empty"><div class="ic">👥</div>'+t('ck_no_students')+'</div>'; ckBindSelects(el); return; }

  var rec=ckFindRec(CK.paperId,CK.classId,CK.sectionId);
  var emap={}; if(rec) (rec.entries||[]).forEach(function(e){emap[e.studentId]=e;});
  CK.draft={};
  students.forEach(function(s){ var e=emap[s.id]; CK.draft[s.id]=(e&&e.marks?e.marks.slice():qs.map(function(){return '';}) ); });

  h+='<div class="card"><div class="toolbar"><b>👥 '+fmtNum(students.length)+'</b><span style="flex:1"></span>'
    +'<button class="btn btn-green btn-sm" id="ck-saveall">💾 '+t('ck_save_all')+'</button></div><div id="ck-rows">'
    +students.map(function(s){return ckRowHTML(s,qs);}).join('')+'</div>'
    +'<div class="btnrow"><button class="btn btn-green" id="ck-saveall2">💾 '+t('ck_save_all')+'</button></div></div>';
  el.innerHTML=h;
  ckBindSelects(el);

  el.querySelectorAll('.ck-row').forEach(function(row){ ckRecalcRow(row, maxTotal); });
  el.querySelectorAll('input.ck-m').forEach(function(inp){
    inp.oninput=function(){
      var row=inp.closest('.ck-row'), sid=row.dataset.sid, qi=+inp.dataset.qi;
      var v=inp.value===''? '' : Math.max(0, Math.min(+qs[qi].marks||0, +inp.value||0));
      CK.draft[sid][qi]=v;
      ckRecalcRow(row, maxTotal);
    };
  });
  el.querySelectorAll('button[data-sv]').forEach(function(b){
    b.onclick=function(){ ckSaveStudents([b.dataset.sv], p); };
  });
  function saveAll(){ ckSaveStudents(students.map(function(s){return s.id;}), p); }
  document.getElementById('ck-saveall').onclick=saveAll;
  document.getElementById('ck-saveall2').onclick=saveAll;
}

function ckBindSelects(el){
  var sc=el.querySelector('#ck-class'), ss=el.querySelector('#ck-sec');
  if(sc) sc.onchange=function(){ CK.classId=sc.value; CK.sectionId=''; CK.draft={}; App.refresh(); };
  if(ss) ss.onchange=function(){ CK.sectionId=ss.value; CK.draft={}; App.refresh(); };
  var bk=el.querySelector('#ck-back');
  if(bk) bk.onclick=function(){ CK.paperId=null; CK.classId=''; CK.sectionId=''; CK.draft={}; App.refresh(); };
}

function ckRowHTML(s,qs){
  var marks=CK.draft[s.id];
  var cells=qs.map(function(q,i){
    var v=marks[i]===''? '':marks[i];
    return '<div style="min-width:56px"><div style="font-size:10.5px;color:var(--muted)">Q'+(i+1)+' <span style="font-weight:700">/'+(q.marks||0)+'</span></div>'
      +'<input type="number" class="ck-m" data-qi="'+i+'" min="0" max="'+(q.marks||0)+'" value="'+v+'" style="width:100%;padding:6px;border:1px solid var(--line);border-radius:8px" inputmode="numeric"></div>';
  }).join('');
  return '<div class="ck-row" data-sid="'+s.id+'" style="border:1px solid var(--line);border-radius:12px;padding:10px;margin-bottom:10px;background:#fff">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px"><div><b>'+esc(s.name)+'</b>'
    +(s.rollNo?' <span class="chip">#'+esc(s.rollNo)+'</span>':'')+'</div>'
    +'<button class="btn btn-ghost btn-sm" data-sv="'+s.id+'">💾 '+t('ck_save_row')+'</button></div>'
    +'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:6px">'+cells+'</div>'
    +'<div style="display:flex;gap:10px;align-items:center;margin-top:8px;font-size:14px"><span>'+t('ck_total')+': <b class="ck-t">0</b></span>'
    +'<span class="ck-p" style="color:var(--muted)">0%</span><span class="ck-g"></span></div></div>';
}

function ckRecalcRow(row, maxTotal){
  var tot=0;
  row.querySelectorAll('input.ck-m').forEach(function(inp){ tot+=+inp.value||0; });
  var pct=maxTotal>0?Math.round(tot/maxTotal*100):0;
  row.querySelector('.ck-t').textContent=fmtNum(tot)+' / '+fmtNum(maxTotal);
  row.querySelector('.ck-p').textContent=pct+'%';
  row.querySelector('.ck-g').innerHTML=ckGradeBadge(ckGrade(pct));
}

function ckSaveStudents(ids, p){
  var qs=p.questions||[];
  var rec=ckFindRec(CK.paperId,CK.classId,CK.sectionId);
  var emap={}; if(rec) (rec.entries||[]).forEach(function(e){emap[e.studentId]=e;});
  ids.forEach(function(sid){
    var marks=(CK.draft[sid]||[]).map(function(v,i){ return v===''?0:Math.max(0,Math.min(+qs[i].marks||0,+v||0)); });
    while(marks.length<qs.length) marks.push(0);
    var total=marks.reduce(function(s,m){return s+m;},0);
    emap[sid]={studentId:sid, marks:marks, total:total};
  });
  var entries=Object.keys(emap).map(function(k){return emap[k];});
  if(rec) DB.update('checkings', rec.id, {entries:entries, updatedAt:Date.now()});
  else DB.add('checkings',{paperId:CK.paperId, classId:CK.classId, sectionId:CK.sectionId, entries:entries, updatedAt:Date.now()});
  App.toast(t('ck_saved'));
}
