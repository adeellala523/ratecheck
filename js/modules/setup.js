/* School Setup module: sessions, classes, sections, subjects, teachers, students + CSV import/export */
Object.assign(I18N.en,{
  st_sessions:"Sessions", st_classes:"Classes", st_sections:"Sections", st_subjects:"Subjects",
  st_teachers:"Teachers", st_students:"Students",
  st_add_session:"Add Session", st_session_name:"Session name", st_active:"Active", st_make_active:"Set as active",
  st_add_class:"Add Class", st_class_name:"Class name",
  st_add_section:"Add Section", st_section_name:"Section name", st_class:"Class",
  st_add_subject:"Add Subject", st_subject_name:"Subject name",
  st_add_teacher:"Add Teacher", st_edit_teacher:"Edit Teacher", st_teacher_name:"Teacher name",
  st_teacher_subject:"Subject (optional)", st_no_subject:"— No specific subject —", st_phone:"Phone",
  st_add_student:"Add Student", st_edit_student:"Edit Student", st_import_csv:"Import CSV", st_export_csv:"Export CSV",
  st_roll:"Roll No", st_father:"Father Name", st_gender:"Gender", st_male:"Male", st_female:"Female",
  st_admission:"Admission No", st_dob:"Date of Birth", st_contact:"Contact", st_status:"Status",
  st_active_status:"Active", st_inactive:"Inactive", st_left:"Left",
  st_section:"Section", st_all_classes:"All Classes", st_all_sections:"All Sections",
  st_search_students:"Search name, roll, admission...", st_csv_help:"CSV header: rollNo,name,fatherName,class,section,gender,admissionNo,dob,contact,status (any order). Missing classes/sections are created.",
  st_imported:"imported", st_skipped:"skipped", st_import_btn:"Import Now",
  st_choose_file:"Choose CSV file", st_class_used:"Cannot delete: referenced by sections, subjects or students.",
  st_no_teachers:"No teachers yet", st_no_students:"No students yet",
  st_csv_example:"rollNo,name,fatherName,class,section,gender,admissionNo,dob,contact,status",
  st_status_active:"Active", st_status_all:"All Statuses",
});
Object.assign(I18N.ur,{
  st_sessions:"سیشنز", st_classes:"جماعتیں", st_sections:"سیکشنز", st_subjects:"مضامین",
  st_teachers:"اساتذہ", st_students:"طلبہ",
  st_add_session:"سیشن شامل کریں", st_session_name:"سیشن کا نام", st_active:"فعال", st_make_active:"فعال کریں",
  st_add_class:"جماعت شامل کریں", st_class_name:"جماعت کا نام",
  st_add_section:"سیکشن شامل کریں", st_section_name:"سیکشن کا نام", st_class:"جماعت",
  st_add_subject:"مضمون شامل کریں", st_subject_name:"مضمون کا نام",
  st_add_teacher:"استاد شامل کریں", st_edit_teacher:"استاد کی ترمیم", st_teacher_name:"استاد کا نام",
  st_teacher_subject:"مضمون (اختیاری)", st_no_subject:"— کوئی خاص مضمون نہیں —", st_phone:"فون",
  st_add_student:"طالب علم شامل کریں", st_edit_student:"طالب علم کی ترمیم", st_import_csv:"CSV امپورٹ", st_export_csv:"CSV ایکسپورٹ",
  st_roll:"رول نمبر", st_father:"والد کا نام", st_gender:"جنس", st_male:"لڑکا", st_female:"لڑکی",
  st_admission:"داخلہ نمبر", st_dob:"تاریخ پیدائش", st_contact:"رابطہ", st_status:"حالت",
  st_active_status:"فعال", st_inactive:"غیر فعال", st_left:"چھوڑ گیا",
  st_section:"سیکشن", st_all_classes:"تمام جماعتیں", st_all_sections:"تمام سیکشنز",
  st_search_students:"نام، رول یا داخلہ نمبر تلاش کریں...", st_csv_help:"CSV ہیڈر: rollNo,name,fatherName,class,section,gender,admissionNo,dob,contact,status (کسی بھی ترتیب میں)۔ غائب جماعتیں/سیکشنز خود بن جائیں گے۔",
  st_imported:"شامل ہوئے", st_skipped:"چھوڑے گئے", st_import_btn:"ابھی امپورٹ کریں",
  st_choose_file:"CSV فائل منتخب کریں", st_class_used:"حذف نہیں ہو سکتا: سیکشنز، مضامین یا طلبہ میں استعمال ہو رہا ہے۔",
  st_no_teachers:"ابھی کوئی استاد نہیں", st_no_students:"ابھی کوئی طالب علم نہیں",
  st_csv_example:"rollNo,name,fatherName,class,section,gender,admissionNo,dob,contact,status",
  st_status_active:"فعال", st_status_all:"تمام حالتیں",
});

