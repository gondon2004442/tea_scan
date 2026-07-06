import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';
import { TimeIcon } from './icons/TimeIcons';

const TIME_FILTERS = [
  { id: 'morning', label: 'Morning', icon: 'sun' as const },
  { id: 'afternoon', label: 'Afternoon', icon: 'sun' as const },
  { id: 'evening', label: 'Evening', icon: 'moon' as const },
];

const TYPE_FILTERS = ['Red', 'Oolong', 'Green', 'Pu-erh', 'White'] as const;

type TimeFilter = (typeof TIME_FILTERS)[number]['id'] | null;
type TypeFilter = (typeof TYPE_FILTERS)[number] | null;

type Props = {
  selectedTime: TimeFilter;
  selectedType: TypeFilter;
  onTimeChange: (value: TimeFilter) => void;
  onTypeChange: (value: TypeFilter) => void;
};

export function FilterChips({
  selectedTime,
  selectedType,
  onTimeChange,
  onTypeChange,
}: Props) {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {TIME_FILTERS.map((f) => (
          <Pressable
            key={f.id}
            style={[styles.chipTime, selectedTime === f.id && styles.chipActive]}
            onPress={() => onTimeChange(selectedTime === f.id ? null : f.id)}
          >
            <TimeIcon type={f.icon} size={16} />
            <Text style={styles.chipText}>{f.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {TYPE_FILTERS.map((label) => (
          <Pressable
            key={label}
            style={[styles.chipType, selectedType === label && styles.chipActive]}
            onPress={() => onTypeChange(selectedType === label ? null : label)}
          >
            <Text style={styles.chipText}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 5,
    paddingTop: 2,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 13,
  },
  chipTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 1000,
    borderWidth: 1.5,
    borderColor: colors.filterBorder,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  chipType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 1000,
    borderWidth: 1.5,
    borderColor: colors.filterBorder,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderStyle: 'solid',
  },
  chipIcon: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  chipText: {
    ...typography.filterChip,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
  },
});
