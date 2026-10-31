// The page: reads the places, applies filters, draws the cards.
import { PLACES, UPDATED } from "./data/places.js";
import { applyFilters } from "./filters.js";
import { RATINGS, validateFeedback, submitFeedback, loadLocalFeedback } from "./feedback.js";
import { SUBMIT_URL } from "./config.js";

const TYPE_LABEL = { cafe: "Кафе", coworking: "Коворкинг", library: "Библиотека" };
const SOCKETS_LABEL = { yes: "есть", some: "есть, но не везде", no: "нет" };
const NOISE_LABEL = { quiet: "тихо", medium: "средне", loud: "шумно" };
const UNKNOWN = "не проверено";

const state = { quiet: false, sockets: false, late: false, userPos: null };

const listEl = document.getElementById("list");
const statusEl = document.getElementById("status");
const nearBtn = document.getElementById("near-me");

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

function wifiBlock(place) {
  if (place.wifi) {
    return `
      <div class="wifi wifi--measured">
        <span class="wifi-speed">${esc(place.wifi.down)}<small> Мбит/с</small></span>
        <span class="wifi-sub">↑ ${esc(place.wifi.up)} · замер ${esc(place.wifi.measuredAt)}</span>
      </div>`;
  }
  return `
    <div class="wifi">
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

function card(place) {
  const distance = place.distance != null
    ? `<span class="distance">${place.distance < 1 ? `${Math.round(place.distance * 1000)} м` : `${place.distance.toFixed(1)} км`}</span>`
    : "";
  return `
    <li class="card">
      <div class="card-head">
        <span class="badge badge--${place.type}">${TYPE_LABEL[place.type]}</span>
        ${place.wifi ? `<span class="badge badge--verified">✓ Проверено</span>` : ""}
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
      ${place.note ? `<p class="note">${esc(place.note)}</p>` : ""}
      ${myReview(place.id)}
      <button class="btn-review" type="button" data-review="${esc(place.id)}">📶 Сообщить скорость Wi-Fi</button>
      <div class="card-foot">
        <a class="btn" href="${mapLink(place)}" target="_blank" rel="noopener">📍 ${esc(place.address)}</a>
        ${place.source ? `<a class="source" href="${esc(place.source)}" target="_blank" rel="noopener">источник</a>` : ""}
      </div>
    </li>`;
}

function render() {
  const places = applyFilters(PLACES, state, state.userPos);
  listEl.innerHTML = places.map(card).join("");

  const anyFilter = state.quiet || state.sockets || state.late;
  if (places.length === 0) {
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
  const btn = event.target.closest("[data-review]");
  if (btn) openReview(btn.dataset.review);
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
    const { sent } = await submitFeedback(check.data, SUBMIT_URL);
    document.getElementById("wifi-thanks-text").textContent = sent
      ? "Ваш отзыв отправлен. Мы проверим его и добавим на сайт."
      : "Отзыв сохранён на этом устройстве. Отправка на сервер пока не подключена.";
    form.hidden = true;
    thanks.hidden = false;
    render(); // show "Ваш отзыв" on the card
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить";
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
});

document.getElementById("updated").textContent = `Обновлено: ${UPDATED.split("-").reverse().join(".")}`;
paintThemeButton();
render();

// A link like ...#wifi=sierra-manas opens the speed form right away (good for a QR code on a cafe table)
const fromLink = location.hash.match(/^#wifi=([\w-]+)$/);
if (fromLink) openReview(fromLink[1]);
