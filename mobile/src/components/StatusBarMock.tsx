import { StyleSheet, Text, View } from 'react-native';
import { layout } from '../theme';

export function StatusBarMock() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.time}>9:41</Text>
      <View style={styles.island} />
      <View style={styles.right}>
        <View style={styles.signal}>
          <View style={[styles.bar, styles.bar1]} />
          <View style={[styles.bar, styles.bar2]} />
          <View style={[styles.bar, styles.bar3]} />
          <View style={[styles.bar, styles.bar4]} />
        </View>
        <View style={styles.wifi} />
        <View style={styles.battery}>
          <View style={styles.batteryFill} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: layout.statusBarHeight,
    paddingTop: 14,
    paddingBottom: 12,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    position: 'absolute',
    left: 77,
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.4,
  },
  island: {
    width: 124,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
  },
  right: {
    position: 'absolute',
    right: 35,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  signal: {
    width: 19,
    height: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 1,
  },
  bar: {
    width: 3,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  bar1: { height: 4, opacity: 0.6 },
  bar2: { height: 6, opacity: 0.75 },
  bar3: { height: 8, opacity: 0.9 },
  bar4: { height: 10, opacity: 1 },
  wifi: {
    width: 17,
    height: 12,
    borderWidth: 1.3,
    borderColor: '#000',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
    borderRadius: 4,
  },
  battery: {
    width: 27,
    height: 13,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    padding: 2,
    justifyContent: 'center',
  },
  batteryFill: {
    width: 21,
    height: 9,
    backgroundColor: '#000',
    borderRadius: 2,
  },
});
