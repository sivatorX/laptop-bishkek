// The page: reads the places, applies filters, draws the cards.
import { PLACES, UPDATED } from "./data/places.js";
import { applyFilters, fastestId } from "./filters.js";
import { RATINGS, validateFeedback, submitFeedback, loadLocalFeedback, postJson } from "./feedback.js";
import { PLACE_TYPES, GOOD_FOR, validateSuggestion, suggestionSummary } from "./suggest.js";
import { SUBMIT_URL } from "./config.js";
import { showMap, setMapTheme } from "./map.js";
import { startStats, track } from "./stats.js";
import { placesJsonLd } from "./seo.js";

const TYPE_LABEL = { cafe: "Кафе", coworking: "Коворкинг", library: "Библиотека" };
const SOCKETS_LABEL = { yes: "есть", some: "есть, но не везде", no: "нет" };
const NOISE_LABEL = { quiet: "тихо", medium: "средне", loud: "шумно" };
const UNKNOWN = "не проверено";

const state = { openNow: false, quiet: false, sockets: false, late: false, query: "", userPos: null, view: "list" };
const FASTEST = fastestId(PLACES);

const listEl = document.getElementById("list");
const statusEl = document.getElementById("status");
const nearBtn = document.getElementById("near-me");
const mapEl = document.getElementById("map");
const toastEl = document.getElementById("toast");

// Turn text into safe HTML (so a "<" in the data can never break the page)
function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function mapLink(place) {
  return `https://2gis.kg/bishkek/search/${encodeURIComponent(`${place.name} ${place.address}`)}`;
}

function hoursText(hours) {
  if (hours === "24/7") return "круглосуточно";
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
        <span class="wifi-speed">${esc(place.wifi.down)}<small> Мбит/с</small></span>
        <span class="wifi-sub">↑ ${esc(place.wifi.up)} · замер ${esc(place.wifi.measuredAt)}</span>
      </div>`;
  }
  return `
    <div class="wifi">
      ${bars(null)}
      <span class="wifi-speed wifi-speed--unknown">?</span>
      <span class="wifi-sub">ещё не замеряли${place.wifiNote ? ` · ${esc(place.wifiNote)}` : ""}</span>
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
  if (f.down != null) parts.push(`${f.down}${f.up != null ? ` / ${f.up}` : ""} Мбит/с`);
  if (f.rating) parts.push(RATINGS[f.rating]);
  return `
    <div class="my-review">
      <b>Ваш отзыв:</b> ${esc(parts.join(" · "))}
      ${f.comment ? `<span>«${esc(f.comment)}»</span>` : ""}
    </div>`;
}

// Green dot = open now, grey = closed, nothing if we don't know the hours
function openStatus(open) {
  if (open === true) return `<span class="open open--yes">● Открыто</span>`;
  if (open === false) return `<span class="open open--no">● Закрыто</span>`;
  return "";
}

function card(place, index) {
  const distance = place.distance != null
    ? `<span class="distance">${place.distance < 1 ? `${Math.round(place.distance * 1000)} м` : `${place.distance.toFixed(1)} км`}</span>`
    : "";
  return `
    <li class="card card--${place.type}" id="place-${esc(place.id)}" style="--i: ${index}">
      <div class="card-head">
        <span class="badge badge--${place.type}">${TYPE_LABEL[place.type]}</span>
        ${place.wifi ? `<span class="badge badge--verified">✓ Проверено</span>` : ""}
        ${place.id === FASTEST ? `<span class="badge badge--fastest">🏆 Самый быстрый</span>` : ""}
        ${openStatus(place.openNow)}
        ${distance}
      </div>
      <h2 class="card-title">${esc(place.name)}</h2>
      ${wifiBlock(place)}
      <ul class="facts">
        ${row("🔌", "Розетки", SOCKETS_LABEL[place.sockets] ?? UNKNOWN)}
        ${row("🔊", "Шум", NOISE_LABEL[place.noise] ?? UNKNOWN)}
        ${row("☕", "Капучино", place.coffee ? `${place.coffee} сом${place.coffeeNote ? ` (${place.coffeeNote})` : ""}` : UNKNOWN)}
        ${row("🕒", "Часы", hoursText(place.hours))}
      </ul>
      ${place.note || place.source ? `<p class="note">${place.note ? esc(place.note) : ""}
        ${place.source ? `<a class="source" href="${esc(place.source)}" target="_blank" rel="noopener">источник</a>` : ""}</p>` : ""}
      ${myReview(place.id)}
      <button class="btn-review" type="button" data-review="${esc(place.id)}">📶 Сообщить скорость Wi-Fi</button>
      <div class="card-foot">
        <a class="btn" href="${mapLink(place)}" target="_blank" rel="noopener">📍 ${esc(place.address)}</a>
        <button class="btn-share" type="button" data-share="${esc(place.id)}" aria-label="Поделиться: ${esc(place.name)}">🔗 Поделиться</button>
      </div>
    </li>`;
}

// Numbers in the hero: how many places, measured, open right now
function renderStats(all) {
  const measured = all.filter((p) => p.wifi).length;
  const open = all.filter((p) => p.openNow === true).length;
  document.getElementById("stats").innerHTML = [
    [all.length, "мест"],
    [measured, "замерено"],
    [open, "открыто сейчас"],
  ].map(([n, label]) => `<div class="stat"><b>${n}</b><span>${label}</span></div>`).join("");
}

