/* ===== Paper Generator (papers) — AI-heuristic question generation from book analysis ===== */
Object.assign(I18N.en,{
  pp_tab_mypapers:"My Papers", pp_tab_new:"New Paper",
  pp_title:"Title", pp_title_ph:"e.g. Class 5 Science Test 1",
  pp_test_word:"Test", pp_class:"Class", pp_subject:"Subject", pp_book:"Book",
  pp_select:"-- Select --", pp_chapters:"Chapters", pp_pages:"Pages (info)", pp_pages_ph:"e.g. 12-30",
  pp_total_marks:"Total Marks", pp_time:"Time Allowed", pp_min:"min",
  pp_difficulty:"Difficulty", pp_diff_easy:"Easy", pp_diff_medium:"Medium", pp_diff_hard:"Hard", pp_diff_mixed:"Mixed",
  pp_qcounts:"Question counts", pp_preset_board:"Board pattern", pp_preset_weekly:"Weekly test", pp_preset_clear:"Clear",
  pp_btn_generate:"Generate Questions", pp_settings:"Settings",
  pp_type_mcq:"MCQ", pp_type_fillblank:"Fill in the blank", pp_type_truefalse:"True / False",
  pp_type_matching:"Matching", pp_type_short:"Short", pp_type_long:"Long",
  pp_type_definition:"Definition", pp_type_numerical:"Numerical", pp_type_application:"Application",
  pp_questions:"Questions", pp_marks:"Marks", pp_answer:"Answer",
  pp_total_fmt:"Total: {a} / Target: {b}",
  pp_add_q:"Add question", pp_qtext_ph:"Question text…", pp_btn_add_q:"Add",
  pp_btn_save_paper:"Save Paper", pp_act_regen:"Regen", pp_edit_q:"Edit question",
  pp_opt_lines:"Options (one per line)", pp_correct_opt:"Correct option number",
  pp_tpl_match:"Match the following:", pp_tpl_long:'Explain "{x}" in detail.',
  pp_tpl_define:"Define: {x}", pp_tpl_apply:'How can you apply "{x}" in daily life?',
  pp_tpl_calc:"Calculate: {x}", pp_tpl_shortq:"Write a short note on: {x}",
  pp_warn_form:"Please select class, subject and an analyzed book first.",
  pp_warn_no_analysis:"This book has no AI analysis yet — analyze it in Book Library first.",
  pp_warn_no_chapters:"Select at least one chapter.",
  pp_msg_regen_fail:"Could not regenerate — source text too small.",
  pp_empty:"No papers yet — create one from the New Paper tab.",
  pp_col_title:"Title", pp_col_class:"Class / Subject", pp_col_marks:"Marks", pp_col_qs:"Qs", pp_col_date:"Date",
  pp_footer_goodluck:"Good luck!",
});
Object.assign(I18N.ur,{
  pp_tab_mypapers:"میرے پیپرز", pp_tab_new:"نیا پیپر",
  pp_title:"عنوان", pp_title_ph:"مثلاً جماعت پنجم سائنس ٹیسٹ 1",
  pp_test_word:"ٹیسٹ", pp_class:"جماعت", pp_subject:"مضمون", pp_book:"کتاب",
  pp_select:"-- منتخب کریں --", pp_chapters:"ابواب", pp_pages:"صفحات (معلومات)", pp_pages_ph:"مثلاً 12-30",
  pp_total_marks:"کل نمبرات", pp_time:"وقت", pp_min:"منٹ",
  pp_difficulty:"مشکل کی سطح", pp_diff_easy:"آسان", pp_diff_medium:"درمیانہ", pp_diff_hard:"مشکل", pp_diff_mixed:"مخلوط",
  pp_qcounts:"سوالات کی تعداد", pp_preset_board:"بورڈ پیٹرن", pp_preset_weekly:"ہفتہ وار ٹیسٹ", pp_preset_clear:"صاف کریں",
  pp_btn_generate:"سوالات بنائیں", pp_settings:"ترتیبات",
  pp_type_mcq:"معروضی", pp_type_fillblank:"خالی جگہ پُر کریں", pp_type_truefalse:"صحیح / غلط",
  pp_type_matching:"ملاپ", pp_type_short:"مختصر", pp_type_long:"تفصیلی",
  pp_type_definition:"تعریف", pp_type_numerical:"عددی", pp_type_application:"اطلاقی",
  pp_questions:"سوالات", pp_marks:"نمبرات", pp_answer:"جواب",
  pp_total_fmt:"کل: {a} / ہدف: {b}",
  pp_add_q:"سوال شامل کریں", pp_qtext_ph:"سوال کا متن…", pp_btn_add_q:"شامل کریں",
  pp_btn_save_paper:"پیپر محفوظ کریں", pp_act_regen:"دوبارہ", pp_edit_q:"سوال میں ترمیم",
  pp_opt_lines:"آپشنز (ہر لائن پر ایک)", pp_correct_opt:"درست آپشن کا نمبر",
  pp_tpl_match:"درج ذیل کا ملاپ کریں:", pp_tpl_long:'"{x}" کی تفصیل سے وضاحت کریں۔',
  pp_tpl_define:"تعریف کریں: {x}", pp_tpl_apply:'"{x}" کو روزمرہ زندگی میں کیسے استعمال کر سکتے ہیں؟',
  pp_tpl_calc:"حساب کریں: {x}", pp_tpl_shortq:"مختصر نوٹ لکھیں: {x}",
  pp_warn_form:"پہلے جماعت، مضمون اور تجزیہ شدہ کتاب منتخب کریں۔",
  pp_warn_no_analysis:"اس کتاب کا ابھی تجزیہ نہیں ہوا — پہلے کتاب لائبریری میں تجزیہ کروائیں۔",
  pp_warn_no_chapters:"کم از کم ایک باب منتخب کریں۔",
  pp_msg_regen_fail:"دوبارہ نہیں بن سکا — مواد بہت کم ہے۔",
  pp_empty:"ابھی کوئی پیپر نہیں — نیا پیپر ٹیب سے بنائیں۔",
  pp_col_title:"عنوان", pp_col_class:"جماعت / مضمون", pp_col_marks:"نمبرات", pp_col_qs:"سوالات", pp_col_date:"تاریخ",
  pp_footer_goodluck:"نیک تمنائیں!",
});

