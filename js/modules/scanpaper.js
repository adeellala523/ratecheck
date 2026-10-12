/* ===== Scan Paper (scanpaper) — OCR scanned pages then generate a paper ===== */
Object.assign(I18N.en,{
  sp_upload:"Upload page photos (1–3)", sp_extract:"Extract Text (OCR)",
  sp_ocr_loading:"Loading OCR engine…", sp_ocr_page:"Reading page {n}…", sp_ocr_done:"Text extracted.",
  sp_ocr_fail:"OCR unavailable (offline or blocked) — paste the text manually below.",
  sp_page:"Page {n}", sp_paste_ph:"Paste page text here…", sp_remove:"Remove",
  sp_title:"Paper title", sp_title_ph:"e.g. Chapter 3 Scanned Test",
  sp_total_marks:"Total marks", sp_qcounts:"Question counts", sp_generate:"Generate Paper",
  sp_saved:"Paper saved — opening Paper Generator…",
  sp_need_text:"Add at least one page of text first.", sp_need_title:"Please enter a paper title.",
  sp_need_counts:"Set at least one question count.",
  sp_max3:"Only the first 3 images are used.",
  sp_hint:"Tip: works fully offline if you paste the text manually.",
  sp_type_mcq:"MCQ", sp_type_fillblank:"Fill blank", sp_type_truefalse:"True/False", sp_type_short:"Short", sp_type_long:"Long",
});
Object.assign(I18N.ur,{
  sp_upload:"صفحات کی تصاویر اپ لوڈ کریں (1–3)", sp_extract:"متن نکالیں (OCR)",
  sp_ocr_loading:"OCR انجن لوڈ ہو رہا ہے…", sp_ocr_page:"صفحہ {n} پڑھا جا رہا ہے…", sp_ocr_done:"متن نکال لیا گیا۔",
  sp_ocr_fail:"OCR دستیاب نہیں (آف لائن یا بلاک) — نیچے متن خود پیسٹ کریں۔",
  sp_page:"صفحہ {n}", sp_paste_ph:"یہاں صفحے کا متن پیسٹ کریں…", sp_remove:"ہٹائیں",
  sp_title:"پیپر کا عنوان", sp_title_ph:"مثلاً باب 3 اسکین ٹیسٹ",
  sp_total_marks:"کل نمبرات", sp_qcounts:"سوالات کی تعداد", sp_generate:"پیپر بنائیں",
  sp_saved:"پیپر محفوظ ہو گیا — پیپر جنریٹر کھولا جا رہا ہے…",
  sp_need_text:"پہلے کم از کم ایک صفحے کا متن شامل کریں۔", sp_need_title:"براہ کرم پیپر کا عنوان لکھیں۔",
  sp_need_counts:"کم از کم ایک سوال کی تعداد درج کریں۔",
  sp_max3:"صرف پہلی 3 تصاویر استعمال ہوں گی۔",
  sp_hint:"مشورہ: متن خود پیسٹ کریں تو مکمل آف لائن کام کرتا ہے۔",
  sp_type_mcq:"معروضی", sp_type_fillblank:"خالی جگہ", sp_type_truefalse:"صحیح/غلط", sp_type_short:"مختصر", sp_type_long:"تفصیلی",
});

var SP={imgs:[], texts:[], ocrBusy:false};
function spFmt(key,n){ return t(key).split('{n}').join(n); }

