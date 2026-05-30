import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

enableScreens(Platform.OS !== 'web');

const rootStyle =
  Platform.OS === 'web'
    ? ({ flex: 1, minHeight: '100vh', height: '100%', width: '100%' } as const)
    : { flex: 1 };

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
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
            <Stack.Screen name="my-teas" />
            <Stack.Screen name="explore" />
            <Stack.Screen
              name="tea/[id]"
              options={{
                presentation: Platform.OS === 'web' ? 'modal' : 'transparentModal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </View>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
