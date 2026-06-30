import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { TeaModalProvider } from '../src/context/TeaModalContext';
import { useAppFonts } from '../src/fonts';
import { useTeaImagePreload } from '../src/hooks/useTeaImagePreload';
import { hydrateFavorites } from '../src/storage/favorites';
import { hydrateSession } from '../src/storage/session';

enableScreens(Platform.OS !== 'web');

const rootStyle =
  Platform.OS === 'web'
    ? ({ flex: 1, minHeight: '100vh', height: '100%', width: '100%' } as const)
    : { flex: 1 };

export default function RootLayout() {
  const { loaded: fontsLoaded } = useAppFonts();
  const [storageReady, setStorageReady] = useState(Platform.OS === 'web');
  useTeaImagePreload(fontsLoaded && storageReady);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    void Promise.all([hydrateSession(), hydrateFavorites()]).then(() => {
      setStorageReady(true);
    });
  }, []);

  if (!fontsLoaded || !storageReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <TeaModalProvider>
          <View style={rootStyle}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { flex: 1 },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="my-teas" />
              <Stack.Screen name="explore" />
              <Stack.Screen name="quiz" />
            </Stack>
          </View>
        </TeaModalProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
