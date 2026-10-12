/* Results module: marks entry, merit list, report cards */
Object.assign(I18N.en,{
  rs_tab_entry:"Entry", rs_tab_merit:"Merit List", rs_tab_report:"Report Card",
  rs_exam_title:"Exam Title", rs_exam_title_ph:"e.g. First Term 2026",
  rs_class:"Class", rs_section:"Section", rs_subject:"Subject",
  rs_all_subjects:"All Subjects", rs_all_sections:"All Sections",
  rs_max_marks:"Max Marks", rs_roll:"Roll No", rs_total:"Total", rs_percent:"%",
  rs_grade:"Grade", rs_position:"Position", rs_marks:"Marks", rs_obtained:"Obtained",
  rs_save_results:"Save Results", rs_exam:"Exam", rs_student:"Student",
  rs_father:"Father's Name", rs_remarks:"Remarks",
  rs_print_card:"Print Report Card", rs_whatsapp:"Share on WhatsApp",
  rs_no_exams:"No exams found yet", rs_no_students:"No students in this class",
  rs_no_subjects:"No subjects found for this class",
  rs_select_exam:"Select Exam", rs_select_student:"Select Student",
  rs_msg_no_phone:"No phone number saved for this student",
  rs_rem_a1:"Outstanding! Keep up the excellent work.",
  rs_rem_a:"Excellent performance. Well done!",
  rs_rem_b:"Good work. Keep improving.",
  rs_rem_c:"Satisfactory. More effort is needed.",
  rs_rem_d:"Needs improvement. Work harder.",
  rs_rem_f:"Failed. Needs serious effort and guidance.",
  rs_report_title:"Report Card", rs_class_teacher:"Class Teacher", rs_principal:"Principal",
  rs_parent_sign:"Parent/Guardian", rs_of:"of",
});
Object.assign(I18N.ur,{
  rs_tab_entry:"اندراج", rs_tab_merit:"میرٹ لسٹ", rs_tab_report:"رپورٹ کارڈ",
  rs_exam_title:"امتحان کا عنوان", rs_exam_title_ph:"مثلاً پہلی ٹرم 2026",
  rs_class:"جماعت", rs_section:"سیکشن", rs_subject:"مضمون",
  rs_all_subjects:"تمام مضامین", rs_all_sections:"تمام سیکشنز",
  rs_max_marks:"کل نمبر", rs_roll:"رول نمبر", rs_total:"کل", rs_percent:"٪",
  rs_grade:"گریڈ", rs_position:"پوزیشن", rs_marks:"نمبر", rs_obtained:"حاصل کردہ",
  rs_save_results:"نتائج محفوظ کریں", rs_exam:"امتحان", rs_student:"طالب علم",
  rs_father:"والد کا نام", rs_remarks:"تبصرہ",
  rs_print_card:"رپورٹ کارڈ پرنٹ کریں", rs_whatsapp:"واٹس ایپ پر بھیجیں",
  rs_no_exams:"ابھی کوئی امتحان نہیں ملا", rs_no_students:"اس جماعت میں کوئی طالب علم نہیں",
  rs_no_subjects:"اس جماعت کے لیے کوئی مضمون نہیں ملا",
  rs_select_exam:"امتحان منتخب کریں", rs_select_student:"طالب علم منتخب کریں",
  rs_msg_no_phone:"اس طالب علم کا فون نمبر محفوظ نہیں ہے",
  rs_rem_a1:"شاندار! اسی طرح محنت جاری رکھیں۔",
  rs_rem_a:"بہترین کارکردگی۔ شاباش!",
  rs_rem_b:"اچھی کوشش۔ مزید بہتر بنائیں۔",
  rs_rem_c:"تسلی بخش۔ مزید محنت درکار ہے۔",
  rs_rem_d:"بہتری کی ضرورت ہے۔ مزید محنت کریں۔",
  rs_rem_f:"ناکام۔ سنجیدہ محنت اور رہنمائی درکار ہے۔",
  rs_report_title:"رپورٹ کارڈ", rs_class_teacher:"کلاس ٹیچر", rs_principal:"پرنسپل",
  rs_parent_sign:"والد/سرپرست", rs_of:"میں سے",
});

function gradeOf(p){ return p>=90?'A+':p>=80?'A':p>=70?'B':p>=60?'C':p>=50?'D':'F'; }

