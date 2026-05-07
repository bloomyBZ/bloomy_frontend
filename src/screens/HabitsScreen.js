import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { isHydrationHabit } from '../api/mappers';
import AddHabitSheet from '../components/AddHabitSheet';
import HabitDetailModal from '../components/HabitDetailModal';
import PageLayout from '../components/PageLayout';
import { SmallActionButton } from '../components/Button';
import { DailyHydrationRow, WeeklyHydration } from '../components/HydrationTracker';
import NoticeBanner from '../components/NoticeBanner';
import {
  DEFAULT_WATER_CUPS,
  WATER_GOAL,
  formatHabitDate,
  formatRelativeHabitDate,
  getAvailableXp,
  getCompletedCount,
  getDateKey,
  getEarnedXp,
  getHabitDayLabel,
  getHabitDayNumber,
  parseDateKey,
  shiftDate,
} from '../data/habits';
import { colors, radii, shadow } from '../theme';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'done', label: 'Done' },
];

const habitPaletteByCategory = {
  Health: {
    surface: '#F4FBFF',
    border: '#D4EAF6',
    accent: '#1481C4',
    accentSoft: '#E8F6FF',
  },
  Mind: {
    surface: '#F8F3FF',
    border: '#E3D8F8',
    accent: '#7A56C5',
    accentSoft: '#F1EAFF',
  },
  Energy: {
    surface: '#FFF8EE',
    border: '#F4DFC1',
    accent: '#C47A12',
    accentSoft: '#FFF1DA',
  },
  Home: {
    surface: '#F3FBF6',
    border: '#D7ECDC',
    accent: '#1D8A63',
    accentSoft: '#E7F6EC',
  },
  Learning: {
    surface: '#F3F7FF',
    border: '#D9E5FF',
    accent: '#2A62C9',
    accentSoft: '#EAF1FF',
  },
  Work: {
    surface: '#FFF6F0',
    border: '#F0D9CC',
    accent: '#B45A25',
    accentSoft: '#FFEBDD',
  },
  Social: {
    surface: '#FFF5F8',
    border: '#F4D9E3',
    accent: '#C14D78',
    accentSoft: '#FFEAF1',
  },
  Other: {
    surface: '#F7F8F9',
    border: '#DFE4E8',
    accent: '#5F6B76',
    accentSoft: '#EEF1F3',
  },
};

function getHabitPalette(category) {
  return habitPaletteByCategory[category] ?? habitPaletteByCategory.Mind;
}

function useCompletionBurst(token) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    scale.setValue(0.985);
    translateY.setValue(2);

    Animated.parallel([
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.025,
          friction: 6,
          tension: 110,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -4,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    return undefined;
  }, [scale, token, translateY]);

  return {
    transform: [{ scale }, { translateY }],
  };
}

function getHydrationStateKey(dateKey, habitId) {
  return `${dateKey}:${habitId}`;
}

function getHydrationCups(habit, cupsByDate, dateKey) {
  const stateKey = getHydrationStateKey(dateKey, habit.id);

  if (typeof cupsByDate[stateKey] === 'number') {
    return cupsByDate[stateKey];
  }

  return habit.cups ?? (habit.checked ? WATER_GOAL : DEFAULT_WATER_CUPS);
}

