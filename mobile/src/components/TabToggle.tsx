import { Pressable, StyleSheet, View } from 'react-native';

import { colors, layout } from '../theme';

import { ExploreIcon, HeartIcon, SparkleIcon } from './icons/TabIcons';

export type Tab = 'my' | 'explore' | 'quiz';

export type TabMode = 'exploreOnly' | 'dual';

type Props = {
  active: Tab;
  mode: TabMode;
  onChange: (tab: Tab) => void;
};

export function TabToggle({ active, mode, onChange }: Props) {
  const tabs: Tab[] = mode === 'dual' ? ['my', 'explore', 'quiz'] : ['explore', 'quiz'];

  return (
    <View style={[styles.wrap, { width: layout.tabItemWidth * tabs.length }]}>
      {tabs.map((tab) => {
        const isActive = active === tab;
        const iconColor = isActive ? colors.white : colors.textBlack;
        return (
          <Pressable
            key={tab}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onChange(tab)}
            accessibilityRole="button"
            accessibilityLabel={tab}
          >
            {tab === 'my' && <HeartIcon color={iconColor} />}
            {tab === 'explore' && <ExploreIcon color={iconColor} />}
            {tab === 'quiz' && <SparkleIcon color={iconColor} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
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
