Object.assign(I18N.en, {
  ex_book_label: "Book",
  ex_all_books: "All Books",
  ex_ask_ph: "Ask a question about your books…",
  ex_welcome: "👋 Hi! I am your AI School Expert. Select a book (or all books) and ask me anything from your syllabus.",
  ex_typing: "Typing…",
  ex_intro: "Here is what I found in your books:",
  ex_nofound: "Sorry, I could not find anything about that in the selected books. Try different words.",
  ex_nobooks: "No books added yet — upload a book from the Book Library first.",
  ex_book_word: "Book"
});
Object.assign(I18N.ur, {
  ex_book_label: "کتاب",
  ex_all_books: "تمام کتب",
  ex_ask_ph: "اپنی کتابوں سے کوئی سوال پوچھیں…",
  ex_welcome: "👋 السلام علیکم! میں آپ کا اے آئی اسکول ماہر ہوں۔ کوئی کتاب منتخب کریں (یا تمام کتب) اور نصاب سے متعلق کچھ بھی پوچھیں۔",
  ex_typing: "لکھ رہا ہے…",
  ex_intro: "آپ کی کتابوں میں یہ ملا:",
  ex_nofound: "معذرت، منتخب کتابوں میں اس بارے میں کچھ نہیں ملا۔ مختلف الفاظ آزمائیں۔",
  ex_nobooks: "ابھی کوئی کتاب شامل نہیں — پہلے بک لائبریری سے کتاب اپ لوڈ کریں۔",
  ex_book_word: "کتاب"
});

/* ---------- offline keyword search helpers ---------- */
const EX_STOP = new Set([
  'the','a','an','and','or','of','to','in','on','for','with','is','are','was','were','be','been','being',
  'what','when','where','why','how','who','which','whom','whose','do','does','did','done','can','could',
  'should','will','would','shall','may','might','must','not','no','yes','it','its','this','that','these',
  'those','by','from','as','at','i','you','we','they','he','she','his','her','their','our','your','my',
  'me','us','them','have','has','had','there','then','than','so','such','if','but','about','into','over',
  'tell','please','give','list','define','explain','short','long','brief','detail','chapter','book','note','notes',
  'کیا','کے','کی','کا','کو','میں','سے','نے','پر','اور','ہے','ہیں','تھا','تھے','تھی','ہو','ہوتا','ہوتی','ہوئے',
  'وہ','یہ','جو','تو','بھی','نہ','نہیں','اس','ان','اپنے','اپنی','اپنا','کریں','کرے','بتائیں','بتاؤ','بتا',
  'کتاب','باب','مختصر','تفصیل','سوال','جواب','تعریف','نوٹ'
]);
function exTokens(s){
  return String(s || '').toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !EX_STOP.has(w));
}
function exChapters(b){
  if (b.analysis && Array.isArray(b.analysis.chapters)) return b.analysis.chapters;
  if (Array.isArray(b.chapters)) return b.chapters;
  return [];
}
function exStrs(v){
  if (!Array.isArray(v)) return [];
  return v.map(x => (x && typeof x === 'object') ? (x.text || x.title || x.name || '') : String(x || '')).filter(Boolean);
}
function exDefs(v){
  if (!Array.isArray(v)) return [];
  return v.map(x => {
    if (x && typeof x === 'object') return { term: String(x.term || x.word || x.title || ''), def: String(x.def || x.definition || x.meaning || x.text || '') };
    const s = String(x || '');
    const i = s.indexOf(':');
    return i > 0 ? { term: s.slice(0, i).trim(), def: s.slice(i + 1).trim() } : { term: '', def: s };
  }).filter(d => d.term || d.def);
}
function exCite(b, ch){
  return (b.bookName || b.title || t('ex_book_word')) + (ch && ch.title ? ' — ' + ch.title : '');
}

