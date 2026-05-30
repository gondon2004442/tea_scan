import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { resolveMyTeasListImage, resolveTeaImage } from '../assets';
import { Tea } from '../data/teas';
import { colors, layout, typography } from '../theme';

type Variant = 'list' | 'grid';

type Props = {
  tea: Tea;
  variant: Variant;
  onPress: () => void;
};

function displayTimeHint(time: string) {
  return time.replace(/\s*\/\s*/g, ' · ');
}

function resolveTimeIcon(tea: Tea): Tea['timeIcon'] {
  if (tea.timeIcon !== 'none') {
    return tea.timeIcon;
  }

  const time = tea.timeToDrink.toLowerCase();
  if (time.includes('morning')) {
    return 'sun';
  }
  if (time.includes('night') || time.includes('evening')) {
    return 'moon';
  }
  return 'none';
}

export function TeaCard({ tea, variant, onPress }: Props) {
  const imageSize =
    variant === 'list' ? layout.cardImageMyTeas : layout.cardImageExplore;
  const radius = imageSize / 2;
  const isList = variant === 'list';
  const timeIcon = resolveTimeIcon(tea);
  const listPreview = isList ? resolveMyTeasListImage(tea) : null;
  const imageSource = listPreview?.source ?? resolveTeaImage(tea.image, tea.imageAsset);
  const imageOffset = listPreview?.offset ?? tea.imageOffset;

  const imageStyle = imageOffset
    ? {
        width: imageOffset.width,
        height: imageOffset.height,
        marginLeft: imageOffset.marginLeft,
        marginTop: imageOffset.marginTop,
      }
    : {
        width: imageSize * 1.12,
        height: imageSize * 1.12,
        marginLeft: -imageSize * 0.06,
        marginTop: -imageSize * 0.06,
      };

  return (
    <Pressable style={[styles.card, isList && styles.cardList]} onPress={onPress}>
      <View
        style={[
          styles.imageWrap,
          { width: imageSize, height: imageSize, borderRadius: radius },
        ]}
      >
        <Image
          source={imageSource}
          style={imageStyle}
          resizeMode="cover"
        />
      </View>
      <View style={[styles.labelWrap, isList && styles.labelWrapList]}>
        <View style={styles.labelRow}>
          <Text
            style={[
              styles.name,
              !isList && styles.nameGrid,
              tea.nameWeight === 'medium' && styles.nameMedium,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {tea.name}
          </Text>
          {timeIcon !== 'none' && (
            <Text style={styles.timeIconText}>{timeIcon === 'sun' ? '☼' : '☾'}</Text>
          )}
        </View>
        {!isList && <Text style={styles.timeHint}>{displayTimeHint(tea.timeToDrink)}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: layout.cardLabelGap,
  },
  cardList: {
    width: layout.cardImageMyTeas,
  },
  imageWrap: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  labelWrap: {
    alignItems: 'center',
    minHeight: 42,
  },
  labelWrapList: {
    minHeight: 28,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: layout.labelIconGap,
    minHeight: 28,
  },
  name: {
    ...typography.teaName,
    fontSize: 17,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    flexShrink: 1,
  },
  nameGrid: {
    maxWidth: 140,
  },
  nameMedium: {
    fontWeight: '500',
  },
  timeIcon: {
    width: layout.timeIconSize,
    height: layout.timeIconSize,
    flexShrink: 0,
  },
  timeIconText: {
    width: layout.timeIconSize,
    height: layout.timeIconSize,
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    flexShrink: 0,
  },
  timeHint: {
    marginTop: -2,
    fontSize: 11,
    lineHeight: 14,
    color: 'rgba(24, 0, 54, 0.55)',
    textAlign: 'center',
  },
});
