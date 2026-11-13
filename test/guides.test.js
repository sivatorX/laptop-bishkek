import { test } from "node:test";
import assert from "node:assert/strict";
import { GUIDES, CHECKED } from "../data/guides.js";
import {
  renderGuidePage, renderGuideIndex, sitemapXml, guidePath, guideUrl, formatDate, escapeHtml, BOT_URL,
} from "../guides.js";

const options = { guides: GUIDES, checked: CHECKED, version: "1", statsCode: "laptopbishkek" };

test("guides: every guide has Russian and English texts", () => {
  const slugs = new Set();
  for (const g of GUIDES) {
    assert.match(g.slug, /^[a-z-]+$/, "slug: small latin letters and dashes (it is the page address)");
    assert.ok(!slugs.has(g.slug), `slug ${g.slug} is used twice`);
    slugs.add(g.slug);
    for (const lang of ["ru", "en"]) {
      const page = g[lang];
      assert.ok(page, `${g.slug}: no ${lang}`);
      assert.ok(page.title && page.intro && page.ask, `${g.slug}/${lang}: title, intro and ask are needed`);
      // Google shows about 155–160 characters of the description
      assert.ok(page.description.length >= 70 && page.description.length <= 165, `${g.slug}/${lang}: description is ${page.description.length} chars`);
      assert.ok(page.sections.length >= 3, `${g.slug}/${lang}: at least 3 sections`);
    }
    assert.equal(g.ru.sections.length, g.en.sections.length, `${g.slug}: same number of sections in ru and en`);
  }
});

test("guides: links between guides point to existing pages", () => {
  const slugs = GUIDES.map((g) => g.slug);
  for (const g of GUIDES) {
    for (const lang of ["ru", "en"]) {
      for (const s of g[lang].sections) {
        for (const [, file] of s.html.matchAll(/href="([\w-]+)\.html"/g)) {
          assert.ok(slugs.includes(file), `${g.slug}/${lang}: link to a missing guide ${file}.html`);
        }
      }
    }
  }
});

test("guides: a page has SEO tags, both languages and the bot link", () => {
  const html = renderGuidePage(GUIDES[0], "ru", options);
  assert.match(html, /<html lang="ru">/);
  assert.ok(html.includes(`<link rel="canonical" href="${guideUrl("ru", GUIDES[0].slug)}">`));
  assert.ok(html.includes(`hreflang="en" href="${guideUrl("en", GUIDES[0].slug)}"`));
  assert.ok(html.includes(`hreflang="x-default"`));
  assert.ok(html.includes(BOT_URL));
  assert.ok(html.includes('"@type":"Article"'));
  assert.ok(html.includes("laptopbishkek.goatcounter.com"));
  assert.ok(html.includes('href="../style.css?v=1"'));
  assert.ok(!html.includes("{site}"), "the {site} placeholder must be replaced");
  assert.equal((html.match(/<h1>/g) ?? []).length, 1, "one h1 per page");
});

test("guides: English pages sit one folder deeper", () => {
  const html = renderGuidePage(GUIDES[0], "en", options);
  assert.match(html, /<html lang="en">/);
  assert.ok(html.includes('href="../../style.css?v=1"'));
  assert.ok(html.includes(`href="../${GUIDES[0].slug}.html"`), "link to the Russian twin");
  assert.equal(guidePath("en", "x"), "guide/en/x.html");
  assert.equal(guidePath("ru"), "guide/");
});

test("guides: the index lists every guide, other pages skip themselves", () => {
  const index = renderGuideIndex("en", options);
  for (const g of GUIDES) assert.ok(index.includes(`href="${g.slug}.html"`));
  const page = renderGuidePage(GUIDES[1], "en", options);
  assert.ok(!page.includes(`<li><a href="${GUIDES[1].slug}.html"`));
});

test("guides: sitemap has the main page and every guide in both languages", () => {
  const xml = sitemapXml(GUIDES, { today: "2026-11-13", checked: CHECKED });
  const count = (xml.match(/<loc>/g) ?? []).length;
  assert.equal(count, 2 + 2 * (GUIDES.length + 1));
  assert.ok(xml.includes(`<loc>${guideUrl("en", "airport")}</loc>`));
});

test("guides: dates and escaping", () => {
  assert.equal(formatDate("2026-11-13", "ru"), "13 ноября 2026");
  assert.equal(formatDate("2026-01-05", "en"), "5 January 2026");
  assert.equal(escapeHtml('a<b>"c"&'), "a&lt;b&gt;&quot;c&quot;&amp;");
});
