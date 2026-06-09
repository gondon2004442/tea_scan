import { StyleSheet, View } from 'react-native';
import { SmileIcon } from './icons/SmileIcon';
import { layout } from '../theme';
import { TabMode, TabToggle } from './TabToggle';

type Tab = 'my' | 'explore';

type Props = {
  activeTab: Tab;
  tabMode: TabMode;
  onTabChange: (tab: Tab) => void;
};

export function ScreenHeader({ activeTab, tabMode, onTabChange }: Props) {
  if (tabMode === 'exploreOnly') {
    return (
      <View style={styles.headerExploreOnly}>
        <View style={styles.smileExploreOnly}>
          <SmileIcon size={layout.headerIconSize} />
        </View>
        <View style={styles.exploreOnlyPillWrap}>
          <TabToggle active={activeTab} mode="exploreOnly" onChange={onTabChange} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.headerDual}>
      <View style={styles.smileDual}>
        <SmileIcon size={layout.headerIconSize} />
      </View>
      <View style={styles.toggleWrap}>
        <TabToggle active={activeTab} mode="dual" onChange={onTabChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerExploreOnly: {
    width: '100%',
    height: layout.exploreOnlyChromeHeight,
    position: 'relative',
  },
  headerDual: {
    width: '100%',
    height: layout.exploreOnlyChromeHeight,
    position: 'relative',
  },
  smileExploreOnly: {
    position: 'absolute',
    left: layout.headerIconLeft,
    top: layout.firstOpenSmileTop,
    width: layout.headerIconSize,
    height: layout.headerIconSize,
  },
  smileDual: {
    position: 'absolute',
    left: layout.headerIconLeft,
    top: layout.firstOpenSmileTop,
    width: layout.headerIconSize,
    height: layout.headerIconSize,
  },
  exploreOnlyPillWrap: {
    position: 'absolute',
    left: layout.exploreOnlyToggleLeft,
    top: layout.exploreOnlyToggleTop,
    width: layout.exploreOnlyToggleWidth,
    height: layout.exploreOnlyToggleHeight,
  },
  toggleWrap: {
    position: 'absolute',
    top: layout.tabToggleTop,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