/* ================= PaperGen heuristic engine =================
   corpus = { text, sentences:[], definitions:[], questions:[], topics:[] }
   generate(corpus, {counts:{mcq:..}, difficulty, totalMarks}) -> questions[]
   question = {id, type, text, options?, answer?, marks}                        */
window.PaperGen = (function(){
  var TYPES = ['mcq','fillblank','truefalse','matching','short','long','definition','numerical','application'];
  var BASE_MARKS = {mcq:1,fillblank:1,truefalse:1,matching:2,short:3,long:5,definition:2,numerical:3,application:4};
  var AUTO = {
    Easy:   {mcq:3,fillblank:3,truefalse:2,definition:2,short:2},
    Hard:   {long:3,application:2,numerical:2,short:2,mcq:1},
    Medium: {mcq:2,fillblank:2,truefalse:1,short:2,long:2,definition:1},
    Mixed:  {mcq:2,fillblank:2,truefalse:1,short:2,long:2,definition:1}
  };
  var STOP = {};
  ('the,and,for,are,with,this,that,from,they,have,has,was,were,will,would,can,all,any,each,which,their,there,then,than,into,such,more,most,very,some,also,used,using,use,one,two,three,its,not,but,about,when,what,how,why,who,where,has,had,per,اور,ہے,ہیں,میں,کا,کی,کے,سے,کو,پر,یہ,وہ,جو,بھی,نہیں,کیا,ایک,نے,تو,تا,تھا,تھی,ہو,ہوا,ہوئی,کر,کریں,کرتا,کرتی').split(',').forEach(function(w){STOP[w]=1;});

  function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function qid(){ return 'q_'+Math.random().toString(36).slice(2,9); }
  function tpl(key,x){ return t(key).split('{x}').join(x==null?'':x); }
  function pickUnused(arr, used){ var s=shuffle(arr); for(var i=0;i<s.length;i++) if(!used.has(s[i])) return s[i]; return null; }

  function termFromDef(d){
    var pats=[/^(.*?)\s+is defined as/i,/^(.*?)\s+is called/i,/^(.*?)\s+is known as/i,/^(.*?)\s+کہلاتا ہے/,/^(.*?)\s+کہلاتی ہے/,/^(.*?)\s+کو کہتے ہیں/,/^(.*?)\s+means\b/i,/^(.*?)\s*[:،]\s*\S/];
    for(var i=0;i<pats.length;i++){ var m=String(d).match(pats[i]); if(m){ var x=m[1].trim().replace(/^["'“”]+|["'“”]+$/g,''); if(x.length>1&&x.length<60) return x; } }
    return null;
  }
  function splitSentences(text){
    return String(text||'').split(/(?<=[.!?۔؟\n])\s+/).map(function(s){return s.trim();}).filter(function(s){return s.length>15;});
  }

  function buildCorpus(text){
    var raw=String(text||'');
    var lines=raw.split(/\n+/).map(function(s){return s.trim();}).filter(Boolean);
    var sentences=splitSentences(raw);
    var questions=lines.filter(function(l){return /[?؟]\s*$/.test(l);});
    var qset={}; questions.forEach(function(q){qset[q]=1;});
    var definitions=sentences.filter(function(s){return termFromDef(s)!==null;});
    var topics=lines.filter(function(l){return l.length>2&&l.length<80&&!/[.!?؟:]$/.test(l)&&!qset[l];}).slice(0,80);
    return {text:raw, sentences:sentences, definitions:definitions, questions:questions, topics:topics};
  }
  function normChapter(ch){
    if(typeof ch==='string') return {title:ch, topics:[], definitions:[], questions:[], content:''};
    return { title: ch.title||ch.name||'?', topics: ch.topics||[], definitions: ch.definitions||[], questions: ch.questions||ch.exercise||[], content: ch.content||ch.text||'' };
  }
  function buildCorpusFromChapters(chapters){
    var agg={text:'', sentences:[], definitions:[], questions:[], topics:[]};
    (chapters||[]).forEach(function(raw){
      var ch=normChapter(raw);
      var c=buildCorpus([ch.topics.join('\n'), ch.definitions.join('\n'), ch.questions.join('\n'), ch.content].join('\n'));
      agg.text+= '\n'+c.text;
      agg.sentences=agg.sentences.concat(c.sentences);
      agg.definitions=agg.definitions.concat(ch.definitions.length?ch.definitions:c.definitions);
      agg.questions=agg.questions.concat(ch.questions);
      agg.topics=agg.topics.concat(ch.topics.length?ch.topics:c.topics);
    });
    return agg;
  }

  function makeState(c){
    var st={ text:c.text||'', sentences:(c.sentences||[]).slice(), defs:(c.definitions||[]).slice(),
      qs:(c.questions||[]).slice(), topics:(c.topics||[]).slice(),
      usedS:new Set(), usedT:new Set(), usedQ:new Set(), pairs:[], terms:[] };
    var seen={};
    st.defs.forEach(function(d){ var term=termFromDef(d); if(term&&!seen[term.toLowerCase()]){ seen[term.toLowerCase()]=1; st.pairs.push({term:term, def:d}); st.terms.push(term); } });
    (st.text.match(/\b[A-Z][a-z]{3,}\b/g)||[]).forEach(function(w){ var k=w.toLowerCase(); if(!seen[k]&&!STOP[k]){ seen[k]=1; st.terms.push(w); } });
    if(st.terms.length<6){
      var freq={};
      (st.text.toLowerCase().match(/[a-z\u0600-\u06FF]{4,}/g)||[]).forEach(function(w){ if(!STOP[w]&&!seen[w]) freq[w]=(freq[w]||0)+1; });
      Object.keys(freq).sort(function(a,b){return freq[b]-freq[a];}).slice(0,24).forEach(function(w){ if(freq[w]>=2){ seen[w]=1; st.terms.push(w); } });
    }
    return st;
  }
  function termIn(s, st){
    s=s.toLowerCase();
    for(var i=0;i<st.terms.length;i++){ var x=st.terms[i]; if(x.length>2&&s.indexOf(x.toLowerCase())>=0) return x; }
    return null;
  }

  var GEN={
    mcq:function(st){
      var d=pickUnused(st.defs, st.usedS); if(!d) return null;
      var term=termFromDef(d);
      if(!term||d.toLowerCase().indexOf(term.toLowerCase())<0) term=termIn(d,st);
      if(!term) return null;
      var others=shuffle(st.terms.filter(function(x){return x.toLowerCase()!==term.toLowerCase();})).slice(0,3);
      if(others.length<3) return null;
      var idx=d.toLowerCase().indexOf(term.toLowerCase());
      var options=shuffle([term].concat(others));
      st.usedS.add(d); st.usedT.add(term.toLowerCase());
      return {type:'mcq', text:d.slice(0,idx)+'_____'+d.slice(idx+term.length), options:options, answer:options.indexOf(term)};
    },
    fillblank:function(st){
      var cands=shuffle(st.sentences.filter(function(s){return s.length>=40&&s.length<=140&&!st.usedS.has(s);}));
      for(var i=0;i<cands.length;i++){ var s=cands[i], term=termIn(s,st); if(!term) continue;
        var idx=s.toLowerCase().indexOf(term.toLowerCase());
        st.usedS.add(s); st.usedT.add(term.toLowerCase());
        return {type:'fillblank', text:s.slice(0,idx)+'_____'+s.slice(idx+term.length), answer:term}; }
      return null;
    },
    truefalse:function(st){
      var cands=shuffle(st.sentences.filter(function(s){return s.length>=30&&s.length<=160&&!st.usedS.has(s);}));
      for(var i=0;i<cands.length;i++){ var s=cands[i], term=termIn(s,st); if(!term) continue;
        st.usedS.add(s);
        if(Math.random()<0.5) return {type:'truefalse', text:s, answer:true};
        var other=shuffle(st.terms.filter(function(x){return x.toLowerCase()!==term.toLowerCase();}))[0];
        if(!other) return {type:'truefalse', text:s, answer:true};
        var idx=s.toLowerCase().indexOf(term.toLowerCase());
        return {type:'truefalse', text:s.slice(0,idx)+other+s.slice(idx+term.length), answer:false}; }
      return null;
    },
    matching:function(st){
      var avail=st.pairs.filter(function(p){return !st.usedT.has(p.term.toLowerCase());});
      if(avail.length<4) return null;
      var ps=shuffle(avail).slice(0,4);
      ps.forEach(function(p){st.usedT.add(p.term.toLowerCase());});
      return {type:'matching', text:tpl('pp_tpl_match'),
        options:ps.map(function(p){ var b=p.def.replace(p.term,'').replace(/^[\s:–—-]+/,'').trim(); return {a:p.term, b:b.length>100?b.slice(0,100)+'…':b}; }),
        answer:ps.map(function(p){return p.term;})};
    },
    short:function(st){
      var q=st.qs.find(function(x){return !st.usedQ.has(x);});
      if(q){ st.usedQ.add(q); return {type:'short', text:q, answer:''}; }
      var s=pickUnused(st.sentences, st.usedS); if(!s) return null;
      st.usedS.add(s);
      return {type:'short', text:tpl('pp_tpl_shortq', s.length>90?s.slice(0,90)+'…':s), answer:''};
    },
    long:function(st){
      var topic=pickUnused(st.topics, st.usedT);
      if(!topic){ var tm=st.terms.find(function(x){return !st.usedT.has(x.toLowerCase());}); if(!tm) return null; topic=tm; }
      st.usedT.add(String(topic).toLowerCase());
      return {type:'long', text:tpl('pp_tpl_long', topic), answer:''};
    },
    definition:function(st){
      var term=st.terms.find(function(x){return !st.usedT.has(x.toLowerCase());});
      if(!term) return null;
      st.usedT.add(term.toLowerCase());
      return {type:'definition', text:tpl('pp_tpl_define', term), answer:''};
    },
    numerical:function(st){
      var nums=(st.text.match(/\d+(\.\d+)?/g)||[]).map(Number).filter(function(n){return n<1000000;});
      if(nums.length<2) return null; /* caller falls back to short */
      var a=nums[Math.floor(Math.random()*nums.length)], b=nums[Math.floor(Math.random()*nums.length)];
      if(b===a) b=a+Math.floor(Math.random()*9)+1;
      var ops=[['+','+'],['−','-'],['×','*']], op=ops[Math.floor(Math.random()*3)];
      var ans=op[1]==='+'?a+b:op[1]==='-'?a-b:a*b;
      return {type:'numerical', text:tpl('pp_tpl_calc', a+' '+op[0]+' '+b+' = ?'), answer:String(ans)};
    },
    application:function(st){
      var topic=pickUnused(st.topics, st.usedT);
      if(!topic){ var tm=st.terms.find(function(x){return !st.usedT.has(x.toLowerCase());}); if(!tm) return null; topic=tm; }
      st.usedT.add(String(topic).toLowerCase());
      return {type:'application', text:tpl('pp_tpl_apply', topic), answer:''};
    }
  };

  function assignMarks(qs, total){
    var base=0; qs.forEach(function(q){base+=BASE_MARKS[q.type]||2;});
    var scale=base>0?(total||50)/base:1;
    qs.forEach(function(q){ q.marks=Math.max(1, Math.round((BASE_MARKS[q.type]||2)*scale)); });
  }
  function generate(corpus, opts){
    opts=opts||{};
    var st=makeState(corpus||{text:''});
    var counts=Object.assign({}, opts.counts);
    var tot=TYPES.reduce(function(s,k){return s+((+counts[k])||0);},0);
    if(tot===0){ var d=opts.difficulty||'Mixed'; counts=Object.assign({}, AUTO[d]||AUTO.Mixed); }
    var qs=[];
    TYPES.forEach(function(type){
      var n=(+counts[type])||0;
      for(var i=0;i<n;i++){
        var q=GEN[type](st);
        if(!q&&type!=='short') q=GEN.short(st);
        if(!q) q=GEN.fillblank(st);
        if(!q) continue;
        q.id=qid(); q.marks=0; qs.push(q);
      }
    });
    assignMarks(qs, +opts.totalMarks||50);
    return qs;
  }
  function generateOne(corpus, type, marks){
    var st=makeState(corpus||{text:''});
    var q=(GEN[type]||GEN.short)(st)||GEN.short(st);
    if(!q) return null;
    q.id=qid(); q.marks=marks||BASE_MARKS[type]||2;
    return q;
  }
  return {TYPES:TYPES, BASE_MARKS:BASE_MARKS, generate:generate, generateOne:generateOne,
    buildCorpus:buildCorpus, buildCorpusFromChapters:buildCorpusFromChapters};
})();

/* ================= Module state & UI ================= */
var PP_TAB='list', PP_ED=null;
function ppFmt(key,a,b){ return t(key).split('{a}').join(a).split('{b}').join(b); }

App.register('papers',{titleKey:'nav_papers', icon:'📝', roles:['superadmin','principal','teacher','exam'], render:function(el){
  el.innerHTML='<div class="tabs">'
    +'<button class="btn btn-sm '+(PP_TAB==='list'?'btn-navy':'btn-ghost')+'" id="pp-t-list">'+t('pp_tab_mypapers')+'</button>'
    +'<button class="btn btn-sm '+(PP_TAB==='form'?'btn-navy':'btn-ghost')+'" id="pp-t-form">'+t('pp_tab_new')+'</button></div>'
    +'<div id="pp-body"></div>';
  document.getElementById('pp-t-list').onclick=function(){PP_TAB='list';App.refresh();};
  document.getElementById('pp-t-form').onclick=function(){PP_TAB='form';App.refresh();};
  if(PP_TAB==='list') ppList(document.getElementById('pp-body'));
  else ppForm(document.getElementById('pp-body'));
}});

/* ---------- My Papers list ---------- */
function ppList(body){
  var papers=DB.get('papers').slice().sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);});
  if(!papers.length){ body.innerHTML='<div class="empty"><div class="ic">📝</div>'+t('pp_empty')+'</div>'; return; }
  var rows=papers.map(function(p){
    var d=p.date||(p.createdAt?new Date(p.createdAt).toISOString().slice(0,10):'');
    return '<tr><td><b>'+esc(p.title)+'</b>'+(p.source==='scanned'?' <span class="badge b-blue">📸</span>':'')+'</td>'
      +'<td>'+esc(DB.className(p.classId))+' / '+esc(DB.subjectName(p.subjectId))+'</td>'
      +'<td>'+fmtNum(p.totalMarks||0)+'</td><td>'+fmtNum((p.questions||[]).length)+'</td><td>'+fmtDate(d)+'</td>'
      +'<td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" data-a="view" data-id="'+p.id+'">👁</button> '
      +'<button class="btn btn-ghost btn-sm" data-a="edit" data-id="'+p.id+'">✏️</button> '
      +'<button class="btn btn-ghost btn-sm" data-a="print" data-id="'+p.id+'">🖨</button> '
      +'<button class="btn btn-danger btn-sm" data-a="del" data-id="'+p.id+'">🗑</button></td></tr>';
  }).join('');
  body.innerHTML='<div class="table-wrap"><table class="tbl"><thead><tr><th>'+t('pp_col_title')+'</th><th>'+t('pp_col_class')+'</th><th>'+t('pp_col_marks')+'</th><th>'+t('pp_col_qs')+'</th><th>'+t('pp_col_date')+'</th><th>'+t('actions')+'</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  body.querySelectorAll('button[data-a]').forEach(function(b){
    b.onclick=function(){
      var p=DB.find('papers', b.dataset.id); if(!p) return;
      var a=b.dataset.a;
      if(a==='view') ppViewModal(p);
      else if(a==='edit'){
        var corpus=null, bk=DB.find('books', p.bookId);
        if(bk&&bk.analysis&&bk.analysis.chapters){
          var chs=bk.analysis.chapters.filter(function(c){ var nm=typeof c==='string'?c:(c.title||c.name||''); return (p.chapters||[]).indexOf(nm)>=0; });
          corpus=window.PaperGen.buildCorpusFromChapters(chs.length?chs:bk.analysis.chapters);
        }
        PP_ED={paperId:p.id, title:p.title, classId:p.classId, subjectId:p.subjectId, bookId:p.bookId, chapters:(p.chapters||[]).slice(), pages:p.pages||'', totalMarks:p.totalMarks, timeAllowed:p.timeAllowed, difficulty:p.difficulty||'Mixed', questions:JSON.parse(JSON.stringify(p.questions||[])), corpus:corpus}; PP_TAB='form'; App.refresh(); }
      else if(a==='print') ppPrint(p);
      else if(a==='del') (async function(){ if(await App.confirm(t('msg_confirm_delete'))){ DB.remove('papers',p.id); App.toast(t('msg_deleted')); App.refresh(); } })();
    };
  });
}

