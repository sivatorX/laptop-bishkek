// The page: reads the places, applies filters, draws the cards.
import { PLACES, UPDATED } from "./data/places.js?v=202611021118";
import { PLACES_EN } from "./data/places-en.js?v=202611021118";
import { applyFilters, fastestId } from "./filters.js?v=202611021118";
import { RATINGS, validateFeedback, submitFeedback, loadLocalFeedback, postJson } from "./feedback.js?v=202611021118";
import { PLACE_TYPES, GOOD_FOR, validateSuggestion, suggestionSummary } from "./suggest.js?v=202611021118";
import { SUBMIT_URL } from "./config.js?v=202611021118";
import { showMap, setMapTheme } from "./map.js?v=202611021118";
import { startStats, track } from "./stats.js?v=202611021118";
import { placesJsonLd } from "./seo.js?v=202611021118";
import { t, currentLang, localizePlace, translatePage, switchLang } from "./i18n.js?v=202611021118";

// Language first: swap the page texts, then show the page
const LANG = currentLang();
translatePage();
document.documentElement.classList.remove("i18n-wait");

// The places in the chosen language (English names, addresses and notes for "en")
const ALL_PLACES = PLACES.map((p) => localizePlace(p, LANG, PLACES_EN));
const UNKNOWN = t("unknown");

const state = { openNow: false, quiet: false, sockets: false, late: false, free: false, query: "", userPos: null, view: "list" };
const FASTEST = fastestId(ALL_PLACES);

const listEl = document.getElementById("list");
const statusEl = document.getElementById("status");
const nearBtn = document.getElementById("near-me");
const mapEl = document.getElementById("map");
const toastEl = document.getElementById("toast");

// Turn text into safe HTML (so a "<" in the data can never break the page)
function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// 2GIS understands the Russian name and address best
function link2gis(place) {
  return `https://2gis.kg/bishkek/search/${encodeURIComponent(`${place.nameRu} ${place.addressRu}`)}`;
}

