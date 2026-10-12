Object.assign(I18N.en, {
  sy_new: "New Syllabus", sy_book: "Book", sy_class: "Class", sy_subject: "Subject",
  sy_start: "Start Date", sy_end: "End Date",
  sy_preset_1w: "1 Week", sy_preset_2w: "2 Weeks", sy_preset_1m: "1 Month", sy_preset_term: "Full Term",
  sy_teaching_days: "Teaching Days", sy_periods: "Periods per Day", sy_difficulty: "Difficulty",
  sy_easy: "Easy", sy_medium: "Medium", sy_hard: "Hard",
  sy_revision: "Add weekly revision day", sy_weekly_test: "Add weekly test",
  sy_generate: "Generate Preview", sy_preview: "Syllabus Preview",
  sy_date: "Date", sy_chapter: "Chapter", sy_topic: "Topic", sy_activity: "Activity",
  sy_save: "Save Syllabus", sy_view_title: "Syllabus", sy_week: "Week",
  sy_no_analysis: "No analyzed books for this subject. Upload and analyze a book first.",
  sy_select_class_first: "Select class and subject first",
  sy_no_syllabi: "No syllabi saved yet. Create the first one.",
  sy_back: "Back", sy_saved: "Syllabus saved",
  sy_edit_hint: "You can edit topics and activities below before saving.",
  sy_act_reading: "Reading + Explanation", sy_act_questions: "Questions + Activity",
  sy_act_exercise: "Exercise", sy_act_revision: "Revision", sy_act_test: "Weekly Test",
  sy_act_custom: "Custom…", sy_custom_ph: "Type activity…",
  sy_not_enough_days: "Not enough teaching days for all chapters — the remaining content was left out. Extend the end date or add more teaching days.",
  sy_gen_error: "Could not generate — check dates and teaching days.",
  sy_select_book: "Select book…", sy_select_class: "Select class…", sy_select_subject: "Select subject…",
  sy_days_count: "teaching days", sy_from: "From", sy_to: "To"
});
Object.assign(I18N.ur, {
  sy_new: "نیا نصاب", sy_book: "کتاب", sy_class: "کلاس", sy_subject: "مضمون",
  sy_start: "آغاز کی تاریخ", sy_end: "اختتام کی تاریخ",
  sy_preset_1w: "1 ہفتہ", sy_preset_2w: "2 ہفتے", sy_preset_1m: "1 مہینہ", sy_preset_term: "مکمل ٹرم",
  sy_teaching_days: "تدریسی دن", sy_periods: "روزانہ پیریڈ", sy_difficulty: "مشکل",
  sy_easy: "آسان", sy_medium: "درمیانہ", sy_hard: "مشکل",
  sy_revision: "ہفتہ وار دہرائی شامل کریں", sy_weekly_test: "ہفتہ وار ٹیسٹ شامل کریں",
  sy_generate: "پیش نظارہ بنائیں", sy_preview: "نصاب کا پیش نظارہ",
  sy_date: "تاریخ", sy_chapter: "باب", sy_topic: "موضوع", sy_activity: "سرگرمی",
  sy_save: "نصاب محفوظ کریں", sy_view_title: "نصاب", sy_week: "ہفتہ",
  sy_no_analysis: "اس مضمون کے لیے کوئی تجزیہ شدہ کتاب نہیں۔ پہلے کتاب اپ لوڈ کر کے تجزیہ کریں۔",
  sy_select_class_first: "پہلے کلاس اور مضمون منتخب کریں",
  sy_no_syllabi: "ابھی کوئی نصاب محفوظ نہیں۔ پہلا نصاب بنائیں۔",
  sy_back: "واپس", sy_saved: "نصاب محفوظ ہو گیا",
  sy_edit_hint: "محفوظ کرنے سے پہلے نیچے موضوعات اور سرگرمیاں تبدیل کر سکتے ہیں۔",
  sy_act_reading: "مطالعہ + وضاحت", sy_act_questions: "سوالات + سرگرمی",
  sy_act_exercise: "مشق", sy_act_revision: "دہرائی", sy_act_test: "ہفتہ وار ٹیسٹ",
  sy_act_custom: "اپنی مرضی…", sy_custom_ph: "سرگرمی لکھیں…",
  sy_not_enough_days: "تمام ابواب کے لیے تدریسی دن کم ہیں — باقی مواد شامل نہیں ہو سکا۔ اختتامی تاریخ بڑھائیں یا مزید تدریسی دن شامل کریں۔",
  sy_gen_error: "نصاب نہیں بن سکا — تاریخیں اور تدریسی دن چیک کریں۔",
  sy_select_book: "کتاب منتخب کریں…", sy_select_class: "کلاس منتخب کریں…", sy_select_subject: "مضمون منتخب کریں…",
  sy_days_count: "تدریسی دن", sy_from: "از", sy_to: "تا"
});

