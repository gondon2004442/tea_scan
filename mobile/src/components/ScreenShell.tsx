import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View, type ColorValue } from 'react-native';

type Props = {
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  locations?: readonly [number, number, ...number[]];
  children: React.ReactNode;
};

/** Full-screen gradient + content layer (web-safe stacking). */
export function ScreenShell({ colors, locations, children }: Props) {
  return (
    <View style={styles.shell}>
      <LinearGradient
        colors={colors}
        locations={locations}
        style={styles.gradient}
        pointerEvents="none"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? ({ minHeight: '100%', height: '100%' } as object)
      : {}),
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  content: {
    flex: 1,
    width: '100%',
    zIndex: 1,
    minHeight: 0,
  },
});
