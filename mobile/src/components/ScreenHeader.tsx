import { StyleSheet, View } from 'react-native';
import { SmileIcon } from './icons/SmileIcon';
import { layout } from '../theme';
import { TabMode, TabToggle, type Tab } from './TabToggle';

type Props = {
  activeTab: Tab;
  tabMode: TabMode;
  onTabChange: (tab: Tab) => void;
};

export function ScreenHeader({ activeTab, tabMode, onTabChange }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.smile}>
        <SmileIcon size={layout.headerIconSize} />
      </View>
      <View style={styles.toggleWrap}>
        <TabToggle active={activeTab} mode={tabMode} onChange={onTabChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: layout.exploreOnlyChromeHeight,
    position: 'relative',
  },
  smile: {
    position: 'absolute',
    left: layout.headerIconLeft,
    top: layout.firstOpenSmileTop,
    width: layout.headerIconSize,
    height: layout.headerIconSize,
  },
  toggleWrap: {
    position: 'absolute',
    top: layout.tabToggleTop,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