function ppQCardHTML(q, i, editable){
  var h='<div class="qcard"><div class="qhead"><span><span class="qtype">'+t('pp_type_'+q.type)+'</span> <span class="qmarks">Q'+(i+1)+'</span></span><span class="qmarks">';
  if(editable) h+='<input type="number" min="1" value="'+(q.marks||1)+'" data-mk="'+i+'" style="width:58px;padding:4px;border:1px solid var(--line);border-radius:8px"> '+t('pp_marks');
  else h+='<b>'+fmtNum(q.marks||0)+'</b> '+t('pp_marks');
  h+='</span></div><div class="qtext">'+esc(q.text)+'</div>';
  if(q.type==='mcq'&&q.options){
    var letters=['a','b','c','d','e','f'];
    h+='<div class="qopts">'+q.options.map(function(o,k){return '<div>'+letters[k]+') '+esc(o)+(k===q.answer?' ✓':'')+'</div>';}).join('')+'</div>';
  } else if(q.type==='matching'&&q.options){
    h+='<div class="row" style="margin-top:6px"><div>'+q.options.map(function(p,k){return '<div>'+(k+1)+'. '+esc(p.a)+'</div>';}).join('')+'</div>'
      +'<div>'+q.options.map(function(p,k){return '<div>'+String.fromCharCode(97+k)+'. '+esc(p.b)+'</div>';}).join('')+'</div></div>';
  } else if(q.answer!==''&&q.answer!==undefined&&q.answer!==null&&q.type!=='mcq'){
    h+='<div class="qmarks" style="margin-top:4px">'+t('pp_answer')+': '+esc(String(q.answer))+'</div>';
  }
  if(editable){
    h+='<div class="btnrow" style="margin-top:8px"><button class="btn btn-ghost btn-sm" data-ea="regen" data-i="'+i+'">🔁 '+t('pp_act_regen')+'</button>'
      +'<button class="btn btn-ghost btn-sm" data-ea="edit" data-i="'+i+'">✏️</button>'
      +'<button class="btn btn-ghost btn-sm" data-ea="del" data-i="'+i+'">🗑</button>'
      +'<button class="btn btn-ghost btn-sm" data-ea="up" data-i="'+i+'">↑</button>'
      +'<button class="btn btn-ghost btn-sm" data-ea="down" data-i="'+i+'">↓</button></div>';
  }
  return h+'</div>';
}

