Object.assign(I18N.en, {
  db_demo: "Demo data is active — sample records are mixed in. You can delete them anytime from Settings.",
  db_go_settings: "Open Settings",
  db_students: "Students", db_teachers: "Teachers", db_classes: "Classes", db_subjects: "Subjects",
  db_books: "Books", db_syllabi: "Active Syllabi", db_pending: "Pending Checking", db_results: "Recent Results",
  db_quick_actions: "Quick Actions",
  db_q_book: "Upload Book", db_q_students: "Upload Student List", db_q_syllabus: "Weekly Syllabus",
  db_q_paper: "Generate Paper", db_q_scan: "Scan Paper", db_q_checking: "Check Papers",
  db_q_results: "View Results", db_q_expert: "AI Expert",
  db_notices: "Latest Notices", db_no_notices: "No notices yet.", db_view_all: "View All"
});
Object.assign(I18N.ur, {
  db_demo: "ڈیمو ڈیٹا فعال ہے — نمونہ ریکارڈ شامل ہیں۔ آپ انہیں سیٹنگز سے کسی بھی وقت حذف کر سکتے ہیں۔",
  db_go_settings: "سیٹنگز کھولیں",
  db_students: "طلبہ", db_teachers: "اساتذہ", db_classes: "جماعتیں", db_subjects: "مضامین",
  db_books: "کتب", db_syllabi: "فعال نصاب", db_pending: "چیکنگ باقی", db_results: "حالیہ نتائج",
  db_quick_actions: "فوری اقدامات",
  db_q_book: "کتاب اپ لوڈ", db_q_students: "طلبہ کی فہرست", db_q_syllabus: "ہفتہ وار نصاب",
  db_q_paper: "پیپر بنائیں", db_q_scan: "پیپر اسکین", db_q_checking: "پیپر چیک کریں",
  db_q_results: "نتائج دیکھیں", db_q_expert: "اے آئی ماہر",
  db_notices: "تازہ ترین نوٹس", db_no_notices: "ابھی کوئی نوٹس نہیں۔", db_view_all: "سب دیکھیں"
});

App.register('dashboard', {
  titleKey: 'nav_dashboard',
  icon: '🏠',
  roles: ['superadmin', 'principal', 'teacher', 'exam'],
  render(el){
    const KEY_COLS = ['sessions','classes','sections','subjects','teachers','students','books',
      'syllabi','papers','checkings','results','attendance','feeheads','feetxns','notices'];
    const hasDemo = KEY_COLS.some(c => DB.get(c).some(x => x && x.demo));

    // pending checking: papers with no checking record yet
    const papers = DB.get('papers');
    const checkedIds = new Set(DB.get('checkings').map(c => c && c.paperId));
    const pending = papers.filter(p => !checkedIds.has(p.id)).length;

    // recent results: distinct exam titles
    const resultSets = new Set(DB.get('results').map(r => r && (r.examTitle || r.title)).filter(Boolean)).size;

    const stats = [
      { n: DB.get('students').length, l: t('db_students'), go: 'setup',   c: '' },
      { n: DB.get('teachers').length, l: t('db_teachers'), go: 'setup',   c: 'green' },
      { n: DB.get('classes').length,  l: t('db_classes'),  go: 'setup',   c: 'navy' },
      { n: DB.get('subjects').length, l: t('db_subjects'), go: 'setup',   c: 'orange' },
      { n: DB.get('books').length,    l: t('db_books'),    go: 'books',   c: 'green' },
      { n: DB.get('syllabi').length,  l: t('db_syllabi'),  go: 'syllabus',c: 'navy' },
      { n: pending,                   l: t('db_pending'),  go: 'checking',c: 'orange' },
      { n: resultSets,                l: t('db_results'),  go: 'results', c: '' }
    ];

    const quicks = [
      ['📚', 'db_q_book',     'books'],
      ['👥', 'db_q_students', 'setup'],
      ['📅', 'db_q_syllabus', 'syllabus'],
      ['📝', 'db_q_paper',    'papers'],
      ['📷', 'db_q_scan',     'scanpaper'],
      ['✅', 'db_q_checking', 'checking'],
      ['🏆', 'db_q_results',  'results'],
      ['🤖', 'db_q_expert',   'expert']
    ];

    // notices visible to this role: 'all' + role-specific; principal/superadmin see more
    const role = App.user.role;
    const noticeVisible = n => {
      const a = String(n.audience || 'all').toLowerCase();
      if (a === 'all') return true;
      if (a === role || a === role + 's') return true;
      if (role === 'superadmin') return true;
      if (role === 'principal' && a !== 'students') return true;
      return false;
    };
    const notices = DB.get('notices')
      .filter(noticeVisible)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
      .slice(0, 3);

    let html = '';
    if (hasDemo){
      html += '<div class="notice"><b>ℹ️</b> ' + esc(t('db_demo')) +
        ' <button class="btn btn-sm btn-ghost" data-go="settings">' + esc(t('db_go_settings')) + '</button></div>';
    }

    html += '<div class="grid-stats">' + stats.map(s =>
      '<div class="stat-card ' + s.c + '" data-go="' + s.go + '">' +
      '<div class="n">' + fmtNum(s.n) + '</div><div class="l">' + esc(s.l) + '</div></div>'
    ).join('') + '</div>';

    html += '<div class="card"><h3>⚡ ' + esc(t('db_quick_actions')) + '</h3>' +
      '<div class="quickgrid">' + quicks.map(q =>
        '<div class="quick" data-go="' + q[2] + '"><span class="ic">' + q[0] + '</span><span>' + esc(t(q[1])) + '</span></div>'
      ).join('') + '</div></div>';

    html += '<div class="card"><h3>📢 ' + esc(t('db_notices')) + '</h3>';
    if (notices.length){
      html += notices.map(n =>
        '<div class="notice"><b>' + esc(n.title || '—') + '</b> <small>' + esc(fmtDate(n.date)) + '</small>' +
        '<div style="margin-top:4px;font-size:13.5px">' + esc(String(n.message || '').slice(0, 140)) + '</div></div>'
      ).join('');
      if (DB.get('notices').length > 3){
        html += '<div class="btnrow"><button class="btn btn-ghost btn-sm" data-go="notices">' + esc(t('db_view_all')) + '</button></div>';
      }
    } else {
      html += '<div class="empty"><span class="ic">📭</span>' + esc(t('db_no_notices')) + '</div>';
    }
    html += '</div>';

    el.innerHTML = html;
    el.querySelectorAll('[data-go]').forEach(b => { b.onclick = () => App.navigate(b.dataset.go); });
  }
});
