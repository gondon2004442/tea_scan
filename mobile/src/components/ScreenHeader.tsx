import { Image, StyleSheet, View } from 'react-native';
import { images } from '../assets';
import { layout } from '../theme';
import { TabToggle } from './TabToggle';

type Tab = 'my' | 'explore';

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

export function ScreenHeader({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.header}>
      <Image source={images.iconSmile} style={styles.smile} resizeMode="contain" />
      <View style={styles.toggleWrap}>
        <TabToggle active={activeTab} onChange={onTabChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: layout.myTeasListTop,
    position: 'relative',
  },
  smile: {
    position: 'absolute',
    left: layout.headerIconLeft,
    top: layout.headerIconTop,
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