/* ---------- local (offline) answer ---------- */
function exLocalAnswer(query, bookIds){
  const kw = exTokens(query);
  const books = DB.get('books').filter(b => !bookIds.length || bookIds.includes(b.id));
  if (!books.length) return '<p>' + esc(t('ex_nobooks')) + '</p>';
  if (!kw.length) return '<p>' + esc(t('ex_nofound')) + '</p>';

  const matches = [];
  const hit = text => kw.some(kw0 => String(text || '').toLowerCase().includes(kw0));

  books.forEach(b => {
    exChapters(b).forEach(ch => {
      const topics = exStrs(ch.topics);
      const defs = exDefs(ch.definitions || ch.defs);
      const qs = exStrs(ch.questions);
      const blob = [ch.title, topics.join(' '), defs.map(d => d.term + ' ' + d.def).join(' '), qs.join(' ')].join(' ').toLowerCase();
      if (!kw.some(k => blob.includes(k))) return;
      const cite = exCite(b, ch);
      defs.forEach(d => {
        if (hit(d.term) || hit(d.def))
          matches.push({ cite, text: '<b>' + esc(d.term) + '</b>: ' + esc(d.def) });
      });
      qs.forEach(q => { if (hit(q)) matches.push({ cite, text: esc(q) }); });
      topics.forEach(tp => { if (hit(tp)) matches.push({ cite, text: esc(tp) }); });
    });
    // raw text snippet (first keyword hit per book, ~120 chars around it)
    const raw = b.text || b.fullText || b.extractedText || b.content || '';
    if (raw){
      const low = raw.toLowerCase();
      for (const k of kw){
        const i = low.indexOf(k);
        if (i >= 0){
          const sn = raw.slice(Math.max(0, i - 60), i + 60).replace(/\s+/g, ' ').trim();
          matches.push({ cite: exCite(b, null), text: '…' + esc(sn) + '…' });
          break;
        }
      }
    }
  });

  if (!matches.length) return '<p>' + esc(t('ex_nofound')) + '</p>';
  let html = '<p>' + esc(t('ex_intro')) + '</p><ul style="padding-inline-start:18px;margin:6px 0;display:grid;gap:8px">';
  matches.slice(0, 8).forEach(m => {
    html += '<li>📖 <small style="color:var(--muted)">' + esc(m.cite) + '</small><br>' + m.text + '</li>';
  });
  html += '</ul>';
  return html;
}
function exBuildContext(query, bookIds){
  const books = DB.get('books').filter(b => !bookIds.length || bookIds.includes(b.id));
  const parts = [];
  books.forEach(b => {
    const raw = b.text || b.fullText || b.extractedText || b.content || '';
    if (raw) parts.push('BOOK: ' + (b.bookName || b.title || '') + '\n' + raw.slice(0, 1500));
    exChapters(b).forEach(ch => {
      const txt = [ch.title, exStrs(ch.topics).join('; '),
        exDefs(ch.definitions || ch.defs).map(d => d.term + ': ' + d.def).join('; '),
        exStrs(ch.questions).join('; ')].filter(Boolean).join('\n');
      if (txt) parts.push('CHAPTER: ' + (ch.title || '') + '\n' + txt.slice(0, 1500));
    });
  });
  return parts.join('\n\n');
}

/* ---------- online AI answer (falls back to local) ---------- */
async function exAiAnswer(query, bookIds){
  const s = DB.settings();
  if (!s.aiKey || !navigator.onLine) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(s.aiEndpoint || 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + s.aiKey },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Answer briefly using this book context: ' + exBuildContext(query, bookIds).slice(0, 6000) },
          { role: 'user', content: query }
        ]
      }),
      signal: ctrl.signal
    });
    if (!r.ok) return null;
    const j = await r.json();
    const txt = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
    return txt ? String(txt).trim() : null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- module ---------- */
function exMsg(chat, html, who){
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.innerHTML = html;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
  return d;
}

App.register('expert', {
  titleKey: 'nav_expert',
  icon: '🤖',
  roles: ['superadmin', 'principal', 'teacher', 'exam'],
  render(el){
    const books = DB.get('books');
    el.innerHTML =
      '<div class="toolbar"><div class="form-group" style="margin:0;flex:1;min-width:200px">' +
      '<label>' + esc(t('ex_book_label')) + '</label>' +
      '<select id="ex-book"><option value="">' + esc(t('ex_all_books')) + '</option>' +
      books.map(b => '<option value="' + b.id + '">' + esc(b.bookName || b.title || '—') + '</option>').join('') +
      '</select></div></div>' +
      '<div class="card"><div class="chatbox" id="ex-chat"></div>' +
      '<div class="chatbar"><input type="text" id="ex-input" placeholder="' + esc(t('ex_ask_ph')) + '" autocomplete="off">' +
      '<button class="btn btn-primary" id="ex-send">' + esc(t('btn_send')) + '</button></div></div>';

    const chat = el.querySelector('#ex-chat');
    const input = el.querySelector('#ex-input');
    const sel = el.querySelector('#ex-book');
    exMsg(chat, esc(t('ex_welcome')), 'bot');

    let busy = false;
    const send = async () => {
      const q = input.value.trim();
      if (!q || busy) return;
      busy = true;
      const ids = sel.value ? [sel.value] : [];
      exMsg(chat, esc(q), 'me');
      input.value = '';
      const typing = exMsg(chat, '<i>' + esc(t('ex_typing')) + '</i>', 'bot');
      let ans = null;
      try { ans = await exAiAnswer(q, ids); } catch (e) { ans = null; }
      if (ans) typing.innerHTML = esc(ans).replace(/\n/g, '<br>');
      else typing.innerHTML = exLocalAnswer(q, ids);
      chat.scrollTop = chat.scrollHeight;
      busy = false;
    };
    el.querySelector('#ex-send').onclick = send;
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  }
});
