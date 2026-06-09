import { Pressable, StyleSheet, View } from 'react-native';

import { colors, layout } from '../theme';

import { ExploreIcon, HeartIcon } from './icons/TabIcons';



type Tab = 'my' | 'explore';

export type TabMode = 'exploreOnly' | 'dual';



type Props = {

  active: Tab;

  mode: TabMode;

  onChange: (tab: Tab) => void;

};



export function TabToggle({ active, mode, onChange }: Props) {

  if (mode === 'exploreOnly') {

    const isExploreActive = active === 'explore';

    return (

      <Pressable

        style={[styles.exploreOnly, isExploreActive && styles.exploreOnlyActive]}

        onPress={() => onChange('explore')}

        accessibilityRole="button"

      >

        <ExploreIcon color={isExploreActive ? colors.white : colors.textBlack} />

      </Pressable>

    );

  }



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

  exploreOnly: {

    width: '100%',

    height: '100%',

    borderRadius: 40,

    backgroundColor: colors.white,

    borderWidth: 1,

    borderColor: colors.textBlack,

    alignItems: 'center',

    justifyContent: 'center',

  },

  exploreOnlyActive: {

    backgroundColor: colors.toggleActive,

    borderColor: colors.white,

    borderWidth: 2,

  },

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


