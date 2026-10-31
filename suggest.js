// "Предложить место": a visitor sends a new cafe or coworking. Checking the form (pure).

export const PLACE_TYPES = { cafe: "☕ Кафе", coworking: "💻 Коворкинг", other: "📚 Другое" };
export const GOOD_FOR = { wifi: "📶 Быстрый Wi-Fi", sockets: "🔌 Розетки", quiet: "🤫 Тихо", late: "🌙 Допоздна" };

const MAX = { name: 80, address: 120, comment: 300 };

export function validateSuggestion(raw) {
  const errors = [];
  const text = (value, max) => String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);

  const name = text(raw.name, MAX.name);
  const address = text(raw.address, MAX.address);
  const comment = text(raw.comment, MAX.comment);
  const type = raw.type in PLACE_TYPES ? raw.type : "other";
  // Checkboxes come as a list; keep only the ones we know
  const good = [].concat(raw.good ?? []).filter((g) => g in GOOD_FOR);

  if (name.length < 2) errors.push("Напишите название места");
  if (address.length < 3) errors.push("Напишите адрес или район");

  return { ok: errors.length === 0, errors, data: { name, address, type, good, comment } };
}

// Readable text for the email
export function suggestionSummary(data) {
  return [
    `${PLACE_TYPES[data.type]}: ${data.name}`,
    `Адрес: ${data.address}`,
    data.good.length ? `Чем хорошо: ${data.good.map((g) => GOOD_FOR[g]).join(", ")}` : "",
    data.comment ? `Комментарий: ${data.comment}` : "",
  ].filter(Boolean).join("\n");
}