let SETUP_TAB = 'sessions';
let ST_FILTER = { classId:'', sectionId:'', q:'' };

function st_render(el){
  const tabs = [['sessions','st_sessions'],['classes','st_classes'],['sections','st_sections'],
                ['subjects','st_subjects'],['teachers','st_teachers'],['students','st_students']];
  let body = '<div class="tabs">' + tabs.map(x =>
    '<button class="'+(SETUP_TAB===x[0]?'active':'')+'" data-tab="'+x[0]+'">'+t(x[1])+'</button>').join('') + '</div>';
  if (SETUP_TAB==='sessions') body += st_sessionsHTML();
  else if (SETUP_TAB==='classes') body += st_classesHTML();
  else if (SETUP_TAB==='sections') body += st_sectionsHTML();
  else if (SETUP_TAB==='subjects') body += st_subjectsHTML();
  else if (SETUP_TAB==='teachers') body += st_teachersHTML();
  else if (SETUP_TAB==='students') body += st_studentsHTML();
  el.innerHTML = body;
  el.querySelectorAll('[data-tab]').forEach(b=>{ b.onclick = ()=>{ SETUP_TAB = b.dataset.tab; App.refresh(); }; });
  if (SETUP_TAB==='sessions') st_sessionsBind(el);
  else if (SETUP_TAB==='classes') st_classesBind(el);
  else if (SETUP_TAB==='sections') st_sectionsBind(el);
  else if (SETUP_TAB==='subjects') st_subjectsBind(el);
  else if (SETUP_TAB==='teachers') st_teachersBind(el);
  else if (SETUP_TAB==='students') st_studentsBind(el);
}

/* ---------------- sessions ---------------- */
function st_sessionsHTML(){
  const rows = DB.get('sessions');
  let h = '<div class="card"><div class="row">'
    + '<div class="form-group" style="flex:1"><label>'+t('st_session_name')+'</label><input id="ss-name" placeholder="'+t('ph_session')+'"></div>'
    + '<div class="form-group"><label>&nbsp;</label><label style="display:flex;align-items:center;gap:6px;font-weight:600"><input type="checkbox" id="ss-active"> '+t('st_active')+'</label></div>'
    + '<div class="form-group"><label>&nbsp;</label><button class="btn btn-primary" id="ss-add">'+t('btn_add')+'</button></div>'
    + '</div></div>';
  if (!rows.length) h += '<div class="empty"><span class="ic">📭</span><p>'+t('msg_no_data')+'</p></div>';
  else h += '<div class="card"><div class="table-wrap"><table class="tbl"><tr><th>'+t('st_session_name')+'</th><th>'+t('st_active')+'</th><th>'+t('actions')+'</th></tr>'
    + rows.map(s => '<tr><td>'+esc(s.name)+'</td><td>'+(s.active?'<span class="badge b-green">'+t('st_active')+'</span>':'<span class="badge b-gray">—</span>')+'</td>'
      + '<td>'+(!s.active?'<button class="btn btn-sm btn-green" data-makeactive="'+s.id+'">'+t('st_make_active')+'</button> ':'')
      + '<button class="btn btn-sm btn-danger" data-delsess="'+s.id+'">'+t('btn_delete')+'</button></td></tr>').join('')
    + '</table></div></div>';
  return h;
}
function st_sessionsBind(el){
  el.querySelector('#ss-add').onclick = ()=>{
    const name = el.querySelector('#ss-name').value.trim();
    if(!name){ App.toast(t('msg_required')); return; }
    const active = el.querySelector('#ss-active').checked;
    if(active) DB.get('sessions').forEach(s=>{ s.active=false; });
    DB.add('sessions', { name, active });
    DB.save(); App.toast(t('msg_saved')); App.refresh();
  };
  el.querySelectorAll('[data-makeactive]').forEach(b=>{ b.onclick = ()=>{
    DB.get('sessions').forEach(s=>{ s.active = (s.id===b.dataset.makeactive); });
    DB.save(); App.refresh();
  };});
  el.querySelectorAll('[data-delsess]').forEach(b=>{ b.onclick = async ()=>{
    if(await App.confirm(t('msg_confirm_delete'))){ DB.remove('sessions', b.dataset.delsess); App.toast(t('msg_deleted')); App.refresh(); }
  };});
}

