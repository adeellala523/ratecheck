/* i18n — all user-visible strings. Modules merge their own prefixed keys:
   Object.assign(I18N.en, {...}); Object.assign(I18N.ur, {...}); */
const I18N = {
en: {
  app_name:"AI School Management", app_tag:"Academic Assistant",
  login_title:"Welcome", select_school:"Select School", select_role:"Select Your Role",
  enter_pin:"Enter PIN", btn_login:"Login", wrong_pin:"Wrong PIN, try again",
  role_superadmin:"Super Admin", role_principal:"Principal", role_teacher:"Teacher", role_exam:"Exam Staff",
  setup_wizard:"School Setup", wz_school:"School Name", wz_logo:"School Logo (optional)",
  wz_session:"Academic Session (e.g. 2026-27)", wz_pin_admin:"Admin PIN", wz_pin_teacher:"Teacher PIN",
  wz_pin_exam:"Exam Staff PIN", wz_pin_super:"Super Admin PIN",
  btn_next:"Next", btn_back:"Back", btn_finish:"Finish Setup", btn_add_school:"Add Another School",
  nav_dashboard:"Dashboard", nav_setup:"School Setup", nav_books:"Book Library", nav_syllabus:"Syllabus",
  nav_papers:"Paper Generator", nav_scanpaper:"Scan Paper", nav_checking:"Paper Checking", nav_results:"Results",
  nav_attendance:"Attendance", nav_fees:"Fees", nav_notices:"Notices", nav_expert:"AI Expert", nav_settings:"Settings",
  btn_save:"Save", btn_cancel:"Cancel", btn_add:"Add", btn_edit:"Edit", btn_delete:"Delete", btn_close:"Close",
  btn_print:"Print", btn_download:"Download", btn_upload:"Upload", btn_generate:"Generate", btn_search:"Search",
  btn_export:"Export", btn_import:"Import", btn_logout:"Logout", btn_choose:"Choose", btn_send:"Send", btn_view:"View",
  msg_saved:"Saved successfully", msg_deleted:"Deleted", msg_confirm_delete:"Are you sure you want to delete this?",
  msg_no_data:"No records yet", msg_required:"Please fill all required fields", msg_yes:"Yes", msg_no:"No",
  search_ph:"Search...", actions:"Actions", name:"Name", date:"Date", status:"Status", total:"Total",
  demo_notice:"Demo data — you can delete it anytime from Settings.",
  day_mon:"Monday", day_tue:"Tuesday", day_wed:"Wednesday", day_thu:"Thursday", day_fri:"Friday", day_sat:"Saturday", day_sun:"Sunday",
  offline:"Offline", online:"Online", lang_name:"اردو",
  ph_school_name:"e.g. City Public School", ph_session:"e.g. 2026-27",
},
ur: {
  app_name:"اے آئی اسکول مینجمنٹ", app_tag:"اکیڈمک اسسٹنٹ",
  login_title:"خوش آمدید", select_school:"اسکول منتخب کریں", select_role:"اپنا کردار منتخب کریں",
  enter_pin:"پن درج کریں", btn_login:"لاگ اِن", wrong_pin:"غلط پن، دوبارہ کوشش کریں",
  role_superadmin:"سپر ایڈمن", role_principal:"پرنسپل", role_teacher:"استاد", role_exam:"امتحانی عملہ",
  setup_wizard:"اسکول سیٹ اپ", wz_school:"اسکول کا نام", wz_logo:"اسکول لوگو (اختیاری)",
  wz_session:"تعلیمی سیشن (مثلاً 2026-27)", wz_pin_admin:"ایڈمن پن", wz_pin_teacher:"استاد پن",
  wz_pin_exam:"امتحانی عملہ پن", wz_pin_super:"سپر ایڈمن پن",
  btn_next:"آگے", btn_back:"پیچھے", btn_finish:"سیٹ اپ مکمل کریں", btn_add_school:"نیا اسکول شامل کریں",
  nav_dashboard:"ڈیش بورڈ", nav_setup:"اسکول سیٹ اپ", nav_books:"کتاب لائبریری", nav_syllabus:"نصاب",
  nav_papers:"پیپر جنریٹر", nav_scanpaper:"اسکین پیپر", nav_checking:"پیپر چیکنگ", nav_results:"نتائج",
  nav_attendance:"حاضری", nav_fees:"فیس", nav_notices:"نوٹس", nav_expert:"اے آئی ماہر", nav_settings:"سیٹنگز",
  btn_save:"محفوظ کریں", btn_cancel:"منسوخ", btn_add:"شامل کریں", btn_edit:"ترمیم", btn_delete:"حذف کریں", btn_close:"بند کریں",
  btn_print:"پرنٹ", btn_download:"ڈاؤن لوڈ", btn_upload:"اپ لوڈ", btn_generate:"بنائیں", btn_search:"تلاش",
  btn_export:"ایکسپورٹ", btn_import:"امپورٹ", btn_logout:"لاگ آؤٹ", btn_choose:"منتخب کریں", btn_send:"بھیجیں", btn_view:"دیکھیں",
  msg_saved:"کامیابی سے محفوظ ہو گیا", msg_deleted:"حذف کر دیا گیا", msg_confirm_delete:"کیا آپ واقعی حذف کرنا چاہتے ہیں؟",
  msg_no_data:"ابھی کوئی ریکارڈ نہیں", msg_required:"براہ کرم تمام ضروری خانے پُر کریں", msg_yes:"جی ہاں", msg_no:"نہیں",
  search_ph:"تلاش کریں...", actions:"عمل", name:"نام", date:"تاریخ", status:"حالت", total:"کل",
  demo_notice:"ڈیمو ڈیٹا — آپ اسے سیٹنگز سے کسی بھی وقت حذف کر سکتے ہیں۔",
  day_mon:"پیر", day_tue:"منگل", day_wed:"بدھ", day_thu:"جمعرات", day_fri:"جمعہ", day_sat:"ہفتہ", day_sun:"اتوار",
  offline:"آف لائن", online:"آن لائن", lang_name:"English",
  ph_school_name:"مثلاً سٹی پبلک اسکول", ph_session:"مثلاً 2026-27",
}
};
let LANG = localStorage.getItem('sams_lang') || 'en';
function t(key){
  const d = I18N[LANG] || I18N.en;
  if (d[key] !== undefined) return d[key];
  if (I18N.en[key] !== undefined) return I18N.en[key];
  return key;
}
function setLang(l){
  LANG = (l === 'ur') ? 'ur' : 'en';
  localStorage.setItem('sams_lang', LANG);
  document.documentElement.lang = LANG;
  document.documentElement.dir = (LANG === 'ur') ? 'rtl' : 'ltr';
  const tg = document.getElementById('lang-toggle');
  if (tg) tg.textContent = t('lang_name');
  if (window.App && App.current) App.refresh();
}
