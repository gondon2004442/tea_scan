import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { isSignedIn } from '../storage/session.web';

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn()) {
      router.replace('/login');
    }
  }, [router]);
}
