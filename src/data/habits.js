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