function ppViewModal(p){
  var h='<h3 style="margin-top:0">'+esc(p.title)+'</h3><p style="color:var(--muted);font-size:13px">'+esc(DB.className(p.classId))+' · '+esc(DB.subjectName(p.subjectId))+' · '+t('pp_marks')+': '+fmtNum(p.totalMarks||0)+' · '+t('pp_time')+': '+esc(p.timeAllowed||'')+' '+t('pp_min')+'</p>'
    +(p.questions||[]).map(function(q,i){return ppQCardHTML(q,i,false);}).join('')
    +'<div class="btnrow" style="justify-content:flex-end"><button class="btn btn-ghost" onclick="App.closeModal()">'+t('btn_close')+'</button></div>';
  App.modal(h);
}

/* ---------- New Paper form / editor ---------- */
function ppForm(body){
  if(PP_ED&&PP_ED.questions){ ppEditor(body); return; }
  var E=PP_ED||{};
  var classes=DB.get('classes');
  var h='<div class="card"><div class="form-group"><label>'+t('pp_title')+'</label><input type="text" id="pp-f-title" placeholder="'+esc(t('pp_title_ph'))+'" value="'+esc(E.title||'')+'"></div>'
    +'<div class="row"><div class="form-group"><label>'+t('pp_class')+'</label><select id="pp-f-class"><option value="">'+t('pp_select')+'</option>'
    +classes.map(function(c){return '<option value="'+c.id+'"'+(E.classId===c.id?' selected':'')+'>'+esc(c.name)+'</option>';}).join('')+'</select></div>'
    +'<div class="form-group"><label>'+t('pp_subject')+'</label><select id="pp-f-subject"></select></div></div>'
    +'<div class="form-group"><label>'+t('pp_book')+'</label><select id="pp-f-book"></select></div>'
    +'<div class="form-group"><label>'+t('pp_chapters')+'</label><div id="pp-f-chapters" style="max-height:170px;overflow:auto;border:1px solid var(--line);border-radius:10px;padding:8px"></div></div>'
    +'<div class="row"><div class="form-group"><label>'+t('pp_pages')+'</label><input type="text" id="pp-f-pages" placeholder="'+esc(t('pp_pages_ph'))+'" value="'+esc(E.pages||'')+'"></div>'
    +'<div class="form-group"><label>'+t('pp_total_marks')+'</label><input type="number" id="pp-f-marks" min="1" value="'+(E.totalMarks||50)+'"></div></div>'
    +'<div class="row"><div class="form-group"><label>'+t('pp_time')+' ('+t('pp_min')+')</label><input type="number" id="pp-f-time" min="1" value="'+(E.timeAllowed||90)+'"></div>'
    +'<div class="form-group"><label>'+t('pp_difficulty')+'</label><select id="pp-f-diff">'
    +['Easy','Medium','Hard','Mixed'].map(function(d){return '<option value="'+d+'"'+((E.difficulty||'Mixed')===d?' selected':'')+'>'+t('pp_diff_'+d.toLowerCase())+'</option>';}).join('')+'</select></div></div>'
    +'<div class="form-group"><label>'+t('pp_qcounts')+'</label><div class="row" id="pp-counts">'
    +window.PaperGen.TYPES.map(function(tp){var v=(E.counts&&E.counts[tp])||0;return '<div class="form-group" style="min-width:100px"><label style="font-size:12px">'+t('pp_type_'+tp)+'</label><input type="number" min="0" value="'+v+'" data-ct="'+tp+'"></div>';}).join('')
    +'</div><div class="btnrow"><button class="btn btn-ghost btn-sm" id="pp-preset-board">'+t('pp_preset_board')+'</button>'
    +'<button class="btn btn-ghost btn-sm" id="pp-preset-weekly">'+t('pp_preset_weekly')+'</button>'
    +'<button class="btn btn-ghost btn-sm" id="pp-preset-clear">'+t('pp_preset_clear')+'</button></div></div>'
    +'<div class="btnrow"><button class="btn btn-primary" id="pp-generate">⚡ '+t('pp_btn_generate')+'</button></div></div>';
  body.innerHTML=h;

  var selC=document.getElementById('pp-f-class'), selS=document.getElementById('pp-f-subject'), selB=document.getElementById('pp-f-book');
  function fillSubjects(){
    var cid=selC.value;
    var subs=DB.get('subjects').filter(function(s){return !cid||s.classId===cid;});
    selS.innerHTML='<option value="">'+t('pp_select')+'</option>'+subs.map(function(s){return '<option value="'+s.id+'"'+(E.subjectId===s.id?' selected':'')+'>'+esc(s.name)+'</option>';}).join('');
  }
  function fillBooks(){
    var cid=selC.value, sid=selS.value;
    var books=DB.get('books').filter(function(b){return (!cid||b.classId===cid)&&(!sid||!b.subjectId||b.subjectId===sid);});
    selB.innerHTML='<option value="">'+t('pp_select')+'</option>'+books.map(function(b){
      var an=b.analysis?' ✅':' ⚠️';
      return '<option value="'+b.id+'"'+(E.bookId===b.id?' selected':'')+'>'+esc(b.bookName||DB.bookTitle(b.id))+an+'</option>';
    }).join('');
  }
  function fillChapters(){
    var box=document.getElementById('pp-f-chapters');
    var book=DB.find('books', selB.value);
    if(!book||!book.analysis||!book.analysis.chapters){ box.innerHTML='<span style="color:var(--muted);font-size:13px">'+t('pp_warn_no_analysis')+'</span>'; return; }
    var chs=book.analysis.chapters;
    box.innerHTML=chs.map(function(c,i){
      var nm=typeof c==='string'?c:(c.title||c.name||('Ch '+(i+1)));
      var checked=E.chapters&&E.chapters.indexOf(nm)>=0?' checked':'';
      return '<label style="display:block;padding:4px 2px;font-size:14px"><input type="checkbox" data-ch="'+i+'"'+checked+'> '+esc(nm)+'</label>';
    }).join('');
  }
  selC.onchange=function(){E.classId=selC.value;E.subjectId='';E.bookId='';E.chapters=[];fillSubjects();fillBooks();fillChapters();};
  selS.onchange=function(){
    E.subjectId=selS.value;E.bookId='';E.chapters=[];fillBooks();fillChapters();
    var ti=document.getElementById('pp-f-title');
    if(ti&&!ti.value.trim()&&selC.value&&selS.value){
      var n=DB.get('papers').filter(function(p){return p.classId===selC.value&&p.subjectId===selS.value;}).length+1;
      ti.value=DB.className(selC.value)+' '+DB.subjectName(selS.value)+' '+t('pp_test_word')+' '+n;
    }
  };
  selB.onchange=function(){E.bookId=selB.value;E.chapters=[];fillChapters();};
  fillSubjects();fillBooks();fillChapters();

  document.getElementById('pp-preset-board').onclick=function(){ppSetCounts({mcq:4,short:6,long:3});};
  document.getElementById('pp-preset-weekly').onclick=function(){ppSetCounts({mcq:5,fillblank:5,short:5});};
  document.getElementById('pp-preset-clear').onclick=function(){ppSetCounts({});};
  function ppSetCounts(c){ document.querySelectorAll('#pp-counts input').forEach(function(i){i.value=c[i.dataset.ct]||0;}); }

  document.getElementById('pp-generate').onclick=function(){
    var title=document.getElementById('pp-f-title').value.trim();
    var cid=selC.value, sid=selS.value, bid=selB.value;
    var book=DB.find('books',bid);
    if(!title||!cid||!sid||!book){ App.toast(t('pp_warn_form')); return; }
    if(!book.analysis||!book.analysis.chapters){ App.toast(t('pp_warn_no_analysis')); return; }
    var chIdx=[]; document.querySelectorAll('#pp-f-chapters input:checked').forEach(function(c){chIdx.push(+c.dataset.ch);});
    if(!chIdx.length){ App.toast(t('pp_warn_no_chapters')); return; }
    var counts={}; document.querySelectorAll('#pp-counts input').forEach(function(i){counts[i.dataset.ct]=+i.value||0;});
    var chObjs=chIdx.map(function(i){return book.analysis.chapters[i];});
    var corpus=window.PaperGen.buildCorpusFromChapters(chObjs);
    var questions=window.PaperGen.generate(corpus,{counts:counts, difficulty:document.getElementById('pp-f-diff').value, totalMarks:+document.getElementById('pp-f-marks').value||50});
    PP_ED={paperId:E.paperId||null, title:title, classId:cid, subjectId:sid, bookId:bid,
      chapters:chObjs.map(function(c){return typeof c==='string'?c:(c.title||c.name||'?');}),
      pages:document.getElementById('pp-f-pages').value.trim(),
      totalMarks:+document.getElementById('pp-f-marks').value||50,
      timeAllowed:+document.getElementById('pp-f-time').value||90,
      difficulty:document.getElementById('pp-f-diff').value, counts:counts,
      questions:questions, corpus:corpus};
    App.refresh();
  };
}

