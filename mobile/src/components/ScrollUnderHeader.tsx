import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { layout } from '../theme';
import { ScreenHeader } from './ScreenHeader';
import type { Tab, TabMode } from './TabToggle';

type Props = {
  activeTab: Tab;
  tabMode: TabMode;
  onTabChange: (tab: Tab) => void;
  paddingTop: number;
  paddingBottom?: number;
  headerHeight?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
};

export function ScrollUnderHeader({
  activeTab,
  tabMode,
  onTabChange,
  paddingTop,
  paddingBottom = 24,
  headerHeight,
  contentContainerStyle,
  headerExtra,
  children,
}: Props) {
  const chromeHeight = headerHeight ?? layout.exploreOnlyChromeHeight;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop, paddingBottom },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      <View
        style={[styles.chromeTop, { minHeight: chromeHeight }]}
        pointerEvents="box-none"
      >
        <ScreenHeader activeTab={activeTab} tabMode={tabMode} onTabChange={onTabChange} />
        {headerExtra}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    minHeight: 0,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    width: '100%',
  },
  chromeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
