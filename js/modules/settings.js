Object.assign(I18N.en, {
  se_profile: "School Profile",
  se_logo_preview: "Logo preview",
  se_pins: "Change PINs",
  se_pin_sa: "Super Admin PIN", se_pin_pr: "Principal PIN", se_pin_te: "Teacher PIN", se_pin_ex: "Exam Staff PIN",
  se_pin_hint: "Leave a field empty to keep its current PIN. New PINs must be at least 4 characters.",
  se_pin_error: "Each new PIN must be at least 4 characters long.",
  se_ai: "AI Settings",
  se_ai_key: "AI API Key",
  se_ai_endpoint: "API Endpoint",
  se_ai_test: "Test Connection",
  se_ai_testing: "Testing…",
  se_ai_ok: "✓ AI connection works",
  se_ai_fail: "AI connection failed — check the key and your internet.",
  se_ai_nokey: "Enter an API key first.",
  se_ai_offline: "You are offline — connect to the internet to test.",
  se_backup: "Backup & Restore",
  se_export: "Export Backup",
  se_import: "Import Backup",
  se_import_ok: "Backup imported successfully.",
  se_import_fail: "Could not import — invalid backup file.",
  se_demo: "Demo Data",
  se_demo_info: "Demo records are clearly marked and safe to remove.",
  se_demo_delete: "Delete Demo Data",
  se_about: "About",
  se_desc: "AI School Management & Academic Assistant — manage students, fees, attendance, books, syllabus, papers and results, all in one place.",
  se_version: "Version",
  se_offline: "Works fully offline — all data stays on this device."
});
Object.assign(I18N.ur, {
  se_profile: "اسکول پروفائل",
  se_logo_preview: "لوگو کا پیش نظارہ",
  se_pins: "پن تبدیل کریں",
  se_pin_sa: "سپر ایڈمن پن", se_pin_pr: "پرنسپل پن", se_pin_te: "استاد پن", se_pin_ex: "امتحانی عملہ پن",
  se_pin_hint: "موجودہ پن رکھنے کے لیے خانہ خالی چھوڑ دیں۔ نیا پن کم از کم 4 حروف کا ہو۔",
  se_pin_error: "ہر نیا پن کم از کم 4 حروف کا ہونا چاہیے۔",
  se_ai: "اے آئی سیٹنگز",
  se_ai_key: "اے آئی اے پی آئی کی",
  se_ai_endpoint: "اے پی آئی اینڈ پوائنٹ",
  se_ai_test: "کنکشن ٹیسٹ کریں",
  se_ai_testing: "ٹیسٹ ہو رہا ہے…",
  se_ai_ok: "✓ اے آئی کنکشن درست ہے",
  se_ai_fail: "اے آئی کنکشن ناکام — کی اور انٹرنیٹ چیک کریں۔",
  se_ai_nokey: "پہلے اے پی آئی کی درج کریں۔",
  se_ai_offline: "آپ آف لائن ہیں — ٹیسٹ کے لیے انٹرنیٹ سے جڑیں۔",
  se_backup: "بیک اپ اور ریسٹور",
  se_export: "بیک اپ ایکسپورٹ",
  se_import: "بیک اپ امپورٹ",
  se_import_ok: "بیک اپ کامیابی سے امپورٹ ہو گیا۔",
  se_import_fail: "امپورٹ نہیں ہو سکا — فائل درست نہیں۔",
  se_demo: "ڈیمو ڈیٹا",
  se_demo_info: "ڈیمو ریکارڈ نشان زد ہیں اور محفوظ طریقے سے حذف کیے جا سکتے ہیں۔",
  se_demo_delete: "ڈیمو ڈیٹا حذف کریں",
  se_about: "ایپ کے بارے میں",
  se_desc: "اے آئی اسکول مینجمنٹ اور اکیڈمک اسسٹنٹ — طلبہ، فیس، حاضری، کتب، نصاب، پیپرز اور نتائج، سب ایک جگہ۔",
  se_version: "ورژن",
  se_offline: "مکمل آف لائن کام کرتا ہے — تمام ڈیٹا اسی ڈیوائس پر رہتا ہے۔"
});