/* ---------- Editor ---------- */
function ppEditor(body){
  var E=PP_ED;
  var total=(E.questions||[]).reduce(function(s,q){return s+(+q.marks||0);},0);
  var h='<div class="card"><div class="toolbar"><b>'+esc(E.title)+'</b>'
    +'<span class="chip">'+esc(DB.className(E.classId))+' · '+esc(DB.subjectName(E.subjectId))+'</span>'
    +'<span class="chip" id="pp-total">'+ppFmt('pp_total_fmt', fmtNum(total), fmtNum(E.totalMarks||0))+'</span>'
    +'<span style="flex:1"></span><button class="btn btn-ghost btn-sm" id="pp-back-settings">⚙️ '+t('pp_settings')+'</button></div>'
    +'<div id="pp-qlist">'+E.questions.map(function(q,i){return ppQCardHTML(q,i,true);}).join('')+'</div>'
    +'<div class="card" style="background:#f8fbff"><b>'+t('pp_add_q')+'</b><div class="row" style="margin-top:8px"><div class="form-group"><select id="pp-aq-type">'
    +window.PaperGen.TYPES.map(function(tp){return '<option value="'+tp+'">'+t('pp_type_'+tp)+'</option>';}).join('')
    +'</select></div><div class="form-group" style="flex:2"><input type="text" id="pp-aq-text" placeholder="'+esc(t('pp_qtext_ph'))+'"></div></div>'
    +'<div class="btnrow"><button class="btn btn-green btn-sm" id="pp-aq-add">➕ '+t('pp_btn_add_q')+'</button></div></div>'
    +'<div class="btnrow"><button class="btn btn-primary" id="pp-save">💾 '+t('pp_btn_save_paper')+'</button>'
    +'<button class="btn btn-ghost" id="pp-print2">🖨 '+t('btn_print')+'</button></div></div>';
  body.innerHTML=h;

  function retotal(){
    var s=E.questions.reduce(function(x,q){return x+(+q.marks||0);},0);
    document.getElementById('pp-total').textContent=ppFmt('pp_total_fmt', fmtNum(s), fmtNum(E.totalMarks||0));
  }
  body.querySelectorAll('input[data-mk]').forEach(function(inp){
    inp.onchange=function(){ E.questions[+inp.dataset.mk].marks=Math.max(1,+inp.value||1); retotal(); };
  });
  body.querySelectorAll('button[data-ea]').forEach(function(b){
    b.onclick=function(){
      var i=+b.dataset.i, a=b.dataset.ea, qs=E.questions;
      if(a==='del')(async function(){ if(await App.confirm(t('msg_confirm_delete'))){ qs.splice(i,1); App.refresh(); } })();
      else if(a==='up'){ if(i>0){ var x=qs[i-1];qs[i-1]=qs[i];qs[i]=x; App.refresh(); } }
      else if(a==='down'){ if(i<qs.length-1){ var y=qs[i+1];qs[i+1]=qs[i];qs[i]=y; App.refresh(); } }
      else if(a==='regen'){
        var old=qs[i];
        var nq=window.PaperGen.generateOne(E.corpus||{text:''}, old.type, old.marks);
        if(!nq){ App.toast(t('pp_msg_regen_fail')); return; }
        qs[i]=nq; App.refresh();
      }
      else if(a==='edit') ppEditModal(i);
    };
  });
  document.getElementById('pp-aq-add').onclick=function(){
    var tp=document.getElementById('pp-aq-type').value, tx=document.getElementById('pp-aq-text').value.trim();
    if(!tx){ App.toast(t('msg_required')); return; }
    var q={id:'q_'+Math.random().toString(36).slice(2,9), type:tp, text:tx, answer:'', marks:window.PaperGen.BASE_MARKS[tp]||2};
    if(tp==='mcq'){ q.options=[tx]; q.answer=0; }
    E.questions.push(q); App.refresh();
  };
  document.getElementById('pp-back-settings').onclick=function(){ E.questions=null; App.refresh(); };
  document.getElementById('pp-print2').onclick=function(){ ppPrint(Object.assign({},E,{date:todayISO()})); };
  document.getElementById('pp-save').onclick=function(){
    var rec={title:E.title, classId:E.classId, subjectId:E.subjectId, bookId:E.bookId, chapters:E.chapters,
      pages:E.pages, totalMarks:E.questions.reduce(function(s,q){return s+(+q.marks||0);},0),
      timeAllowed:E.timeAllowed, difficulty:E.difficulty, questions:E.questions,
      source:E.paperId?(DB.find('papers',E.paperId)||{}).source:'book', date:todayISO()};
    if(E.paperId) DB.update('papers',E.paperId,rec); else DB.add('papers',rec);
    PP_ED=null; PP_TAB='list'; App.toast(t('msg_saved')); App.refresh();
  };
}