// Google Maps: by coordinates (exact), or by name if we have none
function linkGoogle(place) {
  const query = place.coords ? `${place.coords.lat},${place.coords.lng}` : `${place.nameRu}, ${place.addressRu}, Бишкек`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Locals use 2GIS, visitors from abroad use Google Maps:
// the address button opens the usual one, a small link under it opens the other
function mapLinks(place) {
  const maps = [[link2gis(place), t("map2gis")], [linkGoogle(place), t("mapGoogle")]];
  if (LANG === "en") maps.reverse();
  const [[mainUrl, mainName], [altUrl, altName]] = maps;
  return {
    main: `<a class="btn" href="${mainUrl}" target="_blank" rel="noopener" title="${esc(t("mapOpenIn", { app: mainName }))}">📍 ${esc(place.address)}</a>`,
    alt: `<a class="alt-map" href="${altUrl}" target="_blank" rel="noopener">🗺 ${esc(t("mapOpenIn", { app: altName }))}</a>`,
  };
}

function hoursText(hours) {
  if (hours === "24/7") return t("allDay");
  if (hours) return `${hours.open}–${hours.close}`;
  return UNKNOWN;
}

// Signal bars like on a phone: 0 = unknown, 1 = slow … 4 = very fast
function bars(speed) {
  const level = speed == null ? 0 : speed < 10 ? 1 : speed < 25 ? 2 : speed < 50 ? 3 : 4;
  const items = [1, 2, 3, 4].map((n) => `<i class="${n <= level ? "on" : ""}"></i>`).join("");
  return `<span class="bars bars--${level}" aria-hidden="true">${items}</span>`;
}

function wifiBlock(place) {
  if (place.wifi) {
    return `
      <div class="wifi wifi--measured">
        ${bars(place.wifi.down)}
        <span class="wifi-speed">${esc(place.wifi.down)}<small> ${t("mbps")}</small></span>
        <span class="wifi-sub">↑ ${esc(place.wifi.up)} · ${esc(t("measured", { date: place.wifi.measuredAt }))}</span>
      </div>`;
  }
  return `
    <div class="wifi">
      ${bars(null)}
      <span class="wifi-speed wifi-speed--unknown">?</span>
      <span class="wifi-sub">${t("notMeasured")}${place.wifiNote ? ` · ${esc(place.wifiNote)}` : ""}</span>
    </div>`;
}

function row(icon, label, value) {
  const unknown = value === UNKNOWN;
  return `<li><span aria-hidden="true">${icon}</span> ${label}: <b class="${unknown ? "unknown" : ""}">${esc(value)}</b></li>`;
}

// The visitor's own review (saved in this browser), shown on the card
function myReview(placeId) {
  const f = loadLocalFeedback().find((x) => x.placeId === placeId);
  if (!f) return "";
  const parts = [];
  if (f.down != null) parts.push(`${f.down}${f.up != null ? ` / ${f.up}` : ""} ${t("mbps")}`);
  if (f.rating in RATINGS) parts.push(t(`rating.${f.rating}`));
  return `
    <div class="my-review">
      <b>${t("yourReview")}</b> ${esc(parts.join(" · "))}
      ${f.comment ? `<span>«${esc(f.comment)}»</span>` : ""}
    </div>`;
}

// Green = open, orange = closes within an hour, grey = closed (+ when it opens), nothing if hours are unknown
function openStatus(info) {
  if (!info) return "";
  if (info.state === "always") return `<span class="open open--yes">● ${t("open247")}</span>`;
  if (info.state === "open") return `<span class="open open--yes">● ${t("openUntil", { time: info.until })}</span>`;
  if (info.state === "closing") return `<span class="open open--soon">● ${t("closingIn", { min: info.minutesLeft })}</span>`;
  if (info.state === "closed") {
    const text = !info.opensAt ? t("closedNow")
      : info.inDays === 0 ? t("opensToday", { time: info.opensAt })
      : info.inDays === 1 ? t("opensTomorrow", { time: info.opensAt })
      : t("opensOn", { day: t(`day.${info.day}`), time: info.opensAt });
    return `<span class="open open--no">● ${esc(text)}</span>`;
  }
  return "";
}

function card(place, index) {
  const distance = place.distance != null
    ? `<span class="distance">${place.distance < 1 ? `${Math.round(place.distance * 1000)} ${t("m")}` : `${place.distance.toFixed(1)} ${t("km")}`}</span>`
    : "";
  const maps = mapLinks(place);
  const coffee = place.coffee ? `${place.coffee} ${t("som")}${place.coffeeNote ? ` (${place.coffeeNote})` : ""}` : UNKNOWN;
  return `
    <li class="card card--${place.type}" id="place-${esc(place.id)}" style="--i: ${index}">
      <div class="card-head">
        <span class="badge badge--${place.type}">${t(`type.${place.type}`)}</span>
        ${place.wifi ? `<span class="badge badge--verified">${t("verified")}</span>` : ""}
        ${place.id === FASTEST ? `<span class="badge badge--fastest">${t("fastest")}</span>` : ""}
        ${place.free ? `<span class="badge badge--free">${t("free")}</span>` : ""}
        ${openStatus(place.openInfo)}
        ${distance}
      </div>
      <h2 class="card-title">${esc(place.name)}</h2>
      ${wifiBlock(place)}
      <ul class="facts">
        ${row("🔌", t("sockets"), place.sockets ? t(`sockets.${place.sockets}`) : UNKNOWN)}
        ${row("🔊", t("noise"), place.noise ? t(`noise.${place.noise}`) : UNKNOWN)}
        ${row("☕", t("cappuccino"), coffee)}
        ${row("🕒", t("hours"), hoursText(place.hours))}
      </ul>
      ${place.note || place.source ? `<p class="note">${place.note ? esc(place.note) : ""}
        ${place.source ? `<a class="source" href="${esc(place.source)}" target="_blank" rel="noopener">${t("source")}</a>` : ""}</p>` : ""}
      ${myReview(place.id)}
      <button class="btn-review" type="button" data-review="${esc(place.id)}">${t("reportWifi")}</button>
      <div class="card-foot">
        ${maps.main}
        <button class="btn-share" type="button" data-share="${esc(place.id)}" aria-label="${esc(t("shareLabel", { name: place.name }))}">${t("share")}</button>
      </div>
      ${maps.alt}
    </li>`;
}

// Numbers in the hero: how many places, measured, open right now
function renderStats(all) {
  const measured = all.filter((p) => p.wifi).length;
  const open = all.filter((p) => p.openNow === true).length;
  document.getElementById("stats").innerHTML = [
    [all.length, t("stat.places")],
    [measured, t("stat.measured")],
    [open, t("stat.open")],
  ].map(([n, label]) => `<div class="stat"><b>${n}</b><span>${label}</span></div>`).join("");
}

// Small window on a map pin
function popupHtml(place) {
  const speed = place.wifi ? `${esc(place.wifi.down)} ${t("mbps")}` : t("notMeasuredWifi");
  return `
    <div class="popup">
      <div class="popup-head"><span class="badge badge--${place.type}">${t(`type.${place.type}`)}</span> ${openStatus(place.openInfo)}</div>
      <b class="popup-title">${esc(place.name)}</b>
      <span>📶 ${speed}</span>
      <span>🕒 ${esc(hoursText(place.hours))}</span>
      <button type="button" class="popup-btn" data-show="${esc(place.id)}">${t("more")}</button>
    </div>`;
}

function render() {
  const places = applyFilters(ALL_PLACES, state, state.userPos);
  listEl.innerHTML = places.map(card).join("");
  if (state.view === "map") {
    showMap(mapEl, places, { userPos: state.userPos, theme: document.documentElement.dataset.theme, popupHtml })
      .catch((err) => { statusEl.textContent = err.message; });
  }
  renderStats(applyFilters(ALL_PLACES, {}));

  const anyFilter = state.openNow || state.quiet || state.sockets || state.late || state.free || state.query.trim() !== "";
  if (places.length === 0 && state.query.trim()) {
    statusEl.innerHTML = `${esc(t("nothingFound", { query: state.query.trim() }))} <button type="button" class="link-btn" data-suggest>${t("suggestThis")}</button>`;
  } else if (places.length === 0) {
    statusEl.textContent = t("noPlaces");
  } else {
    statusEl.textContent = t(anyFilter ? "matching" : "total", { n: places.length });
  }
}

// Filter chips: click = on/off
document.querySelectorAll(".chip[data-filter]").forEach((chip) => {
  chip.addEventListener("click", () => {
    const key = chip.dataset.filter;
    state[key] = !state[key];
    chip.setAttribute("aria-pressed", String(state[key]));
    render();
  });
});

// Search: filter while typing
document.getElementById("search").addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

// List / map switch
function setView(view) {
  if (view === "map") track("open-map");
  state.view = view;
  document.querySelectorAll(".view-btn").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === view)));
  listEl.hidden = view === "map";
  mapEl.hidden = view !== "map";
  render();
}
document.querySelectorAll(".view-btn").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

