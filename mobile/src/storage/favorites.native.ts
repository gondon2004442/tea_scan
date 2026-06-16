import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

const KEY = 'tea-scan:favorites';

export const FAVORITES_CHANGED_EVENT = 'tea-scan:favorites-changed';

let favoritesCache: string[] = [];

async function readFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === 'string');
  } catch {
    return [];
  }
}

export async function hydrateFavorites(): Promise<void> {
  favoritesCache = await readFavorites();
}

function notifyFavoritesChanged() {
  DeviceEventEmitter.emit(FAVORITES_CHANGED_EVENT);
}

export function getFavorites(): string[] {
  return favoritesCache;
}

export function setFavorites(ids: string[]) {
  favoritesCache = [...new Set(ids)];
  void AsyncStorage.setItem(KEY, JSON.stringify(favoritesCache));
}

export function clearFavorites(): void {
  favoritesCache = [];
  void AsyncStorage.removeItem(KEY);
  notifyFavoritesChanged();
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
