import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';

// Public web config (safe to ship in the client bundle).
const firebaseConfig = {
  apiKey: 'AIzaSyBFmIdNyKxcjqQzknw0U-Y3YbERhrljUQw',
  authDomain: 'teascan.firebaseapp.com',
  projectId: 'teascan',
  storageBucket: 'teascan.firebasestorage.app',
  messagingSenderId: '670551440970',
  appId: '1:670551440970:web:1856a7a832f054691670b3',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export type SessionUser = {
  name: string;
  email: string;
  photoURL: string | null;
};

let currentUser: SessionUser | null = null;

function mapUser(u: User | null): SessionUser | null {
  if (!u) return null;
  return {
    name: u.displayName ?? 'Google account user',
    email: u.email ?? '',
    photoURL: u.photoURL,
  };
}

/** Resolve once the initial Firebase auth state is known; keep the cache updated after. */
export function hydrateSession(): Promise<void> {
  return new Promise((resolve) => {
    let resolved = false;
    onAuthStateChanged(auth, (u) => {
      currentUser = mapUser(u);
      if (!resolved) {
        resolved = true;
        resolve();
      }
    });
  });
}

export function isSignedIn(): boolean {
  return currentUser !== null;
}

export function getCurrentUser(): SessionUser | null {
  return currentUser;
}

export async function signInWithGoogle(): Promise<void> {
  await setPersistence(auth, browserLocalPersistence);
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  currentUser = mapUser(result.user);
}

export function signOut(): void {
  currentUser = null;
  void firebaseSignOut(auth);
}
