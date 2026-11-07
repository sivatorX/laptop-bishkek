// Two languages: Russian (ru) and English (en).
// The language is chosen in index.html before the page draws (saved choice, or the browser language)
// and written to <html lang="...">. Here: all texts for both languages + helpers.

// Texts made by JavaScript (cards, messages). {name} = a value put in later.
export const T = {
  "type.cafe": { ru: "Кафе", en: "Cafe" },
  "type.coworking": { ru: "Коворкинг", en: "Coworking" },
  "type.library": { ru: "Библиотека", en: "Library" },
  "sockets.yes": { ru: "есть", en: "yes" },
  "sockets.some": { ru: "есть, но не везде", en: "some, not everywhere" },
  "sockets.no": { ru: "нет", en: "no" },
  "noise.quiet": { ru: "тихо", en: "quiet" },
  "noise.medium": { ru: "средне", en: "medium" },
  "noise.loud": { ru: "шумно", en: "loud" },
  unknown: { ru: "не проверено", en: "not checked" },
  allDay: { ru: "круглосуточно", en: "24/7" },
  mbps: { ru: "Мбит/с", en: "Mbps" },
  som: { ru: "сом", en: "som" },
  m: { ru: "м", en: "m" },
  km: { ru: "км", en: "km" },
  measured: { ru: "замер {date}", en: "tested {date}" },
  notMeasured: { ru: "ещё не замеряли", en: "not tested yet" },
  notMeasuredWifi: { ru: "Wi-Fi ещё не замеряли", en: "Wi-Fi not tested yet" },
  sockets: { ru: "Розетки", en: "Sockets" },
  noise: { ru: "Шум", en: "Noise" },
  cappuccino: { ru: "Капучино", en: "Cappuccino" },
  hours: { ru: "Часы", en: "Hours" },
  yourReview: { ru: "Ваш отзыв:", en: "Your report:" },
  open247: { ru: "Круглосуточно", en: "Open 24/7" },
  openUntil: { ru: "Открыто до {time}", en: "Open until {time}" },
  closingIn: { ru: "Закроется через {min} мин", en: "Closes in {min} min" },
  opensToday: { ru: "Закрыто · откроется в {time}", en: "Closed · opens at {time}" },
  opensTomorrow: { ru: "Закрыто · откроется завтра в {time}", en: "Closed · opens tomorrow at {time}" },
  opensOn: { ru: "Закрыто · откроется {day} в {time}", en: "Closed · opens {day} at {time}" },
  closedNow: { ru: "Закрыто", en: "Closed" },
  "day.0": { ru: "в воскресенье", en: "on Sunday" },
  "day.1": { ru: "в понедельник", en: "on Monday" },
  "day.2": { ru: "во вторник", en: "on Tuesday" },
  "day.3": { ru: "в среду", en: "on Wednesday" },
  "day.4": { ru: "в четверг", en: "on Thursday" },
  "day.5": { ru: "в пятницу", en: "on Friday" },
  "day.6": { ru: "в субботу", en: "on Saturday" },
  free: { ru: "💸 Бесплатно", en: "💸 Free" },
  isNew: { ru: "🆕 Новое", en: "🆕 New" },
  "hello.morning": { ru: "Доброе утро!", en: "Good morning!" },
  "hello.day": { ru: "Добрый день!", en: "Good afternoon!" },
  "hello.evening": { ru: "Добрый вечер!", en: "Good evening!" },
  "hello.night": { ru: "Доброй ночи!", en: "Good night!" },
  openCount: { ru: "Сейчас открыто {n} {places}", en: "{n} {places} open now" },
  noneOpen: { ru: "Сейчас всё закрыто 😴", en: "Everything is closed now 😴" },
  weatherNow: { ru: "{icon} {temp}° в Бишкеке", en: "{icon} {temp}° in Bishkek" },
  "tip.bad": { ru: "отличный день, чтобы поработать в кафе ☕", en: "a great day to work in a cafe ☕" },
  "tip.cold": { ru: "холодно, грейтесь в кафе с горячим кофе", en: "it's cold, warm up in a cafe with hot coffee" },
  "tip.hot": { ru: "жарко, ищите место с кондиционером", en: "it's hot, find a place with air conditioning" },
  "tip.nice": { ru: "хорошая погода, чтобы дойти до нового места", en: "nice weather to walk to a new place" },
  forecast: { ru: "Прогноз →", en: "Forecast →" },
  favAdd: { ru: "Сохранить в «Мои места»", en: "Save to “My places”" },
  favRemove: { ru: "Убрать из «Моих мест»", en: "Remove from “My places”" },
  favSaved: { ru: "❤️ Сохранено в «Мои места»", en: "❤️ Saved to “My places”" },
  favRemoved: { ru: "Убрано из «Моих мест»", en: "Removed from “My places”" },
  favEmpty: { ru: "Здесь пока пусто. Нажмите ♡ на карточке, чтобы сохранить место.", en: "Nothing here yet. Tap ♡ on a card to save a place." },
  pickResult: { ru: "🎲 Сегодня работаем в: {name}", en: "🎲 Today you work at: {name}" },
  pickNone: { ru: "Сейчас всё подходящее закрыто 😴 Попробуйте убрать фильтры.", en: "Everything matching is closed now 😴 Try removing filters." },
  map2gis: { ru: "2ГИС", en: "2GIS" },
  mapGoogle: { ru: "Google Maps", en: "Google Maps" },
  mapOpenIn: { ru: "Открыть в {app}", en: "Open in {app}" },
  verified: { ru: "✓ Проверено", en: "✓ Tested" },
  fastest: { ru: "🏆 Самый быстрый", en: "🏆 Fastest" },
  source: { ru: "источник", en: "source" },
  reportWifi: { ru: "📶 Сообщить скорость Wi-Fi", en: "📶 Report Wi-Fi speed" },
  share: { ru: "🔗 Поделиться", en: "🔗 Share" },
  shareLabel: { ru: "Поделиться: {name}", en: "Share: {name}" },
  shareText: { ru: "Где поработать с ноутбуком в Бишкеке", en: "Where to work with a laptop in Bishkek" },
  linkCopied: { ru: "🔗 Ссылка скопирована", en: "🔗 Link copied" },
  copyLink: { ru: "Скопируйте ссылку:", en: "Copy the link:" },
  "stat.places": { ru: "мест", en: "places" },
  "stat.measured": { ru: "замерено", en: "tested" },
  "stat.open": { ru: "открыто сейчас", en: "open now" },
  more: { ru: "Подробнее →", en: "Details →" },
  nothingFound: { ru: "Ничего не нашли по «{query}».", en: "Nothing found for “{query}”." },
  suggestThis: { ru: "➕ Предложите это место", en: "➕ Suggest this place" },
  noPlaces: { ru: "Пока нет мест, где это точно проверено. Скоро добавим замеры!", en: "No places with this checked yet. Tests are coming soon!" },
  matching: { ru: "Подходит: {n}", en: "Matching: {n}" },
  total: { ru: "Всего мест: {n}", en: "Places: {n}" },
  noGeo: { ru: "Этот браузер не умеет определять место.", en: "This browser can't find your location." },
  locating: { ru: "Определяю, где вы…", en: "Finding where you are…" },
  geoFailed: { ru: "Не получилось узнать место. Разрешите доступ к геолокации в браузере.", en: "Couldn't get your location. Allow location access in the browser." },
  sending: { ru: "Отправляю…", en: "Sending…" },
  send: { ru: "Отправить", en: "Send" },
  sendError: { ru: "Не получилось отправить. Проверьте интернет и попробуйте ещё раз.", en: "Couldn't send. Check your internet and try again." },
  thanksSent: { ru: "Ваш отзыв отправлен. Мы проверим его и добавим на сайт.", en: "Your report has been sent. We'll check it and add it to the site." },
  thanksLocal: { ru: "Отзыв сохранён на этом устройстве. Отправка на сервер пока не подключена.", en: "Saved on this device. Sending to the server is not connected yet." },
  themeDark: { ru: "Тёмная тема", en: "Dark theme" },
  themeLight: { ru: "Светлая тема", en: "Light theme" },
  updated: { ru: "Обновлено: {date}", en: "Updated: {date}" },
  mapYou: { ru: "Вы здесь", en: "You are here" },
  mapError: { ru: "Не получилось загрузить карту. Проверьте интернет.", en: "Couldn't load the map. Check your internet." },
  langButton: { ru: "EN", en: "RU" },
  langLabel: { ru: "Switch to English", en: "Переключить на русский" },
  "rating.fast": { ru: "🚀 Быстро", en: "🚀 Fast" },
  "rating.ok": { ru: "👌 Нормально", en: "👌 OK" },
  "rating.slow": { ru: "🐢 Медленно", en: "🐢 Slow" },
  "rating.broken": { ru: "❌ Не работает", en: "❌ Not working" },
  "ptype.cafe": { ru: "☕ Кафе", en: "☕ Cafe" },
  "ptype.coworking": { ru: "💻 Коворкинг", en: "💻 Coworking" },
  "ptype.other": { ru: "📚 Другое", en: "📚 Other" },
  "good.wifi": { ru: "📶 Быстрый Wi-Fi", en: "📶 Fast Wi-Fi" },
  "good.sockets": { ru: "🔌 Розетки", en: "🔌 Sockets" },
  "good.quiet": { ru: "🤫 Тихо", en: "🤫 Quiet" },
  "good.late": { ru: "🌙 Допоздна", en: "🌙 Open late" },
  pageTitle: {
    ru: "Laptop Bishkek: кафе с Wi-Fi и коворкинги Бишкека для работы с ноутбуком",
    en: "Laptop Bishkek: cafes with Wi-Fi and coworkings in Bishkek for laptop work",
  },
  pageDescription: {
    ru: "Где поработать с ноутбуком в Бишкеке: кафе с Wi-Fi, коворкинги и библиотеки. Скорость Wi-Fi, розетки, шум, цена кофе, часы работы и карта.",
    en: "Where to work with a laptop in Bishkek, Kyrgyzstan: cafes with Wi-Fi, coworkings and libraries. Wi-Fi speed, sockets, noise, coffee prices, opening hours and a map.",
  },
};

