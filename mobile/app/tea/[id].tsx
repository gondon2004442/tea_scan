import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images, placeholderCropOffset, teaImage, teaUsesPlaceholder } from '../../src/assets';
import { CloudDivider } from '../../src/components/CloudDivider';
import { SteepingDiagram } from '../../src/components/SteepingDiagram';
import { formatTimeToDrink, getTeaById } from '../../src/data/teas';
import { getFavorites, toggleFavorite } from '../../src/storage/favorites.web';
import { colors, typography } from '../../src/theme';

const IMG = 206;
const RADIUS = IMG / 2;

export default function TeaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tea = getTeaById(id ?? '');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!tea) return;
    setIsFavorite(getFavorites().includes(tea.id));
  }, [tea]);

  if (!tea) {
    return null;
  }

  const isPlaceholder = teaUsesPlaceholder(tea);
  const placeholderOffset = placeholderCropOffset(IMG);
  const imageStyle = isPlaceholder
    ? {
        width: placeholderOffset.width,
        height: placeholderOffset.height,
        marginLeft: placeholderOffset.marginLeft,
        marginTop: placeholderOffset.marginTop,
      }
    : {
        width: IMG * 1.12,
        height: IMG * 1.12,
        marginLeft: -IMG * 0.06,
        marginTop: -IMG * 0.06,
      };

  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <View style={styles.content}>
              <View style={styles.hero}>
                <View
                  style={[
                    styles.imageWrap,
                    isPlaceholder && styles.imageWrapPlaceholder,
                    { width: IMG, height: IMG, borderRadius: RADIUS },
                  ]}
                >
                  <Image
                    source={teaImage(tea.image)}
                    style={imageStyle}
                    resizeMode={isPlaceholder ? 'contain' : 'cover'}
                  />
                </View>
                <View style={styles.titleBlock}>
                  <Text style={styles.title}>{tea.name}</Text>
                  <Text style={styles.category}>{tea.category}</Text>
                </View>
                <Text style={styles.timeDrink}>
                  {formatTimeToDrink(tea.timeToDrink)}
                </Text>
                <View style={styles.params}>
                  <Text style={styles.paramText}>{tea.leafRatio}</Text>
                  <Image source={images.divider} style={styles.divider} />
                  <Text style={styles.paramText}>{tea.temperature}</Text>
                </View>
                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => {
                    const updated = toggleFavorite(tea.id);
                    setIsFavorite(updated.includes(tea.id));
                  }}
                >
                  <Text style={styles.favoriteButtonText}>
                    {isFavorite ? 'Remove from My teas' : 'Add to My teas'}
                  </Text>
                </Pressable>
              </View>

              <CloudDivider />

              <View style={styles.steepingSection}>
                <Text style={styles.sectionTitle}>Steeping time</Text>
                <SteepingDiagram tea={tea} />
              </View>

              <CloudDivider />

              <Text style={styles.story}>{tea.story}</Text>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.modalBackdrop,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    paddingTop: 62,
    paddingHorizontal: 4,
    paddingBottom: 40,
    alignItems: 'center',
  },
  card: {
    width: 382,
    maxWidth: '100%',
    backgroundColor: colors.modalCard,
    borderRadius: 40,
    overflow: 'hidden',
  },
  content: {
    width: 300,
    alignSelf: 'center',
    paddingTop: 24,
    paddingBottom: 40,
    gap: 32,
    alignItems: 'center',
  },
  hero: {
    width: 266,
    alignItems: 'center',
    gap: 20,
  },
  imageWrap: {
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  imageWrapPlaceholder: {
    backgroundColor: colors.white,
  },
  titleBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    ...typography.modalTitle,
    fontSize: 44,
    lineHeight: 50,
    textAlign: 'center',
    fontWeight: '400',
    width: '100%',
  },
  category: {
    ...typography.modalBody,
    fontSize: 17,
    lineHeight: 19,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.55)',
    width: '100%',
  },
  timeDrink: {
    ...typography.modalBody,
    fontSize: 17,
    lineHeight: 19,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  params: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 8,
  },
  paramText: {
    ...typography.modalBody,
    fontSize: 17,
    lineHeight: 19,
    width: 100,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 10,
  },
  favoriteButton: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  favoriteButtonText: {
    ...typography.modalBody,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  steepingSection: {
    width: 300,
    alignItems: 'center',
    gap: 20,
  },
  sectionTitle: {
    ...typography.modalBody,
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
    width: '100%',
  },
  story: {
    ...typography.modalBody,
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
    width: 300,
    color: 'rgba(0, 0, 0, 0.85)',
  },
});
