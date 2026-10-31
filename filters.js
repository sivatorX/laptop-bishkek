// Pure filter logic: no page, no network. So it can be tested with `npm test`.

// "HH:MM" -> minutes after midnight
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function isQuiet(place) {
  return place.noise === "quiet";
}

export function hasSockets(place) {
  return place.sockets === "yes" || place.sockets === "some";
}

// "Late" = open until 22:00 or later. A closing time after midnight (00:00–05:59) also counts.
export function isOpenLate(place) {
  if (place.hours === "24/7") return true;
  if (!place.hours || !place.hours.close) return false;
  const close = toMinutes(place.hours.close);
  return close >= toMinutes("22:00") || close < toMinutes("06:00");
}

// Distance between two points on Earth in km (haversine formula)
export function distanceKm(a, b) {
  const R = 6371;
  const rad = (deg) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// filters: { quiet, sockets, late } (true = must have it)
// userPos: { lat, lng } or null. With a position, the list is sorted by distance,
// places without coordinates go to the end.
export function applyFilters(places, filters, userPos = null) {
  const result = places
    .filter((p) => !filters.quiet || isQuiet(p))
    .filter((p) => !filters.sockets || hasSockets(p))
    .filter((p) => !filters.late || isOpenLate(p))
    .map((p) => ({
      ...p,
      distance: userPos && p.coords ? distanceKm(userPos, p.coords) : null,
    }));

  if (userPos) {
    result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  }
  return result;
}
