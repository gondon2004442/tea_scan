import { useCallback, useEffect, useState } from 'react';
import {
  FAVORITES_CHANGED_EVENT,
  getFavorites,
} from '../storage/favorites.web';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const sync = useCallback(() => {
    setFavoriteIds(getFavorites());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('focus', sync);
    window.addEventListener(FAVORITES_CHANGED_EVENT, sync);
    return () => {
      window.removeEventListener('focus', sync);
      window.removeEventListener(FAVORITES_CHANGED_EVENT, sync);
    };
  }, [sync]);

  return { favoriteIds, hasMyTeasTab: favoriteIds.length >= 1 };
}
