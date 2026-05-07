import { DEFAULT_WATER_CUPS, WATER_GOAL } from '../data/habits';

const orderedStageImages = [
  require('../../assets/bloomy-docs/bloomy-wbg/stage1.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage2.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage3.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage4nobg.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage5.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage6.png'),
  require('../../assets/bloomy-docs/bloomy-bg/stage7.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage8nobg.png'),
];

const growthStageImages = orderedStageImages.slice(0, 4);
const evolutionStageImages = orderedStageImages;

function titleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inferCategoryFromText(text) {
  const normalized = (text || '').toLowerCase();

  if (
    /water|drink|sleep|health|workout|walk|run|stretch|nefes|uyku|su|spor/.test(
      normalized
    )
  ) {
    return 'Health';
  }

  if (/home|desk|kitchen|clean|room|ev|masa|oda|mutfak/.test(normalized)) {
    return 'Home';
  }

  if (/energy|focus|pomodoro|plan|task|journal|work|study|calisma|odak/.test(normalized)) {
    return 'Energy';
  }

  return 'Mind';
}

function normalizeSearchText(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function isSameLocalDay(timestamp) {
  if (!timestamp) {
    return false;
  }

  const completedAt = new Date(timestamp);
  if (Number.isNaN(completedAt.getTime())) {
    return false;
  }

  const now = new Date();

  return (
    completedAt.getFullYear() === now.getFullYear() &&
    completedAt.getMonth() === now.getMonth() &&
    completedAt.getDate() === now.getDate()
  );
}

function isTodayDateKey(dateKey) {
  if (!dateKey) {
    return false;
  }

  const today = new Date();
  const safeMonth = `${today.getMonth() + 1}`.padStart(2, '0');
  const safeDay = `${today.getDate()}`.padStart(2, '0');
  const todayKey = `${today.getFullYear()}-${safeMonth}-${safeDay}`;

  return dateKey === todayKey;
}

function getFrequencyLabel(frequency) {
  if (frequency === 'weekly') {
    return 'Every week';
  }

  if (frequency === 'custom') {
    return 'Custom routine';
  }

  return 'Every day';
}

function looksLikeScheduleLabel(value) {
  const trimmedValue = (value || '').trim();
  if (!trimmedValue) {
    return false;
  }

  return trimmedValue.length <= 40 && !/[.!?]$/.test(trimmedValue);
}

function getHabitProgress(streak, checked) {
  if (checked) {
    return 100;
  }

  return Math.max(18, Math.min(92, 22 + streak * 8));
}

function inferXp(streak, checked, pointsEarned) {
  if (typeof pointsEarned === 'number' && pointsEarned > 0) {
    return pointsEarned;
  }

  if (checked && streak >= 3) {
    return 15;
  }

  return 10;
}

function buildEnglishHabitSummary(name, category, frequency) {
  const frequencyLabel = getFrequencyLabel(frequency || 'daily').toLowerCase();

  if (category === 'Health') {
    return `${name} is a gentle ${frequencyLabel} ritual that supports your energy and physical wellbeing without feeling overwhelming.`;
  }

  if (category === 'Energy') {
    return `${name} creates a focused ${frequencyLabel} rhythm that helps you build momentum through small, repeatable effort.`;
  }

  if (category === 'Home') {
    return `${name} is a simple ${frequencyLabel} reset that can make your space feel calmer, cleaner, and easier to enjoy.`;
  }

  return `${name} is a thoughtful ${frequencyLabel} habit that helps you feel more grounded, clear, and consistent over time.`;
}

function buildEnglishRecommendationReason(name, category) {
  if (category === 'Health') {
    return `Bloomy AI recommends "${name}" because steady physical habits are easier to keep when they feel light, supportive, and realistic on busy days.`;
  }

  if (category === 'Energy') {
    return `Bloomy AI suggests "${name}" because a small burst of deliberate action can quickly rebuild momentum and confidence.`;
  }

  if (category === 'Home') {
    return `Bloomy AI chose "${name}" because a calmer space often makes the rest of the day feel easier to manage.`;
  }

  return `Bloomy AI picked "${name}" to help you create a steadier mental rhythm through a habit that feels simple enough to repeat.`;
}

const translatedHabitNameMap = {
  'gunde 2l su ic': 'Drink 2L of water',
  'uyumadan 30 dk once ekran kapat': 'Turn off screens 30 min before sleep',
  'sabah 5 dk nefes egzersizi': '5 min breathing exercise',
  'antrenman sonrasi 10 dk esneme': '10 min stretch after workouts',
  'gunde 8.000 adim hedefi': '8,000 steps a day',
  'haftada 2 gun kuvvet antrenmani': 'Strength training twice a week',
  'her gun 10 sayfa oku': 'Read 10 pages a day',
  'gunde 15 dk yabanci dil': '15 min language practice',
  'haftalik ogrenme ozeti yaz': 'Write a weekly learning recap',
  'gune 3 oncelik yazarak basla': 'Start the day with 3 priorities',
  'pomodoro ile 25 dk odak': '25 min focus with Pomodoro',
  'aksam 5 dk ertesi gun plani': '5 min next-day plan',
  'gunluk 3 minnet notu': '3 gratitude notes a day',
  'aksam 5 dk duygu gunlugu': '5 min evening journal',
  'haftada 1 dijital detoks saati': '1 digital detox hour a week',
  'gunde 10 dk yuruyus': '10 min daily walk',
  'gunluk su takibi': 'Daily water tracking',
  'gunde 10 sayfa kitap': 'Read 10 pages a day',
  'uyumadan once 5 dk plan': '5 min plan before sleep',
};

function translateHabitNameToEnglish(value) {
  const rawValue = (value || '').trim();
  if (!rawValue) {
    return rawValue;
  }

  const normalizedValue = normalizeSearchText(rawValue)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  return translatedHabitNameMap[normalizedValue] || rawValue;
}

export function buildHabitCreatePayload(source) {
  if (source?.name) {
    const translatedName = translateHabitNameToEnglish(source.name);
    const frequency = source.frequency || 'daily';
    const category =
      source.category ||
      inferCategoryFromText(
        `${translatedName} ${source.description || ''} ${source.reason || ''}`
      );

    return {
      name: translatedName,
      frequency,
      schedule: source.schedule || getFrequencyLabel(frequency),
      category,
      source: source.source || 'ai',
      description: buildEnglishHabitSummary(translatedName, category, frequency),
      icon: source.icon || inferIcon(category),
    };
  }

  const title = translateHabitNameToEnglish(source?.title?.trim() || '');
  const schedule = source?.schedule?.trim() || '';
  const category = source?.category?.trim() || 'Mind';

  return {
    name: title,
    frequency: source?.frequency || 'daily',
    schedule,
    category,
    source: source?.source || 'manual',
    description: source?.description?.trim() || '',
    icon: source?.icon || inferIcon(category),
  };
}

function inferIcon(category) {
  if (category === 'Health') {
    return '💧';
  }

  if (category === 'Home') {
    return '🏡';
  }

  if (category === 'Energy') {
    return '⚡';
  }

  if (category === 'Learning') {
    return '📚';
  }

  if (category === 'Work') {
    return '💼';
  }

  if (category === 'Social') {
    return '🤝';
  }

  if (category === 'Other') {
    return '✨';
  }

  return '🌿';
}

export function mapBackendHabitToUi(habit, options = {}) {
  const streak = options.streak ?? habit.streak_count ?? 0;
  const category =
    habit.category ||
    inferCategoryFromText(`${habit.name || ''} ${habit.description || ''} ${habit.icon || ''}`);
  const hydration = isHydrationHabit({
    title: habit.name,
    description: habit.description,
    icon: habit.icon,
    id: habit.habit_id,
  });
  const source = habit.source || (hydration ? 'system' : 'manual');
  const fallbackSchedule =
    source === 'manual' && !habit.schedule && looksLikeScheduleLabel(habit.description)
      ? habit.description
      : getFrequencyLabel(habit.frequency);
  const schedule = habit.schedule || fallbackSchedule;
  const description =
    source === 'manual' && !habit.schedule && habit.description === schedule
      ? ''
      : habit.description || '';
  const backendCups = hydration
    ? isTodayDateKey(habit.water_date)
      ? Math.max(0, Math.min(WATER_GOAL, Number(habit.water_intake ?? DEFAULT_WATER_CUPS)))
      : DEFAULT_WATER_CUPS
    : undefined;
  const checked = Boolean(
    options.checked ??
      (hydration
        ? (options.cups ?? backendCups ?? DEFAULT_WATER_CUPS) >= WATER_GOAL
        : habit.completed_today ?? isSameLocalDay(habit.last_completed_at))
  );

  return {
    id: habit.habit_id,
    title: translateHabitNameToEnglish(habit.name),
    schedule,
    category,
    streak,
    progress: getHabitProgress(streak, checked),
    xp: inferXp(streak, checked, options.pointsEarned),
    checked,
    frequency: habit.frequency,
    description,
    icon: habit.icon || inferIcon(category),
    habitId: habit.habit_id,
    source,
    variant: hydration ? 'hydration' : 'standard',
    cups: hydration
      ? options.cups ??
        backendCups ??
        (checked ? WATER_GOAL : DEFAULT_WATER_CUPS)
      : undefined,
  };
}

export function mapRecommendationToCard(recommendation, index = 0) {
  const fallbackCategory = inferCategoryFromText(
    `${recommendation.name || ''} ${recommendation.description || ''} ${
      recommendation.reason || ''
    }`
  );
  const safeName = translateHabitNameToEnglish(recommendation.name || 'New habit');
  const frequency = recommendation.frequency || 'daily';
  const englishDescription = buildEnglishHabitSummary(
    safeName,
    fallbackCategory,
    frequency
  );
  const englishReason = buildEnglishRecommendationReason(safeName, fallbackCategory);

  return {
    id: recommendation.id || `${slugify(safeName || 'habit')}-${index}`,
    title: safeName,
    body: englishDescription,
    schedule: getFrequencyLabel(frequency),
    category: fallbackCategory,
    xp: frequency === 'weekly' ? 15 : 10,
    artwork: fallbackCategory === 'Home' ? 'desk' : fallbackCategory === 'Mind' ? 'books' : 'stretch',
    icon: recommendation.icon || inferIcon(fallbackCategory),
    frequency,
    description: englishDescription,
    reason: englishReason,
    name: safeName,
  };
}

export function mapPlantStageToImageIndex(stage) {
  switch (stage) {
    case 'seedling':
      return 1;
    case 'plant':
      return 2;
    case 'flower':
      return 3;
    case 'seed':
    default:
      return 0;
  }
}

export function getPlantStageImage(stage) {
  return growthStageImages[mapPlantStageToImageIndex(stage)];
}

export function getEvolutionStageImage(level = 1) {
  const safeIndex = Math.max(0, Math.min(evolutionStageImages.length - 1, level - 1));
  return evolutionStageImages[safeIndex];
}

export function getStageNumber(level = 1) {
  return Math.max(1, Math.min(evolutionStageImages.length, level));
}

export function getStageLabel(level = 1) {
  return `STAGE ${getStageNumber(level)}`;
}

export function isHydrationHabit(habit) {
  const normalizedId = normalizeSearchText(habit?.id || '');
  const normalizedTitle = normalizeSearchText(habit?.title || habit?.name || '');
  const hydrationTrackerPatterns = [
    'water tracking',
    'water tracker',
    'water log',
    'hydration tracking',
    'hydration tracker',
    'hydration log',
    'su takibi',
    'su takip',
  ];
  const matchesHydrationTrackerName = hydrationTrackerPatterns.some((pattern) =>
    normalizedTitle.includes(pattern)
  );

  return (
    habit?.variant === 'hydration' ||
    normalizedId === 'water' ||
    matchesHydrationTrackerName
  );
}

export function getDisplayName(profile) {
  const displayName = profile?.display_name?.trim();
  if (displayName) {
    return titleCase(displayName);
  }

  const email = profile?.email || '';
  if (!email.includes('@')) {
    return 'Bloomy user';
  }

  return titleCase(email.split('@')[0]);
}

export function buildAiHabitInsight(habit) {
  const category = habit?.category || inferCategoryFromText(habit?.title || habit?.name || '');
  const title = translateHabitNameToEnglish(habit?.title || habit?.name || 'New habit');
  const baseDescription = buildEnglishHabitSummary(
    title,
    category,
    habit?.frequency || 'daily'
  );
  const frequency = habit?.schedule || getFrequencyLabel(habit?.frequency || 'daily');

  return {
    title,
    description: `${baseDescription} It is designed to feel achievable from day one, which makes it much easier to keep showing up and turn a good intention into a real routine.`,
    motivation: buildEnglishRecommendationReason(title, category),
    frequency,
    category,
  };
}