App.register('settings', {
  titleKey: 'nav_settings',
  icon: '⚙️',
  roles: ['superadmin', 'principal'],
  render(el){
    const meta = DB.meta();
    const settings = DB.settings();

    el.innerHTML =
      /* 1. School profile */
      '<div class="card"><h3>🏫 ' + esc(t('se_profile')) + '</h3>' +
      '<div class="form-group"><label>' + esc(t('wz_school')) + '</label>' +
      '<input type="text" id="se-name" value="' + esc(meta.name || '') + '" placeholder="' + esc(t('ph_school_name')) + '"></div>' +
      '<div class="form-group"><label>' + esc(t('wz_logo')) + '</label>' +
      '<input type="file" id="se-logo" accept="image/*">' +
      (meta.logo ? '<img id="se-logo-prev" src="' + meta.logo + '" alt="" style="max-width:120px;max-height:120px;border-radius:12px;display:block;margin-top:8px">' : '<img id="se-logo-prev" alt="" style="display:none;max-width:120px;max-height:120px;border-radius:12px;margin-top:8px">') +
      '</div>' +
      '<div class="form-group"><label>' + esc(t('wz_session')) + '</label>' +
      '<input type="text" id="se-session" value="' + esc(meta.session || '') + '" placeholder="' + esc(t('ph_session')) + '"></div>' +
      '<div class="btnrow"><button class="btn btn-primary" id="se-save-profile">' + esc(t('btn_save')) + '</button></div></div>' +

      /* 2. Change PINs */
      '<div class="card"><h3>🔑 ' + esc(t('se_pins')) + '</h3>' +
      '<p style="color:var(--muted);font-size:13px">' + esc(t('se_pin_hint')) + '</p>' +
      '<div class="row">' +
      '<div class="form-group"><label>' + esc(t('se_pin_sa')) + '</label><input type="password" id="se-pin-sa" inputmode="numeric" maxlength="8" autocomplete="new-password"></div>' +
      '<div class="form-group"><label>' + esc(t('se_pin_pr')) + '</label><input type="password" id="se-pin-pr" inputmode="numeric" maxlength="8" autocomplete="new-password"></div>' +
      '<div class="form-group"><label>' + esc(t('se_pin_te')) + '</label><input type="password" id="se-pin-te" inputmode="numeric" maxlength="8" autocomplete="new-password"></div>' +
      '<div class="form-group"><label>' + esc(t('se_pin_ex')) + '</label><input type="password" id="se-pin-ex" inputmode="numeric" maxlength="8" autocomplete="new-password"></div>' +
      '</div>' +
      '<div class="btnrow"><button class="btn btn-primary" id="se-save-pins">' + esc(t('btn_save')) + '</button></div></div>' +

      /* 3. AI settings */
      '<div class="card"><h3>🤖 ' + esc(t('se_ai')) + '</h3>' +
      '<div class="form-group"><label>' + esc(t('se_ai_key')) + '</label>' +
      '<input type="password" id="se-aikey" value="' + esc(settings.aiKey || '') + '" autocomplete="off"></div>' +
      '<div class="form-group"><label>' + esc(t('se_ai_endpoint')) + '</label>' +
      '<input type="text" id="se-aiendpoint" value="' + esc(settings.aiEndpoint || '') + '" placeholder="https://api.openai.com/v1/chat/completions" autocomplete="off"></div>' +
      '<div class="btnrow"><button class="btn btn-navy" id="se-save-ai">' + esc(t('btn_save')) + '</button>' +
      '<button class="btn btn-ghost" id="se-test-ai">' + esc(t('se_ai_test')) + '</button></div></div>' +

      /* 4. Backup */
      '<div class="card"><h3>💾 ' + esc(t('se_backup')) + '</h3>' +
      '<div class="btnrow"><button class="btn btn-green" id="se-export">⬇ ' + esc(t('se_export')) + '</button>' +
      '<button class="btn btn-orange" id="se-import-btn">⬆ ' + esc(t('se_import')) + '</button>' +
      '<input type="file" id="se-import-file" accept=".json,application/json" style="display:none"></div></div>' +

      /* 5. Demo data */
      '<div class="card"><h3>🧪 ' + esc(t('se_demo')) + '</h3>' +
      '<p style="color:var(--muted);font-size:13px">' + esc(t('se_demo_info')) + '</p>' +
      '<div class="btnrow"><button class="btn btn-danger" id="se-clear-demo">' + esc(t('se_demo_delete')) + '</button></div></div>' +

      /* 6. About */
      '<div class="card"><h3>ℹ️ ' + esc(t('se_about')) + '</h3>' +
      '<p><b>' + esc(t('app_name')) + '</b> — ' + esc(t('se_version')) + ' 1.0</p>' +
      '<p style="color:var(--muted);font-size:13.5px">' + esc(t('se_desc')) + '</p>' +
      '<p style="font-size:13.5px">📴 ' + esc(t('se_offline')) + '</p></div>';

    const v = id => { const e = document.getElementById(id); return e ? e.value.trim() : ''; };

    /* 1. profile */
    let pendingLogo = null;
    const logoInput = document.getElementById('se-logo');
    logoInput.onchange = () => {
      const f = logoInput.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        pendingLogo = r.result;
        const prev = document.getElementById('se-logo-prev');
        prev.src = pendingLogo;
        prev.style.display = 'block';
      };
      r.readAsDataURL(f);
    };
    document.getElementById('se-save-profile').onclick = () => {
      const name = v('se-name');
      if (!name){ App.toast(t('msg_required')); return; }
      const m = DB.meta();
      m.name = name;
      m.session = v('se-session');
      if (pendingLogo) m.logo = pendingLogo;
      DB.save();
      App.toast(t('msg_saved'));
      App.refresh();
    };

    /* 2. PINs */
    document.getElementById('se-save-pins').onclick = () => {
      const map = [['se-pin-sa','superadmin'],['se-pin-pr','principal'],['se-pin-te','teacher'],['se-pin-ex','exam']];
      const pins = DB.meta().pins = DB.meta().pins || {};
      const updates = {};
      for (const [id, role] of map){
        const val = v(id);
        if (val){
          if (val.length < 4){ App.toast(t('se_pin_error')); return; }
          updates[role] = val;
        }
      }
      Object.assign(pins, updates);
      DB.save();
      App.toast(t('msg_saved'));
      App.refresh();
    };

    /* 3. AI settings */
    document.getElementById('se-save-ai').onclick = () => {
      const s = DB.settings();
      s.aiKey = v('se-aikey');
      s.aiEndpoint = v('se-aiendpoint');
      DB.save();
      App.toast(t('msg_saved'));
    };
    document.getElementById('se-test-ai').onclick = async () => {
      if (!navigator.onLine){ App.toast(t('se_ai_offline')); return; }
      const key = v('se-aikey');
      if (!key){ App.toast(t('se_ai_nokey')); return; }
      const ep = v('se-aiendpoint') || 'https://api.openai.com/v1/chat/completions';
      App.toast(t('se_ai_testing'));
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      try {
        const r = await fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
          body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 5, messages: [{ role: 'user', content: 'Reply with OK' }] }),
          signal: ctrl.signal
        });
        let ok = false;
        if (r.ok){
          const j = await r.json();
          ok = !!(j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content);
        }
        App.toast(t(ok ? 'se_ai_ok' : 'se_ai_fail'));
      } catch (e) {
        App.toast(t('se_ai_fail'));
      } finally {
        clearTimeout(timer);
      }
    };

    /* 4. Backup */
    document.getElementById('se-export').onclick = () => {
      App.download('school-backup-' + todayISO() + '.json', DB.exportAll(), 'application/json');
    };
    const importFile = document.getElementById('se-import-file');
    document.getElementById('se-import-btn').onclick = () => importFile.click();
    importFile.onchange = () => {
      const f = importFile.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          DB.importAll(r.result);
          App.toast(t('se_import_ok'));
          App.refresh();
        } catch (e) {
          App.toast(t('se_import_fail'));
        }
        importFile.value = '';
      };
      r.readAsText(f);
    };

    /* 5. Demo data */
    document.getElementById('se-clear-demo').onclick = async () => {
      if (await App.confirm(t('msg_confirm_delete'))){
        Seed.clearDemo();
        App.toast(t('msg_deleted'));
        App.refresh();
      }
    };
  }
});
