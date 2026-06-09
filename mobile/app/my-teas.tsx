import { Redirect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { DesignFrame } from '../src/components/DesignFrame';
import { ScreenShell } from '../src/components/ScreenShell';
import { ScrollUnderHeader } from '../src/components/ScrollUnderHeader';
import { TeaCard } from '../src/components/TeaCard';
import { useTeaModal } from '../src/context/TeaModalContext';
import { getTeasByIds } from '../src/data/teas';
import { useFavorites } from '../src/hooks/useFavorites';
import { useRequireAuth } from '../src/hooks/useRequireAuth';
import { useTimeOfDay } from '../src/hooks/useTimeOfDay';
import { layout, timePalettes } from '../src/theme';

export default function MyTeasScreen() {
  const router = useRouter();
  const { openTea } = useTeaModal();
  const { timeOfDay } = useTimeOfDay();
  const { favoriteIds, hasMyTeasTab } = useFavorites();
  useRequireAuth();

  const tabMode = hasMyTeasTab ? 'dual' : 'exploreOnly';
  const teasToRender = getTeasByIds(favoriteIds);

  if (teasToRender.length === 0) {
    return <Redirect href="/explore" />;
  }

  return (
    <DesignFrame>
      <ScreenShell
        colors={timePalettes.my[timeOfDay]}
        locations={[0, 0.6]}
      >
        <ScrollUnderHeader
          activeTab="my"
          tabMode={tabMode}
          onTabChange={(tab) => {
            if (tab === 'explore') router.replace('/explore');
          }}
          paddingTop={layout.myTeasListTop}
          contentContainerStyle={styles.scrollContent}
        >
          {teasToRender.map((tea) => (
            <TeaCard
              key={tea.id}
              tea={tea}
              variant="list"
              onPress={() => openTea(tea.id)}
            />
          ))}
        </ScrollUnderHeader>
      </ScreenShell>
    </DesignFrame>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    gap: layout.listItemGap,
  },
});
