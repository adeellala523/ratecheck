/* Fees module: fee heads, collection, dues, summary */
Object.assign(I18N.en,{
  fe_tab_collect:"Collect Fee", fe_tab_heads:"Fee Heads", fe_tab_dues:"Dues", fe_tab_summary:"Summary",
  fe_head_name:"Head Name", fe_head_name_ph:"e.g. Monthly Tuition Fee",
  fe_amount:"Amount (Rs)", fe_add_head:"Add Head", fe_update_head:"Update Head", fe_cancel_edit:"Cancel",
  fe_search_student:"Search student by name or roll…",
  fe_student:"Student", fe_head:"Fee Head", fe_month:"Month", fe_discount:"Discount (Rs)",
  fe_net:"Net Payable (Rs)", fe_collect_btn:"Collect & Print Receipt",
  fe_receipt_title:"Fee Receipt", fe_receipt_no:"Receipt No", fe_date:"Date",
  fe_father:"Father's Name", fe_class:"Class",
  fe_received_by:"Received By", fe_parent_sign:"Parent/Guardian",
  fe_due_amount:"Due Amount (Rs)", fe_remind:"WhatsApp Reminder",
  fe_no_dues:"No dues — all fees paid for this head and month",
  fe_total_collected:"Total Collected (Rs)", fe_txn_count:"Transactions",
  fe_per_head:"Collection by Fee Head",
  fe_msg_no_phone:"No phone number saved for this student",
  fe_msg_dues:"Assalam-o-Alaikum! This is a fee reminder from {school}. {student} ({cls}) has a pending fee: {head} for {month} — Rs {amount}. Kindly pay at the school office. Thank you.",
  fe_no_heads:"Add a fee head first", fe_select_head:"Select Fee Head",
  fe_select_student:"Select Student", fe_no_match:"No students match your search",
  fe_msg_saved_rcpt:"Fee collected — receipt sent to printer", fe_roll:"Roll No",
});
Object.assign(I18N.ur,{
  fe_tab_collect:"فیس وصول کریں", fe_tab_heads:"فیس ہیڈز", fe_tab_dues:"بقایا جات", fe_tab_summary:"خلاصہ",
  fe_head_name:"ہیڈ کا نام", fe_head_name_ph:"مثلاً ماہانہ ٹیوشن فیس",
  fe_amount:"رقم (روپے)", fe_add_head:"ہیڈ شامل کریں", fe_update_head:"ہیڈ اپ ڈیٹ کریں", fe_cancel_edit:"منسوخ",
  fe_search_student:"نام یا رول نمبر سے طالب علم تلاش کریں…",
  fe_student:"طالب علم", fe_head:"فیس ہیڈ", fe_month:"مہینہ", fe_discount:"رعایت (روپے)",
  fe_net:"خالص قابلِ ادائیگی (روپے)", fe_collect_btn:"وصول کریں اور رسید پرنٹ کریں",
  fe_receipt_title:"فیس رسید", fe_receipt_no:"رسید نمبر", fe_date:"تاریخ",
  fe_father:"والد کا نام", fe_class:"جماعت",
  fe_received_by:"وصول کنندہ", fe_parent_sign:"والد/سرپرست",
  fe_due_amount:"بقایا رقم (روپے)", fe_remind:"واٹس ایپ یاد دہانی",
  fe_no_dues:"کوئی بقایا نہیں — اس ہیڈ اور ماہ کی تمام فیس ادا شدہ",
  fe_total_collected:"کل وصول شدہ (روپے)", fe_txn_count:"لین دین کی تعداد",
  fe_per_head:"فیس ہیڈ کے حساب سے وصولی",
  fe_msg_no_phone:"اس طالب علم کا فون نمبر محفوظ نہیں ہے",
  fe_msg_dues:"السلام علیکم! {school} کی طرف سے فیس کی یاد دہانی۔ {student} ({cls}) کی فیس بقایا ہے: {month} کا {head} — {amount} روپے۔ براہ کرم اسکول آفس میں ادا کریں۔ شکریہ۔",
  fe_no_heads:"پہلے فیس ہیڈ شامل کریں", fe_select_head:"فیس ہیڈ منتخب کریں",
  fe_select_student:"طالب علم منتخب کریں", fe_no_match:"تلاش سے کوئی طالب علم نہیں ملا",
  fe_msg_saved_rcpt:"فیس وصول ہو گئی — رسید پرنٹر کو بھیج دی گئی", fe_roll:"رول نمبر",
});

