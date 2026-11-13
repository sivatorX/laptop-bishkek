// `npm run guides`: writes the guide pages (guide/*.html, guide/en/*.html) and sitemap.xml
// from data/guides.js. Run it after changing the guide texts, then `npm run bump` and publish.
import { mkdirSync, writeFileSync } from "node:fs";
import { GUIDES, CHECKED } from "../data/guides.js";
import { GOATCOUNTER_CODE } from "../config.js";
import { renderGuidePage, renderGuideIndex, guidePath, sitemapXml } from "../guides.js";

const version = new Date().toISOString().slice(0, 16).replace(/\D/g, ""); // same format as npm run bump
const options = { guides: GUIDES, checked: CHECKED, version, statsCode: GOATCOUNTER_CODE };

mkdirSync("guide/en", { recursive: true });

let pages = 0;
for (const lang of ["ru", "en"]) {
  writeFileSync(guidePath(lang) + "index.html", renderGuideIndex(lang, options));
  pages++;
  for (const guide of GUIDES) {
    writeFileSync(guidePath(lang, guide.slug), renderGuidePage(guide, lang, options));
    pages++;
  }
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync("sitemap.xml", sitemapXml(GUIDES, { today, checked: CHECKED }));

console.log(`Guides: wrote ${pages} pages and sitemap.xml`);
