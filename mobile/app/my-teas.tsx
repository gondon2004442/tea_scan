import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DesignFrame } from '../src/components/DesignFrame';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { ScreenShell } from '../src/components/ScreenShell';
import { TeaCard } from '../src/components/TeaCard';
import { getTeasByIds, MY_TEAS } from '../src/data/teas';
import { useTimeOfDay } from '../src/hooks/useTimeOfDay';
import { getFavorites } from '../src/storage/favorites.web';
import { layout, timePalettes } from '../src/theme';

export default function MyTeasScreen() {
  const router = useRouter();
  const { timeOfDay } = useTimeOfDay();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(getFavorites());
    const sync = () => setFavoriteIds(getFavorites());
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, []);

  const teasToRender = useMemo(() => {
    const favorites = getTeasByIds(favoriteIds);
    return favorites.length > 0 ? favorites : MY_TEAS;
  }, [favoriteIds]);

  return (
    <DesignFrame>
      <ScreenShell
        colors={timePalettes.my[timeOfDay]}
        locations={[0, 0.6]}
      >
        <View style={styles.content}>
          <ScreenHeader
            activeTab="my"
            onTabChange={(tab) => {
              if (tab === 'explore') router.replace('/explore');
            }}
          />
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {teasToRender.map((tea) => (
              <TeaCard
                key={tea.id}
                tea={tea}
                variant="list"
                onPress={() => router.push(`/tea/${tea.id}`)}
              />
            ))}
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
    paddingTop: 0,
    paddingBottom: 24,
    alignItems: 'center',
    gap: layout.listItemGap,
  },
});
