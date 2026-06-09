import { clearFavorites } from './favorites.web';

const SIGNED_IN_KEY = 'tea-scan:signed-in';

function isBrowser() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

/** Preview-only mock sign-in. Replace with Google OAuth later. */
export function isSignedIn(): boolean {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(SIGNED_IN_KEY) === '1';
}

export function signInWithGoogleMock(): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(SIGNED_IN_KEY, '1');
  clearFavorites();
}

export function signOut(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SIGNED_IN_KEY);
}
