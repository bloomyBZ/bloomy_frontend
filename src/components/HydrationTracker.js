import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow } from '../theme';

export const WATER_GOAL = 7;

const hydrationBlue = '#13A8E8';
const emptyBlue = '#E7EEF9';
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function WeeklyHydration({ values }) {
  return (
    <View style={styles.weekCard}>
      <Text style={styles.title}>Weekly Hydration</Text>
      <Text style={styles.subtitle}>
        Track how much water you drank each day. Stay consistent and keep your
        body happy.
      </Text>

      <View style={styles.weekGrid}>
        {days.map((day, index) => (
          <View key={`${day}-${index}`} style={styles.dayColumn}>
            <SegmentedGlass filled={values[index] ?? 0} />
            <Text style={styles.dayLabel}>{day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function DailyHydrationRow({ cups, onChange }) {
  return (
    <View style={styles.dailyRow}>
      {Array.from({ length: WATER_GOAL }).map((_, index) => {
        const filled = index < cups;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Glass ${index + 1}`}
            key={index}
            onPress={() => onChange(cups === index + 1 ? index : index + 1)}
            style={({ pressed }) => [styles.dailyCupTap, pressed && styles.pressed]}
          >
            <View style={[styles.dailyCup, filled && styles.dailyCupFilled]} />
          </Pressable>
        );
      })}
    </View>
  );
}

function SegmentedGlass({ filled }) {
  return (
    <View style={styles.segmentedGlass}>
      {Array.from({ length: WATER_GOAL }).map((_, index) => {
        const segmentFromBottom = WATER_GOAL - index;
        const isFilled = segmentFromBottom <= filled;

        return (
          <View
            key={index}
            style={[
              styles.segment,
              index === 0 && styles.segmentTop,
              index === WATER_GOAL - 1 && styles.segmentBottom,
              isFilled && styles.segmentFilled,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  weekCard: {
    width: '100%',
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 14,
    ...shadow,
  },
  title: {
    color: colors.ink,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#AAB2C0',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 22,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    width: 38,
  },
  segmentedGlass: {
    width: 30,
    height: 150,
  },
  segment: {
    flex: 1,
    backgroundColor: emptyBlue,
    marginBottom: 4,
  },
  segmentTop: {
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  segmentBottom: {
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    marginBottom: 0,
  },
  segmentFilled: {
    backgroundColor: hydrationBlue,
  },
  dayLabel: {
    color: '#AAB2C0',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 9,
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 7,
    marginTop: 14,
  },
  dailyCupTap: {
    flex: 1,
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyCup: {
    width: '100%',
    maxWidth: 32,
    height: 38,
    borderRadius: 8,
    backgroundColor: emptyBlue,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dailyCupFilled: {
    backgroundColor: hydrationBlue,
  },
  pressed: {
    opacity: 0.72,
  },
});