/* ---------- module state ---------- */
var SyMode = 'list', SyViewId = null, SyDraft = null;
var SY_ACTS = ['reading', 'questions', 'exercise', 'revision', 'test', 'custom'];

App.register('syllabus', {
  titleKey: 'nav_syllabus', icon: '📅',
  roles: ['superadmin', 'principal', 'teacher'],
  render: function(el){ sy_render(el); }
});

function sy_render(el){
  if (SyMode === 'gen') sy_renderGen(el);
  else if (SyMode === 'view') sy_renderView(el);
  else sy_renderList(el);
}

/* ---------- date helpers (local-time safe) ---------- */
function sy_iso(d){
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + dd;
}
function sy_parse(iso){ return new Date(iso + 'T00:00:00'); }
function sy_addDays(iso, n){ var d = sy_parse(iso); d.setDate(d.getDate() + n); return sy_iso(d); }
function sy_monday(iso){
  var d = sy_parse(iso);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return sy_iso(d);
}
function sy_wd(jsDay){
  return t(['day_sun', 'day_mon', 'day_tue', 'day_wed', 'day_thu', 'day_fri', 'day_sat'][jsDay]);
}
function sy_actLabel(e){
  if (e.activity === 'custom' && e.custom) return e.custom;
  return t('sy_act_' + e.activity);
}