function ppEditModal(i){
  var q=PP_ED.questions[i];
  var optH='', extraH='';
  if(q.type==='mcq'){
    optH='<div class="form-group"><label>'+t('pp_opt_lines')+'</label><textarea id="pp-e-opts" rows="4">'+esc((q.options||[]).join('\n'))+'</textarea></div>'
      +'<div class="form-group"><label>'+t('pp_correct_opt')+'</label><input type="number" id="pp-e-ans" min="1" max="'+(q.options||[]).length+'" value="'+((q.answer||0)+1)+'"></div>';
  } else if(q.type==='matching'){
    optH='<div class="form-group"><label>'+t('pp_opt_lines')+' (term | def)</label><textarea id="pp-e-opts" rows="4">'+esc((q.options||[]).map(function(p){return p.a+' | '+p.b;}).join('\n'))+'</textarea></div>';
  } else if(q.answer!==''&&q.answer!==undefined){
    extraH='<div class="form-group"><label>'+t('pp_answer')+'</label><input type="text" id="pp-e-answer" value="'+esc(String(q.answer))+'"></div>';
  }
  App.modal('<h3 style="margin-top:0">'+t('pp_edit_q')+' — '+t('pp_type_'+q.type)+'</h3>'
    +'<div class="form-group"><label>'+t('pp_questions')+'</label><textarea id="pp-e-text" rows="3">'+esc(q.text)+'</textarea></div>'+optH+extraH
    +'<div class="form-group"><label>'+t('pp_marks')+'</label><input type="number" id="pp-e-marks" min="1" value="'+(q.marks||1)+'"></div>'
    +'<div class="btnrow" style="justify-content:flex-end"><button class="btn btn-ghost" onclick="App.closeModal()">'+t('btn_cancel')+'</button> '
    +'<button class="btn btn-primary" id="pp-e-save">'+t('btn_save')+'</button></div>');
  document.getElementById('pp-e-save').onclick=function(){
    q.text=document.getElementById('pp-e-text').value.trim()||q.text;
    q.marks=Math.max(1,+document.getElementById('pp-e-marks').value||1);
    var eo=document.getElementById('pp-e-opts');
    if(eo&&q.type==='mcq'){
      q.options=eo.value.split('\n').map(function(s){return s.trim();}).filter(Boolean);
      var an=Math.max(1,Math.min(q.options.length,+document.getElementById('pp-e-ans').value||1))-1;
      q.answer=an;
    } else if(eo&&q.type==='matching'){
      q.options=eo.value.split('\n').map(function(s){return s.trim();}).filter(Boolean).map(function(line){
        var p=line.split('|'); return {a:(p[0]||'').trim(), b:(p[1]||'').trim()};
      }).filter(function(p){return p.a&&p.b;});
    }
    var ea=document.getElementById('pp-e-answer'); if(ea) q.answer=ea.value;
    App.closeModal(); App.refresh();
  };
}

