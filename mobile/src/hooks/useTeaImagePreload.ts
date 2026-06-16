import { Image } from 'expo-image';
import { useEffect } from 'react';
import { getTeaImagePreloadSources } from '../assets';

export function useTeaImagePreload(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const sources = getTeaImagePreloadSources();
    void Promise.all(sources.map((source) => Image.prefetch(source)));
  }, [enabled]);
}
