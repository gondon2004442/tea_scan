import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGNED_IN_KEY = 'tea-scan:signed-in';

export type SessionUser = {
  name: string;
  email: string;
  photoURL: string | null;
};

const MOCK_USER: SessionUser = {
  name: 'Google account user',
  email: '',
  photoURL: null,
};

let signedInCache = false;

export async function hydrateSession(): Promise<void> {
  signedInCache = (await AsyncStorage.getItem(SIGNED_IN_KEY)) === '1';
}

export function isSignedIn(): boolean {
  return signedInCache;
}

export function getCurrentUser(): SessionUser | null {
  return signedInCache ? MOCK_USER : null;
}

/** Native is preview-only (web is the shipped target, which uses Firebase Google auth). */
export async function signInWithGoogle(): Promise<void> {
  signedInCache = true;
  await AsyncStorage.setItem(SIGNED_IN_KEY, '1');
}

export function signOut(): void {
  signedInCache = false;
  void AsyncStorage.removeItem(SIGNED_IN_KEY);
}
