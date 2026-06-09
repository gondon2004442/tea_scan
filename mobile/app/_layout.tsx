import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { TeaModalProvider } from '../src/context/TeaModalContext';
import { useAppFonts } from '../src/fonts';

enableScreens(Platform.OS !== 'web');

const rootStyle =
  Platform.OS === 'web'
    ? ({ flex: 1, minHeight: '100vh', height: '100%', width: '100%' } as const)
    : { flex: 1 };

export default function RootLayout() {
  const { loaded } = useAppFonts();

  if (!loaded) {
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
            </Stack>
          </View>
        </TeaModalProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