App.register('scanpaper',{titleKey:'nav_scanpaper', icon:'📸', roles:['superadmin','principal','teacher','exam'], render:function(el){
  var thumbs=SP.imgs.map(function(im,i){
    return '<div style="position:relative;display:inline-block;margin:4px"><img src="'+im.src+'" style="width:96px;height:96px;object-fit:cover;border-radius:10px;border:1px solid var(--line)">'
      +'<button class="btn btn-danger btn-sm" data-rm="'+i+'" style="position:absolute;top:2px;inset-inline-end:2px;padding:2px 8px">✕</button>'
      +'<div style="font-size:11px;text-align:center">'+spFmt('sp_page', i+1)+'</div></div>';
  }).join('');
  var areas=SP.imgs.map(function(im,i){
    return '<div class="form-group"><label>'+spFmt('sp_page', i+1)+'</label><textarea rows="4" data-tx="'+i+'" placeholder="'+esc(t('sp_paste_ph'))+'">'+esc(SP.texts[i]||'')+'</textarea></div>';
  }).join('');
  var types=['mcq','fillblank','truefalse','short','long'];
  el.innerHTML='<div class="card"><div class="form-group"><label>'+t('sp_upload')+'</label>'
    +'<input type="file" id="sp-file" accept="image/*" multiple></div>'
    +'<div id="sp-thumbs">'+thumbs+'</div>'
    +'<div class="btnrow"><button class="btn btn-orange" id="sp-ocr" '+(SP.ocrBusy||!SP.imgs.length?'disabled':'')+'>🔍 '+t('sp_extract')+'</button></div>'
    +'<div id="sp-prog" style="margin-top:6px;font-size:13px;color:var(--muted)"></div></div>'
    +'<div class="card">'+(areas||'<p style="color:var(--muted);font-size:13px">'+t('sp_hint')+'</p>')+'</div>'
    +'<div class="card"><div class="form-group"><label>'+t('sp_title')+'</label><input type="text" id="sp-title" placeholder="'+esc(t('sp_title_ph'))+'"></div>'
    +'<div class="form-group"><label>'+t('sp_total_marks')+'</label><input type="number" id="sp-marks" min="1" value="20" style="max-width:140px"></div>'
    +'<div class="form-group"><label>'+t('sp_qcounts')+'</label><div class="row">'
    +types.map(function(tp){return '<div class="form-group" style="min-width:90px"><label style="font-size:12px">'+t('sp_type_'+tp)+'</label><input type="number" min="0" value="0" data-sct="'+tp+'"></div>';}).join('')
    +'</div></div><div class="btnrow"><button class="btn btn-primary" id="sp-gen">⚡ '+t('sp_generate')+'</button></div></div>';

  document.getElementById('sp-file').onchange=function(e){
    var files=Array.prototype.slice.call(e.target.files||[]);
    if(files.length>3) App.toast(t('sp_max3'));
    files.slice(0,3).forEach(function(f){
      var r=new FileReader();
      r.onload=function(){ SP.imgs.push({src:r.result}); SP.texts.push(''); App.refresh(); };
      r.readAsDataURL(f);
    });
    e.target.value='';
  };
  el.querySelectorAll('button[data-rm]').forEach(function(b){
    b.onclick=function(){ var i=+b.dataset.rm; SP.imgs.splice(i,1); SP.texts.splice(i,1); App.refresh(); };
  });
  el.querySelectorAll('textarea[data-tx]').forEach(function(ta){
    ta.oninput=function(){ SP.texts[+ta.dataset.tx]=ta.value; };
  });
  document.getElementById('sp-ocr').onclick=spDoOCR;
  document.getElementById('sp-gen').onclick=spGenerate;
}});

