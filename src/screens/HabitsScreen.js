import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PageLayout from '../components/PageLayout';
import { SmallActionButton } from '../components/Button';
import {
  DailyHydrationRow,
  WATER_GOAL,
  WeeklyHydration,
} from '../components/HydrationTracker';
import { getAvailableXp, getCompletedCount, getEarnedXp } from '../data/habits';
import { colors, radii, shadow } from '../theme';

export default function HabitsScreen({
  habits,
  onToggleHabit,
  onSetHabitChecked,
  onTabPress,
}) {
  const waterHabit = habits.find((habit) => habit.id === 'water');
  const [waterCups, setWaterCups] = useState(waterHabit?.checked ? WATER_GOAL : 2);
  const completedCount = getCompletedCount(habits);
  const earnedXp = getEarnedXp(habits);
  const availableXp = getAvailableXp(habits);
  const weeklyHydration = useMemo(
    () => [2, 6, 3, 2, 6, 6, waterCups],
    [waterCups]
  );

  const handleWaterChange = (nextCups) => {
    setWaterCups(nextCups);
    onSetHabitChecked('water', nextCups >= WATER_GOAL);
  };

  return (
    <PageLayout
      title="Habits"
      subtitle="Manage today's routine"
      activeTab="habits"
      onTabPress={onTabPress}
      scroll
      contentStyle={styles.content}
    >
      <WeeklyHydration values={weeklyHydration} />

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryEyebrow}>Today</Text>
          <Text style={styles.summaryTitle}>
            {completedCount}/{habits.length} completed
          </Text>
          <Text style={styles.summaryBody}>
            {earnedXp}/{availableXp} XP collected from today's tasks.
          </Text>
        </View>
        <SmallActionButton
          title="+ New"
          style={styles.newButton}
          textStyle={styles.newButtonText}
        />
      </View>

      <View style={styles.filterRow}>
        <View style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={[styles.filterText, styles.filterTextActive]}>All</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>Active</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>Done</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your habits</Text>
        <Text style={styles.sectionMeta}>{habits.length} habits</Text>
      </View>

      {habits.map((habit) => (
        habit.id === 'water' ? (
          <WaterHabitRow
            key={habit.id}
            habit={habit}
            cups={waterCups}
            onChange={handleWaterChange}
          />
        ) : (
          <HabitRow
            key={habit.id}
            habit={habit}
            onToggle={() => onToggleHabit(habit.id)}
          />
        )
      ))}
    </PageLayout>
  );
}

function WaterHabitRow({ habit, cups, onChange }) {
  return (
    <View style={[styles.waterCard, cups >= WATER_GOAL && styles.waterCardDone]}>
      <View style={styles.waterHeader}>
        <View>
          <Text style={styles.habitTitle}>{habit.title}</Text>
          <Text style={styles.habitSchedule}>
            {cups}/{WATER_GOAL} glasses today
          </Text>
        </View>
        <View style={styles.xpPill}>
          <Text style={styles.xpText}>+{habit.xp} XP</Text>
        </View>
      </View>

      <DailyHydrationRow cups={cups} onChange={onChange} />
    </View>
  );
}

function HabitRow({ habit, onToggle }) {
  return (
    <View style={[styles.habitCard, habit.checked && styles.habitCardDone]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: habit.checked }}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.checkButton,
          habit.checked && styles.checkButtonDone,
          pressed && styles.pressed,
        ]}
      >
        {habit.checked ? <CheckMark /> : null}
      </Pressable>

      <View style={styles.habitContent}>
        <View style={styles.habitHeader}>
          <Text
            style={[styles.habitTitle, habit.checked && styles.habitTitleDone]}
            numberOfLines={1}
          >
            {habit.title}
          </Text>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
          >
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
          </Pressable>
        </View>

        <Text style={styles.habitSchedule}>{habit.schedule}</Text>

        <View style={styles.habitMetaRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{habit.category}</Text>
          </View>
          <View style={styles.xpPill}>
            <Text style={styles.xpText}>+{habit.xp} XP</Text>
          </View>
          <Text style={styles.streakText}>{habit.streak} day streak</Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${habit.checked ? 100 : habit.progress}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

function CheckMark() {
  return (
    <View style={styles.checkMark}>
      <View style={styles.checkStem} />
      <View style={styles.checkArm} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 18,
    paddingBottom: 20,
  },
  summaryCard: {
    minHeight: 128,
    borderRadius: radii.card,
    backgroundColor: colors.greenDark,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  summaryEyebrow: {
    color: '#A9E5B5',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  summaryBody: {
    color: '#D6EAE1',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  newButton: {
    backgroundColor: '#FFFFFF',
  },
  newButtonText: {
    color: colors.greenDark,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    minHeight: 36,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.greenSoft,
  },
  filterText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  filterTextActive: {
    color: colors.greenDark,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
  },
  sectionMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  waterCard: {
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
    ...shadow,
  },
  waterCardDone: {
    borderColor: '#BDE8F8',
    backgroundColor: '#FAFDFF',
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  habitCard: {
    minHeight: 128,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    padding: 14,
    marginBottom: 12,
    ...shadow,
  },
  habitCardDone: {
    backgroundColor: '#FBFDFC',
    borderColor: '#CAE8D9',
  },
  checkButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkButtonDone: {
    borderColor: colors.green,
    backgroundColor: colors.green,
  },
  checkMark: {
    width: 16,
    height: 12,
  },
  checkStem: {
    position: 'absolute',
    left: 1,
    top: 6,
    width: 7,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  checkArm: {
    position: 'absolute',
    right: 0,
    top: 4,
    width: 13,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },
  habitContent: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  habitTitle: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
  },
  habitTitleDone: {
    color: colors.muted,
  },
  moreButton: {
    width: 32,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  moreDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.soft,
  },
  habitSchedule: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  habitMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  categoryPill: {
    minHeight: 24,
    borderRadius: 8,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenSoft,
  },
  categoryText: {
    color: colors.greenDark,
    fontSize: 11,
    fontWeight: '800',
  },
  xpPill: {
    minHeight: 24,
    borderRadius: 8,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4D7',
  },
  xpText: {
    color: '#85620D',
    fontSize: 11,
    fontWeight: '800',
  },
  streakText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceSoft,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  pressed: {
    opacity: 0.7,
  },
});
