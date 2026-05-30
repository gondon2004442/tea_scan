import { Pressable, StyleSheet, View } from 'react-native';
import { colors, layout } from '../theme';
import { ExploreIcon, HeartIcon } from './icons/TabIcons';

type Tab = 'my' | 'explore';

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export function TabToggle({ active, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.item, active === 'my' && styles.itemActive]}
        onPress={() => onChange('my')}
      >
        <HeartIcon color={active === 'my' ? colors.white : colors.textBlack} />
      </Pressable>
      <Pressable
        style={[styles.item, active === 'explore' && styles.itemActive]}
        onPress={() => onChange('explore')}
      >
        <ExploreIcon color={active === 'explore' ? colors.white : colors.textBlack} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    width: layout.tabToggleWidth,
    height: layout.tabToggleHeight,
    backgroundColor: colors.white,
    borderRadius: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  item: {
    width: layout.tabItemWidth,
    height: layout.tabToggleHeight,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemActive: {
    backgroundColor: colors.toggleActive,
    borderColor: colors.white,
  },
});