function spLoadScript(src){
  return new Promise(function(res,rej){
    if(document.querySelector('script[src="'+src+'"]')){ res(); return; }
    var s=document.createElement('script'); s.src=src; s.onload=function(){res();}; s.onerror=function(){rej(new Error('cdn'));};
    document.head.appendChild(s);
    setTimeout(function(){rej(new Error('timeout'));},25000);
  });
}
async function spDoOCR(){
  var prog=document.getElementById('sp-prog');
  if(!SP.imgs.length||SP.ocrBusy) return;
  SP.ocrBusy=true;
  var btn=document.getElementById('sp-ocr'); if(btn) btn.disabled=true;
  function fail(){ if(prog) prog.innerHTML='<span class="badge b-orange">⚠️ '+t('sp_ocr_fail')+'</span>'; SP.ocrBusy=false; if(btn) btn.disabled=false; }
  try{
    if(prog) prog.textContent=t('sp_ocr_loading');
    if(!window.Tesseract) await spLoadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    if(!window.Tesseract) throw new Error('no tesseract');
    for(var i=0;i<SP.imgs.length;i++){
      if(prog) prog.textContent=spFmt('sp_ocr_page', i+1);
      var r=await window.Tesseract.recognize(SP.imgs[i].src, 'eng+urd');
      SP.texts[i]=((r&&r.data&&r.data.text)||'').trim();
      var ta=document.querySelector('textarea[data-tx="'+i+'"]'); if(ta) ta.value=SP.texts[i];
    }
    if(prog) prog.innerHTML='<span class="badge b-green">✓ '+t('sp_ocr_done')+'</span>';
  }catch(e){ fail(); return; }
  SP.ocrBusy=false; if(btn) btn.disabled=false;
}

/* local fallback if papers.js PaperGen is unavailable */
function spFallbackGenerate(text, counts, totalMarks){
  var qs=[], n=0;
  function add(type,txt,ans,marks){ qs.push({id:'sq_'+(n++), type:type, text:txt, answer:ans||'', marks:marks||2}); }
  var lines=String(text).split(/\n+/).map(function(s){return s.trim();}).filter(Boolean);
  var qlines=lines.filter(function(l){return /[?؟]\s*$/.test(l);});
  var sents=String(text).split(/(?<=[.!?۔؟])\s+/).map(function(s){return s.trim();}).filter(function(s){return s.length>25&&s.length<150;});
  var i;
  for(i=0;i<(counts.short||0);i++) if(qlines.length) add('short', qlines[i%qlines.length], '', 3);
  for(i=0;i<(counts.long||0);i++) if(lines.length) add('long', t('pp_tpl_long').split('{x}').join(lines[i%lines.length].slice(0,60)), '', 5);
  for(i=0;i<(counts.fillblank||0);i++) if(sents.length){ var s=sents[i%sents.length], w=(s.match(/[A-Za-z\u0600-\u06FF]{5,}/)||[])[0];
    add('fillblank', w?s.replace(w,'_____'):s, w||'', 1); }
  for(i=0;i<(counts.truefalse||0);i++) if(sents.length) add('truefalse', sents[i%sents.length], true, 1);
  for(i=0;i<(counts.mcq||0);i++) if(sents.length) add('fillblank', sents[i%sents.length], '', 1);
  return qs;
}

function spGenerate(){
  var title=document.getElementById('sp-title').value.trim();
  var text=SP.texts.map(function(x){return (x||'').trim();}).filter(Boolean).join('\n\n');
  if(!title){ App.toast(t('sp_need_title')); return; }
  if(!text){ App.toast(t('sp_need_text')); return; }
  var counts={}; document.querySelectorAll('input[data-sct]').forEach(function(i){counts[i.dataset.sct]=+i.value||0;});
  var tot=Object.keys(counts).reduce(function(s,k){return s+counts[k];},0);
  if(!tot){ App.toast(t('sp_need_counts')); return; }
  var totalMarks=+document.getElementById('sp-marks').value||20;
  var questions;
  if(window.PaperGen&&window.PaperGen.generate){
    var corpus=window.PaperGen.buildCorpus(text);
    questions=window.PaperGen.generate(corpus,{counts:counts, difficulty:'Mixed', totalMarks:totalMarks});
  } else {
    questions=spFallbackGenerate(text, counts, totalMarks);
  }
  DB.add('papers',{title:title, classId:'', subjectId:'', bookId:'', chapters:[], pages:SP.imgs.length+' 📸',
    totalMarks:totalMarks, timeAllowed:60, difficulty:'Mixed', questions:questions, source:'scanned', date:todayISO()});
  SP.imgs=[]; SP.texts=[];
  App.toast(t('sp_saved'));
  App.navigate('papers');
}