// Texts written in index.html. The HTML has Russian; for English we swap them.
// data-i18n = text, data-i18n-html = text with tags, data-i18n-placeholder, data-i18n-aria = aria-label
export const PAGE_EN = {
  heroKicker: "📍 Bishkek · cafes · coworkings · libraries",
  heroTitle: 'Where to work <span class="grad">with a laptop</span>',
  heroText: "Wi-Fi speed, sockets, quiet and coffee prices. Tested on the spot.",
  findPlace: "Find a place ↓",
  howLink: "How it works",
  botCta: "A question about Bishkek? <b>Ask the AI guide in Telegram →</b>",
  footBot: '🤖 <a href="https://t.me/BishkekBuddyBot?start=site" target="_blank" rel="noopener">AI guide to Bishkek in Telegram</a>: food, transport, where to go and Wi-Fi places near you.',
  view: "View",
  viewList: "📋 List",
  viewMap: "🗺 Map",
  search: "Name or street, e.g. “Manas”",
  searchLabel: "Search by name or street",
  filters: "Filters",
  openNow: "🟢 Open now",
  quiet: "🤫 Quiet",
  sockets: "🔌 Sockets",
  late: "🌙 Open late",
  nearMe: "📍 Near me",
  favChip: "❤️ My places",
  pick: "🎲 Where to go now?",
  rolling: "🎲 Picking a place…",
  freeChip: "💸 Free",
  suggestTitle: "Know a good place?",
  suggestText: "A cafe with fast Wi-Fi, a quiet coworking, a nice library: tell us, and we'll check it and add it.",
  suggestBtn: "➕ Suggest a place",
  howTitle: "How it works",
  how1Title: "We test on the spot",
  how1Text: "We go there, connect to the Wi-Fi and run a speed test. No “the cafe says so”.",
  how2Title: "We check what matters",
  how2Text: "Are there sockets, how noisy it is, how much coffee costs and how late it's open.",
  how3Title: "You help",
  how3Text: "Sitting in a cafe? Tap “Report Wi-Fi speed”, and the place gets more accurate for everyone.",
  close: "Close",
  wifiIn: "Wi-Fi at",
  wifiHint: 'Connect to the place\'s Wi-Fi, open <a href="https://fast.com" target="_blank" rel="noopener">fast.com</a> or <a href="https://www.speedtest.net" target="_blank" rel="noopener">speedtest.net</a> and enter the speed.',
  download: "⬇️ Download <em>*</em>",
  upload: "⬆️ Upload",
  mbps: "Mbps",
  ratingLegend: "How is the Wi-Fi? <small>(optional)</small>",
  comment: "💬 Comment <small>(optional)</small>",
  wifiComment: "E.g.: better signal by the window, password on the receipt",
  send: "Send",
  thanks: "Thank you!",
  done: "Done",
  suggestDialogTitle: '➕ Suggest a <span>place</span>',
  suggestHint: "We'll check the place and add it to the site.",
  placeName: "Name <em>*</em>",
  placeNameHint: "E.g.: Coffee Lab",
  placeAddress: "Address or area <em>*</em>",
  placeAddressHint: "E.g.: 120 Chui Ave or Dzhal",
  placeType: "What is it?",
  placeGood: "What's good about it? <small>(choose any)</small>",
  suggestComment: "E.g.: there is a separate room, Wi-Fi password on the receipt",
  suggestThanks: "We'll check the place and add it to the site soon.",
  footNote: "We test the Wi-Fi speed ourselves, on the spot. Few places are tested so far: some data comes from reviews and 2GIS and is being checked.",
  footQr: 'Own a cafe? <a href="qr.html">Print a QR sticker</a> for the tables: guests will report the Wi-Fi speed themselves.',
  madeIn: "Made in Bishkek 💙💗",
};

