# Laptop Bishkek: project guide for Claude

## What this project is
A **website** (later a **Telegram Mini App**) that rates cafes and coworkings in Bishkek for working with a laptop.
It is the author's **fourth project** ("level 4"). Earlier projects:
- Level 1: Battleship game https://github.com/sivatorX/neon-armada
- Level 2: Weather app https://github.com/sivatorX/neon-weather (`C:\Users\armin\Desktop\Weather`, neon style comes from its `style.css`)
- Level 3: Outfit Weather, a ChatGPT plugin (`C:\Users\armin\Desktop\OutfitWeather`)

**Idea:** the Nomad List pattern (levelsio): start with a simple list of 10–30 places, check that people care, then grow.
**Main goal:** the author's own product, not only learning. Instagram Reels ("top cafes with fast Wi-Fi") bring the first visitors.

## Product
- **Place card:** name, Wi-Fi speed (measured on the spot: download/upload Mbps + date of the test), sockets (yes/few/no), noise (quiet/medium/loud), coffee price (som), opening hours, address + link to the map (2GIS / Google Maps), photo.
- **Filters:** quiet, sockets, open late, near me (browser geolocation, only after the user agrees).
- **v1:** one static page, places stored in a data file (`data/places.js` or JSON). No server, no database.
- **Later:** database, map, reviews and accounts, React, payments (cafes pay for promotion / "verified" badge), Almaty and Tashkent.
- Language: Russian + English (since 2026-11-02, RU/EN button). Kyrgyz maybe later.
  - Language is picked in the `<head>` script of `index.html`: saved `lb-lang`, else Russian for ru/ky/kk/uz/… browsers, else English. Written to `<html lang>`.
  - `i18n.js`: `T` (texts made by JS, ru+en, use `t("key")`), `PAGE_EN` (English for texts in index.html, marked with `data-i18n`, `data-i18n-html`, `data-i18n-placeholder`, `data-i18n-aria`).
  - `data/places-en.js`: English address/notes/names per place id. **A new place needs an entry there too** (a test checks it).
  - Emails to the author (Formspree) stay in Russian, with a `lang` field.

## Style (same as neon-weather and Outfit Weather)
- Dark background, neon blue `#3ad8ff`, neon pink `#ff2e88`, glow effects.
- A light theme too (toggle, remember the choice in `localStorage`, respect `prefers-color-scheme`).
- Mobile first: most visitors come from Instagram on a phone.

## About the author (important)
- A beginner who wants to become a professional developer. **Teach, don't just code.**
- **Always answer in Russian.** Simple words, short sentences, step by step, real-life examples. Code and names stay in English.
- Explain each new idea (geolocation, JSON, filters, hosting, Telegram Mini App) in 1–3 simple sentences the first time.
- Modes: "Сделаю сам" (one small step at a time, then check) or "Сделай сам" (write, test, then explain). Ask which one at the start of a task.
- Edits in **Cursor**; unsaved changes there can overwrite files on disk.

## Tech choices
- v1: plain HTML + CSS + JavaScript (ES modules), no frameworks, no build step.
- Keep data separate from code: places in one data file, the filter logic pure (easy to test).
- Never put secret keys in the repo. Never collect location without asking.

## Code style
- 2-space indent, `const`/`let`, no `var`, clear English names, short "why" comments.
- Use CSS variables for colors (`--neon`, `--pink`) so both themes work.

## Workflow
- Small steps; commit after each finished step. git works only in **bash**, not PowerShell.
- **Before every publish run `npm run bump`** (`scripts/bump.js`): it adds a fresh `?v=<time>` to all local script/style links. Without it, visitors who opened the site in the last 10 min can get the new page with old cached scripts, and the page breaks (empty list).
- GitHub CLI (not on PATH): `/c/Users/armin/AppData/Local/Microsoft/WinGet/Packages/GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe/bin/gh.exe` (logged in as sivatorX).
- Hosting for v1: GitHub Pages (free, static), like neon-weather.
- Always say what you checked before saying something works.

