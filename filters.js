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

// Current time in Bishkek as "HH:MM" (correct even if the visitor's phone is in another time zone)
export function bishkekTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bishkek",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

// Day of the week in Bishkek: 0 = Sunday … 6 = Saturday
export function bishkekDay(date = new Date()) {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bishkek", weekday: "short" }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

// true = open, false = closed, null = we don't know the hours.
// place.closedDays: optional list of days off, e.g. [0] = closed on Sunday.
export function isOpenNow(place, time = bishkekTime(), day = bishkekDay()) {
  if (place.hours === "24/7") return true;
  if (!place.hours) return null;
  if (place.closedDays?.includes(day)) return false;
  const now = toMinutes(time);
  const open = toMinutes(place.hours.open);
  const close = toMinutes(place.hours.close);
  // Closes after midnight (e.g. 08:00–02:00): open in the evening part OR the night part
  if (close <= open) return now >= open || now < close;
  return now >= open && now < close;
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

// filters: { quiet, sockets, late, openNow } (true = must have it)
// userPos: { lat, lng } or null.
// Order: with a position, by distance (no coordinates go to the end).
// Without it, by our measured Wi-Fi speed, fastest first (unmeasured keep their order at the end).
export function applyFilters(places, filters, userPos = null, time = bishkekTime(), day = bishkekDay()) {
  const result = places
    .filter((p) => !filters.quiet || isQuiet(p))
    .filter((p) => !filters.sockets || hasSockets(p))
    .filter((p) => !filters.late || isOpenLate(p))
    .filter((p) => !filters.openNow || isOpenNow(p, time, day) === true)
    .map((p) => ({
      ...p,
      distance: userPos && p.coords ? distanceKm(userPos, p.coords) : null,
      openNow: isOpenNow(p, time, day),
    }));

  if (userPos) {
    result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  } else {
    result.sort((a, b) => (b.wifi?.down ?? -1) - (a.wifi?.down ?? -1));
  }
  return result;
}

// Id of the place with the fastest measured Wi-Fi (for the 🏆 badge), or null
export function fastestId(places) {
  const measured = places.filter((p) => p.wifi);
  if (measured.length === 0) return null;
  return measured.reduce((best, p) => (p.wifi.down > best.wifi.down ? p : best)).id;
}