/* ---------------- classes ---------------- */
function st_classesHTML(){
  const rows = DB.get('classes');
  let h = '<div class="card"><div class="row">'
    + '<div class="form-group" style="flex:1"><label>'+t('st_class_name')+'</label><input id="cl-name"></div>'
    + '<div class="form-group"><label>&nbsp;</label><button class="btn btn-primary" id="cl-add">'+t('btn_add')+'</button></div>'
    + '</div></div>';
  if (!rows.length) h += '<div class="empty"><span class="ic">📭</span><p>'+t('msg_no_data')+'</p></div>';
  else h += '<div class="card"><div class="table-wrap"><table class="tbl"><tr><th>'+t('st_class_name')+'</th><th>'+t('actions')+'</th></tr>'
    + rows.map(c => '<tr><td>'+esc(c.name)+'</td><td><button class="btn btn-sm btn-danger" data-delclass="'+c.id+'">'+t('btn_delete')+'</button></td></tr>').join('')
    + '</table></div></div>';
  return h;
}
function st_classesBind(el){
  el.querySelector('#cl-add').onclick = ()=>{
    const name = el.querySelector('#cl-name').value.trim();
    if(!name){ App.toast(t('msg_required')); return; }
    DB.add('classes', { name }); App.toast(t('msg_saved')); App.refresh();
  };
  el.querySelectorAll('[data-delclass]').forEach(b=>{ b.onclick = async ()=>{
    const id = b.dataset.delclass;
    const used = DB.get('sections').some(s=>s.classId===id) || DB.get('subjects').some(s=>s.classId===id) || DB.get('students').some(s=>s.classId===id);
    if(used){ App.toast(t('st_class_used')); return; }
    if(await App.confirm(t('msg_confirm_delete'))){ DB.remove('classes', id); App.toast(t('msg_deleted')); App.refresh(); }
  };});
}

/* ---------------- sections ---------------- */
function st_sectionsHTML(){
  const classes = DB.get('classes');
  let h = '<div class="card"><div class="row">'
    + '<div class="form-group" style="flex:1"><label>'+t('st_class')+'</label><select id="sc-class">'
    + classes.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('') + '</select></div>'
    + '<div class="form-group" style="flex:1"><label>'+t('st_section_name')+'</label><input id="sc-name"></div>'
    + '<div class="form-group"><label>&nbsp;</label><button class="btn btn-primary" id="sc-add">'+t('btn_add')+'</button></div>'
    + '</div></div>';
  if (!classes.length) return h + '<div class="empty"><span class="ic">📭</span><p>'+t('msg_no_data')+'</p></div>';
  h += classes.map(c=>{
    const secs = DB.get('sections').filter(s=>s.classId===c.id);
    if(!secs.length) return '';
    return '<div class="card"><h4 style="margin:0 0 8px">'+esc(c.name)+'</h4>'
      + '<div class="table-wrap"><table class="tbl"><tr><th>'+t('st_section_name')+'</th><th>'+t('actions')+'</th></tr>'
      + secs.map(s=>'<tr><td>'+esc(s.name)+'</td><td><button class="btn btn-sm btn-danger" data-delsec="'+s.id+'">'+t('btn_delete')+'</button></td></tr>').join('')
      + '</table></div></div>';
  }).join('');
  return h;
}
function st_sectionsBind(el){
  const add = el.querySelector('#sc-add');
  if(add) add.onclick = ()=>{
    const classId = el.querySelector('#sc-class').value, name = el.querySelector('#sc-name').value.trim();
    if(!classId || !name){ App.toast(t('msg_required')); return; }
    DB.add('sections', { classId, name }); App.toast(t('msg_saved')); App.refresh();
  };
  el.querySelectorAll('[data-delsec]').forEach(b=>{ b.onclick = async ()=>{
    if(await App.confirm(t('msg_confirm_delete'))){ DB.remove('sections', b.dataset.delsec); App.toast(t('msg_deleted')); App.refresh(); }
  };});
}

