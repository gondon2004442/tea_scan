import { StyleSheet, Text, View } from 'react-native';
import { Tea } from '../data/teas';
import { scale } from '../scale';
import { colors, typography } from '../theme';

const RINGS = [
  { size: 286, opacity: 0.2, borderRadius: 80.22 },
  { size: 218, opacity: 0.2, borderRadius: 61.146 },
  { size: 154, opacity: 0.2, borderRadius: 43.195 },
  { size: 82, opacity: 1, borderRadius: 23 },
];

const LABEL_TOPS = [55, 125, 189, 245];

type Props = {
  tea: Tea;
};

export function SteepingDiagram({ tea }: Props) {
  const labels = [
    tea.steepingPours[0] ?? '20s',
    tea.steepingPours[1] ?? '25s',
    tea.steepingPours[2] ?? '35s',
    tea.steepingExtra ?? '+ 10s',
  ];

  return (
    <View style={styles.wrap}>
      {RINGS.map((ring) => (
        <View
          key={ring.size}
          style={[
            styles.ring,
            {
              width: scale(ring.size),
              height: scale(ring.size),
              borderRadius: scale(ring.borderRadius),
              opacity: ring.opacity,
            },
          ]}
        />
      ))}
      {labels.map((label, i) => (
        <View
          key={`${label}-${i}`}
          style={[styles.labelSlot, { top: scale(LABEL_TOPS[i]) }]}
        >
          {i === 0 ? <View style={styles.labelHighlight} /> : null}
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: scale(286),
    height: scale(286),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    backgroundColor: colors.steepingRing,
  },
  labelSlot: {
    position: 'absolute',
    width: scale(100),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelHighlight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.steepingRing,
    borderRadius: scale(12),
    opacity: 1,
  },
  label: {
    textAlign: 'center',
    ...typography.modalBody,
    fontSize: scale(17),
    lineHeight: scale(19),
    fontWeight: '400',
    zIndex: 1,
  },
});