/* ---------- Print ---------- */
function ppPrint(p){
  var m=DB.meta(), qs=p.questions||[], order=window.PaperGen.TYPES;
  var h='<div style="font-family:inherit;color:#000;max-width:700px;margin:0 auto">'
    +'<div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px">'
    +(m.logo?'<img src="'+m.logo+'" style="height:54px">':'<div style="font-size:34px">🏫</div>')
    +'<h2 style="margin:4px 0">'+esc(m.name)+'</h2><h3 style="margin:4px 0">'+esc(p.title)+'</h3>'
    +'<p style="font-size:13px;margin:2px 0">'+t('pp_class')+': <b>'+esc(DB.className(p.classId))+'</b> &nbsp; '
    +t('pp_subject')+': <b>'+esc(DB.subjectName(p.subjectId))+'</b> &nbsp; '
    +t('pp_time')+': <b>'+esc(p.timeAllowed||'')+' '+t('pp_min')+'</b> &nbsp; '
    +t('pp_marks')+': <b>'+fmtNum(p.totalMarks||0)+'</b> &nbsp; '
    +t('pp_col_date')+': <b>'+fmtDate(p.date||todayISO())+'</b></p></div>';
  var n=0, letters=['a','b','c','d','e','f'];
  order.forEach(function(tp){
    var list=qs.map(function(q,ix){return {q:q,ix:ix};}).filter(function(o){return o.q.type===tp;});
    if(!list.length) return;
    h+='<h4 style="margin:14px 0 6px;border-bottom:1px solid #999;padding-bottom:2px">'+t('pp_type_'+tp)+'</h4>';
    list.forEach(function(o){
      n++; var q=o.q;
      h+='<div style="margin:8px 0"><b>Q'+n+'.</b> '+esc(q.text)+' <span style="float:right">['+(q.marks||0)+']</span>';
      if(tp==='mcq'&&q.options){
        h+='<div style="margin:4px 0 4px 18px;font-size:13.5px">'+q.options.map(function(op,k){return '<div>('+letters[k]+') '+esc(op)+'</div>';}).join('')+'</div>';
      } else if(tp==='matching'&&q.options){
        var right=q.options.slice().sort(function(){return Math.random()-0.5;});
        h+='<div style="display:flex;gap:24px;margin:4px 0 4px 18px;font-size:13.5px"><div>'
          +q.options.map(function(op,k){return '<div>'+(k+1)+'. '+esc(op.a)+'</div>';}).join('')+'</div><div>'
          +right.map(function(op,k){return '<div>('+letters[k]+') '+esc(op.b)+'</div>';}).join('')+'</div></div>';
      } else if(tp==='truefalse'){
        h+='<div style="margin:4px 0 4px 18px;font-size:13px">( '+t('pp_type_truefalse')+' )</div>';
      } else {
        var lines=tp==='long'?4:tp==='short'||tp==='definition'?3:2;
        for(var l=0;l<lines;l++) h+='<div style="border-bottom:1px dotted #999;height:20px;margin-left:18px"></div>';
      }
      h+='</div>';
    });
  });
  h+='<p style="text-align:center;margin-top:18px;font-weight:700">— '+t('pp_footer_goodluck')+' —</p></div>';
  App.print(h);
}
