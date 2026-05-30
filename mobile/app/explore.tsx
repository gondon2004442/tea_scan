import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DesignFrame } from '../src/components/DesignFrame';
import { FilterChips } from '../src/components/FilterChips';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { ScreenShell } from '../src/components/ScreenShell';
import { TeaCard } from '../src/components/TeaCard';
import { TEAS } from '../src/data/teas';
import { useTimeOfDay } from '../src/hooks/useTimeOfDay';
import { layout, timePalettes } from '../src/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const { timeOfDay } = useTimeOfDay();
  const [timeFilter, setTimeFilter] = useState<'morning' | 'afternoon' | 'evening' | null>(
    null,
  );
  const [typeFilter, setTypeFilter] = useState<
    'Red' | 'Oolong' | 'Green' | 'Pu-erh' | 'White' | null
  >(null);

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
        <View style={styles.content}>
          <ScreenHeader
            activeTab="explore"
            onTabChange={(tab) => {
              if (tab === 'my') router.replace('/my-teas');
            }}
          />
          <FilterChips
            selectedTime={timeFilter}
            selectedType={typeFilter}
            onTimeChange={setTimeFilter}
            onTypeChange={setTypeFilter}
          />
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {filteredTeas.map((tea) => (
                <View key={tea.id} style={styles.gridItem}>
                  <TeaCard
                    tea={tea}
                    variant="grid"
                    onPress={() => router.push(`/tea/${tea.id}`)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScreenShell>
    </DesignFrame>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    minHeight: 0,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingTop: 4,
    paddingHorizontal: layout.exploreGridLeft,
    paddingBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: layout.gridGap,
    rowGap: layout.gridGap,
  },
  gridItem: {
    width: layout.cardImageExplore,
  },
});
