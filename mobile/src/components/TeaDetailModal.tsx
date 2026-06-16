import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { images, placeholderCropOffset, resolveTeaImageSource, teaUsesPlaceholder } from '../assets';
import { useTeaModal } from '../context/TeaModalContext';
import { CloudDivider } from './CloudDivider';
import { SteepingDiagram } from './SteepingDiagram';
import { TeaImage } from './TeaImage';
import { formatTimeToDrink, getTeaById } from '../data/teas';
import { getFavorites, toggleFavorite } from '../storage/favorites';
import { colors, DESIGN, typography } from '../theme';

const IMG = 206;
const RADIUS = IMG / 2;
const ANIM_MS = 350;
const SLIDE_DISTANCE = DESIGN.height;

export function TeaDetailModal() {
  const { selectedTeaId, closeTea } = useTeaModal();
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const slideY = useRef(new Animated.Value(SLIDE_DISTANCE)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  const tea = activeId ? getTeaById(activeId) : null;

  useEffect(() => {
    if (!selectedTeaId) {
      return;
    }
    setActiveId(selectedTeaId);
    setIsFavorite(getFavorites().includes(selectedTeaId));
    setVisible(true);
    slideY.setValue(SLIDE_DISTANCE);
    backdrop.setValue(0);
    Animated.parallel([
      Animated.timing(backdrop, {
        toValue: 1,
        duration: ANIM_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideY, {
        toValue: 0,
        duration: ANIM_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedTeaId, backdrop, slideY]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(backdrop, {
        toValue: 0,
        duration: ANIM_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideY, {
        toValue: SLIDE_DISTANCE,
        duration: ANIM_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        return;
      }
      setVisible(false);
      setActiveId(null);
      closeTea();
    });
  };

  if (!visible || !tea) {
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
        width: IMG,
        height: IMG,
      };

  return (
    <View style={styles.root} pointerEvents="box-none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdrop.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.85],
              }),
            },
          ]}
        />
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideY }] }]}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.content}>
                <View style={styles.hero}>
                  <View
                    style={[
                      styles.imageWrap,
                      isPlaceholder && styles.imageWrapPlaceholder,
                      { width: IMG, height: IMG, borderRadius: RADIUS },
                    ]}
                  >
                    <TeaImage
                      source={resolveTeaImageSource(tea.id, tea.image, tea.imageAsset)}
                      style={imageStyle}
                      contentFit={isPlaceholder ? 'contain' : 'cover'}
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
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.modalBackdrop,
  },
  sheet: {
    width: DESIGN.width,
    maxWidth: '100%',
    alignSelf: 'center',
    maxHeight: '92%',
    backgroundColor: colors.modalCard,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  scroll: {
    paddingTop: 24,
    paddingHorizontal: 4,
    paddingBottom: 40,
    alignItems: 'center',
  },
  content: {
    width: 300,
    alignSelf: 'center',
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
    backgroundColor: 'transparent',
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
