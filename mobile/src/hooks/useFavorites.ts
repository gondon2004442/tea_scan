import { useCallback, useEffect, useState } from 'react';
import { AppState, DeviceEventEmitter, Platform } from 'react-native';
import {
  FAVORITES_CHANGED_EVENT,
  getFavorites,
} from '../storage/favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const sync = useCallback(() => {
    setFavoriteIds(getFavorites());
  }, []);

  useEffect(() => {
    sync();

    if (Platform.OS === 'web') {
      const onFocus = () => sync();
      window.addEventListener('focus', onFocus);
      window.addEventListener(FAVORITES_CHANGED_EVENT, sync);
      return () => {
        window.removeEventListener('focus', onFocus);
        window.removeEventListener(FAVORITES_CHANGED_EVENT, sync);
      };
    }

    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        sync();
      }
    });
    const favoritesSub = DeviceEventEmitter.addListener(
      FAVORITES_CHANGED_EVENT,
      sync,
    );

    return () => {
      appStateSub.remove();
      favoritesSub.remove();
    };
  }, [sync]);

  return { favoriteIds, hasMyTeasTab: favoriteIds.length >= 1 };
}
