// Wi-Fi feedback from visitors: checking the form (pure) and sending it.

export const RATINGS = {
  fast: "🚀 Быстро",
  ok: "👌 Нормально",
  slow: "🐢 Медленно",
  broken: "❌ Не работает",
};

export const COMMENT_MAX = 300;

// Turns raw form values into clean data, or a list of errors in Russian.
// Pure: no page, no network, so it is easy to test.
export function validateFeedback(raw) {
  const errors = [];
  const toSpeed = (value, label) => {
    const text = String(value ?? "").trim().replace(",", ".");
    if (text === "") return null;
    const n = Number(text);
    if (!Number.isFinite(n) || n < 0 || n > 2000) {
      errors.push(`${label}: введите число от 0 до 2000`);
      return null;
    }
    return Math.round(n * 10) / 10;
  };

  const down = toSpeed(raw.down, "Скорость загрузки");
  const up = toSpeed(raw.up, "Скорость отдачи");
  const rating = raw.rating in RATINGS ? raw.rating : null;
  const comment = String(raw.comment ?? "").trim().slice(0, COMMENT_MAX);

  // Speed is the main thing we collect, so download speed is required
  if (down === null && !errors.some((e) => e.startsWith("Скорость загрузки"))) {
    errors.push("Укажите скорость загрузки (Мбит/с)");
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(submitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { sent: true };
  } catch {
    throw new Error("Не получилось отправить. Проверьте интернет и попробуйте ещё раз.");
  } finally {
    clearTimeout(timer);
  }
}