const FE = {
  tab:'heads',
  headName:'', headAmount:'', editHeadId:null,
  search:'', studentId:'', headId:'', month:todayISO().slice(0,7), amount:'', discount:'0',
  duesMonth:todayISO().slice(0,7), duesClass:'', duesHead:'',
  sumMonth:todayISO().slice(0,7),
};

function feWaPhone(contact){
  let d=String(contact||'').replace(/\D/g,'');
  if(d.length===11&&d[0]==='0') d='92'+d.slice(1);
  return d;
}
function feStudents(){ return DB.get('students').filter(s=>!s.status||s.status==='Active'); }
function feFilteredStudents(){
  const q=FE.search.trim().toLowerCase();
  const all=feStudents();
  if(!q) return all;
  return all.filter(s=>(s.name||'').toLowerCase().includes(q)||String(s.rollNo||'').toLowerCase().includes(q));
}
function feHeadName(id){ const h=DB.find('feeheads',id); return h?h.name:'—'; }

function feRender(el){
  const tabs=[['heads',t('fe_tab_heads')],['collect',t('fe_tab_collect')],['dues',t('fe_tab_dues')],['summary',t('fe_tab_summary')]];
  el.innerHTML='<div class="tabs">'+tabs.map(x=>'<button data-tab="'+x[0]+'" class="'+(FE.tab===x[0]?'active':'')+'">'+esc(x[1])+'</button>').join('')+'</div><div id="fe-body"></div>';
  el.querySelectorAll('.tabs button').forEach(b=>{ b.onclick=()=>{ FE.tab=b.dataset.tab; App.refresh(); }; });
  const body=el.querySelector('#fe-body');
  if(FE.tab==='heads') feRenderHeads(body);
  else if(FE.tab==='collect') feRenderCollect(body);
  else if(FE.tab==='dues') feRenderDues(body);
  else feRenderSummary(body);
}

/* ---------------- FEE HEADS ---------------- */
function feRenderHeads(body){
  const heads=DB.get('feeheads');
  body.innerHTML='<div class="card"><div class="row">'
    +'<div class="form-group"><label>'+t('fe_head_name')+'</label><input type="text" id="feh-name" placeholder="'+esc(t('fe_head_name_ph'))+'" value="'+esc(FE.headName)+'"></div>'
    +'<div class="form-group"><label>'+t('fe_amount')+'</label><input type="number" id="feh-amt" min="0" value="'+esc(FE.headAmount)+'" inputmode="numeric"></div>'
    +'</div><div class="btnrow">'
    +(FE.editHeadId
      ?'<button class="btn btn-primary" id="feh-save">✏️ '+t('fe_update_head')+'</button><button class="btn btn-ghost" id="feh-cancel">'+t('fe_cancel_edit')+'</button>'
      :'<button class="btn btn-primary" id="feh-save">➕ '+t('fe_add_head')+'</button>')
    +'</div></div>'
    +'<div class="card">'
    +(!heads.length?'<div class="empty"><div class="ic">💰</div><p>'+t('fe_no_heads')+'</p></div>'
      :'<div class="table-wrap"><table class="tbl"><thead><tr><th>'+t('fe_head_name')+'</th><th>'+t('fe_amount')+'</th><th>'+t('actions')+'</th></tr></thead><tbody>'
      +heads.map(h=>'<tr><td>'+esc(h.name)+'</td><td>'+fmtNum(h.amount)+'</td>'
        +'<td><button class="btn btn-sm btn-ghost" data-edit="'+h.id+'">'+t('btn_edit')+'</button> '
        +'<button class="btn btn-sm btn-danger" data-del="'+h.id+'">'+t('btn_delete')+'</button></td></tr>').join('')
      +'</tbody></table></div>')
    +'</div>';

  document.getElementById('feh-name').oninput=e=>{ FE.headName=e.target.value; };
  document.getElementById('feh-amt').oninput=e=>{ FE.headAmount=e.target.value; };
  document.getElementById('feh-save').onclick=()=>{
    const name=FE.headName.trim(), amt=Number(FE.headAmount);
    if(!name||!(amt>0)){ App.toast(t('msg_required')); return; }
    if(FE.editHeadId){ DB.update('feeheads',FE.editHeadId,{name:name,amount:amt}); }
    else { DB.add('feeheads',{name:name,amount:amt}); FE.headId=FE.headId||DB.get('feeheads')[DB.get('feeheads').length-1].id; }
    FE.headName=''; FE.headAmount=''; FE.editHeadId=null;
    App.toast(t('msg_saved')); App.refresh();
  };
  const cc=document.getElementById('feh-cancel');
  if(cc) cc.onclick=()=>{ FE.headName=''; FE.headAmount=''; FE.editHeadId=null; App.refresh(); };
  body.querySelectorAll('[data-edit]').forEach(b=>{ b.onclick=()=>{ const h=DB.find('feeheads',b.dataset.edit); FE.editHeadId=h.id; FE.headName=h.name; FE.headAmount=String(h.amount); App.refresh(); }; });
  body.querySelectorAll('[data-del]').forEach(b=>{ b.onclick=async()=>{
    if(await App.confirm(t('msg_confirm_delete'))){ DB.remove('feeheads',b.dataset.del); App.toast(t('msg_deleted')); App.refresh(); }
  }; });
}

