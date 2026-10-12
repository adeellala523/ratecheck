/* Notices module: list, add/edit (admins), delete */
Object.assign(I18N.en,{
  nt_add:"Add Notice", nt_edit:"Edit Notice", nt_title:"Title", nt_message:"Message",
  nt_date:"Date", nt_audience:"Audience", nt_for_all:"Everyone",
  nt_for_teachers:"Teachers", nt_for_students:"Students", nt_for_parents:"Parents",
  nt_no_notices:"No notices yet",
});
Object.assign(I18N.ur,{
  nt_add:"نوٹس شامل کریں", nt_edit:"نوٹس کی ترمیم", nt_title:"عنوان", nt_message:"پیغام",
  nt_date:"تاریخ", nt_audience:"مخاطب", nt_for_all:"سب",
  nt_for_teachers:"اساتذہ", nt_for_students:"طلبہ", nt_for_parents:"والدین",
  nt_no_notices:"ابھی کوئی نوٹس نہیں",
});

function nt_audienceKey(a){
  return a==='teachers'?'nt_for_teachers':a==='students'?'nt_for_students':a==='parents'?'nt_for_parents':'nt_for_all';
}
function nt_canAdmin(){ return App.user && (App.user.role==='superadmin' || App.user.role==='principal'); }

function nt_render(el){
  const admin = nt_canAdmin();
  const rows = DB.get('notices').slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')) || (b.createdAt||0)-(a.createdAt||0));
  let h = '';
  if(admin) h += '<div class="btnrow" style="margin-bottom:12px"><button class="btn btn-primary" id="nt-add">+ '+t('nt_add')+'</button></div>';
  if(!rows.length) h += '<div class="empty"><span class="ic">📢</span><p>'+t('nt_no_notices')+'</p></div>';
  else h += rows.map(n =>
    '<div class="notice"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">'
    + '<h4 style="margin:0">'+esc(n.title)+'</h4>'
    + '<span style="display:flex;gap:6px"><span class="badge b-blue">'+fmtDate(n.date)+'</span><span class="badge b-green">'+t(nt_audienceKey(n.audience))+'</span></span></div>'
    + '<p style="margin:8px 0 0;white-space:pre-wrap">'+esc(n.message)+'</p>'
    + (admin ? '<div class="btnrow" style="margin-top:10px"><button class="btn btn-sm btn-navy" data-edtnt="'+n.id+'">'+t('btn_edit')+'</button>'
      + '<button class="btn btn-sm btn-danger" data-delnt="'+n.id+'">'+t('btn_delete')+'</button></div>' : '')
    + '</div>'
  ).join('');
  el.innerHTML = h;
  if(admin) el.querySelector('#nt-add').onclick = ()=>nt_modal(null);
  el.querySelectorAll('[data-edtnt]').forEach(b=>{ b.onclick = ()=>nt_modal(DB.find('notices', b.dataset.edtnt)); });
  el.querySelectorAll('[data-delnt]').forEach(b=>{ b.onclick = async ()=>{
    if(await App.confirm(t('msg_confirm_delete'))){ DB.remove('notices', b.dataset.delnt); App.toast(t('msg_deleted')); App.refresh(); }
  };});
}
function nt_modal(n){
  const auds = [['all','nt_for_all'],['teachers','nt_for_teachers'],['students','nt_for_students'],['parents','nt_for_parents']];
  App.modal('<h3 style="margin-top:0">'+(n?t('nt_edit'):t('nt_add'))+'</h3>'
    + '<div class="form-group"><label>'+t('nt_title')+'</label><input id="m-nt-title" value="'+esc(n?n.title:'')+'"></div>'
    + '<div class="form-group"><label>'+t('nt_message')+'</label><textarea id="m-nt-msg" rows="4">'+esc(n?n.message:'')+'</textarea></div>'
    + '<div class="row"><div class="form-group" style="flex:1"><label>'+t('nt_date')+'</label><input type="date" id="m-nt-date" value="'+esc(n&&n.date?n.date:todayISO())+'"></div>'
    + '<div class="form-group" style="flex:1"><label>'+t('nt_audience')+'</label><select id="m-nt-aud">'
    + auds.map(a=>'<option value="'+a[0]+'"'+(n&&n.audience===a[0]?' selected':'')+'>'+t(a[1])+'</option>').join('') + '</select></div></div>'
    + '<div class="btnrow" style="justify-content:flex-end"><button class="btn btn-ghost" id="m-nt-cancel">'+t('btn_cancel')+'</button>'
    + '<button class="btn btn-primary" id="m-nt-save">'+t('btn_save')+'</button></div>');
  document.getElementById('m-nt-cancel').onclick = App.closeModal;
  document.getElementById('m-nt-save').onclick = ()=>{
    const title = document.getElementById('m-nt-title').value.trim();
    const message = document.getElementById('m-nt-msg').value.trim();
    if(!title || !message){ App.toast(t('msg_required')); return; }
    const data = { title, message, date: document.getElementById('m-nt-date').value || todayISO(),
                   audience: document.getElementById('m-nt-aud').value };
    if(n) DB.update('notices', n.id, data); else DB.add('notices', data);
    App.closeModal(); App.toast(t('msg_saved')); App.refresh();
  };
}

App.register('notices',{ titleKey:'nav_notices', icon:'📢', roles:['superadmin','principal','teacher','exam'], render: nt_render });
