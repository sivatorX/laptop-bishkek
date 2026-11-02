// QR stickers: one card per place, with a QR code that opens the speed form (#wifi=<id>).
import { PLACES } from "./data/places.js?v=202611021133";
import { startStats } from "./stats.js?v=202611021133";

const SITE = "https://sivatorx.github.io/laptop-bishkek/";
const COPIES = 4; // one place = a full A4 page of 4 stickers

const select = document.getElementById("place");
const sheet = document.getElementById("sheet");

function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// The QR picture is made by a free service: we send the link, it returns a PNG
function qrSrc(link) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=440x440&margin=8&data=${encodeURIComponent(link)}`;
}

function sticker(place) {
  const link = `${SITE}#wifi=${place.id}`;
  return `
    <article class="sticker">
      <p class="sticker-logo">💻 Laptop <span>Bishkek</span></p>
      <h2 class="sticker-title">Работаете с ноутбуком?</h2>
      <p class="sticker-text">Сканируйте и сообщите скорость Wi-Fi.<br>Это 30 секунд и помощь другим 💙</p>
      <p class="sticker-en">EN: Working on a laptop? Scan and report the Wi-Fi speed.</p>
      <img src="${qrSrc(link)}" alt="QR-код: сообщить скорость Wi-Fi в ${esc(place.name)}">
      <p class="sticker-place">${esc(place.name)}</p>
      <p class="sticker-url">sivatorx.github.io/laptop-bishkek</p>
    </article>`;
}

function render() {
  const chosen = PLACES.find((p) => p.id === select.value);
  const cards = chosen ? Array(COPIES).fill(chosen) : PLACES;
  sheet.innerHTML = cards.map(sticker).join("");
}

select.innerHTML = [
  `<option value="">Все места (по одной)</option>`,
  ...PLACES.map((p) => `<option value="${esc(p.id)}">${esc(p.name)} — ${esc(p.address)}</option>`),
].join("");

// qr.html?place=sierra-manas opens one place right away
const fromLink = new URLSearchParams(location.search).get("place");
if (PLACES.some((p) => p.id === fromLink)) select.value = fromLink;

select.addEventListener("change", render);
document.getElementById("print").addEventListener("click", () => window.print());
render();
startStats();
