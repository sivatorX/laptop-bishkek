// Weather in Bishkek right now (Open-Meteo: free, no key) + a friendly tip and greeting.
// The pure parts (describeWeather, greetingKey) are tested; loadWeather talks to the network.

const API = "https://api.open-meteo.com/v1/forecast?latitude=42.8746&longitude=74.6122&current=temperature_2m,weather_code,is_day&timezone=Asia%2FBishkek";
const CACHE_KEY = "lb-weather";
const CACHE_MINUTES = 30;

// WMO weather code → icon + which tip to show (tip keys are texts in i18n.js)
export function describeWeather(code, temp, isDay = true) {
  let icon;
  let kind;
  if (code === 0) { icon = isDay ? "☀️" : "🌙"; kind = "clear"; }
  else if (code <= 3) { icon = isDay ? "⛅" : "☁️"; kind = "cloudy"; }
  else if (code === 45 || code === 48) { icon = "🌫"; kind = "fog"; }
  else if ((code >= 71 && code <= 77) || code === 85 || code === 86) { icon = "❄️"; kind = "snow"; }
  else if (code >= 95) { icon = "⛈"; kind = "rain"; }
  else if (code >= 51) { icon = "🌧"; kind = "rain"; }
  else { icon = "🌡"; kind = "cloudy"; }

  // The tip: bad weather → "work in a cafe", very cold / hot → its own tip, nice → "go somewhere new"
  let tip;
  if (kind === "rain" || kind === "snow" || kind === "fog") tip = "tip.bad";
  else if (temp <= 3) tip = "tip.cold";
  else if (temp >= 32) tip = "tip.hot";
  else tip = "tip.nice";
  return { icon, tip, temp: Math.round(temp) };
}

// Hour in Bishkek (0–23) → greeting text key
export function greetingKey(hour) {
  if (hour >= 5 && hour < 12) return "hello.morning";
  if (hour >= 12 && hour < 18) return "hello.day";
  if (hour >= 18 && hour < 23) return "hello.evening";
  return "hello.night";
}

// Gets { code, temp, isDay }, from a 30-minute cache if possible. Returns null if anything fails:
// the weather is a nice extra, the site must work without it.
export async function loadWeather() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.at < CACHE_MINUTES * 60000) return cached.data;
  } catch {
    // broken cache: just load again
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(API, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const { current } = await res.json();
    const data = { code: current.weather_code, temp: current.temperature_2m, isDay: current.is_day === 1 };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
    return data;
  } catch {
    return null;
  }
}
