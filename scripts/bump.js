// Run before every publish: `npm run bump`.
// Why: browsers keep site files for up to 10 minutes (GitHub Pages cache). Right after an update,
// a visitor could get the NEW page with OLD scripts, and the page breaks.
// This adds a fresh "?v=<time>" to every local script and style link, so the browser sees new
// addresses and downloads the new files at once.
import { readFileSync, writeFileSync } from "node:fs";

const version = new Date().toISOString().slice(0, 16).replace(/\D/g, ""); // e.g. 202611021530

const FILES = [
  "index.html", "qr.html",
  "app.js", "qr.js", "map.js", "stats.js", "i18n.js", "filters.js", "feedback.js", "suggest.js", "seo.js", "config.js",
  "favorites.js", "effects.js", "data/places.js", "data/places-en.js",
];

let changed = 0;
for (const file of FILES) {
  const before = readFileSync(file, "utf8");
  const after = before
    // import ... from "./x.js" or "./x.js?v=old"
    .replace(/(from\s+"\.{1,2}\/[^"?]+\.js)(\?v=\w+)?"/g, `$1?v=${version}"`)
    // <script src="app.js"> and <link href="style.css"> in the HTML pages
    .replace(/((?:src|href)="(?!https?:)[\w/-]+\.(?:js|css))(\?v=\w+)?"/g, `$1?v=${version}"`);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}
console.log(`Version ${version}: updated ${changed} files`);
