// Wi-Fi feedback from visitors: checking the form (pure) and sending it.

export const RATINGS = {
  fast: "🚀 Быстро",
  ok: "👌 Нормально",
  slow: "🐢 Медленно",
  broken: "❌ Не работает",
};

export const COMMENT_MAX = 300;

const MSG = {
  ru: { range: "{label}: введите число от 0 до 2000", down: "Скорость загрузки", up: "Скорость отдачи", required: "Укажите скорость загрузки (Мбит/с)" },
  en: { range: "{label}: enter a number from 0 to 2000", down: "Download speed", up: "Upload speed", required: "Enter the download speed (Mbps)" },
};

// Turns raw form values into clean data, or a list of errors (in Russian or English).
// Pure: no page, no network, so it is easy to test.
export function validateFeedback(raw, lang = "ru") {
  const msg = MSG[lang] ?? MSG.ru;
  const errors = [];
  let downBad = false;
  const toSpeed = (value, label, isDown) => {
    const text = String(value ?? "").trim().replace(",", ".");
    if (text === "") return null;
    const n = Number(text);
    if (!Number.isFinite(n) || n < 0 || n > 2000) {
      errors.push(msg.range.replace("{label}", label));
      if (isDown) downBad = true;
      return null;
    }
    return Math.round(n * 10) / 10;
  };

  const down = toSpeed(raw.down, msg.down, true);
  const up = toSpeed(raw.up, msg.up, false);
  const rating = raw.rating in RATINGS ? raw.rating : null;
  const comment = String(raw.comment ?? "").trim().slice(0, COMMENT_MAX);

  // Speed is the main thing we collect, so download speed is required
  if (down === null && !downBad) {
    errors.push(msg.required);
  }

  return {
    ok: errors.length === 0,
    errors,
    data: { placeId: raw.placeId, down, up, rating, comment, date: raw.date },
  };
}

// Saved in this browser, so the visitor sees their own review on the card
const STORAGE_KEY = "lb-feedback";

export function loadLocalFeedback() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveLocal(data) {
  const all = loadLocalFeedback().filter((f) => f.placeId !== data.placeId);
  all.push(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// Sends to SUBMIT_URL (if set) and always keeps a local copy.
// Returns { sent: true } or { sent: false } (no address yet) or throws a friendly error.
export async function submitFeedback(data, submitUrl) {
  saveLocal(data);
  if (!submitUrl) return { sent: false };
  await postJson(submitUrl, data);
  return { sent: true };
}

// POST JSON with a 10 s timeout. Throws a friendly Russian error on any problem.
export async function postJson(url, data) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch {
    throw new Error("Не получилось отправить. Проверьте интернет и попробуйте ещё раз.");
  } finally {
    clearTimeout(timer);
  }
}
