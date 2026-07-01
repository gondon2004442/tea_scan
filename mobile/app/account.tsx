import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DesignFrame } from '../src/components/DesignFrame';
import { ScreenShell } from '../src/components/ScreenShell';
import { useRequireAuth } from '../src/hooks/useRequireAuth';
import { signOut } from '../src/storage/session';
import { colors } from '../src/theme';

function BackArrow({ size = 23, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 12H5M5 12L11 6M5 12L11 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function AccountScreen() {
  const router = useRouter();
  useRequireAuth();

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/explore');
    }
  }

  function handleLogout() {
    signOut();
    router.replace('/login');
  }

  return (
    <DesignFrame>
      <ScreenShell colors={[colors.white, colors.white]} locations={[0, 1]}>
        <View style={styles.screen}>
          <Pressable
            style={styles.back}
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
          >
            <BackArrow />
          </Pressable>

          <View style={styles.avatar} />

          <Text style={styles.name}>google account user</Text>

          <Pressable
            style={styles.logout}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Text style={styles.logoutText}>log out</Text>
          </Pressable>
        </View>
      </ScreenShell>
    </DesignFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'relative',
    ...(Platform.OS === 'web' ? ({ height: '100%' } as object) : {}),
  },
  back: {
    position: 'absolute',
    left: 33,
    top: 66,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    position: 'absolute',
    left: 115,
    top: 97,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#D9D9D9',
  },
  name: {
    position: 'absolute',
    top: 300,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 20,
    lineHeight: 28,
    color: '#000000',
  },
  logout: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 18,
    lineHeight: 28,
    color: '#FF0000',
  },
});
