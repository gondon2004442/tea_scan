import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearFavorites } from './favorites';

const SIGNED_IN_KEY = 'tea-scan:signed-in';

let signedInCache = false;

export async function hydrateSession(): Promise<void> {
  signedInCache = (await AsyncStorage.getItem(SIGNED_IN_KEY)) === '1';
}

/** Preview-only mock sign-in. Replace with Google OAuth later. */
export function isSignedIn(): boolean {
  return signedInCache;
}

export function signInWithGoogleMock(): void {
  signedInCache = true;
  void AsyncStorage.setItem(SIGNED_IN_KEY, '1');
  clearFavorites();
}

export function signOut(): void {
  signedInCache = false;
  void AsyncStorage.removeItem(SIGNED_IN_KEY);
}
