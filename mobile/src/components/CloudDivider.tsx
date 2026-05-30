import { Image, StyleSheet, View } from 'react-native';
import { images } from '../assets';
import { scale } from '../scale';

export function CloudDivider() {
  return (
    <View style={styles.wrap}>
      <Image source={images.cloud} style={styles.cloud} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: scale(35.64),
    height: scale(27.26),
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-20.6deg' }],
  },
  cloud: {
    width: scale(31.59),
    height: scale(17.25),
  },
});