/* ---------- list ---------- */
function sy_renderList(el){
  var ss = DB.get('syllabi').slice().reverse();
  var head = '<div class="toolbar" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px">'
    + '<h2 style="margin:0">' + t('nav_syllabus') + '</h2>'
    + '<button class="btn btn-primary" id="sy-new">➕ ' + t('sy_new') + '</button></div>';
  if (!ss.length){
    el.innerHTML = head + '<div class="card empty"><div class="ic">📅</div><p>' + t('sy_no_syllabi') + '</p></div>';
  } else {
    var rows = ss.map(function(s){
      return '<tr><td><b>' + esc(DB.bookTitle(s.bookId)) + '</b></td>'
        + '<td>' + esc(DB.className(s.classId)) + '<br><small style="color:var(--muted)">' + esc(DB.subjectName(s.subjectId)) + '</small></td>'
        + '<td>' + fmtDate(s.startDate) + ' – ' + fmtDate(s.endDate) + '</td>'
        + '<td>' + fmtNum((s.days || []).length) + '</td>'
        + '<td><div class="btnrow">'
        + '<button class="btn btn-primary btn-sm" data-view="' + s.id + '">' + t('btn_view') + '</button>'
        + '<button class="btn btn-navy btn-sm" data-print="' + s.id + '">🖨 ' + t('btn_print') + '</button>'
        + '<button class="btn btn-danger btn-sm" data-del="' + s.id + '">' + t('btn_delete') + '</button>'
        + '</div></td></tr>';
    }).join('');
    el.innerHTML = head
      + '<div class="table-wrap"><table class="tbl"><thead><tr>'
      + '<th>' + t('sy_book') + '</th><th>' + t('sy_class') + ' / ' + t('sy_subject') + '</th>'
      + '<th>' + t('sy_from') + ' – ' + t('sy_to') + '</th><th>' + t('sy_days_count') + '</th><th>' + t('actions') + '</th>'
      + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  document.getElementById('sy-new').onclick = function(){ SyMode = 'gen'; SyDraft = null; App.refresh(); };
  el.querySelectorAll('[data-view]').forEach(function(b){ b.onclick = function(){ SyMode = 'view'; SyViewId = b.dataset.view; App.refresh(); }; });
  el.querySelectorAll('[data-print]').forEach(function(b){ b.onclick = function(){ sy_print(DB.find('syllabi', b.dataset.print)); }; });
  el.querySelectorAll('[data-del]').forEach(function(b){
    b.onclick = async function(){
      if (await App.confirm(t('msg_confirm_delete'))){
        DB.remove('syllabi', b.dataset.del);
        App.toast(t('msg_deleted')); App.refresh();
      }
    };
  });
}

/* ---------- generator form + preview ---------- */
function sy_renderGen(el){
  var classes = DB.get('classes');
  var wdOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon..Sun
  var wdBoxes = wdOrder.map(function(d){
    var on = (d >= 1 && d <= 5) ? ' checked' : '';
    return '<label style="display:inline-flex;align-items:center;gap:6px;margin-inline-end:12px;font-size:14px">'
      + '<input type="checkbox" class="sy-wd" value="' + d + '"' + on + ' style="width:auto"> ' + sy_wd(d) + '</label>';
  }).join('');
  var html =
    '<div class="toolbar" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px">'
    + '<h2 style="margin:0">' + t('sy_new') + '</h2>'
    + '<button class="btn btn-ghost" id="sy-back">← ' + t('sy_back') + '</button></div>'
    + '<div class="card"><h3>⚙️ ' + t('sy_generate') + '</h3>'
    + '<div class="row">'
    + '<div class="form-group"><label>' + t('sy_class') + ' *</label><select id="sy-class"><option value="">' + t('sy_select_class') + '</option>'
    + classes.map(function(c){ return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('') + '</select></div>'
    + '<div class="form-group"><label>' + t('sy_subject') + ' *</label><select id="sy-subject"><option value="">' + t('sy_select_class_first') + '</option></select></div>'
    + '</div>'
    + '<div class="form-group"><label>' + t('sy_book') + ' *</label><select id="sy-book"><option value="">' + t('sy_select_class_first') + '</option></select>'
    + '<div id="sy-bookwarn"></div></div>'
    + '<div class="row">'
    + '<div class="form-group"><label>' + t('sy_start') + ' *</label><input type="date" id="sy-start" value="' + todayISO() + '"></div>'
    + '<div class="form-group"><label>' + t('sy_end') + ' *</label><input type="date" id="sy-end" value="' + sy_addDays(todayISO(), 29) + '"></div>'
    + '</div>'
    + '<div class="form-group"><label>' + t('sy_end') + ' — ' + t('sy_teaching_days') + '</label><div class="btnrow">'
    + [6, 13, 29, 89].map(function(off, i){
        return '<button class="btn btn-ghost btn-sm sy-preset" data-off="' + off + '">'
          + t(['sy_preset_1w', 'sy_preset_2w', 'sy_preset_1m', 'sy_preset_term'][i]) + '</button>';
      }).join('')
    + '</div></div>'
    + '<div class="form-group"><label>' + t('sy_teaching_days') + '</label><div>' + wdBoxes + '</div></div>'
    + '<div class="row">'
    + '<div class="form-group"><label>' + t('sy_periods') + '</label><input type="number" id="sy-periods" min="1" max="6" value="1"></div>'
    + '<div class="form-group"><label>' + t('sy_difficulty') + '</label><select id="sy-diff">'
    + '<option value="easy">' + t('sy_easy') + '</option><option value="medium" selected>' + t('sy_medium') + '</option><option value="hard">' + t('sy_hard') + '</option></select></div>'
    + '</div>'
    + '<div class="row">'
    + '<label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="sy-rev" checked style="width:auto"> ' + t('sy_revision') + '</label>'
    + '<label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="sy-test" checked style="width:auto"> ' + t('sy_weekly_test') + '</label>'
    + '</div>'
    + '<div class="btnrow" style="margin-top:10px"><button class="btn btn-green" id="sy-genbtn">✨ ' + t('sy_generate') + '</button></div>'
    + '</div>'
    + '<div id="sy-preview"></div>';

  el.innerHTML = html;
  document.getElementById('sy-back').onclick = function(){ SyMode = 'list'; SyDraft = null; App.refresh(); };

  function refreshSubjects(){
    var cid = document.getElementById('sy-class').value;
    var subs = DB.get('subjects').filter(function(s){ return s.classId === cid; });
    document.getElementById('sy-subject').innerHTML = '<option value="">' + t('sy_select_subject') + '</option>'
      + subs.map(function(s){ return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join('');
    refreshBooks();
  }
  function refreshBooks(){
    var cid = document.getElementById('sy-class').value;
    var sid = document.getElementById('sy-subject').value;
    var warn = document.getElementById('sy-bookwarn');
    var avail = DB.get('books').filter(function(b){
      return b.classId === cid && b.subjectId === sid && b.analysis && b.analysis.chapters && b.analysis.chapters.length;
    });
    document.getElementById('sy-book').innerHTML = '<option value="">' + t('sy_select_book') + '</option>'
      + avail.map(function(b){ return '<option value="' + b.id + '">' + esc(b.bookName) + ' (' + fmtNum(b.analysis.chapters.length) + ' ' + t('bk_chapters') + ')</option>'; }).join('');
    warn.innerHTML = (cid && sid && !avail.length) ? '<div class="notice" style="margin-top:8px"><small>' + t('sy_no_analysis') + '</small></div>' : '';
  }
  document.getElementById('sy-class').onchange = refreshSubjects;
  document.getElementById('sy-subject').onchange = refreshBooks;
  el.querySelectorAll('.sy-preset').forEach(function(b){
    b.onclick = function(){
      var st = document.getElementById('sy-start').value;
      if (!st){ App.toast(t('msg_required')); return; }
      document.getElementById('sy-end').value = sy_addDays(st, parseInt(b.dataset.off, 10));
    };
  });
  document.getElementById('sy-genbtn').onclick = sy_generate;
  if (SyDraft) sy_renderPreview();
}

/* ---------- generation algorithm ---------- */
function sy_generate(){
  var classId = document.getElementById('sy-class').value;
  var subjectId = document.getElementById('sy-subject').value;
  var bookId = document.getElementById('sy-book').value;
  var start = document.getElementById('sy-start').value;
  var end = document.getElementById('sy-end').value;
  var wds = Array.prototype.slice.call(document.querySelectorAll('.sy-wd'))
    .filter(function(c){ return c.checked; }).map(function(c){ return parseInt(c.value, 10); });
  var periods = Math.max(1, parseInt(document.getElementById('sy-periods').value, 10) || 1);
  var rev = document.getElementById('sy-rev').checked;
  var tst = document.getElementById('sy-test').checked;
  if (!classId || !subjectId || !bookId || !start || !end || end < start || !wds.length){
    App.toast(t('sy_gen_error')); return;
  }
  var book = DB.find('books', bookId);
  if (!book || !book.analysis || !book.analysis.chapters.length){ App.toast(t('sy_gen_error')); return; }

  // 1) teaching-day list between start/end on checked weekdays
  var days = [];
  for (var d = sy_parse(start); sy_iso(d) <= end; d.setDate(d.getDate() + 1)){
    if (wds.indexOf(d.getDay()) >= 0) days.push({date: sy_iso(d), weekday: d.getDay()});
  }
  if (!days.length){ App.toast(t('sy_gen_error')); return; }

  // 2) chapter plan: day1 = Reading+Explanation, following days = Questions+Activity, then 1 Exercise day
  var tpd = periods >= 2 ? 2 : 1; // topics per day
  var plan = [];
  book.analysis.chapters.forEach(function(ch){
    var topics = (ch.topics && ch.topics.length) ? ch.topics : [ch.title];
    for (var i = 0; i < topics.length; i += tpd){
      plan.push({chapter: ch.title, topic: topics.slice(i, i + tpd).join(', '), activity: i === 0 ? 'reading' : 'questions'});
    }
    plan.push({chapter: ch.title, topic: '—', activity: 'exercise'});
  });

  // 3) assign plan to teaching days
  var truncated = plan.length > days.length;
  var entries = plan.slice(0, days.length).map(function(p, i){
    return {date: days[i].date, weekday: days[i].weekday, chapter: p.chapter, topic: p.topic, activity: p.activity, custom: ''};
  });

  // 4) weekly revision + test (grouped by Monday-start weeks)
  var weeks = {};
  entries.forEach(function(e, i){
    var k = sy_monday(e.date);
    (weeks[k] = weeks[k] || []).push(i);
  });
  Object.keys(weeks).sort().forEach(function(k){
    var idxs = weeks[k];
    var testIdx = -1;
    if (tst){
      var fri = idxs.filter(function(i){ return entries[i].weekday === 5; });
      testIdx = fri.length ? fri[0] : idxs[idxs.length - 1];
      entries[testIdx].activity = 'test'; entries[testIdx].topic = '—';
    }
    if (rev){
      var cands = idxs.filter(function(i){ return i !== testIdx; });
      if (cands.length){
        var rIdx = cands[cands.length - 1];
        entries[rIdx].activity = 'revision'; entries[rIdx].topic = '—';
      }
    }
  });

  SyDraft = {
    form: {
      classId: classId, subjectId: subjectId, bookId: bookId,
      startDate: start, endDate: end, periods: periods,
      difficulty: document.getElementById('sy-diff').value
    },
    entries: entries,
    truncated: truncated
  };
  sy_renderPreview();
  document.getElementById('sy-preview').scrollIntoView();
}

/* ---------- editable preview ---------- */
function sy_renderPreview(){
  var host = document.getElementById('sy-preview');
  if (!host || !SyDraft) return;
  var rows = SyDraft.entries.map(function(e, i){
    var opts = SY_ACTS.map(function(a){
      return '<option value="' + a + '"' + (e.activity === a ? ' selected' : '') + '>' + t('sy_act_' + a) + '</option>';
    }).join('');
    return '<tr class="sy-row" data-i="' + i + '">'
      + '<td style="white-space:nowrap"><b>' + fmtDate(e.date) + '</b><br><small style="color:var(--muted)">' + sy_wd(e.weekday) + '</small></td>'
      + '<td><input type="text" class="sy-ch" value="' + esc(e.chapter) + '"></td>'
      + '<td><input type="text" class="sy-tp" value="' + esc(e.topic) + '"></td>'
      + '<td><select class="sy-ac">' + opts + '</select>'
      + '<input type="text" class="sy-cu" placeholder="' + t('sy_custom_ph') + '" value="' + esc(e.custom || '') + '"'
      + ' style="display:' + (e.activity === 'custom' ? 'block' : 'none') + ';margin-top:6px"></td></tr>';
  }).join('');
  host.innerHTML =
    '<div class="card"><h3>👁 ' + t('sy_preview') + ' <span class="badge b-blue">' + fmtNum(SyDraft.entries.length) + ' ' + t('sy_days_count') + '</span></h3>'
    + (SyDraft.truncated ? '<div class="notice"><small>' + t('sy_not_enough_days') + '</small></div>' : '')
    + '<p style="color:var(--muted);font-size:13px">' + t('sy_edit_hint') + '</p>'
    + '<div class="table-wrap"><table class="tbl"><thead><tr>'
    + '<th>' + t('sy_date') + '</th><th>' + t('sy_chapter') + '</th><th>' + t('sy_topic') + '</th><th>' + t('sy_activity') + '</th>'
    + '</tr></thead><tbody>' + rows + '</tbody></table></div>'
    + '<div class="btnrow" style="margin-top:10px"><button class="btn btn-primary" id="sy-savebtn">💾 ' + t('sy_save') + '</button></div>'
    + '</div>';

  // keep SyDraft in sync with edits
  host.querySelectorAll('.sy-row').forEach(function(tr){
    var i = parseInt(tr.dataset.i, 10);
    tr.querySelector('.sy-ch').oninput = function(e){ SyDraft.entries[i].chapter = e.target.value; };
    tr.querySelector('.sy-tp').oninput = function(e){ SyDraft.entries[i].topic = e.target.value; };
    var ac = tr.querySelector('.sy-ac'), cu = tr.querySelector('.sy-cu');
    ac.onchange = function(){
      SyDraft.entries[i].activity = ac.value;
      cu.style.display = ac.value === 'custom' ? 'block' : 'none';
      if (ac.value !== 'custom') SyDraft.entries[i].custom = '';
    };
    cu.oninput = function(e){ SyDraft.entries[i].custom = e.target.value; };
  });
  document.getElementById('sy-savebtn').onclick = function(){
    DB.add('syllabi', {
      classId: SyDraft.form.classId, subjectId: SyDraft.form.subjectId, bookId: SyDraft.form.bookId,
      startDate: SyDraft.form.startDate, endDate: SyDraft.form.endDate,
      periods: SyDraft.form.periods, difficulty: SyDraft.form.difficulty,
      days: SyDraft.entries
    });
    SyDraft = null; SyMode = 'list';
    App.toast(t('sy_saved')); App.refresh();
  };
}

/* ---------- view saved (week-grouped timeline) ---------- */
function sy_renderView(el){
  var s = DB.find('syllabi', SyViewId);
  if (!s){ SyMode = 'list'; App.refresh(); return; }
  el.innerHTML =
    '<div class="toolbar" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px">'
    + '<h2 style="margin:0">' + t('sy_view_title') + '</h2>'
    + '<div class="btnrow"><button class="btn btn-navy btn-sm" id="sy-print2">🖨 ' + t('btn_print') + '</button>'
    + '<button class="btn btn-ghost btn-sm" id="sy-back2">← ' + t('sy_back') + '</button></div></div>'
    + '<div class="card"><h3>📖 ' + esc(DB.bookTitle(s.bookId)) + '</h3>'
    + '<p>' + esc(DB.className(s.classId)) + ' · ' + esc(DB.subjectName(s.subjectId)) + '</p>'
    + '<p><b>' + t('sy_from') + ':</b> ' + fmtDate(s.startDate) + ' &nbsp; <b>' + t('sy_to') + ':</b> ' + fmtDate(s.endDate) + '</p>'
    + '<p><span class="badge b-blue">' + fmtNum((s.days || []).length) + ' ' + t('sy_days_count') + '</span></p></div>'
    + sy_weekTables(s);
  document.getElementById('sy-back2').onclick = function(){ SyMode = 'list'; App.refresh(); };
  document.getElementById('sy-print2').onclick = function(){ sy_print(s); };
}

function sy_weekTables(s){
  var weeks = {};
  (s.days || []).forEach(function(e){
    var k = sy_monday(e.date);
    (weeks[k] = weeks[k] || []).push(e);
  });
  var html = '';
  Object.keys(weeks).sort().forEach(function(k, wi){
    var es = weeks[k];
    var rows = es.map(function(e){
      return '<tr><td style="white-space:nowrap"><b>' + fmtDate(e.date) + '</b><br><small style="color:var(--muted)">' + sy_wd(e.weekday) + '</small></td>'
        + '<td>' + esc(e.chapter) + '</td><td>' + esc(e.topic) + '</td>'
        + '<td><span class="chip">' + esc(sy_actLabel(e)) + '</span></td></tr>';
    }).join('');
    html += '<div class="card"><h4 style="margin-top:0">🗓 ' + t('sy_week') + ' ' + fmtNum(wi + 1)
      + ' <small style="color:var(--muted)">(' + fmtDate(es[0].date) + ' – ' + fmtDate(es[es.length - 1].date) + ')</small></h4>'
      + '<div class="table-wrap"><table class="tbl"><thead><tr>'
      + '<th>' + t('sy_date') + '</th><th>' + t('sy_chapter') + '</th><th>' + t('sy_topic') + '</th><th>' + t('sy_activity') + '</th>'
      + '</tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  });
  return html;
}

/* ---------- print ---------- */
function sy_print(s){
  if (!s) return;
  var m = DB.meta();
  var html =
    '<div style="text-align:center;margin-bottom:14px">'
    + (m.logo ? '<img src="' + m.logo + '" style="max-height:60px"><br>' : '')
    + '<h2 style="margin:4px 0">' + esc(m.name) + '</h2>'
    + '<p style="color:#555;margin:0">' + esc(m.session || '') + ' · ' + t('sy_view_title') + '</p></div>'
    + '<h3>📖 ' + esc(DB.bookTitle(s.bookId)) + '</h3>'
    + '<p><b>' + t('sy_class') + ':</b> ' + esc(DB.className(s.classId)) + ' &nbsp; '
    + '<b>' + t('sy_subject') + ':</b> ' + esc(DB.subjectName(s.subjectId)) + '<br>'
    + '<b>' + t('sy_from') + ':</b> ' + fmtDate(s.startDate) + ' &nbsp; '
    + '<b>' + t('sy_to') + ':</b> ' + fmtDate(s.endDate) + ' &nbsp; '
    + '<b>' + t('sy_days_count') + ':</b> ' + fmtNum((s.days || []).length) + '</p>'
    + sy_weekTables(s);
  App.print(html);
}
