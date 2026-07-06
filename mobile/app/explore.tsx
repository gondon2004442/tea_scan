import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { AiResultCard } from '../src/components/AiResultCard';
import { DesignFrame } from '../src/components/DesignFrame';
import { FilterChips } from '../src/components/FilterChips';
import { ScreenShell } from '../src/components/ScreenShell';
import { ScrollUnderHeader } from '../src/components/ScrollUnderHeader';
import { SearchBar, type PickedImage } from '../src/components/SearchBar';
import { SearchIcon } from '../src/components/icons/TabIcons';
import { TeaCard } from '../src/components/TeaCard';
import { useTeaModal } from '../src/context/TeaModalContext';
import { TEAS, getTeasByIds } from '../src/data/teas';
import { localSearch } from '../src/lib/catalogContext';
import { aiSearch, type AiSearchResult } from '../src/lib/aiClient';
import { useFavorites } from '../src/hooks/useFavorites';
import { useRequireAuth } from '../src/hooks/useRequireAuth';
import { useTimeOfDay } from '../src/hooks/useTimeOfDay';
import { colors, layout, timePalettes } from '../src/theme';

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

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiSearchResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [localIds, setLocalIds] = useState<string[] | null>(null);

  const tabMode = hasMyTeasTab ? 'dual' : 'exploreOnly';
  const filtersTop = layout.exploreFiltersTopExploreOnly;
  const gridTopMargin = layout.exploreGridGapBelowFilters;
  const headerHeight = layout.exploreOnlyChromeHeight;

  const filteredTeas = useMemo(() => {
    // AI-matched catalog teas take priority, then a local text search, then chips.
    if (aiResult && aiResult.matchedTeaIds.length > 0) {
      return getTeasByIds(aiResult.matchedTeaIds);
    }
    if (localIds) {
      return getTeasByIds(localIds);
    }
    return TEAS.filter((tea) => {
      const timeOk =
        timeFilter === null ||
        tea.timeToDrink.toLowerCase().includes(timeFilter.toLowerCase());
      const typeOk =
        typeFilter === null ||
        tea.category.toLowerCase().replace("'", '-') === typeFilter.toLowerCase();
      return timeOk && typeOk;
    });
  }, [aiResult, localIds, timeFilter, typeFilter]);

  function resetSearch() {
    setAiResult(null);
    setAiError(null);
    setLocalIds(null);
  }

  function toggleSearch() {
    if (searchOpen) {
      setSearchOpen(false);
      setQuery('');
      resetSearch();
    } else {
      setSearchOpen(true);
    }
  }

  async function runAiSearch(input: { query?: string; image?: PickedImage }) {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const result = await aiSearch({
        query: input.query,
        imageBase64: input.image?.base64,
        imageMediaType: input.image?.mediaType,
      });
      setAiResult(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setAiLoading(false);
    }
  }

  function onSubmitSearch() {
    const q = query.trim();
    if (!q) {
      resetSearch();
      return;
    }
    const ids = localSearch(q);
    if (ids.length > 0) {
      setAiResult(null);
      setAiError(null);
      setLocalIds(ids);
    } else {
      // No catalog match → ask the AI (web search + Gongfu).
      setLocalIds(null);
      void runAiSearch({ query: q });
    }
  }

  function onPickImage(image: PickedImage) {
    setLocalIds(null);
    void runAiSearch({ query: query.trim() || undefined, image });
  }

  function onChangeQuery(text: string) {
    setQuery(text);
    if (text.trim() === '') {
      resetSearch();
    }
  }

  return (
    <DesignFrame>
      <ScreenShell colors={timePalettes.explore[timeOfDay]} locations={[0, 0.6]}>
        <ScrollUnderHeader
          activeTab="explore"
          tabMode={tabMode}
          onTabChange={(tab) => {
            if (tab === 'my') router.replace('/my-teas');
            if (tab === 'quiz') router.replace('/quiz');
          }}
          paddingTop={filtersTop}
          headerHeight={headerHeight}
          headerExtra={
            <Pressable
              style={[styles.searchBtn, searchOpen && styles.searchBtnActive]}
              onPress={toggleSearch}
              accessibilityRole="button"
              accessibilityLabel="Search"
              hitSlop={8}
            >
              <SearchIcon color={searchOpen ? colors.white : colors.textPrimary} size={22} />
            </Pressable>
          }
        >
          {searchOpen && (
            <SearchBar
              value={query}
              onChangeText={onChangeQuery}
              onSubmit={onSubmitSearch}
              onPickImage={onPickImage}
              loading={aiLoading}
            />
          )}
          {!aiResult && !localIds && (
            <FilterChips
              selectedTime={timeFilter}
              selectedType={typeFilter}
              onTimeChange={setTimeFilter}
              onTypeChange={setTypeFilter}
            />
          )}
          {aiLoading && (
            <View style={styles.statusRow}>
              <ActivityIndicator color={colors.textPrimary} />
              <Text style={styles.statusText}>Searching the world of Gongfu tea…</Text>
            </View>
          )}
          {aiError && <Text style={styles.errorText}>{aiError}</Text>}
          {aiResult && <AiResultCard answer={aiResult.answer} sources={aiResult.sources} />}
          <View style={[styles.grid, styles.gridOffset, { marginTop: gridTopMargin }]}>
            {filteredTeas.map((tea) => (
              <View key={tea.id} style={styles.gridItem}>
                <TeaCard tea={tea} variant="grid" onPress={() => openTea(tea.id)} />
              </View>
            ))}
          </View>
        </ScrollUnderHeader>
      </ScreenShell>
    </DesignFrame>
  );
}

const styles = StyleSheet.create({
  searchBtn: {
    position: 'absolute',
    top: layout.tabToggleTop,
    right: layout.headerIconLeft,
    width: layout.tabToggleHeight,
    height: layout.tabToggleHeight,
    borderRadius: layout.tabToggleHeight / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  searchBtnActive: {
    backgroundColor: colors.toggleActive,
    borderColor: colors.white,
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  statusText: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 14,
    color: colors.textPrimary,
  },
  errorText: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 14,
    color: '#9B2C2C',
    marginHorizontal: 16,
    marginBottom: 12,
  },
});
