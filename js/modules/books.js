Object.assign(I18N.en, {
  bk_upload: "Upload Book", bk_book_name: "Book Name", bk_class: "Class", bk_subject: "Subject",
  bk_board: "Board", bk_session: "Session", bk_language: "Language",
  bk_lang_english: "English", bk_lang_urdu: "Urdu", bk_pdf: "PDF File (optional)",
  bk_select_class: "Select class…", bk_select_subject: "Select subject…",
  bk_save_book: "Save Book", bk_extracting: "Extracting text from PDF…",
  bk_status_analyzed: "Analyzed", bk_status_scanned: "Scanned — needs OCR", bk_status_notext: "No text",
  bk_chapters: "Chapters", bk_reanalyze: "Re-analyze",
  bk_topics: "Topics", bk_definitions: "Definitions", bk_questions: "Questions", bk_exercises: "Exercises",
  bk_page: "Page", bk_paste_label: "No text was extracted from this book (scanned PDF). Paste the book text below, then analyze it:",
  bk_analyze_pasted: "Analyze Pasted Text", bk_back: "Back to Library",
  bk_no_books: "No books in the library yet. Upload your first book.",
  bk_scan_notice: "Text could not be extracted (scanned PDF, or the PDF library failed to load). The book was saved as scanned — open it and paste the text to analyze later.",
  bk_analyzed_ok: "Book saved and analyzed", bk_saved_noanalysis: "Book saved (no text to analyze yet)",
  bk_pages: "Pages", bk_words: "Words", bk_analysis: "AI Analysis", bk_full_book: "Full Book",
  bk_meta: "Book Details", bk_ph_bookname: "e.g. General Science", bk_ph_board: "e.g. Punjab Board",
  bk_upload_hint: "Upload the book PDF — text is extracted in your browser. Scanned PDFs are saved as scanned; you can paste their text later.",
  bk_reanalyzed: "Analysis updated"
});
Object.assign(I18N.ur, {
  bk_upload: "کتاب اپ لوڈ کریں", bk_book_name: "کتاب کا نام", bk_class: "کلاس", bk_subject: "مضمون",
  bk_board: "بورڈ", bk_session: "سیشن", bk_language: "زبان",
  bk_lang_english: "انگریزی", bk_lang_urdu: "اردو", bk_pdf: "پی ڈی ایف فائل (اختیاری)",
  bk_select_class: "کلاس منتخب کریں…", bk_select_subject: "مضمون منتخب کریں…",
  bk_save_book: "کتاب محفوظ کریں", bk_extracting: "پی ڈی ایف سے متن نکالا جا رہا ہے…",
  bk_status_analyzed: "تجزیہ شدہ", bk_status_scanned: "اسکین شدہ — OCR درکار", bk_status_notext: "متن نہیں",
  bk_chapters: "ابواب", bk_reanalyze: "دوبارہ تجزیہ",
  bk_topics: "عنوانات", bk_definitions: "تعریفیں", bk_questions: "سوالات", bk_exercises: "مشقیں",
  bk_page: "صفحہ", bk_paste_label: "اس کتاب سے کوئی متن نہیں نکلا (اسکین شدہ پی ڈی ایف)۔ نیچے کتاب کا متن چسپاں کریں، پھر تجزیہ کریں:",
  bk_analyze_pasted: "چسپاں شدہ متن کا تجزیہ کریں", bk_back: "لائبریری واپس",
  bk_no_books: "لائبریری میں ابھی کوئی کتاب نہیں۔ پہلی کتاب اپ لوڈ کریں۔",
  bk_scan_notice: "متن نہیں نکالا جا سکا (اسکین شدہ پی ڈی ایف، یا پی ڈی ایف لائبریری لوڈ نہ ہوئی)۔ کتاب اسکین شدہ کے طور پر محفوظ ہے — اسے کھول کر متن چسپاں کر کے تجزیہ کریں۔",
  bk_analyzed_ok: "کتاب محفوظ اور تجزیہ ہو گیا", bk_saved_noanalysis: "کتاب محفوظ ہو گئی (ابھی تجزیہ کے لیے متن نہیں)",
  bk_pages: "صفحات", bk_words: "الفاظ", bk_analysis: "اے آئی تجزیہ", bk_full_book: "مکمل کتاب",
  bk_meta: "کتاب کی تفصیل", bk_ph_bookname: "مثلاً جنرل سائنس", bk_ph_board: "مثلاً پنجاب بورڈ",
  bk_upload_hint: "کتاب کی پی ڈی ایف اپ لوڈ کریں — متن آپ کے براؤزر میں نکالا جائے گا۔ اسکین شدہ پی ڈی ایف اسکین شدہ ہی محفوظ ہو گی؛ اس کا متن بعد میں چسپاں کیا جا سکتا ہے۔",
  bk_reanalyzed: "تجزیہ اپ ڈیٹ ہو گیا"
});

