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

// Free to sit and work (libraries, free coworkings). Marked with free: true in places.js
export function isFree(place) {
  return place.free === true;
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

// More detail than isOpenNow, for the status line on a card:
//   { state: "always" }                         open 24/7
//   { state: "open", until: "23:00" }           open
//   { state: "closing", until, minutesLeft }    closes within an hour
//   { state: "closed", opensAt: "08:00", inDays }  inDays: 0 = today, 1 = tomorrow, 2+ = later
//   { state: "unknown" }                        we don't know the hours
export function openInfo(place, time = bishkekTime(), day = bishkekDay()) {
  if (place.hours === "24/7") return { state: "always" };
  if (!place.hours) return { state: "unknown" };
  const now = toMinutes(time);
  const open = toMinutes(place.hours.open);
  const close = toMinutes(place.hours.close);
  const until = place.hours.close;

  if (isOpenNow(place, time, day)) {
    // Minutes until closing; the closing time may be after midnight
    let left = close - now;
    if (left <= 0) left += 24 * 60;
    return left <= 60 ? { state: "closing", until, minutesLeft: left } : { state: "open", until };
  }

  // Closed: find the next day it opens (today counts only if it opens later today)
  const closedDays = place.closedDays ?? [];
  const startToday = now < open && !closedDays.includes(day) ? 0 : 1;
  for (let inDays = startToday; inDays <= 7; inDays++) {
    if (!closedDays.includes((day + inDays) % 7)) {
      return { state: "closed", opensAt: place.hours.open, inDays, day: (day + inDays) % 7 };
    }
  }
  return { state: "closed", opensAt: null };
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

// Search text: lower case, "ё" = "е", extra spaces removed
function normalize(text) {
  return String(text ?? "").toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

// Does the place match the search? Looks in the name and the address
// (in both languages, if the place has Russian copies: nameRu, addressRu).
// Every word must be found, so "манаса sierra" works too.
export function matchesQuery(place, query) {
  const words = normalize(query).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalize(`${place.name} ${place.address} ${place.nameRu ?? ""} ${place.addressRu ?? ""}`);
  return words.every((w) => haystack.includes(w));
}

// "New" = added in the last 14 days (place.added = "YYYY-MM-DD"; places without it are not new)
export function isNew(place, today = new Date().toISOString().slice(0, 10), days = 14) {
  if (!place.added) return false;
  const age = (Date.parse(today) - Date.parse(place.added)) / 86400000;
  return age >= 0 && age < days;
}

// "Куда пойти сейчас?": one place that is open right now.
// places: already passed through applyFilters (they have openNow and distance).
// With a position: one of the 3 nearest. Without: places with measured Wi-Fi first, else any open one.
// random() is a parameter so tests can make the choice predictable.
export function pickPlace(places, random = Math.random) {
  const open = places.filter((p) => p.openNow === true);
  if (open.length === 0) return null;
  let pool;
  if (open.some((p) => p.distance != null)) {
    pool = [...open].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)).slice(0, 3);
  } else {
    const measured = open.filter((p) => p.wifi);
    pool = measured.length ? measured : open;
  }
  return pool[Math.floor(random() * pool.length)];
}

// filters: { quiet, sockets, late, openNow, free, favorites, favoriteIds } (true = must have it), query: search text
// userPos: { lat, lng } or null.
// Order: with a position, by distance (no coordinates go to the end).
// Without it, by our measured Wi-Fi speed, fastest first (unmeasured keep their order at the end).
export function applyFilters(places, filters, userPos = null, time = bishkekTime(), day = bishkekDay()) {
  const result = places
    .filter((p) => matchesQuery(p, filters.query))
    .filter((p) => !filters.quiet || isQuiet(p))
    .filter((p) => !filters.sockets || hasSockets(p))
    .filter((p) => !filters.late || isOpenLate(p))
    .filter((p) => !filters.openNow || isOpenNow(p, time, day) === true)
    .filter((p) => !filters.free || isFree(p))
    .filter((p) => !filters.favorites || (filters.favoriteIds ?? []).includes(p.id))
    .map((p) => ({
      ...p,
      distance: userPos && p.coords ? distanceKm(userPos, p.coords) : null,
      openNow: isOpenNow(p, time, day),
      openInfo: openInfo(p, time, day),
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
