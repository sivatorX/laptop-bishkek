// Builds the guide pages (SEO) from data/guides.js. Pure: text in, HTML text out, easy to test.
// Russian pages live in guide/, English ones in guide/en/. Each page links to its twin in the
// other language (hreflang), so Google shows the right language to each visitor.

export const SITE_URL = "https://sivatorx.github.io/laptop-bishkek/";
export const BOT_URL = "https://t.me/BishkekBuddyBot?start=guide"; // "guide" shows up in the bot's /stats

const LANGS = ["ru", "en"];

const TEXT = {
  ru: {
    locale: "ru_RU",
    home: "Главная",
    guide: "Гид по Бишкеку",
    hubTitle: "Гид по Бишкеку для гостей города",
    hubDescription: "Короткие ответы для гостей Бишкека: как доехать из аэропорта, транспорт, деньги, SIM-карта и что попробовать из еды.",
    hubIntro: "Короткие и честные ответы на первые вопросы в новом городе. Цены и правила меняются, поэтому мы пишем, где это проверить.",
    checked: "Проверено",
    checkNote: "Цены, часы работы и правила меняются. Перед поездкой уточните в 2GIS.",
    botTitle: "Остался вопрос?",
    botText: "Спросите нашего ИИ-гида в Telegram. Он отвечает как местный житель, на русском, английском и кыргызском. Например:",
    botButton: "🤖 Спросить в Telegram",
    more: "Ещё ответы",
    otherLang: "EN",
    otherLangLabel: "English version",
    footNote: "Сделано в Бишкеке 💙💗",
    laptop: "Кафе с Wi-Fi для работы",
  },
  en: {
    locale: "en_US",
    home: "Home",
    guide: "Bishkek guide",
    hubTitle: "Bishkek travel guide for visitors",
    hubDescription: "Short answers for visitors to Bishkek: getting from the airport, public transport, money, SIM cards and what to eat.",
    hubIntro: "Short, honest answers to your first questions in a new city. Prices and rules change, so we also say where to check them.",
    checked: "Checked",
    checkNote: "Prices, opening hours and rules change. Check in 2GIS before you go.",
    botTitle: "Still have a question?",
    botText: "Ask our AI guide in Telegram. It answers like a local, in English, Russian and Kyrgyz. For example:",
    botButton: "🤖 Ask in Telegram",
    more: "More answers",
    otherLang: "RU",
    otherLangLabel: "Русская версия",
    footNote: "Made in Bishkek 💙💗",
    laptop: "Cafes with Wi-Fi for work",
  },
};

