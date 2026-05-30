import { Image, StyleSheet, Text, View } from 'react-native';
import { images } from '../assets';
import { colors, layout, typography } from '../theme';

export function SafariBar() {
  return (
    <View style={styles.wrap}>
      <View style={styles.search}>
        <Image source={images.iconSettings} style={styles.settingsIcon} resizeMode="contain" />
        <Text style={styles.url}>teascan.com</Text>
        <Image source={images.iconReload} style={styles.reloadIcon} resizeMode="contain" />
      </View>
      <View style={styles.toolbar}>
        <Text style={styles.toolIcon}>‹</Text>
        <Text style={styles.toolIcon}>›</Text>
        <Text style={styles.toolIcon}>↗</Text>
        <Text style={styles.toolIcon}>☐</Text>
        <Text style={styles.toolIcon}>···</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: layout.safariWidth,
    alignSelf: 'center',
    minHeight: layout.safariHeight,
    backgroundColor: colors.safariBarBg,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 6,
    marginBottom: layout.safariBottom,
    gap: 5,
  },
  search: {
    width: 326,
    height: 42,
    alignSelf: 'center',
    backgroundColor: colors.safariSearchBg,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  settingsIcon: {
    position: 'absolute',
    left: 15,
    width: 15,
    height: 18,
  },
  url: {
    ...typography.safariUrl,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '500',
  },
  reloadIcon: {
    position: 'absolute',
    right: 13,
    width: 15,
    height: 18,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    height: 44,
    paddingVertical: 8,
  },
  toolIcon: {
    fontSize: 22,
    color: '#1B1B1B',
    width: 24,
    textAlign: 'center',
  },
});
