import { Dimensions, Platform } from 'react-native';
import { DESIGN } from './theme';

/** On web: 1:1 Figma px inside 390pt frame. On native: scale to screen width. */
export function scale(size: number): number {
  if (Platform.OS === 'web') {
    return size;
  }
  const w = Dimensions.get('window').width;
  const base = w > 0 ? w : DESIGN.width;
  return (base / DESIGN.width) * size;
}

export function getScreenWidth(): number {
  if (Platform.OS === 'web') {
    return DESIGN.width;
  }
  const w = Dimensions.get('window').width;
  return w > 0 ? w : DESIGN.width;
}