/* ---------- dynamic pdf.js loader (CDN, offline-safe fallback) ---------- */
function bk_loadPdfJs(){
  return new Promise(function(resolve, reject){
    if (window.pdfjsLib){ resolve(window.pdfjsLib); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = function(){
      try{
        if (window.pdfjsLib){
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        } else reject(new Error('pdfjs-missing'));
      }catch(e){ reject(e); }
    };
    s.onerror = function(){ reject(new Error('cdn-failed')); };
    document.head.appendChild(s);
  });
}

/* Extract per-page text; reassembles visual lines from text items so the
   line-based analysis heuristics work on real book layout. */
async function bk_extractPages(lib, buf){
  var pdf = await lib.getDocument({data: buf}).promise;
  var pages = [];
  for (var i = 1; i <= pdf.numPages; i++){
    var pg = await pdf.getPage(i);
    var tc = await pg.getTextContent();
    var lines = [], cur = null;
    tc.items.forEach(function(it){
      if (!it.str || !it.str.trim()) return;
      var y = (it.transform && typeof it.transform[5] === 'number') ? it.transform[5] : 0;
      if (cur && Math.abs(cur.y - y) < 3){ cur.items.push(it.str); }
      else { cur = {y: y, items: [it.str]}; lines.push(cur); }
    });
    lines.sort(function(a, b){ return b.y - a.y; });
    pages.push(lines.map(function(l){ return l.items.join(' '); }).join('\n'));
  }
  return pages;
}

/* ---------- heuristic book analysis ---------- */
function analyzeBookText(text, pagesArray){
  pagesArray = (pagesArray && pagesArray.length) ? pagesArray : [text || ''];
  var chRe   = /^\s*(chapter|unit|باب)\s*[\d\-–:.)]+/i;
  var exRe   = /exercis(e|es)|مشق/i;
  var defRe  = /(is defined as|is called|refers to|کہلاتا ہے|کہلاتی ہے|تعریف)/i;
  var qRe    = /[؟?]$/;
  var termRe = /[.؟?]$/;
  var chapters = [], cur = null, inExercise = false;
  function newChapter(title, page){
    if (cur) chapters.push(cur);
    cur = {title: title, page: page, topics: [], definitions: [], questions: [], exercises: []};
    inExercise = false;
  }
  pagesArray.forEach(function(pt, pi){
    String(pt || '').split('\n').forEach(function(raw){
      var line = raw.trim();
      if (!line) return;
      if (chRe.test(line)){ newChapter(line.slice(0, 80), pi + 1); return; }
      if (!cur) newChapter(t('bk_full_book'), 1);
      if (exRe.test(line)){ inExercise = true; return; }
      if (inExercise){
        if (cur.exercises.length < 40) cur.exercises.push(line.slice(0, 160));
        return;
      }
      if (qRe.test(line) && line.length > 2){
        if (cur.questions.length < 40) cur.questions.push(line.slice(0, 160));
        return;
      }
      if (defRe.test(line)){
        if (cur.definitions.length < 30) cur.definitions.push(line.slice(0, 200));
        return;
      }
      if (line.length >= 3 && line.length <= 70 && !termRe.test(line) && cur.topics.length < 40){
        cur.topics.push(line);
      }
    });
  });
  if (!cur) newChapter(t('bk_full_book'), 1);
  if (cur) chapters.push(cur);
  var words = String(text || '').split(/\s+/).filter(Boolean).length;
  return {chapters: chapters, stats: {pages: pagesArray.length, words: words}};
}

/* ---------- module state ---------- */
var BkMode = 'list', BkViewId = null, BkNotice = '';

App.register('books', {
  titleKey: 'nav_books', icon: '📚',
  roles: ['superadmin', 'principal', 'teacher'],
  render: function(el){ bk_render(el); }
});