// Small window on a map pin
function popupHtml(place) {
  const speed = place.wifi ? `${esc(place.wifi.down)} Мбит/с` : "Wi-Fi ещё не замеряли";
  return `
    <div class="popup">
      <div class="popup-head"><span class="badge badge--${place.type}">${TYPE_LABEL[place.type]}</span> ${openStatus(place.openNow)}</div>
      <b class="popup-title">${esc(place.name)}</b>
      <span>📶 ${speed}</span>
      <span>🕒 ${esc(hoursText(place.hours))}</span>
      <button type="button" class="popup-btn" data-show="${esc(place.id)}">Подробнее →</button>
    </div>`;
}

function render() {
  const places = applyFilters(PLACES, state, state.userPos);
  listEl.innerHTML = places.map(card).join("");
  if (state.view === "map") {
    showMap(mapEl, places, { userPos: state.userPos, theme: document.documentElement.dataset.theme, popupHtml })
      .catch((err) => { statusEl.textContent = err.message; });
  }
  renderStats(applyFilters(PLACES, {}));

  const anyFilter = state.openNow || state.quiet || state.sockets || state.late || state.query.trim() !== "";
  if (places.length === 0 && state.query.trim()) {
    statusEl.innerHTML = `Ничего не нашли по «${esc(state.query.trim())}». <button type="button" class="link-btn" data-suggest>➕ Предложите это место</button>`;
  } else if (places.length === 0) {
    statusEl.textContent = "Пока нет мест, где это точно проверено. Скоро добавим замеры!";
  } else {
    statusEl.textContent = `${anyFilter ? "Подходит" : "Всего мест"}: ${places.length}`;
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
    for (const key of ["openNow", "quiet", "sockets", "late"]) state[key] = false;
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
  const place = PLACES.find((p) => p.id === placeId);
  if (!place) return;
  const url = `${location.origin}${location.pathname}#place=${placeId}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: `${place.name} — Laptop Bishkek`, text: "Где поработать с ноутбуком в Бишкеке", url });
    } catch {
      // The user closed the share menu: nothing to do
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast("🔗 Ссылка скопирована");
  } catch {
    prompt("Скопируйте ссылку:", url);
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
    statusEl.textContent = "Этот браузер не умеет определять место.";
    return;
  }
  statusEl.textContent = "Определяю, где вы…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      nearBtn.setAttribute("aria-pressed", "true");
      render();
    },
    () => {
      statusEl.textContent = "Не получилось узнать место. Разрешите доступ к геолокации в браузере.";
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

// Rating buttons are radio inputs styled as chips
document.getElementById("rating-options").innerHTML = Object.entries(RATINGS)
  .map(([key, label]) => `
    <label class="rating-chip">
      <input type="radio" name="rating" value="${key}">
      <span>${label}</span>
    </label>`)
  .join("");

function openReview(placeId) {
  const place = PLACES.find((p) => p.id === placeId);
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
  });
  if (!check.ok) {
    errorEl.textContent = check.errors.join(". ");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Отправляю…";
  try {
    // Place name + email subject (_subject is a Formspree field) make the email easy to read
    const placeName = PLACES.find((p) => p.id === currentPlaceId)?.name ?? currentPlaceId;
    const { sent } = await submitFeedback(
      { ...check.data, place: placeName, _subject: `Wi-Fi: ${placeName} — ${check.data.down} Мбит/с` },
      SUBMIT_URL
    );
    document.getElementById("wifi-thanks-text").textContent = sent
      ? "Ваш отзыв отправлен. Мы проверим его и добавим на сайт."
      : "Отзыв сохранён на этом устройстве. Отправка на сервер пока не подключена.";
    form.hidden = true;
    thanks.hidden = false;
    track(`wifi-report/${currentPlaceId}`);
    render(); // show "Ваш отзыв" on the card
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить";
  }
});

// ---------- "Предложить место" window ----------
const suggestDialog = document.getElementById("suggest-dialog");
const suggestForm = document.getElementById("suggest-form");
const suggestThanks = document.getElementById("suggest-thanks");
const suggestError = document.getElementById("suggest-error");
const suggestSubmit = suggestForm.querySelector('button[type="submit"]');

// Choice chips: type = one choice (radio), "чем хорошо" = several (checkbox)
function chips(name, options, kind) {
  return Object.entries(options)
    .map(([key, label], i) => `
      <label class="rating-chip">
        <input type="${kind}" name="${name}" value="${key}"${kind === "radio" && i === 0 ? " checked" : ""}>
        <span>${label}</span>
      </label>`)
    .join("");
}
document.getElementById("suggest-types").innerHTML = chips("type", PLACE_TYPES, "radio");
document.getElementById("suggest-good").innerHTML = chips("good", GOOD_FOR, "checkbox");

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
  });
  if (!check.ok) {
    suggestError.textContent = check.errors.join(". ");
    return;
  }

  suggestSubmit.disabled = true;
  suggestSubmit.textContent = "Отправляю…";
  try {
    await postJson(SUBMIT_URL, {
      kind: "new-place",
      ...check.data,
      message: suggestionSummary(check.data),
      _subject: `Новое место: ${check.data.name}`,
    });
    suggestForm.hidden = true;
    suggestThanks.hidden = false;
    track("suggest-place");
  } catch (err) {
    suggestError.textContent = err.message;
  } finally {
    suggestSubmit.disabled = false;
    suggestSubmit.textContent = "Отправить";
  }
});

// Theme: dark (neon) or light, remembered in localStorage
const themeBtn = document.getElementById("theme-toggle");
function paintThemeButton() {
  const light = document.documentElement.dataset.theme === "light";
  themeBtn.textContent = light ? "🌙" : "☀️";
  themeBtn.setAttribute("aria-label", light ? "Тёмная тема" : "Светлая тема");
}
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("lb-theme", next);
  paintThemeButton();
  setMapTheme(next);
});

document.getElementById("updated").textContent = `Обновлено: ${UPDATED.split("-").reverse().join(".")}`;
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