/* ---------------- subjects ---------------- */
function st_subjectsHTML(){
  const classes = DB.get('classes');
  let h = '<div class="card"><div class="row">'
    + '<div class="form-group" style="flex:1"><label>'+t('st_class')+'</label><select id="sb-class">'
    + classes.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('') + '</select></div>'
    + '<div class="form-group" style="flex:1"><label>'+t('st_subject_name')+'</label><input id="sb-name"></div>'
    + '<div class="form-group"><label>&nbsp;</label><button class="btn btn-primary" id="sb-add">'+t('btn_add')+'</button></div>'
    + '</div></div>';
  if (!classes.length) return h + '<div class="empty"><span class="ic">📭</span><p>'+t('msg_no_data')+'</p></div>';
  h += classes.map(c=>{
    const subs = DB.get('subjects').filter(s=>s.classId===c.id);
    if(!subs.length) return '';
    return '<div class="card"><h4 style="margin:0 0 8px">'+esc(c.name)+'</h4>'
      + '<div class="table-wrap"><table class="tbl"><tr><th>'+t('st_subject_name')+'</th><th>'+t('actions')+'</th></tr>'
      + subs.map(s=>'<tr><td>'+esc(s.name)+'</td><td><button class="btn btn-sm btn-danger" data-delsub="'+s.id+'">'+t('btn_delete')+'</button></td></tr>').join('')
      + '</table></div></div>';
  }).join('');
  return h;
}
function st_subjectsBind(el){
  const add = el.querySelector('#sb-add');
  if(add) add.onclick = ()=>{
    const classId = el.querySelector('#sb-class').value, name = el.querySelector('#sb-name').value.trim();
    if(!classId || !name){ App.toast(t('msg_required')); return; }
    DB.add('subjects', { classId, name }); App.toast(t('msg_saved')); App.refresh();
  };
  el.querySelectorAll('[data-delsub]').forEach(b=>{ b.onclick = async ()=>{
    if(await App.confirm(t('msg_confirm_delete'))){ DB.remove('subjects', b.dataset.delsub); App.toast(t('msg_deleted')); App.refresh(); }
  };});
}

