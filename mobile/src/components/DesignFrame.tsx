import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { DESIGN } from '../theme';

/** Figma frame 390×844 — centered on web */
export function DesignFrame({ children, style, ...rest }: ViewProps) {
  return (
    <View style={styles.outer}>
      <View style={[styles.frame, style]} {...rest}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    ...(Platform.OS === 'web'
      ? ({ minHeight: '100%', height: '100%' } as object)
      : {}),
  },
  frame: {
    flex: 1,
    width: DESIGN.width,
    maxWidth: '100%',
    backgroundColor: '#dce49c',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          height: '100%',
          minHeight: '100%',
          maxHeight: '100vh',
        } as object)
      : {}),
  },
});