// Show one card: switch to the list, scroll to it, make it glow for a moment
function showCard(placeId) {
  if (state.view !== "list") setView("list");
  let el = document.getElementById(`place-${placeId}`);
  if (!el) {
    // Hidden by a filter: turn the filters off and try again
    for (const key of ["openNow", "quiet", "sockets", "late", "free"]) state[key] = false;
    document.querySelectorAll(".chip[data-filter]").forEach((c) => c.setAttribute("aria-pressed", "false"));
    render();
    el = document.getElementById(`place-${placeId}`);
  }
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.remove("card--flash");
  void el.offsetWidth; // restart the animation
  el.classList.add("card--flash");
}
mapEl.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-show]");
  if (btn) showCard(btn.dataset.show);
});

// Short message at the bottom of the screen
let toastTimer = null;
function toast(text) {
  toastEl.textContent = text;
  toastEl.classList.add("toast--show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("toast--show"), 2500);
}

// Share a place: the phone's share menu, or copy the link on a computer
async function sharePlace(placeId) {
  track(`share/${placeId}`);
  const place = ALL_PLACES.find((p) => p.id === placeId);
  if (!place) return;
  const url = `${location.origin}${location.pathname}#place=${placeId}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: `${place.name} — Laptop Bishkek`, text: t("shareText"), url });
    } catch {
      // The user closed the share menu: nothing to do
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast(t("linkCopied"));
  } catch {
    prompt(t("copyLink"), url);
  }
}

// "Near me": the browser asks the user first. We never send the position anywhere.
nearBtn.addEventListener("click", () => {
  if (state.userPos) {
    state.userPos = null;
    nearBtn.setAttribute("aria-pressed", "false");
    render();
    return;
  }
  if (!("geolocation" in navigator)) {
    statusEl.textContent = t("noGeo");
    return;
  }
  statusEl.textContent = t("locating");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      nearBtn.setAttribute("aria-pressed", "true");
      render();
    },
    () => {
      statusEl.textContent = t("geoFailed");
    },
    { timeout: 10000, maximumAge: 60000 }
  );
});

// ---------- Wi-Fi review window ----------
const dialog = document.getElementById("wifi-dialog");
const form = document.getElementById("wifi-form");
const thanks = document.getElementById("wifi-thanks");
const errorEl = document.getElementById("wifi-error");
const submitBtn = form.querySelector('button[type="submit"]');
let currentPlaceId = null;

// Choice chips: radio = one choice, checkbox = several
function chips(name, keys, prefix, kind) {
  return keys
    .map((key, i) => `
      <label class="rating-chip">
        <input type="${kind}" name="${name}" value="${key}"${kind === "radio" && name === "type" && i === 0 ? " checked" : ""}>
        <span>${t(`${prefix}.${key}`)}</span>
      </label>`)
    .join("");
}
document.getElementById("rating-options").innerHTML = chips("rating", Object.keys(RATINGS), "rating", "radio");

function openReview(placeId) {
  const place = ALL_PLACES.find((p) => p.id === placeId);
  if (!place) return;
  currentPlaceId = placeId;
  form.reset();
  errorEl.textContent = "";
  form.hidden = false;
  thanks.hidden = true;
  document.getElementById("wifi-place").textContent = place.name;
  dialog.showModal();
}

// One listener for all cards (cards are redrawn after every filter click)
listEl.addEventListener("click", (event) => {
  const review = event.target.closest("[data-review]");
  if (review) openReview(review.dataset.review);
  const share = event.target.closest("[data-share]");
  if (share) sharePlace(share.dataset.share);
});

dialog.addEventListener("click", (event) => {
  // Close on ✕ / "Готово", or on a click on the dark area around the window
  if (event.target.closest("[data-close]") || event.target === dialog) dialog.close();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const check = validateFeedback({
    ...values,
    placeId: currentPlaceId,
    date: new Date().toISOString().slice(0, 10),
  }, LANG);
  if (!check.ok) {
    errorEl.textContent = check.errors.join(". ");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = t("sending");
  try {
    // The email to the author is always in Russian: Russian place name + subject (_subject is a Formspree field)
    const placeName = PLACES.find((p) => p.id === currentPlaceId)?.name ?? currentPlaceId;
    const { sent } = await submitFeedback(
      { ...check.data, place: placeName, lang: LANG, _subject: `Wi-Fi: ${placeName} — ${check.data.down} Мбит/с` },
      SUBMIT_URL
    );
    document.getElementById("wifi-thanks-text").textContent = t(sent ? "thanksSent" : "thanksLocal");
    form.hidden = true;
    thanks.hidden = false;
    track(`wifi-report/${currentPlaceId}`);
    render(); // show "Ваш отзыв" on the card
  } catch {
    errorEl.textContent = t("sendError");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = t("send");
  }
});

// ---------- "Предложить место" window ----------
const suggestDialog = document.getElementById("suggest-dialog");
const suggestForm = document.getElementById("suggest-form");
const suggestThanks = document.getElementById("suggest-thanks");
const suggestError = document.getElementById("suggest-error");
const suggestSubmit = suggestForm.querySelector('button[type="submit"]');

document.getElementById("suggest-types").innerHTML = chips("type", Object.keys(PLACE_TYPES), "ptype", "radio");
document.getElementById("suggest-good").innerHTML = chips("good", Object.keys(GOOD_FOR), "good", "checkbox");

function openSuggest() {
  suggestForm.reset();
  // The search text is probably the place name
  if (state.query.trim()) suggestForm.elements.name.value = state.query.trim();
  suggestError.textContent = "";
  suggestForm.hidden = false;
  suggestThanks.hidden = true;
  suggestDialog.showModal();
}

// Buttons with data-suggest can be anywhere (the CTA block, the "nothing found" message)
document.addEventListener("click", (event) => {
  if (event.target.closest("[data-suggest]")) openSuggest();
});

suggestDialog.addEventListener("click", (event) => {
  if (event.target.closest("[data-close]") || event.target === suggestDialog) suggestDialog.close();
});

suggestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const fd = new FormData(suggestForm);
  const check = validateSuggestion({
    name: fd.get("name"),
    address: fd.get("address"),
    type: fd.get("type"),
    good: fd.getAll("good"),
    comment: fd.get("comment"),
  }, LANG);
  if (!check.ok) {
    suggestError.textContent = check.errors.join(". ");
    return;
  }

  suggestSubmit.disabled = true;
  suggestSubmit.textContent = t("sending");
  try {
    await postJson(SUBMIT_URL, {
      kind: "new-place",
      ...check.data,
      lang: LANG,
      message: suggestionSummary(check.data),
      _subject: `Новое место: ${check.data.name}`,
    });
    suggestForm.hidden = true;
    suggestThanks.hidden = false;
    track("suggest-place");
  } catch {
    suggestError.textContent = t("sendError");
  } finally {
    suggestSubmit.disabled = false;
    suggestSubmit.textContent = t("send");
  }
});

// Theme: dark (neon) or light, remembered in localStorage
const themeBtn = document.getElementById("theme-toggle");
function paintThemeButton() {
  const light = document.documentElement.dataset.theme === "light";
  themeBtn.textContent = light ? "🌙" : "☀️";
  themeBtn.setAttribute("aria-label", t(light ? "themeDark" : "themeLight"));
}
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("lb-theme", next);
  paintThemeButton();
  setMapTheme(next);
});

// Language: RU ⇄ EN
const langBtn = document.getElementById("lang-toggle");
langBtn.textContent = t("langButton");
langBtn.setAttribute("aria-label", t("langLabel"));
langBtn.addEventListener("click", () => {
  track(`lang/${LANG === "en" ? "ru" : "en"}`);
  switchLang();
});

document.getElementById("updated").textContent = t("updated", { date: UPDATED.split("-").reverse().join(".") });
paintThemeButton();
render();
// Update "Открыто / Закрыто" every minute (but not while the speed form is open)
setInterval(() => {
  if (!dialog.open && !suggestDialog.open) render();
}, 60000);

// A link like ...#wifi=sierra-manas opens the speed form right away (good for a QR code on a cafe table)
const fromLink = location.hash.match(/^#wifi=([\w-]+)$/);
if (fromLink) openReview(fromLink[1]);
// A link like ...#place=sierra-manas shows that place's card (from the share button)
const placeLink = location.hash.match(/^#place=([\w-]+)$/);
if (placeLink) showCard(placeLink[1]);
// ...#map opens the map right away
if (location.hash === "#map") setView("map");
// ...#suggest opens the "Предложить место" window (handy link for Instagram)
if (location.hash === "#suggest") openSuggest();

// Describe the places for Google (it reads this hidden block when it visits the page)
const ld = document.createElement("script");
ld.type = "application/ld+json";
ld.textContent = JSON.stringify(placesJsonLd(PLACES, "https://sivatorx.github.io/laptop-bishkek/"));
document.head.append(ld);

startStats();
