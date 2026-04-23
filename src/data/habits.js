export const WATER_GOAL = 7;
export const DEFAULT_WATER_CUPS = 2;
export const HABIT_HISTORY_DAYS = 7;
export const habitCategories = ['Mind', 'Health', 'Energy', 'Home'];
export const habitXpOptions = [15, 20, 25, 30];

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const initialHabits = [
  {
    id: 'read',
    title: 'Read 20 pages',
    schedule: 'Every evening',
    category: 'Mind',
    streak: 12,
    progress: 70,
    xp: 35,
    checked: true,
  },
  {
    id: 'water',
    title: 'Drink water',
    schedule: '4 times a day',
    category: 'Health',
    streak: 8,
    progress: 50,
    xp: 20,
    cups: DEFAULT_WATER_CUPS,
    checked: false,
  },
  {
    id: 'space',
    title: 'Reset desk',
    schedule: 'Before sleep',
    category: 'Home',
    streak: 5,
    progress: 35,
    xp: 25,
    checked: false,
  },
  {
    id: 'walk',
    title: 'Take a mindful walk',
    schedule: 'After lunch',
    category: 'Energy',
    streak: 6,
    progress: 45,
    xp: 30,
    checked: true,
  },
];

export const XP_PER_LEVEL = 100;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cloneHabits(habits) {
  return habits.map((habit) => ({ ...habit }));
}

export function createCustomHabit({
  title,
  schedule,
  category = 'Mind',
  xp = 20,
  createdAt = Date.now(),
}) {
  const safeTitle = title.trim();
  const safeSchedule = schedule.trim();
  const safeCategory = category.trim() || 'Mind';
  const habitSlug = slugify(safeTitle) || 'habit';

  return {
    id: `${habitSlug}-${createdAt}`,
    title: safeTitle,
    schedule: safeSchedule,
    category: safeCategory,
    streak: 0,
    progress: 0,
    xp,
    checked: false,
  };
}

export function getDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day, 12);
}

export function shiftDate(date, amount) {
  const nextDate = new Date(date);
  nextDate.setHours(12, 0, 0, 0);
  nextDate.setDate(nextDate.getDate() + amount);

  return nextDate;
}

export function formatHabitDate(dateKey) {
  const date = parseDateKey(dateKey);

  return `${weekDayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
}

export function getHabitDayLabel(dateKey) {
  const date = parseDateKey(dateKey);

  return weekDayNames[date.getDay()];
}

export function getHabitDayNumber(dateKey) {
  return `${parseDateKey(dateKey).getDate()}`;
}

export function formatRelativeHabitDate(dateKey, todayKey = getDateKey(new Date())) {
  const dayMs = 24 * 60 * 60 * 1000;
  const diff = Math.round(
    (parseDateKey(todayKey).getTime() - parseDateKey(dateKey).getTime()) / dayMs
  );

  if (diff <= 0) {
    return 'Today';
  }

  if (diff === 1) {
    return 'Yesterday';
  }

  return `${diff} days ago`;
}

function createHistoricalHabit(habit, daysAgo, index) {
  if (daysAgo === 0) {
    return { ...habit };
  }

  const seededValue = habit.id.length * 11 + index * 7 + daysAgo * 13;
  const checked = seededValue % 4 !== 0;

  if (habit.id === 'water') {
    const cups = checked
      ? WATER_GOAL
      : clamp(DEFAULT_WATER_CUPS + (seededValue % (WATER_GOAL - 1)), 1, WATER_GOAL - 1);

    return {
      ...habit,
      cups,
      checked: cups >= WATER_GOAL,
      progress: Math.round((cups / WATER_GOAL) * 100),
      streak: Math.max(1, habit.streak - Math.min(daysAgo, habit.streak - 1)),
    };
  }

  const progress = checked
    ? 100
    : clamp(habit.progress - daysAgo * 7 + (seededValue % 16) - 6, 18, 92);

  return {
    ...habit,
    checked,
    progress,
    streak: Math.max(1, habit.streak - Math.min(daysAgo, habit.streak - 1)),
  };
}

export function createInitialHabitHistory(
  habits = initialHabits,
  baseDate = new Date(),
  days = HABIT_HISTORY_DAYS
) {
  return Array.from({ length: days }).reduce((history, _, index) => {
    const dateKey = getDateKey(shiftDate(baseDate, -index));

    return {
      ...history,
      [dateKey]: habits.map((habit, habitIndex) =>
        createHistoricalHabit(habit, index, habitIndex)
      ),
    };
  }, {});
}

export function getEarnedXp(habits) {
  return habits.reduce((total, habit) => total + (habit.checked ? habit.xp : 0), 0);
}

export function getAvailableXp(habits) {
  return habits.reduce((total, habit) => total + habit.xp, 0);
}

export function getCompletedCount(habits) {
  return habits.filter((habit) => habit.checked).length;
}

export function getLevelProgress(xp) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentLevelXp = xp % XP_PER_LEVEL;
  const progress = Math.min(100, Math.round((currentLevelXp / XP_PER_LEVEL) * 100));

  return {
    level,
    currentLevelXp,
    nextLevelXp: XP_PER_LEVEL,
    progress,
  };
}
