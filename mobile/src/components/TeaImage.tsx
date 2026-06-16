import { Image, ImageContentFit } from 'expo-image';
import { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

type Props = {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
};

export function TeaImage({ source, style, contentFit = 'cover' }: Props) {
  return (
    <Image
      source={source}
      style={style}
      contentFit={contentFit}
      cachePolicy="memory-disk"
      transition={0}
    />
  );
}