const MONTHS = {
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

// "2026-11-13" -> "13 ноября 2026" / "13 November 2026"
export function formatDate(iso, lang) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[lang][month - 1]} ${year}`;
}

export function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

// Address of a page. slug = null means the list of all guides.
export function guidePath(lang, slug = null) {
  const folder = lang === "ru" ? "guide/" : "guide/en/";
  return folder + (slug ? `${slug}.html` : "");
}

export function guideUrl(lang, slug = null) {
  return SITE_URL + guidePath(lang, slug);
}

// Relative way back to the site root: guide/x.html -> "../", guide/en/x.html -> "../../"
function rootPrefix(lang) {
  return lang === "ru" ? "../" : "../../";
}

// The same page in the other language. From guide/: "en/x.html"; from guide/en/: "../x.html".
function otherLangHref(lang, slug) {
  const file = slug ? `${slug}.html` : "./";
  return lang === "ru" ? `en/${file}` : `../${file}`;
}

function head({ lang, slug, title, description, version, jsonLd, statsCode }) {
  const t = TEXT[lang];
  const root = rootPrefix(lang);
  const v = version ? `?v=${version}` : "";
  const alternates = LANGS.map((l) => `  <link rel="alternate" hreflang="${l}" href="${guideUrl(l, slug)}">`).join("\n");
  const stats = statsCode
    ? `\n  <!-- Visitor counter (GoatCounter). It does not count on localhost. -->\n  <script data-goatcounter="https://${statsCode}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`
    : "";
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} · Laptop Bishkek</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${guideUrl(lang, slug)}">
${alternates}
  <link rel="alternate" hreflang="x-default" href="${guideUrl("en", slug)}">
  <meta name="theme-color" content="#050a18">
  <link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Laptop Bishkek">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${guideUrl(lang, slug)}">
  <meta property="og:image" content="${SITE_URL}assets/og.png">
  <meta property="og:locale" content="${t.locale}">
  <meta name="twitter:card" content="summary_large_image">
  <!-- Same theme as the main page (saved choice, otherwise the phone's setting) -->
  <script>
    (() => {
      let saved = null;
      try { saved = localStorage.getItem("lb-theme"); } catch {}
      const light = saved ? saved === "light" : matchMedia("(prefers-color-scheme: light)").matches;
      document.documentElement.dataset.theme = light ? "light" : "dark";
    })();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Saira+Stencil+One&display=swap">
  <link rel="stylesheet" href="${root}style.css${v}">
  <link rel="stylesheet" href="${root}guide/guide.css${v}">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>${stats}
</head>`;
}

function header(lang, slug) {
  const t = TEXT[lang];
  return `<header class="top">
    <a class="logo" href="${rootPrefix(lang)}">
      <img src="${rootPrefix(lang)}assets/favicon.svg" alt="" width="36" height="36">
      Laptop <span>Bishkek</span>
    </a>
    <a class="icon-btn lang-btn guide-lang" href="${otherLangHref(lang, slug)}" hreflang="${lang === "ru" ? "en" : "ru"}" aria-label="${t.otherLangLabel}">${t.otherLang}</a>
  </header>`;
}

function botBox(lang, example) {
  const t = TEXT[lang];
  return `<aside class="guide-bot">
      <h2>${t.botTitle}</h2>
      <p>${t.botText}</p>
      <p class="guide-bot-example">${lang === "ru" ? "«" : "“"}${escapeHtml(example)}${lang === "ru" ? "»" : "”"}</p>
      <a class="btn-primary btn-link" href="${BOT_URL}" target="_blank" rel="noopener">${t.botButton}</a>
    </aside>`;
}

function guideList(lang, guides, skipSlug = null) {
  return guides
    .filter((g) => g.slug !== skipSlug)
    .map((g) => `<li><a href="${g.slug}.html"><span aria-hidden="true">${g.emoji}</span> ${escapeHtml(g[lang].title)}</a></li>`)
    .join("\n        ");
}

function footer(lang) {
  const t = TEXT[lang];
  return `<footer class="foot">
    <p class="foot-logo">Laptop <span>Bishkek</span></p>
    <p><a href="${rootPrefix(lang)}">${t.laptop}</a> · <a href="./">${t.guide}</a> · <a href="${BOT_URL}" target="_blank" rel="noopener">@BishkekBuddyBot</a></p>
    <p>${t.footNote}</p>
  </footer>`;
}

// One guide page, e.g. guide/airport.html
export function renderGuidePage(guide, lang, { guides, checked, version = "", statsCode = "" }) {
  const t = TEXT[lang];
  const page = guide[lang];
  const site = rootPrefix(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    inLanguage: lang,
    dateModified: checked,
    url: guideUrl(lang, guide.slug),
    image: `${SITE_URL}assets/og.png`,
    author: { "@type": "Organization", name: "Laptop Bishkek", url: SITE_URL },
  };
  const sections = page.sections
    .map((s) => `<section>
      <h2>${escapeHtml(s.h)}</h2>
      ${s.html.replaceAll("{site}", site)}
    </section>`)
    .join("\n    ");
  return `${head({ lang, slug: guide.slug, title: page.title, description: page.description, version, jsonLd, statsCode })}
<body>
  ${header(lang, guide.slug)}

  <main class="guide">
    <nav class="guide-crumbs" aria-label="breadcrumbs">
      <a href="${site}">${t.home}</a> › <a href="./">${t.guide}</a>
    </nav>
    <p class="guide-emoji" aria-hidden="true">${guide.emoji}</p>
    <h1>${escapeHtml(page.title)}</h1>
    <p class="guide-lead">${escapeHtml(page.intro)}</p>
    <p class="guide-checked">📅 ${t.checked}: <time datetime="${checked}">${formatDate(checked, lang)}</time>. ${t.checkNote}</p>

    ${sections}

    ${botBox(lang, page.ask)}

    <nav class="guide-more">
      <h2>${t.more}</h2>
      <ul>
        ${guideList(lang, guides, guide.slug)}
      </ul>
    </nav>
  </main>

  ${footer(lang)}
</body>
</html>
`;
}

// List of all guides, e.g. guide/index.html
export function renderGuideIndex(lang, { guides, checked, version = "", statsCode = "" }) {
  const t = TEXT[lang];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.hubTitle,
    url: guideUrl(lang),
    itemListElement: guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: guideUrl(lang, g.slug), name: g[lang].title })),
  };
  return `${head({ lang, slug: null, title: t.hubTitle, description: t.hubDescription, version, jsonLd, statsCode })}
<body>
  ${header(lang, null)}

  <main class="guide">
    <nav class="guide-crumbs" aria-label="breadcrumbs">
      <a href="${rootPrefix(lang)}">${t.home}</a>
    </nav>
    <p class="guide-emoji" aria-hidden="true">🧭</p>
    <h1>${t.hubTitle}</h1>
    <p class="guide-lead">${t.hubIntro}</p>
    <p class="guide-checked">📅 ${t.checked}: <time datetime="${checked}">${formatDate(checked, lang)}</time>.</p>

    <nav class="guide-more guide-hub">
      <ul>
        ${guideList(lang, guides)}
      </ul>
    </nav>

    ${botBox(lang, guides[0][lang].ask)}
  </main>

  ${footer(lang)}
</body>
</html>
`;
}

// sitemap.xml: the main pages plus every guide in both languages
export function sitemapXml(guides, { today, checked }) {
  const urls = [
    { loc: SITE_URL, lastmod: today },
    { loc: `${SITE_URL}qr.html`, lastmod: "2026-11-02" },
    ...LANGS.flatMap((lang) => [
      { loc: guideUrl(lang), lastmod: checked },
      ...guides.map((g) => ({ loc: guideUrl(lang, g.slug), lastmod: checked })),
    ]),
  ];
  const items = urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Site map for Google: the list of pages. Give its address to Google Search Console. Made by npm run guides. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;
}
