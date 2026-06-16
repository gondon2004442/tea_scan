const KEY = 'tea-scan:favorites';

export async function hydrateFavorites(): Promise<void> {
  // localStorage is synchronous on web.
}

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

export function clearFavorites(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
  notifyFavoritesChanged();
}

export const FAVORITES_CHANGED_EVENT = 'tea-scan:favorites-changed';

function notifyFavoritesChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
  }
}

export function toggleFavorite(id: string): string[] {
  const current = getFavorites();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  setFavorites(next);
  notifyFavoritesChanged();
  return next;
}
