import { t } from "./i18n.js?v=202611130559";

// The map view. Leaflet (a free map library) is loaded only when the map is opened,
// so the list stays fast for people who never open the map.

const LEAFLET = "https://unpkg.com/leaflet@1.9.4/dist/";
const BISHKEK = [42.8746, 74.6122];
const TYPE_COLOR = { cafe: "#ff2e88", coworking: "#3ad8ff", library: "#b46cff" };
// Free map pictures from OpenStreetMap. The dark look is made with a CSS filter (see .map--dark in style.css)
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

let leafletReady = null;
let map = null;
let tiles = null;
let markers = null;

function loadLeaflet() {
  if (leafletReady) return leafletReady;
  leafletReady = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${LEAFLET}leaflet.css`;
    document.head.append(css);

    const js = document.createElement("script");
    js.src = `${LEAFLET}leaflet.js`;
    js.onload = () => resolve(window.L);
    js.onerror = () => {
      leafletReady = null; // allow a retry next time
      reject(new Error(t("mapError")));
    };
    document.head.append(js);
  });
  return leafletReady;
}

function setTheme(L, theme) {
  if (!tiles) {
    tiles = L.tileLayer(TILES, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }
  map.getContainer().classList.toggle("map--dark", theme !== "light");
}

// places: already filtered; popupHtml(place) gives the popup content
export async function showMap(container, places, { userPos, theme, popupHtml }) {
  const L = await loadLeaflet();

  if (!map) {
    map = L.map(container, { scrollWheelZoom: false }).setView(BISHKEK, 13);
    setTheme(L, theme);
    markers = L.layerGroup().addTo(map);
  }
  // The box may have been hidden: let Leaflet measure it again
  map.invalidateSize();

  markers.clearLayers();
  const points = [];
  for (const place of places) {
    if (!place.coords) continue;
    const point = [place.coords.lat, place.coords.lng];
    points.push(point);
    L.circleMarker(point, {
      radius: place.wifi ? 11 : 9,
      color: "#ffffff",
      weight: 2,
      fillColor: TYPE_COLOR[place.type] ?? "#3ad8ff",
      fillOpacity: 0.95,
      className: `pin pin--${place.type}`,
    })
      .bindPopup(popupHtml(place), { className: "neon-popup" })
      .addTo(markers);
  }

  if (userPos) {
    const me = [userPos.lat, userPos.lng];
    points.push(me);
    L.circleMarker(me, { radius: 8, color: "#ffffff", weight: 3, fillColor: "#4dffa6", fillOpacity: 1, className: "pin pin--me" })
      .bindPopup(t("mapYou"))
      .addTo(markers);
  }

  if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
  else if (points.length === 1) map.setView(points[0], 15);
}

export function setMapTheme(theme) {
  if (map && window.L) setTheme(window.L, theme);
}
