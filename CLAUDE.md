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
- Language: Russian first; Kyrgyz and English later.

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
- GitHub CLI (not on PATH): `/c/Users/armin/AppData/Local/Microsoft/WinGet/Packages/GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe/bin/gh.exe` (logged in as sivatorX).
- Hosting for v1: GitHub Pages (free, static), like neon-weather.
- Always say what you checked before saying something works.

## Roadmap
1. ✅ Project folder and CLAUDE.md (2026-10-31).
2. ✅ 11 places found by Claude from reviews (2026-10-31): `data/places.js`. Nothing measured yet; unknown = null, shown as "не проверено". Coords from OpenStreetMap; Бублик, Технопарк, Sabi have none yet, Collab is approximate.
3. ✅ First version (2026-10-31): `index.html`, `app.js`, `filters.js` (pure, tested), `style.css`, dark + light theme. `npm start` → http://localhost:5173, `npm test`.
4. ⬜ Author visits 3–4 cafes, measures Wi-Fi, films the first Instagram Reel.
5. ⬜ Publish on GitHub Pages, share the link, watch the interest.
6. Later: map, database, reviews, Telegram Mini App, payments, other cities.