const RS = {
  tab:'entry',
  examTitle:'', classId:'', sectionId:'ALL', subjectId:'ALL', maxMarks:100,
  meritExam:'', meritClass:'', rcExam:'', rcClass:'', rcStudent:'',
};

function rsSections(classId){ return DB.get('sections').filter(s=>!classId||!s.classId||s.classId===classId); }
function rsSubjects(classId){ return DB.get('subjects').filter(s=>!classId||!s.classId||s.classId===classId); }
function rsStudents(classId, sectionId){
  return DB.get('students').filter(s=>(!classId||s.classId===classId)&&(!sectionId||sectionId==='ALL'||s.sectionId===sectionId));
}
function rsExamTitles(){ return [...new Set(DB.get('results').map(r=>r.examTitle).filter(Boolean))]; }
function rsColumnSubjects(){
  if(RS.subjectId!=='ALL'){ const s=DB.find('subjects',RS.subjectId); return s?[s]:[]; }
  return rsSubjects(RS.classId);
}
function rsFindDoc(examTitle,classId,sectionId){
  return DB.get('results').find(r=>r.examTitle===examTitle&&r.classId===classId&&r.sectionId===sectionId);
}
function rsPositions(rows){ // rows: [{studentId,total}] -> {studentId:position}, ties share position
  const sorted=[...rows].sort((a,b)=>b.total-a.total);
  const pos={}; let lastTotal=null,lastPos=0;
  sorted.forEach((r,i)=>{ if(r.total!==lastTotal){ lastPos=i+1; lastTotal=r.total; } pos[r.studentId]=lastPos; });
  return pos;
}
/* aggregate an exam (+class) across its section docs: total/max per student */
function rsMerit(examTitle,classId){
  const docs=DB.get('results').filter(r=>r.examTitle===examTitle&&r.classId===classId);
  const agg={};
  docs.forEach(d=>{
    (d.entries||[]).forEach(e=>{
      const keys=Object.keys(e.marks||{});
      const tot=keys.reduce((a,k)=>a+Number(e.marks[k]||0),0);
      const mx=keys.length*(Number(d.maxMarks)||100);
      if(!agg[e.studentId]) agg[e.studentId]={total:0,max:0};
      agg[e.studentId].total+=tot; agg[e.studentId].max+=mx;
    });
  });
  const rows=Object.keys(agg).map(sid=>{
    const a=agg[sid], pct=a.max?(a.total/a.max*100):0;
    return {studentId:sid,total:a.total,max:a.max,pct:pct,grade:gradeOf(pct)};
  });
  const pos=rsPositions(rows);
  rows.forEach(r=>r.pos=pos[r.studentId]);
  rows.sort((a,b)=>a.pos-b.pos);
  return rows;
}
function rsRemark(grade){
  return { 'A+':'rs_rem_a1','A':'rs_rem_a','B':'rs_rem_b','C':'rs_rem_c','D':'rs_rem_d','F':'rs_rem_f' }[grade] || 'rs_rem_c';
}
function rsWaPhone(contact){
  let d=String(contact||'').replace(/\D/g,'');
  if(d.length===11&&d[0]==='0') d='92'+d.slice(1);
  return d;
}
function ordinal(n){ const s=["th","st","nd","rd"],v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); }

function rsRender(el){
  const classes=DB.get('classes');
  const tabs=[['entry',t('rs_tab_entry')],['merit',t('rs_tab_merit')],['report',t('rs_tab_report')]];
  el.innerHTML='<div class="tabs">'+tabs.map(x=>'<button data-tab="'+x[0]+'" class="'+(RS.tab===x[0]?'active':'')+'">'+esc(x[1])+'</button>').join('')+'</div><div id="rs-body"></div>';
  el.querySelectorAll('.tabs button').forEach(b=>{ b.onclick=()=>{ RS.tab=b.dataset.tab; App.refresh(); }; });
  const body=el.querySelector('#rs-body');
  if(RS.tab==='entry') rsRenderEntry(body,classes);
  else if(RS.tab==='merit') rsRenderMerit(body,classes);
  else rsRenderReport(body,classes);
}