/* ---------------- COLLECT ---------------- */
function feRenderCollect(body){
  const heads=DB.get('feeheads');
  const students=feFilteredStudents();
  if(!FE.headId&&heads.length) FE.headId=heads[0].id;
  const head=DB.find('feeheads',FE.headId);
  if(FE.amount===''&&head) FE.amount=String(head.amount);
  const amt=Number(FE.amount)||0, disc=Number(FE.discount)||0;
  const net=Math.max(0,amt-disc);

  body.innerHTML='<div class="card">'
    +'<div class="form-group"><label>'+t('fe_search_student')+'</label><input type="text" id="fec-search" placeholder="'+esc(t('search_ph'))+'" value="'+esc(FE.search)+'"></div>'
    +'<div class="form-group"><label>'+t('fe_student')+'</label><select id="fec-stu"><option value="">'+t('fe_select_student')+'</option>'
    +students.map(s=>'<option value="'+s.id+'"'+(FE.studentId===s.id?' selected':'')+'>'+esc((s.rollNo||'')+' — '+s.name+' ('+DB.className(s.classId)+')')+'</option>').join('')
    +'</select>'+(FE.search&&!students.length?'<p style="color:var(--muted);font-size:13px">'+t('fe_no_match')+'</p>':'')+'</div>'
    +'<div class="row">'
    +'<div class="form-group"><label>'+t('fe_head')+'</label><select id="fec-head"><option value="">'+t('fe_select_head')+'</option>'
    +heads.map(h=>'<option value="'+h.id+'"'+(FE.headId===h.id?' selected':'')+'>'+esc(h.name)+' — '+fmtNum(h.amount)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('fe_month')+'</label><input type="month" id="fec-month" value="'+FE.month+'"></div>'
    +'</div><div class="row">'
    +'<div class="form-group"><label>'+t('fe_amount')+'</label><input type="number" id="fec-amt" min="0" value="'+esc(String(FE.amount))+'" inputmode="numeric"></div>'
    +'<div class="form-group"><label>'+t('fe_discount')+'</label><input type="number" id="fec-disc" min="0" value="'+esc(String(FE.discount))+'" inputmode="numeric"></div>'
    +'<div class="form-group"><label>'+t('fe_net')+'</label><div style="font-size:20px;font-weight:800;color:var(--green)">'+fmtNum(net)+'</div></div>'
    +'</div>'
    +'<div class="btnrow"><button class="btn btn-green" id="fec-save">🧾 '+t('fe_collect_btn')+'</button></div>'
    +'</div>';

  document.getElementById('fec-search').oninput=e=>{ FE.search=e.target.value; App.refresh(); const si=document.getElementById('fec-search'); si.focus(); si.setSelectionRange(si.value.length,si.value.length); };
  document.getElementById('fec-stu').onchange=e=>{ FE.studentId=e.target.value; };
  document.getElementById('fec-head').onchange=e=>{ FE.headId=e.target.value; const h=DB.find('feeheads',FE.headId); FE.amount=h?String(h.amount):''; App.refresh(); };
  document.getElementById('fec-month').onchange=e=>{ FE.month=e.target.value; };
  document.getElementById('fec-amt').oninput=e=>{ FE.amount=e.target.value; const a=Number(e.target.value)||0,d=Number(FE.discount)||0; e.target.closest('.card').querySelector('.form-group div[style]').textContent=fmtNum(Math.max(0,a-d)); };
  document.getElementById('fec-disc').oninput=e=>{ FE.discount=e.target.value; const a=Number(FE.amount)||0,d=Number(e.target.value)||0; e.target.closest('.card').querySelector('.form-group div[style]').textContent=fmtNum(Math.max(0,a-d)); };
  document.getElementById('fec-save').onclick=()=>{
    if(!FE.studentId||!FE.headId||!FE.month){ App.toast(t('msg_required')); return; }
    const stu=DB.find('students',FE.studentId);
    const h=DB.find('feeheads',FE.headId);
    const a=Number(FE.amount)||0, d=Number(FE.discount)||0, n=Math.max(0,a-d);
    const txn=DB.add('feetxns',{studentId:stu.id,headId:h.id,month:FE.month,amount:a,discount:d,net:n,date:todayISO(),receiptNo:'R'+Date.now().toString(36).toUpperCase()});
    FE.discount='0';
    App.print(feReceiptHTML(txn));
    App.toast(t('fe_msg_saved_rcpt'));
  };
}

function feReceiptHTML(txn){
  const m=DB.meta(), stu=DB.find('students',txn.studentId)||{}, h=DB.find('feeheads',txn.headId)||{};
  const logo=m.logo?'<img src="'+m.logo+'" style="height:60px">':'<div style="font-size:40px">🏫</div>';
  const row=(k,v)=>'<tr><th style="text-align:start">'+k+'</th><td>'+v+'</td></tr>';
  return '<style>.frc{font-family:inherit;color:#111;max-width:560px;margin:auto;border:2px solid #1e3a5f;border-radius:10px;padding:20px}.frc table{width:100%;border-collapse:collapse;margin:10px 0}.frc th,.frc td{padding:7px 4px;font-size:14px;border-bottom:1px dashed #cbd5e1}.frc .hd{text-align:center;border-bottom:3px double #1e3a5f;padding-bottom:10px;margin-bottom:6px}.frc .sig{display:flex;justify-content:space-between;margin-top:46px}.frc .sig div{border-top:1px solid #333;padding-top:4px;width:40%;text-align:center;font-size:13px}.frc .net td{font-size:18px;font-weight:800;border-bottom:none}</style>'
  +'<div class="frc"><div class="hd">'+logo+'<h2 style="margin:6px 0">'+esc(m.name)+'</h2><h3 style="margin:4px 0">'+t('fe_receipt_title')+'</h3></div>'
  +'<table>'
  +row(t('fe_receipt_no'),'<b>'+esc(txn.receiptNo)+'</b>')+row(t('fe_date'),fmtDate(txn.date))
  +row(t('name'),esc(stu.name||'—'))+row(t('fe_father'),esc(stu.fatherName||'—'))
  +row(t('fe_class'),esc(DB.className(stu.classId)+(stu.sectionId?' — '+DB.sectionName(stu.sectionId):'')))
  +row(t('fe_head'),esc(h.name||'—'))+row(t('fe_month'),esc(txn.month))
  +row(t('fe_amount'),fmtNum(txn.amount))+row(t('fe_discount'),fmtNum(txn.discount))
  +'</table><table><tr class="net"><th style="text-align:start">'+t('fe_net')+'</th><td style="text-align:end">'+fmtNum(txn.net)+'</td></tr></table>'
  +'<div class="sig"><div>'+t('fe_received_by')+'</div><div>'+t('fe_parent_sign')+'</div></div></div>';
}

/* ---------------- DUES ---------------- */
function feRenderDues(body){
  const classes=DB.get('classes'), heads=DB.get('feeheads');
  if(!FE.duesHead&&heads.length) FE.duesHead=heads[0].id;
  if(!FE.duesClass&&classes.length) FE.duesClass=classes[0].id;
  const head=DB.find('feeheads',FE.duesHead);
  const paid=new Set(DB.get('feetxns').filter(x=>x.month===FE.duesMonth&&x.headId===FE.duesHead).map(x=>x.studentId));
  const debtors=feStudents().filter(s=>s.classId===FE.duesClass&&!paid.has(s.id));

  body.innerHTML='<div class="card"><div class="row">'
    +'<div class="form-group"><label>'+t('fe_month')+'</label><input type="month" id="fed-month" value="'+FE.duesMonth+'"></div>'
    +'<div class="form-group"><label>'+t('fe_class')+'</label><select id="fed-class">'+classes.map(c=>'<option value="'+c.id+'"'+(FE.duesClass===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('fe_head')+'</label><select id="fed-head">'+heads.map(h=>'<option value="'+h.id+'"'+(FE.duesHead===h.id?' selected':'')+'>'+esc(h.name)+' — '+fmtNum(h.amount)+'</option>').join('')+'</select></div>'
    +'</div></div>'
    +'<div class="card">'
    +(!heads.length?'<div class="empty"><div class="ic">💰</div><p>'+t('fe_no_heads')+'</p></div>'
      :!debtors.length?'<div class="empty"><div class="ic">✅</div><p>'+t('fe_no_dues')+'</p></div>'
      :'<div class="table-wrap"><table class="tbl"><thead><tr><th>'+t('fe_roll')+'</th><th>'+t('name')+'</th><th>'+t('fe_due_amount')+'</th><th>'+t('actions')+'</th></tr></thead><tbody>'
      +debtors.map(s=>'<tr><td>'+esc(s.rollNo||'—')+'</td><td>'+esc(s.name)+'</td><td>'+fmtNum(head?head.amount:0)+'</td>'
        +'<td><button class="btn btn-sm btn-green" data-remind="'+s.id+'">📲 '+t('fe_remind')+'</button></td></tr>').join('')
      +'</tbody></table></div>')
    +'</div>';

  document.getElementById('fed-month').onchange=e=>{ FE.duesMonth=e.target.value; App.refresh(); };
  document.getElementById('fed-class').onchange=e=>{ FE.duesClass=e.target.value; App.refresh(); };
  document.getElementById('fed-head').onchange=e=>{ FE.duesHead=e.target.value; App.refresh(); };
  body.querySelectorAll('[data-remind]').forEach(b=>{ b.onclick=()=>{
    const s=DB.find('students',b.dataset.remind);
    const ph=feWaPhone(s.contact);
    if(!ph){ App.toast(t('fe_msg_no_phone')); return; }
    const msg=t('fe_msg_dues')
      .replace('{school}',DB.meta().name)
      .replace('{student}',s.name)
      .replace('{cls}',DB.className(s.classId)+(s.sectionId?' ('+DB.sectionName(s.sectionId)+')':''))
      .replace('{head}',head?head.name:'')
      .replace('{month}',FE.duesMonth)
      .replace('{amount}',fmtNum(head?head.amount:0));
    window.open('https://wa.me/'+ph+'?text='+encodeURIComponent(msg),'_blank');
  }; });
}

/* ---------------- SUMMARY ---------------- */
function feRenderSummary(body){
  const txns=DB.get('feetxns').filter(x=>x.month===FE.sumMonth);
  const total=txns.reduce((a,x)=>a+Number(x.net||0),0);
  const byHead={};
  txns.forEach(x=>{ if(!byHead[x.headId]) byHead[x.headId]={count:0,total:0}; byHead[x.headId].count++; byHead[x.headId].total+=Number(x.net||0); });

  body.innerHTML='<div class="card"><div class="form-group"><label>'+t('fe_month')+'</label><input type="month" id="fes-month" value="'+FE.sumMonth+'"></div></div>'
    +'<div class="row">'
    +'<div class="card" style="flex:1"><div style="color:var(--muted);font-size:13px">'+t('fe_total_collected')+'</div><div style="font-size:26px;font-weight:800;color:var(--green)">'+fmtNum(total)+'</div></div>'
    +'<div class="card" style="flex:1"><div style="color:var(--muted);font-size:13px">'+t('fe_txn_count')+'</div><div style="font-size:26px;font-weight:800;color:var(--navy)">'+fmtNum(txns.length)+'</div></div>'
    +'</div>'
    +'<div class="card"><h3 style="margin-top:0">'+t('fe_per_head')+'</h3>'
    +(!txns.length?'<div class="empty"><div class="ic">💰</div><p>'+t('msg_no_data')+'</p></div>'
      :'<div class="table-wrap"><table class="tbl"><thead><tr><th>'+t('fe_head')+'</th><th>'+t('fe_txn_count')+'</th><th>'+t('fe_total_collected')+'</th></tr></thead><tbody>'
      +Object.keys(byHead).map(hid=>'<tr><td>'+esc(feHeadName(hid))+'</td><td>'+fmtNum(byHead[hid].count)+'</td><td>'+fmtNum(byHead[hid].total)+'</td></tr>').join('')
      +'</tbody></table></div>')
    +'</div>';

  document.getElementById('fes-month').onchange=e=>{ FE.sumMonth=e.target.value; App.refresh(); };
}

App.register('fees',{titleKey:'nav_fees',icon:'💰',roles:['superadmin','principal'],render:feRender});