// Word form after a number: plural(5, "ru", ["место", "места", "мест"]) → "мест"
export function plural(n, lang, forms) {
  if (lang === "en") return n === 1 ? forms[0] : forms[1];
  const last = n % 10;
  const lastTwo = n % 100;
  if (last === 1 && lastTwo !== 11) return forms[0];
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return forms[1];
  return forms[2];
}

export function currentLang() {
  return globalThis.document?.documentElement.lang === "en" ? "en" : "ru";
}

// t("total", { n: 5 }) → "Всего мест: 5" or "Places: 5"
export function t(key, vars = {}, lang = currentLang()) {
  const entry = T[key];
  if (!entry) return key;
  return entry[lang].replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
}

// The place in the chosen language. Russian name/address stay as nameRu/addressRu
// (search finds both, and the 2GIS link needs the Russian address).
export function localizePlace(place, lang, en = {}) {
  const base = { ...place, nameRu: place.name, addressRu: place.address };
  if (lang !== "en") return base;
  const tr = en[place.id] ?? {};
  return {
    ...base,
    name: tr.name ?? place.name,
    address: tr.address ?? place.address,
    note: place.note ? tr.note ?? place.note : place.note,
    wifiNote: place.wifiNote ? tr.wifiNote ?? place.wifiNote : place.wifiNote,
    coffeeNote: place.coffeeNote ? tr.coffeeNote ?? place.coffeeNote : place.coffeeNote,
  };
}

// Swap the Russian texts of index.html for English ones
export function translatePage() {
  if (currentLang() !== "en") return;
  const each = (attr, apply) => document.querySelectorAll(`[${attr}]`).forEach((el) => {
    const text = PAGE_EN[el.getAttribute(attr)];
    if (text != null) apply(el, text);
  });
  each("data-i18n", (el, text) => { el.textContent = text; });
  each("data-i18n-html", (el, text) => { el.innerHTML = text; });
  each("data-i18n-placeholder", (el, text) => { el.placeholder = text; });
  each("data-i18n-aria", (el, text) => el.setAttribute("aria-label", text));
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("pageDescription"));
}

// Remember the choice and reload: the simplest way to redraw everything in the new language
export function switchLang() {
  localStorage.setItem("lb-lang", currentLang() === "en" ? "ru" : "en");
  location.reload();
}