/* ---------------- ENTRY ---------------- */
function rsRenderEntry(body,classes){
  const secs=rsSections(RS.classId), subs=rsSubjects(RS.classId);
  const students=RS.classId?rsStudents(RS.classId,RS.sectionId):[];
  const cols=RS.classId?rsColumnSubjects():[];
  const doc=(RS.examTitle.trim()&&RS.classId)?rsFindDoc(RS.examTitle.trim(),RS.classId,RS.sectionId==='ALL'?'':RS.sectionId):null;
  const oldMarks={}; (doc&&doc.entries||[]).forEach(e=>{ oldMarks[e.studentId]=e.marks||{}; });

  body.innerHTML='<div class="card">'
    +'<div class="row">'
    +'<div class="form-group"><label>'+t('rs_exam_title')+'</label><input type="text" id="rs-title" placeholder="'+esc(t('rs_exam_title_ph'))+'" value="'+esc(RS.examTitle)+'"></div>'
    +'<div class="form-group"><label>'+t('rs_class')+'</label><select id="rs-class"><option value="">—</option>'+classes.map(c=>'<option value="'+c.id+'"'+(RS.classId===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('rs_section')+'</label><select id="rs-sec"><option value="ALL">'+t('rs_all_sections')+'</option>'+secs.map(s=>'<option value="'+s.id+'"'+(RS.sectionId===s.id?' selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('rs_subject')+'</label><select id="rs-sub"><option value="ALL">'+t('rs_all_subjects')+'</option>'+subs.map(s=>'<option value="'+s.id+'"'+(RS.subjectId===s.id?' selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('rs_max_marks')+'</label><input type="number" id="rs-max" min="1" value="'+RS.maxMarks+'"></div>'
    +'</div></div>'
    +'<div class="card">'
    +(!RS.classId?'<div class="empty"><div class="ic">🏆</div><p>'+t('rs_no_students')+'</p></div>'
      :!subs.length?'<div class="empty"><div class="ic">📚</div><p>'+t('rs_no_subjects')+'</p></div>'
      :!students.length?'<div class="empty"><div class="ic">👥</div><p>'+t('rs_no_students')+'</p></div>'
      :'<div class="table-wrap"><table class="tbl"><thead><tr><th>'+t('rs_roll')+'</th><th>'+t('name')+'</th>'
        +cols.map(c=>'<th>'+esc(c.name)+'<br><small>'+t('rs_of')+' '+RS.maxMarks+'</small></th>').join('')
        +'</tr></thead><tbody>'
        +students.map(s=>'<tr><td>'+esc(s.rollNo||'—')+'</td><td>'+esc(s.name)+'</td>'
          +cols.map(c=>{ const v=(oldMarks[s.id]&&oldMarks[s.id][c.id]!==undefined)?oldMarks[s.id][c.id]:'';
            return '<td><input type="number" min="0" max="'+RS.maxMarks+'" id="rsm_'+s.id+'_'+c.id+'" value="'+esc(String(v))+'" style="width:76px" inputmode="numeric"></td>'; }).join('')
        +'</tr>').join('')
        +'</tbody></table></div>'
        +'<div class="btnrow" style="margin-top:12px"><button class="btn btn-primary" id="rs-save">💾 '+t('rs_save_results')+'</button></div>')
    +'</div>';

  const re=x=>{ const e=document.getElementById(x); return e?e.value:''; };
  document.getElementById('rs-title').oninput=e=>{ RS.examTitle=e.target.value; };
  document.getElementById('rs-class').onchange=e=>{ RS.classId=e.target.value; RS.sectionId='ALL'; RS.subjectId='ALL'; App.refresh(); };
  document.getElementById('rs-sec').onchange=e=>{ RS.sectionId=e.target.value; App.refresh(); };
  document.getElementById('rs-sub').onchange=e=>{ RS.subjectId=e.target.value; App.refresh(); };
  document.getElementById('rs-max').onchange=e=>{ RS.maxMarks=Math.max(1,Number(e.target.value)||100); App.refresh(); };
  const sv=document.getElementById('rs-save');
  if(sv) sv.onclick=()=>{
    const title=RS.examTitle.trim();
    if(!title||!RS.classId||!cols.length){ App.toast(t('msg_required')); return; }
    const secId=RS.sectionId==='ALL'?'':RS.sectionId;
    const byId={}; (rsFindDoc(title,RS.classId,secId)&&rsFindDoc(title,RS.classId,secId).entries||[]).forEach(e=>{ byId[e.studentId]=e; });
    const entries=students.map(s=>{
      const old=(byId[s.id]&&byId[s.id].marks)||{};
      const marks=Object.assign({},old);
      cols.forEach(c=>{
        const inp=document.getElementById('rsm_'+s.id+'_'+c.id);
        if(inp&&inp.value!=='') marks[c.id]=Math.max(0,Math.min(RS.maxMarks,Number(inp.value)));
        else if(inp) delete marks[c.id];
      });
      return {studentId:s.id,marks:marks};
    });
    const ex=rsFindDoc(title,RS.classId,secId);
    if(ex) DB.update('results',ex.id,{maxMarks:RS.maxMarks,entries:entries});
    else DB.add('results',{examTitle:title,classId:RS.classId,sectionId:secId,maxMarks:RS.maxMarks,entries:entries});
    App.toast(t('msg_saved')); App.refresh();
  };
}

/* ---------------- MERIT LIST ---------------- */
function rsRenderMerit(body,classes){
  const exams=rsExamTitles();
  if(!RS.meritExam&&exams.length) RS.meritExam=exams[0];
  if(!RS.meritClass&&classes.length) RS.meritClass=classes[0].id;
  const rows=(RS.meritExam&&RS.meritClass)?rsMerit(RS.meritExam,RS.meritClass):[];
  const medal={1:'🥇',2:'🥈',3:'🥉'};

  body.innerHTML='<div class="card"><div class="row">'
    +'<div class="form-group"><label>'+t('rs_exam')+'</label><select id="rsm-exam">'+exams.map(e=>'<option'+(RS.meritExam===e?' selected':'')+'>'+esc(e)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('rs_class')+'</label><select id="rsm-class">'+classes.map(c=>'<option value="'+c.id+'"'+(RS.meritClass===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div>'
    +'</div></div>'
    +'<div class="card">'
    +(!exams.length?'<div class="empty"><div class="ic">🏆</div><p>'+t('rs_no_exams')+'</p></div>'
      :!rows.length?'<div class="empty"><div class="ic">🏆</div><p>'+t('msg_no_data')+'</p></div>'
      :'<div class="table-wrap"><table class="tbl"><thead><tr><th>'+t('rs_position')+'</th><th>'+t('rs_roll')+'</th><th>'+t('name')+'</th><th>'+t('rs_total')+'</th><th>'+t('rs_percent')+'</th><th>'+t('rs_grade')+'</th></tr></thead><tbody>'
      +rows.map(r=>{ const s=DB.find('students',r.studentId)||{};
        const gradeCls=r.grade==='F'?'b-red':(r.grade==='A+'||r.grade==='A')?'b-green':'b-blue';
        return '<tr><td>'+(medal[r.pos]||r.pos)+'</td><td>'+esc(s.rollNo||'—')+'</td><td>'+esc(s.name||DB.studentName(r.studentId))+'</td><td>'+fmtNum(r.total)+'</td><td>'+r.pct.toFixed(1)+'%</td><td><span class="badge '+gradeCls+'">'+r.grade+'</span></td></tr>'; }).join('')
      +'</tbody></table></div>')
    +'</div>';

  document.getElementById('rsm-exam').onchange=e=>{ RS.meritExam=e.target.value; App.refresh(); };
  document.getElementById('rsm-class').onchange=e=>{ RS.meritClass=e.target.value; App.refresh(); };
}

/* ---------------- REPORT CARD ---------------- */
function rsRenderReport(body,classes){
  const exams=rsExamTitles();
  if(!RS.rcExam&&exams.length) RS.rcExam=exams[0];
  if(!RS.rcClass&&classes.length) RS.rcClass=classes[0].id;
  const rows=(RS.rcExam&&RS.rcClass)?rsMerit(RS.rcExam,RS.rcClass):[];
  const withStudent=rows.filter(r=>DB.find('students',r.studentId));
  if(!RS.rcStudent&&withStudent.length) RS.rcStudent=withStudent[0].studentId;
  const sel=withStudent.find(r=>r.studentId===RS.rcStudent);
  const stu=sel?DB.find('students',sel.studentId):null;

  body.innerHTML='<div class="card"><div class="row">'
    +'<div class="form-group"><label>'+t('rs_exam')+'</label><select id="rsr-exam">'+exams.map(e=>'<option'+(RS.rcExam===e?' selected':'')+'>'+esc(e)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('rs_class')+'</label><select id="rsr-class">'+classes.map(c=>'<option value="'+c.id+'"'+(RS.rcClass===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('rs_student')+'</label><select id="rsr-stu">'+withStudent.map(r=>{ const s=DB.find('students',r.studentId); return '<option value="'+r.studentId+'"'+(RS.rcStudent===r.studentId?' selected':'')+'>'+esc((s.rollNo||'')+' — '+s.name)+'</option>'; }).join('')+'</select></div>'
    +'</div></div>'
    +'<div class="card" id="rsr-preview">'
    +(!exams.length?'<div class="empty"><div class="ic">🏆</div><p>'+t('rs_no_exams')+'</p></div>'
      :!sel?'<div class="empty"><div class="ic">🧾</div><p>'+t('rs_select_student')+'</p></div>'
      :rsCardPreview(stu,sel))
    +'</div>';

  document.getElementById('rsr-exam').onchange=e=>{ RS.rcExam=e.target.value; RS.rcStudent=''; App.refresh(); };
  document.getElementById('rsr-class').onchange=e=>{ RS.rcClass=e.target.value; RS.rcStudent=''; App.refresh(); };
  document.getElementById('rsr-stu').onchange=e=>{ RS.rcStudent=e.target.value; App.refresh(); };
  const pb=document.getElementById('rsr-print'), wb=document.getElementById('rsr-wa');
  if(pb) pb.onclick=()=>App.print(rsCardPrintHTML(stu,sel));
  if(wb) wb.onclick=()=>{
    const ph=rsWaPhone(stu.contact);
    if(!ph){ App.toast(t('rs_msg_no_phone')); return; }
    window.open('https://wa.me/'+ph+'?text='+encodeURIComponent(rsWaMessage(stu,sel)),'_blank');
  };
}

function rsSubjectRows(sel){
  // subject -> obtained/max from the docs of this exam+class for this student
  const rows=[];
  DB.get('results').filter(r=>r.examTitle===RS.rcExam&&r.classId===RS.rcClass).forEach(d=>{
    const e=(d.entries||[]).find(x=>x.studentId===sel.studentId);
    if(!e) return;
    Object.keys(e.marks||{}).forEach(sid=>{ rows.push({subject:DB.subjectName(sid),obt:Number(e.marks[sid]||0),max:Number(d.maxMarks)||100}); });
  });
  return rows;
}

function rsCardPreview(stu,sel){
  const rows=rsSubjectRows(sel);
  const remarkKey=rsRemark(sel.grade);
  return '<div style="text-align:center;margin-bottom:10px">'
    +'<div style="font-size:20px">🏫</div>'
    +'<h3 style="margin:4px 0">'+esc(DB.meta().name)+'</h3>'
    +'<div class="chip">'+t('rs_report_title')+' — '+esc(RS.rcExam)+'</div></div>'
    +'<div class="row">'
    +'<div class="form-group"><label>'+t('name')+'</label><div><b>'+esc(stu.name)+'</b></div></div>'
    +'<div class="form-group"><label>'+t('rs_father')+'</label><div>'+esc(stu.fatherName||'—')+'</div></div>'
    +'<div class="form-group"><label>'+t('rs_roll')+'</label><div>'+esc(stu.rollNo||'—')+'</div></div>'
    +'<div class="form-group"><label>'+t('rs_class')+'</label><div>'+esc(DB.className(stu.classId)+(stu.sectionId?' — '+DB.sectionName(stu.sectionId):''))+'</div></div>'
    +'</div>'
    +'<div class="table-wrap"><table class="tbl"><thead><tr><th>'+t('rs_subject')+'</th><th>'+t('rs_obtained')+'</th><th>'+t('rs_max_marks')+'</th></tr></thead><tbody>'
    +rows.map(r=>'<tr><td>'+esc(r.subject)+'</td><td>'+fmtNum(r.obt)+'</td><td>'+fmtNum(r.max)+'</td></tr>').join('')
    +'</tbody></table></div>'
    +'<div class="row" style="margin-top:10px">'
    +'<div class="form-group"><label>'+t('rs_total')+'</label><div><b>'+fmtNum(sel.total)+' / '+fmtNum(sel.max)+'</b></div></div>'
    +'<div class="form-group"><label>'+t('rs_percent')+'</label><div><b>'+sel.pct.toFixed(1)+'%</b></div></div>'
    +'<div class="form-group"><label>'+t('rs_grade')+'</label><div><span class="badge '+(sel.grade==='F'?'b-red':'b-green')+'">'+sel.grade+'</span></div></div>'
    +'<div class="form-group"><label>'+t('rs_position')+'</label><div><b>'+ordinal(sel.pos)+'</b></div></div>'
    +'</div>'
    +'<p><b>'+t('rs_remarks')+':</b> '+t(remarkKey)+'</p>'
    +'<div class="btnrow"><button class="btn btn-navy" id="rsr-print">🖨️ '+t('rs_print_card')+'</button>'
    +'<button class="btn btn-green" id="rsr-wa">📲 '+t('rs_whatsapp')+'</button></div>';
}

function rsCardPrintHTML(stu,sel){
  const m=DB.meta(), rows=rsSubjectRows(sel), remarkKey=rsRemark(sel.grade);
  const logo=m.logo?'<img src="'+m.logo+'" style="height:64px">':'<div style="font-size:44px">🏫</div>';
  return '<style>.rc{font-family:inherit;color:#111;max-width:700px;margin:auto}.rc table{width:100%;border-collapse:collapse;margin:10px 0}.rc th,.rc td{border:1px solid #333;padding:8px;font-size:14px}.rc th{background:#f1f5f9}.rc .hd{text-align:center;border-bottom:3px double #1e3a5f;padding-bottom:10px;margin-bottom:10px}.rc .sig{display:flex;justify-content:space-between;margin-top:50px}.rc .sig div{border-top:1px solid #333;padding-top:4px;width:30%;text-align:center;font-size:13px}</style>'
  +'<div class="rc"><div class="hd">'+logo+'<h2 style="margin:6px 0">'+esc(m.name)+'</h2>'
  +'<div>'+esc(m.session||'')+'</div><h3 style="margin:8px 0">'+t('rs_report_title')+' — '+esc(RS.rcExam)+'</h3></div>'
  +'<table><tr><th>'+t('name')+'</th><td>'+esc(stu.name)+'</td><th>'+t('rs_roll')+'</th><td>'+esc(stu.rollNo||'—')+'</td></tr>'
  +'<tr><th>'+t('rs_father')+'</th><td>'+esc(stu.fatherName||'—')+'</td><th>'+t('rs_class')+'</th><td>'+esc(DB.className(stu.classId)+(stu.sectionId?' — '+DB.sectionName(stu.sectionId):''))+'</td></tr></table>'
  +'<table><thead><tr><th>'+t('rs_subject')+'</th><th>'+t('rs_obtained')+'</th><th>'+t('rs_max_marks')+'</th></tr></thead><tbody>'
  +rows.map(r=>'<tr><td>'+esc(r.subject)+'</td><td>'+fmtNum(r.obt)+'</td><td>'+fmtNum(r.max)+'</td></tr>').join('')
  +'</tbody></table>'
  +'<table><tr><th>'+t('rs_total')+'</th><td><b>'+fmtNum(sel.total)+' / '+fmtNum(sel.max)+'</b></td><th>'+t('rs_percent')+'</th><td><b>'+sel.pct.toFixed(1)+'%</b></td></tr>'
  +'<tr><th>'+t('rs_grade')+'</th><td><b>'+sel.grade+'</b></td><th>'+t('rs_position')+'</th><td><b>'+ordinal(sel.pos)+'</b></td></tr></table>'
  +'<p><b>'+t('rs_remarks')+':</b> '+t(remarkKey)+'</p>'
  +'<div class="sig"><div>'+t('rs_class_teacher')+'</div><div>'+t('rs_principal')+'</div><div>'+t('rs_parent_sign')+'</div></div></div>';
}

function rsWaMessage(stu,sel){
  const m=DB.meta(), rows=rsSubjectRows(sel);
  const L=[];
  L.push('🏫 '+m.name);
  L.push('🧾 '+t('rs_report_title')+' — '+RS.rcExam);
  L.push('👤 '+stu.name+' ('+t('rs_roll')+': '+(stu.rollNo||'—')+')');
  L.push('———————');
  rows.forEach(r=>L.push('📚 '+r.subject+': '+r.obt+'/'+r.max));
  L.push('———————');
  L.push('✅ '+t('rs_total')+': '+sel.total+'/'+sel.max+' | '+sel.pct.toFixed(1)+'% | '+t('rs_grade')+': '+sel.grade+' | '+t('rs_position')+': '+ordinal(sel.pos));
  L.push('💬 '+t(rsRemark(sel.grade)));
  return L.join('\n');
}

App.register('results',{titleKey:'nav_results',icon:'🏆',roles:['superadmin','principal','teacher','exam'],render:rsRender});