function bk_render(el){
  if (BkMode === 'upload') bk_renderUpload(el);
  else if (BkMode === 'view') bk_renderView(el);
  else bk_renderList(el);
}

function bk_status(b){
  if (b.analysis && b.analysis.chapters && b.analysis.chapters.length)
    return {key: 'bk_status_analyzed', cls: 'b-green'};
  if (b.scanned) return {key: 'bk_status_scanned', cls: 'b-orange'};
  return {key: 'bk_status_notext', cls: 'b-red'};
}

/* ---------- list ---------- */
function bk_renderList(el){
  var books = DB.get('books').slice().reverse();
  var head = '<div class="toolbar" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px">'
    + '<h2 style="margin:0">' + t('nav_books') + '</h2>'
    + '<button class="btn btn-primary" id="bk-new">📤 ' + t('bk_upload') + '</button></div>';
  var notice = BkNotice ? '<div class="notice">' + esc(BkNotice) + '</div>' : '';
  BkNotice = '';
  if (!books.length){
    el.innerHTML = head + notice + '<div class="card empty"><div class="ic">📚</div><p>' + t('bk_no_books') + '</p></div>';
  } else {
    var rows = books.map(function(b){
      var st = bk_status(b);
      var ch = (b.analysis && b.analysis.chapters) ? b.analysis.chapters.length : 0;
      var lang = b.language === 'ur' ? t('bk_lang_urdu') : t('bk_lang_english');
      return '<tr><td><b>' + esc(b.bookName) + '</b></td>'
        + '<td>' + esc(DB.className(b.classId)) + '<br><small style="color:var(--muted)">' + esc(DB.subjectName(b.subjectId)) + '</small></td>'
        + '<td>' + esc(b.board || '—') + '</td>'
        + '<td><span class="badge b-blue">' + esc(lang) + '</span></td>'
        + '<td>' + fmtNum(ch) + '</td>'
        + '<td><span class="badge ' + st.cls + '">' + t(st.key) + '</span></td>'
        + '<td><div class="btnrow">'
        + '<button class="btn btn-primary btn-sm" data-view="' + b.id + '">' + t('btn_view') + '</button>'
        + (b.text ? '<button class="btn btn-orange btn-sm" data-re="' + b.id + '">' + t('bk_reanalyze') + '</button>' : '')
        + '<button class="btn btn-danger btn-sm" data-del="' + b.id + '">' + t('btn_delete') + '</button>'
        + '</div></td></tr>';
    }).join('');
    el.innerHTML = head + notice
      + '<div class="table-wrap"><table class="tbl"><thead><tr>'
      + '<th>' + t('bk_book_name') + '</th><th>' + t('bk_class') + ' / ' + t('bk_subject') + '</th>'
      + '<th>' + t('bk_board') + '</th><th>' + t('bk_language') + '</th>'
      + '<th>' + t('bk_chapters') + '</th><th>' + t('status') + '</th><th>' + t('actions') + '</th>'
      + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  document.getElementById('bk-new').onclick = function(){ BkMode = 'upload'; App.refresh(); };
  el.querySelectorAll('[data-view]').forEach(function(b){ b.onclick = function(){ BkMode = 'view'; BkViewId = b.dataset.view; App.refresh(); }; });
  el.querySelectorAll('[data-re]').forEach(function(b){
    b.onclick = function(){
      var bk = DB.find('books', b.dataset.re);
      if (bk && bk.text){
        var pages = bk.text.split('\n\n');
        DB.update('books', bk.id, {analysis: analyzeBookText(bk.text, pages), scanned: false});
        App.toast(t('bk_reanalyzed')); App.refresh();
      }
    };
  });
  el.querySelectorAll('[data-del]').forEach(function(b){
    b.onclick = async function(){
      if (await App.confirm(t('msg_confirm_delete'))){
        DB.remove('books', b.dataset.del);
        App.toast(t('msg_deleted')); App.refresh();
      }
    };
  });
}

/* ---------- upload form ---------- */
function bk_renderUpload(el){
  var classes = DB.get('classes');
  el.innerHTML =
    '<div class="toolbar" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px">'
    + '<h2 style="margin:0">' + t('bk_upload') + '</h2>'
    + '<button class="btn btn-ghost" id="bk-back">← ' + t('bk_back') + '</button></div>'
    + '<div class="card">'
    + '<div class="row">'
    + '<div class="form-group"><label>' + t('bk_class') + ' *</label><select id="bk-class"><option value="">' + t('bk_select_class') + '</option>'
    + classes.map(function(c){ return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('') + '</select></div>'
    + '<div class="form-group"><label>' + t('bk_subject') + ' *</label><select id="bk-subject"><option value="">' + t('bk_select_class') + '</option></select></div>'
    + '</div>'
    + '<div class="row">'
    + '<div class="form-group"><label>' + t('bk_book_name') + ' *</label><input type="text" id="bk-name" placeholder="' + t('bk_ph_bookname') + '"></div>'
    + '<div class="form-group"><label>' + t('bk_board') + '</label><input type="text" id="bk-board" placeholder="' + t('bk_ph_board') + '"></div>'
    + '</div>'
    + '<div class="row">'
    + '<div class="form-group"><label>' + t('bk_session') + '</label><input type="text" id="bk-session" value="' + esc(DB.meta().session || '') + '"></div>'
    + '<div class="form-group"><label>' + t('bk_language') + '</label><select id="bk-lang"><option value="en">' + t('bk_lang_english') + '</option><option value="ur">' + t('bk_lang_urdu') + '</option></select></div>'
    + '</div>'
    + '<div class="form-group"><label>' + t('bk_pdf') + '</label><input type="file" id="bk-file" accept="application/pdf,.pdf"></div>'
    + '<div class="notice"><small>' + t('bk_upload_hint') + '</small></div>'
    + '<div class="btnrow"><button class="btn btn-primary" id="bk-save">💾 ' + t('bk_save_book') + '</button></div>'
    + '</div>';
  document.getElementById('bk-back').onclick = function(){ BkMode = 'list'; App.refresh(); };
  document.getElementById('bk-class').onchange = function(e){
    var cid = e.target.value;
    var subs = DB.get('subjects').filter(function(s){ return s.classId === cid; });
    document.getElementById('bk-subject').innerHTML = '<option value="">' + t('bk_select_subject') + '</option>'
      + subs.map(function(s){ return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join('');
  };
  document.getElementById('bk-save').onclick = bk_saveBook;
}

async function bk_saveBook(){
  var btn = document.getElementById('bk-save');
  var classId = document.getElementById('bk-class').value;
  var subjectId = document.getElementById('bk-subject').value;
  var bookName = document.getElementById('bk-name').value.trim();
  if (!classId || !subjectId || !bookName){ App.toast(t('msg_required')); return; }
  btn.disabled = true;
  btn.textContent = '⏳ ' + t('bk_extracting');
  var pages = [], text = '', scanned = false;
  var file = document.getElementById('bk-file').files[0];
  if (file){
    try{
      var buf = await file.arrayBuffer();
      var lib = await bk_loadPdfJs();
      pages = await bk_extractPages(lib, buf);
      text = pages.join('\n\n').trim();
    }catch(e){ scanned = true; }
  }
  if (!text.trim()) scanned = true;
  var book = DB.add('books', {
    classId: classId,
    subjectId: subjectId,
    bookName: bookName,
    board: document.getElementById('bk-board').value.trim(),
    session: document.getElementById('bk-session').value.trim(),
    language: document.getElementById('bk-lang').value,
    text: text.slice(0, 200000),
    pages: pages.length,
    analysis: null,
    scanned: scanned
  });
  if (text.trim()){
    book.analysis = analyzeBookText(text, pages);
    DB.save();
    App.toast(t('bk_analyzed_ok'));
  } else {
    BkNotice = t('bk_scan_notice');
    App.toast(t('bk_saved_noanalysis'));
  }
  BkMode = 'list'; App.refresh();
}

/* ---------- view book ---------- */
function bk_renderView(el){
  var b = DB.find('books', BkViewId);
  if (!b){ BkMode = 'list'; App.refresh(); return; }
  var st = bk_status(b);
  var lang = b.language === 'ur' ? t('bk_lang_urdu') : t('bk_lang_english');
  var words = (b.analysis && b.analysis.stats) ? b.analysis.stats.words : String(b.text || '').split(/\s+/).filter(Boolean).length;
  var meta =
    '<div class="card"><h3>' + esc(b.bookName) + '</h3>'
    + '<div class="row">'
    + '<div><b>' + t('bk_class') + ':</b> ' + esc(DB.className(b.classId)) + '</div>'
    + '<div><b>' + t('bk_subject') + ':</b> ' + esc(DB.subjectName(b.subjectId)) + '</div>'
    + '</div><div class="row">'
    + '<div><b>' + t('bk_board') + ':</b> ' + esc(b.board || '—') + '</div>'
    + '<div><b>' + t('bk_session') + ':</b> ' + esc(b.session || '—') + '</div>'
    + '</div><div class="row">'
    + '<div><b>' + t('bk_language') + ':</b> ' + esc(lang) + '</div>'
    + '<div><b>' + t('bk_pages') + ':</b> ' + fmtNum(b.pages || 0) + ' &nbsp; <b>' + t('bk_words') + ':</b> ' + fmtNum(words) + '</div>'
    + '</div>'
    + '<div style="margin-top:8px"><span class="badge ' + st.cls + '">' + t(st.key) + '</span></div>'
    + (b.text ? '<div class="btnrow" style="margin-top:10px"><button class="btn btn-orange btn-sm" id="bk-re2">🔄 ' + t('bk_reanalyze') + '</button></div>' : '')
    + '</div>';

  var body = '';
  if (b.analysis && b.analysis.chapters && b.analysis.chapters.length){
    body += '<div class="card"><h3>🤖 ' + t('bk_analysis') + ' <span class="badge b-blue">' + fmtNum(b.analysis.chapters.length) + ' ' + t('bk_chapters') + '</span></h3>';
    b.analysis.chapters.forEach(function(ch, ci){
      body += '<details class="qcard"><summary style="cursor:pointer;font-weight:700;color:var(--navy)">'
        + esc(ch.title) + ' <span class="badge b-gray">' + t('bk_page') + ' ' + fmtNum(ch.page) + '</span></summary>';
      if (ch.topics.length){
        body += '<p style="font-weight:700;margin:10px 0 6px">' + t('bk_topics') + ' (' + fmtNum(ch.topics.length) + ')</p>'
          + '<div>' + ch.topics.map(function(x){ return '<span class="chip">' + esc(x) + '</span>'; }).join(' ') + '</div>';
      }
      if (ch.definitions.length){
        body += '<p style="font-weight:700;margin:10px 0 6px">' + t('bk_definitions') + ' (' + fmtNum(ch.definitions.length) + ')</p><ul>'
          + ch.definitions.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
      }
      if (ch.questions.length){
        body += '<p style="font-weight:700;margin:10px 0 6px">' + t('bk_questions') + ' (' + fmtNum(ch.questions.length) + ')</p><ul>'
          + ch.questions.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
      }
      if (ch.exercises.length){
        body += '<p style="font-weight:700;margin:10px 0 6px">' + t('bk_exercises') + ' (' + fmtNum(ch.exercises.length) + ')</p><ul>'
          + ch.exercises.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
      }
      body += '</details>';
    });
    body += '</div>';
  }

  if (!b.text){
    body += '<div class="card"><h3>✍️ ' + t('bk_paste_label') + '</h3>'
      + '<div class="form-group"><textarea id="bk-paste" style="min-height:160px" placeholder="…"></textarea></div>'
      + '<div class="btnrow"><button class="btn btn-green" id="bk-paste-btn">🔍 ' + t('bk_analyze_pasted') + '</button></div></div>';
  }

  el.innerHTML =
    '<div class="toolbar" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px">'
    + '<h2 style="margin:0">' + t('nav_books') + '</h2>'
    + '<button class="btn btn-ghost" id="bk-back2">← ' + t('bk_back') + '</button></div>'
    + meta + body;

  document.getElementById('bk-back2').onclick = function(){ BkMode = 'list'; App.refresh(); };
  var re2 = document.getElementById('bk-re2');
  if (re2) re2.onclick = function(){
    DB.update('books', b.id, {analysis: analyzeBookText(b.text, b.text.split('\n\n')), scanned: false});
    App.toast(t('bk_reanalyzed')); App.refresh();
  };
  var pb = document.getElementById('bk-paste-btn');
  if (pb) pb.onclick = function(){
    var txt = document.getElementById('bk-paste').value.trim();
    if (!txt){ App.toast(t('msg_required')); return; }
    DB.update('books', b.id, {text: txt.slice(0, 200000), scanned: false, analysis: analyzeBookText(txt, [txt])});
    App.toast(t('bk_analyzed_ok')); App.refresh();
  };
}