## Roadmap
1. ✅ Project folder and CLAUDE.md (2026-10-31).
2. ✅ 11 places found by Claude from reviews (2026-10-31): `data/places.js`. Nothing measured yet; unknown = null, shown as "не проверено". Online check the same day: hours, addresses, coords from 2GIS; cappuccino prices from Glovo delivery menus (marked as such). Coldo hub removed (it is on Issyk-Kul). Now 10 places.
3. ✅ First version (2026-10-31): `index.html`, `app.js`, `filters.js` (pure, tested), `style.css`, dark + light theme. `npm start` → http://localhost:5173, `npm test`.
3b. ✅ Visitor speed form (2026-10-31): "📶 Сообщить скорость Wi-Fi" on every card → popup (download speed required; upload, rating, comment optional). `feedback.js` (validation tested), `config.js` `SUBMIT_URL` = where reviews go. = Formspree `https://formspree.io/f/meaarogg` (connected 2026-10-31, free plan: 50 submissions/month; reports are emailed to the author; `_subject` = place + speed). Cyrillic test via curl in Git Bash fails (console encoding); test with node instead. Link `#wifi=<place id>` opens the form (for QR codes on cafe tables).
4. ⬜ Author visits 3–4 cafes, measures Wi-Fi, films the first Instagram Reel.
5. 🟡 Published 2026-10-31: https://sivatorx.github.io/laptop-bishkek/ (repo `sivatorX/laptop-bishkek`, public, Pages from `main` /). Every push to `main` updates the site in ~1–2 min. Creating public repos is blocked by the auto-mode safety check: the author runs such commands with `!`. Still to do: visitor counter, share the link, watch the interest.
   Also done: "Открыто сейчас" filter + status (Bishkek time, `closedDays`), sort by measured speed, 🏆 fastest badge.
   2026-10-31 later: new hero + stats, favicon, link preview `assets/og.png` (source `assets/og-source.html`), map view (`map.js`, Leaflet loaded on demand, OpenStreetMap tiles with a CSS night filter; CARTO needs an API key now), share button, search, "Предложить место" form (`suggest.js`, sent to the same Formspree with `kind: "new-place"`).
   2026-11-01: visitor counter on (GoatCounter `laptopbishkek`, https://laptopbishkek.goatcounter.com).
   2026-11-02: Google basics (better title/description, canonical, `sitemap.xml`, places described for Google in `seo.js` as JSON-LD); `qr.html` + `qr.js` = printable QR stickers for cafe tables (QR pictures from api.qrserver.com; `qr.html?place=<id>` = 4 stickers of one place on A4). The author said no to an installable app (PWA).
   2026-11-02 later: 7 new places (17 total): Adriano Coffee (Чуй 127), Aldo Coffee (Анкара 19 = old Горького), Capito (Турусбекова 100), ololoErkindik, free Beeline coworking (library №9, Чуй 111, weekdays), National library, Bayalinov library. From the-tech.kz reviews (Feb 2025); addresses + coords from OpenStreetMap (Nominatim; 2GIS blocks automatic requests now). Skipped: Zerno, Biscuit (address not confirmed), Michelle, Flask, Clever, Traveler's (no address).
   2026-11-02 later: "💸 Бесплатно" filter (`free: true` in places.js: 3 libraries + Beeline coworking), detailed open status (`openInfo` in filters.js: "Открыто до 23:00" / "Закроется через 40 мин" / "Откроется завтра в 08:00"), Google Maps link (main address button = 2GIS in RU, Google Maps in EN; the other one is a small link under it), stats tiles in one row on phones, `npm run bump` cache fix.
   2026-11-02 evening, features to make people come back: ❤️ favorites (`favorites.js`, localStorage `lb-favorites`, chip "Мои места"), 🎲 "Куда пойти сейчас?" (`pickPlace` in filters.js: open now, nearest 3 if location is on, measured Wi-Fi first), 🆕 badge for 14 days (`added: "YYYY-MM-DD"` in places.js, `isNew`). GoatCounter events: fav-add/<id>, fav-remove/<id>, pick, lang/<x>.
   Handy links: `#map` (map), `#suggest` (suggest a place), `#place=<id>` (one card), `#wifi=<id>` (speed form, for QR codes).
6. Later: map, database, reviews, Telegram Mini App, payments, other cities.
