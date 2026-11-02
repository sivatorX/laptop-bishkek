// "Избранное": places the visitor saved with ♡. Kept only in this browser (localStorage).
const KEY = "lb-favorites";

export function loadFavorites() {
  try {
    const ids = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

// Add or remove one place. Returns true if it is saved now.
export function toggleFavorite(id) {
  const ids = loadFavorites();
  const saved = !ids.includes(id);
  const next = saved ? [...ids, id] : ids.filter((x) => x !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return saved;
}
