const KEY = 'tea-scan:favorites';

function isBrowser() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export function getFavorites(): string[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === 'string');
  } catch {
    return [];
  }
}

export function setFavorites(ids: string[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify([...new Set(ids)]));
}

export function toggleFavorite(id: string): string[] {
  const current = getFavorites();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  setFavorites(next);
  return next;
}