export default function HabitsScreen({
  habitHistory,
  todayKey,
  onAddHabit,
  onDeleteHabit,
  onCompleteHabit,
  onUncompleteHabit,
  onUpdateHabit,
  onUndoDeleteHabit,
  onTabPress,
  actionError,
  actionNotice,
  actionBusy,
  profile,
  deletedHabitId,
}) {
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [composerVisible, setComposerVisible] = useState(false);
  const [celebrationTarget, setCelebrationTarget] = useState(null);
  const [hydrationCupsByDate, setHydrationCupsByDate] = useState({});
  const [selectedHabitDetail, setSelectedHabitDetail] = useState(null);
  const dateSliderRef = useRef(null);

  const dateOptions = useMemo(
    () =>
      Object.keys(habitHistory)
        .sort((first, second) => first.localeCompare(second))
        .map((dateKey) => ({
          key: dateKey,
          dayLabel: getHabitDayLabel(dateKey),
          dayNumber: getHabitDayNumber(dateKey),
          relativeLabel: formatRelativeHabitDate(dateKey, todayKey),
        })),
    [habitHistory, todayKey]
  );
  const habits = habitHistory[selectedDateKey] ?? habitHistory[todayKey] ?? [];

  useEffect(() => {
    if (!habitHistory[selectedDateKey] && habitHistory[todayKey]) {
      setSelectedDateKey(todayKey);
    }
  }, [habitHistory, selectedDateKey, todayKey]);

  useEffect(() => {
    if (!selectedHabitDetail) {
      return;
    }

    const nextSelectedHabit = habits.find((habit) => habit.id === selectedHabitDetail.id);
    if (nextSelectedHabit) {
      setSelectedHabitDetail(nextSelectedHabit);
    }
  }, [habits, selectedHabitDetail]);

  useEffect(() => {
    setHydrationCupsByDate((current) => {
      let changed = false;
      const next = { ...current };

      Object.entries(habitHistory).forEach(([dateKey, dayHabits]) => {
        dayHabits.filter(isHydrationHabit).forEach((habit) => {
          const stateKey = getHydrationStateKey(dateKey, habit.id);
          const defaultCups =
            habit.cups ?? (habit.checked ? WATER_GOAL : DEFAULT_WATER_CUPS);

          if (next[stateKey] == null || (habit.checked && next[stateKey] < WATER_GOAL)) {
            next[stateKey] = habit.checked ? WATER_GOAL : defaultCups;
            changed = true;
          }
        });
      });

      return changed ? next : current;
    });
  }, [habitHistory]);
  const celebratingHabitId =
    celebrationTarget?.dateKey === selectedDateKey ? celebrationTarget.habitId : null;
  const completedCount = getCompletedCount(habits);
  const earnedXp = getEarnedXp(habits);
  const availableXp = getAvailableXp(habits);
  const selectedDateTitle = formatHabitDate(selectedDateKey);
  const selectedDateMeta = formatRelativeHabitDate(selectedDateKey, todayKey);
  const sortedHabits = useMemo(
    () =>
      [...habits].sort((first, second) => {
        const firstChecked = Number(first.checked && first.id !== celebratingHabitId);
        const secondChecked = Number(second.checked && second.id !== celebratingHabitId);
        const doneDifference = firstChecked - secondChecked;
        if (doneDifference !== 0) {
          return doneDifference;
        }

        return first.title.localeCompare(second.title);
      }),
    [celebratingHabitId, habits]
  );
  const filteredHabits = useMemo(() => {
    if (selectedFilter === 'active') {
      return sortedHabits.filter(
        (habit) => !(habit.checked && habit.id !== celebratingHabitId)
      );
    }

    if (selectedFilter === 'done') {
      return sortedHabits.filter(
        (habit) => habit.checked && habit.id !== celebratingHabitId
      );
    }

    return sortedHabits;
  }, [celebratingHabitId, selectedFilter, sortedHabits]);
  const sectionMetaLabel =
    selectedFilter === 'all'
      ? `${filteredHabits.length} habits`
      : `${filteredHabits.length} ${selectedFilter} habits`;

  const weeklyWindow = useMemo(() => {
    const anchorDate = parseDateKey(selectedDateKey);

    return Array.from({ length: 7 }).map((_, index) => {
      const dateKey = getDateKey(shiftDate(anchorDate, index - 6));
      const dayWaterHabit = habitHistory[dateKey]?.find(isHydrationHabit);

      return {
        label: getHabitDayLabel(dateKey).charAt(0),
        cups: dayWaterHabit
          ? getHydrationCups(dayWaterHabit, hydrationCupsByDate, dateKey)
          : 0,
      };
    });
  }, [habitHistory, hydrationCupsByDate, selectedDateKey]);

  const triggerCelebration = (habitId) => {
    setCelebrationTarget({
      dateKey: selectedDateKey,
      habitId,
      token: Date.now(),
    });
  };

  const handleToggleHabit = async (habit) => {
    if (actionBusy) {
      return;
    }

    const result = habit.checked
      ? await onUncompleteHabit?.(habit.id)
      : await onCompleteHabit?.(habit.id);

    if (result !== false) {
      if (!habit.checked && isHydrationHabit(habit)) {
        setHydrationCupsByDate((current) => ({
          ...current,
          [getHydrationStateKey(selectedDateKey, habit.id)]: WATER_GOAL,
        }));
      }
      if (habit.checked) {
        setHydrationCupsByDate((current) => ({
          ...current,
          [getHydrationStateKey(selectedDateKey, habit.id)]:
            isHydrationHabit(habit) ? DEFAULT_WATER_CUPS : current[getHydrationStateKey(selectedDateKey, habit.id)],
        }));
      } else {
        triggerCelebration(habit.id);
      }
    }
  };

  const handleWaterChange = async (habit, nextCups) => {
    if (!habit || actionBusy) {
      return;
    }

    const stateKey = getHydrationStateKey(selectedDateKey, habit.id);
    const previousCups = getHydrationCups(habit, hydrationCupsByDate, selectedDateKey);

    setHydrationCupsByDate((current) => ({
      ...current,
      [stateKey]: nextCups,
    }));

    const persisted = await onUpdateHabit?.(habit.id, {
      water_intake: nextCups,
    });

    if (persisted === false) {
      setHydrationCupsByDate((current) => ({
        ...current,
        [stateKey]: previousCups,
      }));
      return;
    }

    if (nextCups < WATER_GOAL) {
      if (habit.checked) {
        await onUncompleteHabit?.(habit.id);
        await onUpdateHabit?.(habit.id, {
          water_intake: nextCups,
        });
      }
      return;
    }

    const result = await onCompleteHabit?.(habit.id, {
      water_intake: nextCups,
    });

    if (result !== false) {
      setHydrationCupsByDate((current) => ({
        ...current,
        [stateKey]: WATER_GOAL,
      }));
      triggerCelebration(habit.id);
      return;
    }

    await onUpdateHabit?.(habit.id, {
      water_intake: previousCups,
    });
    setHydrationCupsByDate((current) => ({
      ...current,
      [stateKey]: previousCups,
    }));
  };

  const handleAddHabit = (draft) => {
    onAddHabit?.(selectedDateKey, draft);
    setComposerVisible(false);
  };
  const handleDeleteHabit = (habitId) => {
    setCelebrationTarget((current) =>
      current?.dateKey === selectedDateKey && current?.habitId === habitId
        ? null
        : current
    );
    setHydrationCupsByDate((current) => {
      const stateKey = getHydrationStateKey(selectedDateKey, habitId);

      if (!(stateKey in current)) {
        return current;
      }

      const next = { ...current };
      delete next[stateKey];
      return next;
    });
    onDeleteHabit?.(selectedDateKey, habitId);
  };

  const handleSaveHabitDescription = async (habitId, description) => {
    const saved = await onUpdateHabit?.(habitId, {
      description,
    });

    if (saved !== false) {
      setSelectedHabitDetail((current) =>
        current?.id === habitId ? { ...current, description } : current
      );
    }

    return saved;
  };

  return (
    <>
      <PageLayout
        title="Habits"
        subtitle={selectedDateTitle}
        activeTab="habits"
        avatarFallbackText={(profile?.display_name || 'B').charAt(0).toUpperCase()}
        avatarId={profile?.avatar_id}
        onTabPress={onTabPress}
        scroll
        contentStyle={styles.content}
      >
        <NoticeBanner message={actionError} tone="error" style={styles.notice} />
        {actionNotice ? (
          <View style={styles.undoCard}>
            <Text style={styles.undoText}>{actionNotice}</Text>
            {deletedHabitId ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => onUndoDeleteHabit?.(deletedHabitId)}
                style={({ pressed }) => [styles.undoButton, pressed && styles.pressed]}
              >
                <Text style={styles.undoButtonText}>Undo</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <View style={styles.dateCard}>
          <Text style={styles.dateEyebrow}>Habit history</Text>
          <Text style={styles.dateTitle}>{selectedDateTitle}</Text>
          <Text style={styles.dateBody}>
            {selectedDateMeta} selected. Slide through earlier days to compare your
            routine.
          </Text>

          <ScrollView
            ref={dateSliderRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sliderContent}
            style={styles.sliderRow}
            onContentSizeChange={() =>
              dateSliderRef.current?.scrollToEnd({ animated: false })
            }
          >
            {dateOptions.map((option) => {
              const active = option.key === selectedDateKey;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={option.key}
                  onPress={() => setSelectedDateKey(option.key)}
                  style={({ pressed }) => [
                    styles.dateChip,
                    active && styles.dateChipActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.dateChipDay, active && styles.dateChipDayActive]}>
                    {option.dayLabel}
                  </Text>
                  <Text
                    style={[
                      styles.dateChipNumber,
                      active && styles.dateChipNumberActive,
                    ]}
                  >
                    {option.dayNumber}
                  </Text>
                  <Text style={[styles.dateChipMeta, active && styles.dateChipMetaActive]}>
                    {option.relativeLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <WeeklyHydration
          values={weeklyWindow.map((day) => day.cups)}
          labels={weeklyWindow.map((day) => day.label)}
        />

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryEyebrow}>{selectedDateMeta}</Text>
            <Text style={styles.summaryTitle}>
              {completedCount}/{habits.length} completed
            </Text>
            <Text style={styles.summaryBody}>
              {earnedXp}/{availableXp} XP collected on this day.
            </Text>
          </View>
          <SmallActionButton
            title="+ New"
            onPress={() => setComposerVisible(true)}
            style={styles.newButton}
            textStyle={styles.newButtonText}
          />
        </View>

        <View style={styles.filterRow}>
          {filters.map((filter) => {
            const active = selectedFilter === filter.key;

            return (
              <Pressable
                accessibilityRole="button"
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                style={({ pressed }) => [
                  styles.filterChip,
                  active && styles.filterChipActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your habits</Text>
          <Text style={styles.sectionMeta}>{sectionMetaLabel}</Text>
        </View>

        {filteredHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No habits here yet</Text>
            <Text style={styles.emptyStateBody}>
              {selectedFilter === 'active'
                ? 'Everything for this day is already done.'
                : 'Create a new habit or finish one to see it here.'}
            </Text>
          </View>
        ) : null}

        {filteredHabits.map((habit) =>
          isHydrationHabit(habit) ? (
            <WaterHabitRow
              celebrationToken={
                celebrationTarget?.dateKey === selectedDateKey &&
                celebrationTarget?.habitId === habit.id
                  ? celebrationTarget.token
                  : null
              }
              key={habit.id}
              habit={habit}
              cups={getHydrationCups(habit, hydrationCupsByDate, selectedDateKey)}
              onCelebrateDone={(token) =>
                setCelebrationTarget((current) =>
                  current?.token === token ? null : current
                )
              }
              onChange={(nextCups) => handleWaterChange(habit, nextCups)}
              onDelete={() => handleDeleteHabit(habit.id)}
              onOpenDetail={() => setSelectedHabitDetail(habit)}
              onToggle={() => handleToggleHabit(habit)}
            />
          ) : (
            <HabitRow
              celebrationToken={
                celebrationTarget?.dateKey === selectedDateKey &&
                celebrationTarget?.habitId === habit.id
                  ? celebrationTarget.token
                  : null
              }
              key={habit.id}
              habit={habit}
              onCelebrateDone={(token) =>
                setCelebrationTarget((current) =>
                  current?.token === token ? null : current
                )
              }
              onDelete={() => handleDeleteHabit(habit.id)}
              onOpenDetail={() => setSelectedHabitDetail(habit)}
              onToggle={() => handleToggleHabit(habit)}
            />
          )
        )}
      </PageLayout>

      <AddHabitSheet
        dateLabel={selectedDateTitle}
        onClose={() => setComposerVisible(false)}
        onSubmit={handleAddHabit}
        visible={composerVisible}
      />

      <HabitDetailModal
        habit={selectedHabitDetail}
        onClose={() => setSelectedHabitDetail(null)}
        onSaveDescription={handleSaveHabitDescription}
        onToggleComplete={() => {
          if (!selectedHabitDetail) {
            return;
          }

          if (selectedHabitDetail.checked) {
            onUncompleteHabit?.(selectedHabitDetail.id);
            if (isHydrationHabit(selectedHabitDetail)) {
              setHydrationCupsByDate((current) => ({
                ...current,
                [getHydrationStateKey(selectedDateKey, selectedHabitDetail.id)]:
                  DEFAULT_WATER_CUPS,
              }));
            }
          } else {
            onCompleteHabit?.(
              selectedHabitDetail.id,
              isHydrationHabit(selectedHabitDetail)
                ? { water_intake: WATER_GOAL }
                : undefined
            );
            if (isHydrationHabit(selectedHabitDetail)) {
              setHydrationCupsByDate((current) => ({
                ...current,
                [getHydrationStateKey(selectedDateKey, selectedHabitDetail.id)]:
                  WATER_GOAL,
              }));
            }
          }
          setSelectedHabitDetail(null);
        }}
        primaryDisabled={actionBusy}
        visible={Boolean(selectedHabitDetail)}
      />
    </>
  );
}

function WaterHabitRow({
  habit,
  cups,
  celebrationToken,
  onCelebrateDone,
  onChange,
  onDelete,
  onOpenDetail,
  onToggle,
}) {
  const checked = cups >= WATER_GOAL;
  const palette = getHabitPalette(habit.category);
  const burstMotion = useCompletionBurst(celebrationToken);

  return (
    <Animated.View
      style={[
        styles.habitCard,
        styles.waterCard,
        { backgroundColor: palette.surface, borderColor: palette.border },
        checked && styles.habitCardDone,
        burstMotion,
      ]}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.checkButton,
          checked && styles.checkButtonDone,
          pressed && styles.pressed,
        ]}
      >
        {checked ? <CheckMark /> : null}
      </Pressable>

      <View style={styles.habitContent}>
        <View style={styles.cardBody}>
          <Pressable
            onPress={onOpenDetail}
            style={({ pressed }) => [
              styles.cardMain,
              styles.cardMainTouchable,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.cardAccent, { backgroundColor: palette.accent }]} />
            <View style={styles.cardCopy}>
              <HabitInfo
                done={checked}
                habit={habit}
                palette={palette}
                subtitle={`${cups}/${WATER_GOAL} glasses logged`}
              />
            </View>
          </Pressable>

          <View style={styles.cardSideActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete ${habit.title}`}
              onPress={onDelete}
              style={({ pressed }) => [
                styles.iconButton,
                styles.deleteIconButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.deleteIconText}>×</Text>
            </Pressable>
            <CelebrationPocket
              active={checked}
              token={celebrationToken}
              xp={habit.xp}
              onDone={onCelebrateDone}
            />
          </View>
        </View>

        <View style={styles.cardDivider} />
        <DailyHydrationRow cups={cups} onChange={onChange} />
      </View>
    </Animated.View>
  );
}

function HabitRow({ habit, celebrationToken, onCelebrateDone, onDelete, onOpenDetail, onToggle }) {
  const palette = getHabitPalette(habit.category);
  const burstMotion = useCompletionBurst(celebrationToken);

  return (
    <Animated.View
      style={[
        styles.habitCard,
        { backgroundColor: palette.surface, borderColor: palette.border },
        habit.checked && styles.habitCardDone,
        burstMotion,
      ]}
    >
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
        <View style={styles.cardBody}>
          <Pressable
            onPress={onOpenDetail}
            style={({ pressed }) => [
              styles.cardMain,
              styles.cardMainTouchable,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.cardAccent, { backgroundColor: palette.accent }]} />
            <View style={styles.cardCopy}>
              <HabitInfo
                done={habit.checked}
                habit={habit}
                palette={palette}
                subtitle={habit.schedule}
              />
            </View>
          </Pressable>

          <View style={styles.cardSideActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete ${habit.title}`}
              onPress={onDelete}
              style={({ pressed }) => [
                styles.iconButton,
                styles.deleteIconButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.deleteIconText}>×</Text>
            </Pressable>
            <CelebrationPocket
              active={habit.checked}
              token={celebrationToken}
              xp={habit.xp}
              onDone={onCelebrateDone}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

function HabitInfo({ habit, subtitle, done, palette }) {
  return (
    <>
      <View style={styles.habitHeader}>
        <Text
          style={[styles.habitTitle, done && styles.habitTitleDone]}
          numberOfLines={2}
        >
          {habit.title}
        </Text>
      </View>

      <Text style={styles.habitSchedule}>{subtitle}</Text>

      <View style={styles.habitMetaRow}>
        <View style={[styles.categoryPill, { backgroundColor: palette.accentSoft }]}>
          <Text style={[styles.categoryText, { color: palette.accent }]}>{habit.category}</Text>
        </View>
        <View style={styles.xpPill}>
          <Text style={styles.xpText}>+{habit.xp} XP</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>{habit.streak} day streak</Text>
        </View>
      </View>

      <View style={styles.habitFootRow}>
        <Text style={styles.habitHint}>
          {done ? 'Completed and counted for today.' : 'Tap the card for the full habit view.'}
        </Text>
        <View style={styles.openBubble}>
          <Text style={styles.openBubbleText}>›</Text>
        </View>
      </View>
    </>
  );
}

function CelebrationPocket({ active, token, xp, onDone }) {
  const visibility = useRef(new Animated.Value(active ? 1 : 0)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const spark = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(visibility, {
      toValue: active ? 1 : 0,
      duration: active ? 180 : 120,
      useNativeDriver: true,
    }).start();
  }, [active]);

  useEffect(() => {
    if (!token || !active) {
      return undefined;
    }

    lift.setValue(10);
    scale.setValue(0.86);
    spark.setValue(0);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 85,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(lift, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(spark, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(spark, {
          toValue: 0.2,
          duration: 640,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const timeoutId = setTimeout(() => {
      onDone?.(token);
    }, 1700);

    return () => clearTimeout(timeoutId);
  }, [token]);

  const sparkleLeft = spark.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });
  const sparkleRight = spark.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });
  const sparkleTop = spark.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });
  const sparkleOpacity = spark.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.7, 1],
  });

  return (
    <View style={styles.celebrationSlot} pointerEvents="none">
      <Animated.View
        style={[
          styles.celebrationBadge,
          {
            opacity: visibility,
            transform: [{ translateY: lift }, { scale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.sparkleDot,
            styles.sparkleDotLeft,
            {
              opacity: sparkleOpacity,
              transform: [{ translateX: sparkleLeft }, { translateY: sparkleTop }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.sparkleDot,
            styles.sparkleDotCenter,
            {
              opacity: sparkleOpacity,
              transform: [{ translateY: sparkleTop }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.sparkleDot,
            styles.sparkleDotRight,
            {
              opacity: sparkleOpacity,
              transform: [{ translateX: sparkleRight }, { translateY: sparkleTop }],
            },
          ]}
        />
        <Text style={styles.celebrationText}>+{xp} XP</Text>
        <Text style={styles.celebrationSubtext}>Nice work</Text>
      </Animated.View>
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
  notice: {
    marginBottom: 14,
  },
  undoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: radii.card,
    backgroundColor: '#EDF8F0',
    borderWidth: 1,
    borderColor: '#C8E5D0',
    padding: 14,
    marginBottom: 14,
  },
  undoText: {
    flex: 1,
    color: '#2E6E45',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  undoButton: {
    minHeight: 34,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DFF3E5',
  },
  undoButtonText: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
  },
  dateCard: {
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 14,
    ...shadow,
  },
  dateEyebrow: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  dateTitle: {
    color: colors.ink,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
  },
  dateBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  sliderRow: {
    marginTop: 18,
  },
  sliderContent: {
    paddingRight: 4,
    gap: 10,
  },
  dateChip: {
    width: 86,
    minHeight: 94,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateChipActive: {
    backgroundColor: colors.greenDark,
    borderColor: colors.greenDark,
  },
  dateChipDay: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  dateChipDayActive: {
    color: '#A9E5B5',
  },
  dateChipNumber: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
  },
  dateChipNumberActive: {
    color: '#FFFFFF',
  },
  dateChipMeta: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  dateChipMetaActive: {
    color: '#D6EAE1',
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
    minHeight: 166,
  },
  habitCard: {
    minHeight: 150,
    borderRadius: radii.card,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 12,
    ...shadow,
  },
  habitCardDone: {
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
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardMain: {
    flex: 1,
    minWidth: 0,
  },
  cardMainTouchable: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  cardAccent: {
    width: 6,
    borderRadius: 999,
    marginRight: 12,
  },
  cardCopy: {
    flex: 1,
    minWidth: 0,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  habitTitle: {
    flex: 1,
    color: colors.ink,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
  },
  habitTitleDone: {
    color: colors.muted,
  },
  cardSideActions: {
    width: 74,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F4D0D0',
    backgroundColor: '#FFF4F4',
  },
  deleteIconButton: {
    marginTop: 2,
  },
  deleteIconText: {
    color: colors.danger,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
  habitSchedule: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  habitMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  categoryPill: {
    minHeight: 26,
    borderRadius: 999,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '900',
  },
  xpPill: {
    minHeight: 26,
    borderRadius: 999,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4D7',
  },
  xpText: {
    color: '#85620D',
    fontSize: 11,
    fontWeight: '900',
  },
  streakPill: {
    minHeight: 26,
    borderRadius: 999,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F7F5',
  },
  streakText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  statePill: {
    minHeight: 28,
    borderRadius: 999,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statePillDone: {
    backgroundColor: '#E8F7EE',
    borderColor: '#CBE8D5',
  },
  statePillPending: {
    borderColor: 'transparent',
  },
  statePillText: {
    fontSize: 11,
    fontWeight: '900',
  },
  statePillTextDone: {
    color: colors.greenDark,
  },
  habitFootRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 14,
  },
  habitHint: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  openBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E4DE',
  },
  openBubbleText: {
    color: colors.greenDark,
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '700',
    marginTop: -2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#DDE7E1',
    marginTop: 14,
    marginBottom: 12,
  },
  emptyState: {
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 12,
    ...shadow,
  },
  emptyStateTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyStateBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  celebrationSlot: {
    flex: 1,
    width: '100%',
    minHeight: 66,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  celebrationBadge: {
    width: 72,
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF8F2',
    borderWidth: 1,
    borderColor: '#CAE8D9',
    overflow: 'visible',
  },
  celebrationText: {
    color: colors.greenDark,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  celebrationSubtext: {
    color: colors.green,
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
  sparkleDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  sparkleDotLeft: {
    left: 10,
    top: 12,
    backgroundColor: '#72D6C9',
  },
  sparkleDotCenter: {
    left: 24,
    top: 4,
    backgroundColor: '#F2C94C',
  },
  sparkleDotRight: {
    right: 12,
    top: 12,
    backgroundColor: '#A9E5B5',
  },
  pressed: {
    opacity: 0.7,
  },
});