/* ---------------- teachers ---------------- */
function st_teachersHTML(){
  const subs = DB.get('subjects');
  let h = '<div class="card"><h4 style="margin:0 0 10px">'+t('st_add_teacher')+'</h4><div class="row">'
    + '<div class="form-group" style="flex:2"><label>'+t('st_teacher_name')+'</label><input id="tc-name"></div>'
    + '<div class="form-group" style="flex:2"><label>'+t('st_teacher_subject')+'</label><select id="tc-sub"><option value="">'+t('st_no_subject')+'</option>'
    + subs.map(s=>'<option value="'+s.id+'">'+esc(DB.className(s.classId))+' — '+esc(s.name)+'</option>').join('') + '</select></div>'
    + '<div class="form-group" style="flex:2"><label>'+t('st_phone')+'</label><input id="tc-phone"></div>'
    + '<div class="form-group"><label>&nbsp;</label><button class="btn btn-primary" id="tc-add">'+t('btn_add')+'</button></div>'
    + '</div></div>';
  const rows = DB.get('teachers');
  if (!rows.length) h += '<div class="empty"><span class="ic">📭</span><p>'+t('st_no_teachers')+'</p></div>';
  else h += '<div class="card"><div class="table-wrap"><table class="tbl"><tr><th>'+t('st_teacher_name')+'</th><th>'+t('st_teacher_subject')+'</th><th>'+t('st_phone')+'</th><th>'+t('actions')+'</th></tr>'
    + rows.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.subjectId?DB.subjectName(x.subjectId):'—')+'</td><td>'+esc(x.phone||'—')+'</td><td>'
      + '<button class="btn btn-sm btn-navy" data-edttch="'+x.id+'">'+t('btn_edit')+'</button> '
      + '<button class="btn btn-sm btn-danger" data-deltch="'+x.id+'">'+t('btn_delete')+'</button></td></tr>').join('')
    + '</table></div></div>';
  return h;
}
function st_teachersBind(el){
  el.querySelector('#tc-add').onclick = ()=>{
    const name = el.querySelector('#tc-name').value.trim();
    if(!name){ App.toast(t('msg_required')); return; }
    DB.add('teachers', { name, subjectId: el.querySelector('#tc-sub').value || '', phone: el.querySelector('#tc-phone').value.trim() });
    App.toast(t('msg_saved')); App.refresh();
  };
  el.querySelectorAll('[data-edttch]').forEach(b=>{ b.onclick = ()=>{
    const x = DB.find('teachers', b.dataset.edttch); if(!x) return;
    const subs = DB.get('subjects');
    App.modal('<h3 style="margin-top:0">'+t('st_edit_teacher')+'</h3>'
      + '<div class="form-group"><label>'+t('st_teacher_name')+'</label><input id="m-tc-name" value="'+esc(x.name)+'"></div>'
      + '<div class="form-group"><label>'+t('st_teacher_subject')+'</label><select id="m-tc-sub"><option value="">'+t('st_no_subject')+'</option>'
      + subs.map(s=>'<option value="'+s.id+'"'+(x.subjectId===s.id?' selected':'')+'>'+esc(DB.className(s.classId))+' — '+esc(s.name)+'</option>').join('') + '</select></div>'
      + '<div class="form-group"><label>'+t('st_phone')+'</label><input id="m-tc-phone" value="'+esc(x.phone||'')+'"></div>'
      + '<div class="btnrow" style="justify-content:flex-end"><button class="btn btn-ghost" id="m-tc-cancel">'+t('btn_cancel')+'</button>'
      + '<button class="btn btn-primary" id="m-tc-save">'+t('btn_save')+'</button></div>');
    document.getElementById('m-tc-cancel').onclick = App.closeModal;
    document.getElementById('m-tc-save').onclick = ()=>{
      const name = document.getElementById('m-tc-name').value.trim();
      if(!name){ App.toast(t('msg_required')); return; }
      DB.update('teachers', x.id, { name, subjectId: document.getElementById('m-tc-sub').value, phone: document.getElementById('m-tc-phone').value.trim() });
      App.closeModal(); App.toast(t('msg_saved')); App.refresh();
    };
  };});
  el.querySelectorAll('[data-deltch]').forEach(b=>{ b.onclick = async ()=>{
    if(await App.confirm(t('msg_confirm_delete'))){ DB.remove('teachers', b.dataset.deltch); App.toast(t('msg_deleted')); App.refresh(); }
  };});
}

