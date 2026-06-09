import { useFonts } from 'expo-font';

export function useAppFonts() {
  const [loaded, error] = useFonts({
    Kapakana: require('../assets/fonts/Kapakana-Regular.ttf'),
  });

  return { loaded, error };
}
