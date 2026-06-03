import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme';

type IconProps = {
  color?: string;
  size?: number;
};

const SUN_PATH =
  'M11.1423 3.82812L9 0L6.85774 3.82812L2.63604 2.63604L3.82812 6.85774L0 9L3.82812 11.1423L2.63604 15.364L6.85774 14.1719L9 18L11.1423 14.1719L15.364 15.364L14.1719 11.1423L18 9L14.1719 6.85774L15.364 2.63604L11.1423 3.82812ZM13 9C13 11.2091 11.2091 13 9 13V5C11.2091 5 13 6.79086 13 9Z';

const MOON_PATH =
  'M8 16C12.4183 16 16 12.4183 16 8C16 7.5335 15.9601 7.07633 15.8834 6.63171C15.3617 9.12636 13.1496 11 10.5 11C7.46243 11 5 8.53757 5 5.5C5 2.85036 6.87364 0.638338 9.36829 0.116556C8.92367 0.0399289 8.4665 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z';

export function SunIcon({ color = colors.textPrimary, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path fillRule="evenodd" clipRule="evenodd" d={SUN_PATH} fill={color} />
    </Svg>
  );
}

export function MoonIcon({ color = colors.textPrimary, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d={MOON_PATH} fill={color} />
    </Svg>
  );
}

export function TimeIcon({
  type,
  size = 20,
}: {
  type: 'sun' | 'moon';
  size?: number;
}) {
  return type === 'sun' ? <SunIcon size={size} /> : <MoonIcon size={size} />;
}
