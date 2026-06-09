import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '../src/assets';
import { DesignFrame } from '../src/components/DesignFrame';
import { FilterChips } from '../src/components/FilterChips';
import { ScreenShell } from '../src/components/ScreenShell';
import { ScrollUnderHeader } from '../src/components/ScrollUnderHeader';
import { TeaCard } from '../src/components/TeaCard';
import { useTeaModal } from '../src/context/TeaModalContext';
import { TEAS } from '../src/data/teas';
import { useFavorites } from '../src/hooks/useFavorites';
import { useRequireAuth } from '../src/hooks/useRequireAuth';
import { useTimeOfDay } from '../src/hooks/useTimeOfDay';
import { layout, timePalettes } from '../src/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const { openTea } = useTeaModal();
  const { hasMyTeasTab } = useFavorites();
  useRequireAuth();
  const { timeOfDay } = useTimeOfDay();
  const [timeFilter, setTimeFilter] = useState<'morning' | 'afternoon' | 'evening' | null>(
    null,
  );
  const [typeFilter, setTypeFilter] = useState<
    'Red' | 'Oolong' | 'Green' | 'Pu-erh' | 'White' | null
  >(null);

  const tabMode = hasMyTeasTab ? 'dual' : 'exploreOnly';
  const filtersTop = layout.exploreFiltersTopExploreOnly;
  const gridTopMargin = layout.exploreGridGapBelowFilters;
  const headerHeight = layout.exploreOnlyChromeHeight;

  const filteredTeas = useMemo(() => {
    return TEAS.filter((tea) => {
      const timeOk =
        timeFilter === null ||
        tea.timeToDrink.toLowerCase().includes(timeFilter.toLowerCase());
      const typeOk =
        typeFilter === null ||
        tea.category.toLowerCase().replace("'", '-') === typeFilter.toLowerCase();
      return timeOk && typeOk;
    });
  }, [timeFilter, typeFilter]);

  return (
    <DesignFrame>
      <ScreenShell
        colors={timePalettes.explore[timeOfDay]}
        locations={[0, 0.6]}
      >
        <ScrollUnderHeader
          activeTab="explore"
          tabMode={tabMode}
          onTabChange={(tab) => {
            if (tab === 'my') router.replace('/my-teas');
          }}
          paddingTop={filtersTop}
          headerHeight={headerHeight}
          headerExtra={
            tabMode === 'dual' ? (
              <Image
                source={images.iconSettings}
                style={styles.settings}
                resizeMode="contain"
              />
            ) : null
          }
        >
          <FilterChips
            selectedTime={timeFilter}
            selectedType={typeFilter}
            onTimeChange={setTimeFilter}
            onTypeChange={setTypeFilter}
          />
          <View style={[styles.grid, styles.gridOffset, { marginTop: gridTopMargin }]}>
            {filteredTeas.map((tea) => (
              <View key={tea.id} style={styles.gridItem}>
                <TeaCard
                  tea={tea}
                  variant="grid"
                  onPress={() => openTea(tea.id)}
                />
              </View>
            ))}
          </View>
        </ScrollUnderHeader>
      </ScreenShell>
    </DesignFrame>
  );
}

const styles = StyleSheet.create({
  settings: {
    position: 'absolute',
    top: layout.headerIconTop,
    right: layout.headerIconLeft,
    width: layout.headerIconSize,
    height: layout.headerIconSize,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: layout.gridGap,
    rowGap: layout.gridGap,
  },
  gridOffset: {
    marginHorizontal: layout.exploreGridLeft,
  },
  gridItem: {
    width: layout.cardImageExplore,
  },
});
