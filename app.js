// The page: reads the places, applies filters, draws the cards.
import { PLACES, UPDATED } from "./data/places.js";
import { applyFilters } from "./filters.js";

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