/* ---------------- students ---------------- */
function st_studentsHTML(){
  const classes = DB.get('classes');
  const secs = DB.get('sections').filter(s=>!ST_FILTER.classId || s.classId===ST_FILTER.classId);
  let h = '<div class="card"><div class="row">'
    + '<div class="form-group" style="flex:1"><label>'+t('st_class')+'</label><select id="stf-class"><option value="">'+t('st_all_classes')+'</option>'
    + classes.map(c=>'<option value="'+c.id+'"'+(ST_FILTER.classId===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('') + '</select></div>'
    + '<div class="form-group" style="flex:1"><label>'+t('st_section')+'</label><select id="stf-sec"><option value="">'+t('st_all_sections')+'</option>'
    + secs.map(s=>'<option value="'+s.id+'"'+(ST_FILTER.sectionId===s.id?' selected':'')+'>'+esc(s.name)+'</option>').join('') + '</select></div>'
    + '<div class="form-group" style="flex:2"><label>'+t('btn_search')+'</label><input id="stf-q" placeholder="'+t('st_search_students')+'" value="'+esc(ST_FILTER.q)+'"></div>'
    + '</div><div class="btnrow">'
    + '<button class="btn btn-primary btn-sm" id="st-add">+ '+t('st_add_student')+'</button>'
    + '<button class="btn btn-navy btn-sm" id="st-import">📥 '+t('st_import_csv')+'</button>'
    + '<button class="btn btn-green btn-sm" id="st-export">📤 '+t('st_export_csv')+'</button>'
    + '</div></div>';
  let rows = DB.get('students');
  if(ST_FILTER.classId) rows = rows.filter(s=>s.classId===ST_FILTER.classId);
  if(ST_FILTER.sectionId) rows = rows.filter(s=>s.sectionId===ST_FILTER.sectionId);
  if(ST_FILTER.q){ const q = ST_FILTER.q.toLowerCase();
    rows = rows.filter(s=>(s.name||'').toLowerCase().includes(q)||(s.rollNo||'').toLowerCase().includes(q)||(s.admissionNo||'').toLowerCase().includes(q)); }
  if(!rows.length) h += '<div class="empty"><span class="ic">📭</span><p>'+t('st_no_students')+'</p><button class="btn btn-primary" id="st-add2">+ '+t('st_add_student')+'</button></div>';
  else h += '<div class="card"><div class="table-wrap"><table class="tbl"><tr><th>'+t('st_roll')+'</th><th>'+t('name')+'</th><th>'+t('st_father')+'</th><th>'+t('st_class')+'</th><th>'+t('st_section')+'</th><th>'+t('st_contact')+'</th><th>'+t('st_status')+'</th><th>'+t('actions')+'</th></tr>'
    + rows.map(s=>'<tr><td>'+esc(s.rollNo||'—')+'</td><td>'+esc(s.name)+'</td><td>'+esc(s.fatherName||'—')+'</td><td>'+esc(DB.className(s.classId))+'</td><td>'+esc(DB.sectionName(s.sectionId)||'—')+'</td><td>'+esc(s.contact||'—')+'</td><td>'
      + '<span class="badge '+(s.status==='Active'?'b-green':(s.status==='Inactive'?'b-orange':'b-red'))+'">'+t(s.status==='Active'?'st_status_active':(s.status==='Inactive'?'st_inactive':'st_left'))+'</span></td><td>'
      + '<button class="btn btn-sm btn-navy" data-edtst="'+s.id+'">'+t('btn_edit')+'</button> '
      + '<button class="btn btn-sm btn-danger" data-delst="'+s.id+'">'+t('btn_delete')+'</button></td></tr>').join('')
    + '</table></div></div>';
  return h;
}
function st_studentsBind(el){
  const fc = el.querySelector('#stf-class'), fs = el.querySelector('#stf-sec'), fq = el.querySelector('#stf-q');
  fc.onchange = ()=>{ ST_FILTER.classId = fc.value; ST_FILTER.sectionId=''; App.refresh(); };
  fs.onchange = ()=>{ ST_FILTER.sectionId = fs.value; App.refresh(); };
  fq.oninput = ()=>{ ST_FILTER.q = fq.value; clearTimeout(fq._tm); fq._tm = setTimeout(()=>App.refresh(), 600); };
  const addB = ()=>{ st_studentModal(null); };
  el.querySelector('#st-add').onclick = addB;
  const a2 = el.querySelector('#st-add2'); if(a2) a2.onclick = addB;
  el.querySelector('#st-import').onclick = st_importModal;
  el.querySelector('#st-export').onclick = st_exportCSV;
  el.querySelectorAll('[data-edtst]').forEach(b=>{ b.onclick = ()=>{ st_studentModal(DB.find('students', b.dataset.edtst)); }; });
  el.querySelectorAll('[data-delst]').forEach(b=>{ b.onclick = async ()=>{
    if(await App.confirm(t('msg_confirm_delete'))){ DB.remove('students', b.dataset.delst); App.toast(t('msg_deleted')); App.refresh(); }
  };});
}
function st_studentFormHTML(s){
  const classes = DB.get('classes');
  const cls = s ? s.classId : (ST_FILTER.classId || (classes[0]&&classes[0].id) || '');
  const secs = DB.get('sections').filter(x=>x.classId===cls);
  return '<div class="row">'
    + '<div class="form-group" style="flex:1"><label>'+t('st_roll')+'</label><input id="m-st-roll" value="'+esc(s?s.rollNo:'')+'"></div>'
    + '<div class="form-group" style="flex:2"><label>'+t('name')+'</label><input id="m-st-name" value="'+esc(s?s.name:'')+'"></div></div>'
    + '<div class="row"><div class="form-group" style="flex:1"><label>'+t('st_father')+'</label><input id="m-st-father" value="'+esc(s?s.fatherName:'')+'"></div>'
    + '<div class="form-group" style="flex:1"><label>'+t('st_gender')+'</label><select id="m-st-gender"><option value="Male"'+(s&&s.gender==='Male'?' selected':'')+'>'+t('st_male')+'</option><option value="Female"'+(s&&s.gender==='Female'?' selected':'')+'>'+t('st_female')+'</option></select></div></div>'
    + '<div class="row"><div class="form-group" style="flex:1"><label>'+t('st_class')+'</label><select id="m-st-class">'
    + classes.map(c=>'<option value="'+c.id+'"'+(cls===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('') + '</select></div>'
    + '<div class="form-group" style="flex:1"><label>'+t('st_section')+'</label><select id="m-st-sec">'
    + secs.map(x=>'<option value="'+x.id+'"'+(s&&s.sectionId===x.id?' selected':'')+'>'+esc(x.name)+'</option>').join('') + '</select></div></div>'
    + '<div class="row"><div class="form-group" style="flex:1"><label>'+t('st_admission')+'</label><input id="m-st-adm" value="'+esc(s?s.admissionNo:'')+'"></div>'
    + '<div class="form-group" style="flex:1"><label>'+t('st_dob')+'</label><input type="date" id="m-st-dob" value="'+esc(s?s.dob:'')+'"></div></div>'
    + '<div class="row"><div class="form-group" style="flex:1"><label>'+t('st_contact')+'</label><input id="m-st-contact" value="'+esc(s?s.contact:'')+'"></div>'
    + '<div class="form-group" style="flex:1"><label>'+t('st_status')+'</label><select id="m-st-status">'
    + ['Active','Inactive','Left'].map(x=>'<option value="'+x+'"'+(s&&s.status===x?' selected':'')+'>'+t(x==='Active'?'st_status_active':(x==='Inactive'?'st_inactive':'st_left'))+'</option>').join('') + '</select></div></div>';
}
function st_studentModal(s){
  if(!DB.get('classes').length){ App.toast(t('st_class')+': '+t('msg_required')); return; }
  App.modal('<h3 style="margin-top:0">'+(s?t('st_edit_student'):t('st_add_student'))+'</h3>'
    + st_studentFormHTML(s)
    + '<div class="btnrow" style="justify-content:flex-end"><button class="btn btn-ghost" id="m-st-cancel">'+t('btn_cancel')+'</button>'
    + '<button class="btn btn-primary" id="m-st-save">'+t('btn_save')+'</button></div>');
  const cs = document.getElementById('m-st-class');
  cs.onchange = ()=>{
    const secs = DB.get('sections').filter(x=>x.classId===cs.value);
    document.getElementById('m-st-sec').innerHTML = secs.map(x=>'<option value="'+x.id+'">'+esc(x.name)+'</option>').join('');
  };
  document.getElementById('m-st-cancel').onclick = App.closeModal;
  document.getElementById('m-st-save').onclick = ()=>{
    const v = id => document.getElementById(id).value.trim();
    const name = v('m-st-name');
    if(!name){ App.toast(t('msg_required')); return; }
    const data = { rollNo:v('m-st-roll'), name, fatherName:v('m-st-father'), classId:cs.value,
      sectionId:document.getElementById('m-st-sec').value||'', gender:document.getElementById('m-st-gender').value,
      admissionNo:v('m-st-adm'), dob:document.getElementById('m-st-dob').value, contact:v('m-st-contact'),
      status:document.getElementById('m-st-status').value };
    if(s) DB.update('students', s.id, data); else DB.add('students', data);
    App.closeModal(); App.toast(t('msg_saved')); App.refresh();
  };
}
/* CSV parsing (handles quoted commas) */
function st_parseCSV(text){
  const rows = []; let row = [], cur = '', q = false;
  for(let i=0;i<text.length;i++){
    const c = text[i];
    if(q){
      if(c==='"'){ if(text[i+1]==='"'){ cur+='"'; i++; } else q=false; }
      else cur += c;
    } else if(c==='"') q = true;
    else if(c===','){ row.push(cur); cur=''; }
    else if(c==='\n'||c==='\r'){ if(c==='\r'&&text[i+1]==='\n') i++; row.push(cur); cur=''; if(row.length>1||row[0]!=='') rows.push(row); row=[]; }
    else cur += c;
  }
  if(cur!==''||row.length){ row.push(cur); rows.push(row); }
  return rows.filter(r=>r.some(x=>String(x).trim()!==''));
}
function st_importModal(){
  App.modal('<h3 style="margin-top:0">'+t('st_import_csv')+'</h3>'
    + '<p style="font-size:12.5px;color:var(--muted)">'+t('st_csv_help')+'</p>'
    + '<div class="form-group"><label>'+t('st_choose_file')+'</label><input type="file" id="m-csv-file" accept=".csv,text/csv"></div>'
    + '<div class="btnrow" style="justify-content:flex-end"><button class="btn btn-ghost" id="m-csv-cancel">'+t('btn_cancel')+'</button>'
    + '<button class="btn btn-primary" id="m-csv-go">'+t('st_import_btn')+'</button></div>');
  document.getElementById('m-csv-cancel').onclick = App.closeModal;
  document.getElementById('m-csv-go').onclick = ()=>{
    const f = document.getElementById('m-csv-file').files[0];
    if(!f){ App.toast(t('msg_required')); return; }
    const r = new FileReader();
    r.onload = ()=>{
      try{
        const rows = st_parseCSV(String(r.result));
        if(!rows.length){ App.toast(t('msg_required')); return; }
        const head = rows[0].map(h=>String(h).trim().toLowerCase());
        const idx = {};
        ['rollno','name','fathername','class','section','gender','admissionno','dob','contact','status'].forEach(k=>{
          const i = head.indexOf(k); if(i>=0) idx[k]=i;
        });
        const findOrCreate = (col, keyName, name)=>{
          const nm = String(name||'').trim(); if(!nm) return '';
          let o = DB.get(col).find(x=>String(x[keyName]||'').toLowerCase()===nm.toLowerCase());
          if(!o){
            if(col==='sections'){ o = DB.add('sections',{ classId:'', name:nm }); }
            else o = DB.add(col,{ name:nm });
          }
          return o.id;
        };
        let imp=0, skip=0;
        for(let i=1;i<rows.length;i++){
          const g = k => idx[k]!==undefined ? String(rows[i][idx[k]]||'').trim() : '';
          const name = g('name');
          if(!name){ skip++; continue; }
          const classId = findOrCreate('classes','name',g('class'));
          let sectionId = '';
          if(g('section')){
            const nm = g('section').toLowerCase();
            let o = DB.get('sections').find(x=>String(x.name||'').toLowerCase()===nm && (!classId || x.classId===classId));
            if(!o) o = DB.add('sections',{ classId:classId||'', name:g('section') });
            sectionId = o.id;
          }
          const st = g('status'), stv = ['Active','Inactive','Left'].includes(st)?st:'Active';
          DB.add('students',{ rollNo:g('rollno'), name, fatherName:g('fathername'), classId, sectionId,
            gender:['Male','Female'].includes(g('gender'))?g('gender'):'Male', admissionNo:g('admissionno'),
            dob:g('dob'), contact:g('contact'), status:stv });
          imp++;
        }
        App.closeModal();
        App.toast(imp+' '+t('st_imported')+', '+skip+' '+t('st_skipped'));
        App.refresh();
      }catch(e){ App.toast(t('msg_required')); }
    };
    r.readAsText(f);
  };
}
function st_exportCSV(){
  let rows = DB.get('students');
  if(ST_FILTER.classId) rows = rows.filter(s=>s.classId===ST_FILTER.classId);
  if(ST_FILTER.sectionId) rows = rows.filter(s=>s.sectionId===ST_FILTER.sectionId);
  if(ST_FILTER.q){ const q = ST_FILTER.q.toLowerCase();
    rows = rows.filter(s=>(s.name||'').toLowerCase().includes(q)||(s.rollNo||'').toLowerCase().includes(q)||(s.admissionNo||'').toLowerCase().includes(q)); }
  const qcell = v => '"' + String(v==null?'':v).replace(/"/g,'""') + '"';
  const head = t('st_csv_example').split(',');
  const lines = [head.join(',')].concat(rows.map(s=>[
    s.rollNo,s.name,s.fatherName,DB.className(s.classId),DB.sectionName(s.sectionId),s.gender,s.admissionNo,s.dob,s.contact,s.status
  ].map(qcell).join(',')));
  App.download('students.csv', '\ufeff'+lines.join('\r\n'), 'text/csv;charset=utf-8');
  App.toast(t('msg_saved'));
}

App.register('setup',{ titleKey:'nav_setup', icon:'⚙️', roles:['superadmin','principal'], render: st_render });
