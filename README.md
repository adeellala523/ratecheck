# AI School Management & Academic Assistant

Static web app for Pakistani schools — books, syllabus, papers, checking, results,
attendance, fees, notices, AI expert. English + Urdu, works offline, PWA-ready.

## Deploy (Hostinger shared hosting, e.g. ratecheck.online)

1. Upload the **contents** of this folder (`index.html`, `css/`, `js/`, `manifest.json`,
   `sw.js`, `icon.svg`) into `public_html/` via hPanel File Manager.
2. Open the domain — the first-run wizard creates the school (name, logo, session, PINs).
3. Each school/device keeps its own separate data (localStorage). Use
   Settings → Backup to export/import JSON between devices.

No build step, no server code, no database needed. Optional CDN libraries
(pdf.js for book text extraction, tesseract.js for OCR) load on demand and fail
gracefully offline.

## First-run PINs

Set during the setup wizard (Super Admin / Principal / Teacher / Exam Staff).
Demo data is seeded on first run and can be deleted from Settings.

## Structure

- `index.html` — app shell + script includes
- `css/style.css` — theme (navy/blue/green/orange), mobile-first, RTL support
- `js/i18n.js` — English/Urdu dictionary (`t()`), modules merge their own keys
- `js/store.js` — `DB` localStorage store, one namespace per school (`sams_<id>`)
- `js/app.js` — boot, wizard, login, shell/router, print, toast, modal
- `js/seed.js` — demo seed data (deletable)
- `js/modules/*.js` — 13 feature modules, each `App.register(id, {titleKey, icon, roles, render})`
- `manifest.json`, `sw.js`, `icon.svg` — PWA installability + offline app-shell cache
