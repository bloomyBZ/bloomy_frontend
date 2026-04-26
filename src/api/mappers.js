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

function getSearchTokens(value) {
  return normalizeSearchText(value).split(/[^a-z0-9]+/).filter(Boolean);
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

function getFrequencyLabel(frequency) {
  if (frequency === 'weekly') {
    return 'Every week';
  }

  if (frequency === 'custom') {
    return 'Custom routine';
  }

  return 'Every day';
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

export function buildHabitCreatePayload(source) {
  if (source?.name) {
    return {
      name: source.name.trim(),
      frequency: source.frequency || 'daily',
      description: source.description || source.reason || '',
      icon: source.icon || '🌿',
    };
  }

  const title = source?.title?.trim() || '';
  const schedule = source?.schedule?.trim() || '';
  const category = source?.category?.trim() || 'Mind';

  return {
    name: title,
    frequency: source?.frequency || 'daily',
    description: source?.description || source?.body || schedule,
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

  return '🌿';
}

export function mapBackendHabitToUi(habit, options = {}) {
  const streak = options.streak ?? habit.streak_count ?? 0;
  const checked = Boolean(
    options.checked ?? habit.completed_today ?? isSameLocalDay(habit.last_completed_at)
  );
  const category = inferCategoryFromText(
    `${habit.name || ''} ${habit.description || ''} ${habit.icon || ''}`
  );
  const hydration = isHydrationHabit({
    title: habit.name,
    description: habit.description,
    icon: habit.icon,
    id: habit.habit_id,
  });

  return {
    id: habit.habit_id,
    title: habit.name,
    schedule: getFrequencyLabel(habit.frequency),
    category,
    streak,
    progress: getHabitProgress(streak, checked),
    xp: inferXp(streak, checked, options.pointsEarned),
    checked,
    frequency: habit.frequency,
    description: habit.description || '',
    icon: habit.icon || inferIcon(category),
    habitId: habit.habit_id,
    variant: hydration ? 'hydration' : 'standard',
    cups: hydration
      ? options.cups ?? (checked ? WATER_GOAL : DEFAULT_WATER_CUPS)
      : undefined,
  };
}

export function mapRecommendationToCard(recommendation, index = 0) {
  const fallbackCategory = inferCategoryFromText(
    `${recommendation.name || ''} ${recommendation.description || ''} ${
      recommendation.reason || ''
    }`
  );

  return {
    id: recommendation.id || `${slugify(recommendation.name || 'habit')}-${index}`,
    title: recommendation.name,
    body: recommendation.description || recommendation.reason || 'A simple routine to try.',
    schedule: getFrequencyLabel(recommendation.frequency || 'daily'),
    category: fallbackCategory,
    xp: recommendation.frequency === 'weekly' ? 15 : 10,
    artwork: fallbackCategory === 'Home' ? 'desk' : fallbackCategory === 'Mind' ? 'books' : 'stretch',
    icon: recommendation.icon || inferIcon(fallbackCategory),
    frequency: recommendation.frequency || 'daily',
    description: recommendation.description || '',
    reason: recommendation.reason || '',
    name: recommendation.name,
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
  const normalizedText = normalizeSearchText(
    `${habit?.id || ''} ${habit?.title || habit?.name || ''} ${habit?.description || ''} ${habit?.icon || ''}`
  );
  const tokens = new Set(getSearchTokens(normalizedText));
  const hasWaterLanguage =
    normalizedText.includes('drink water') ||
    normalizedText.includes('su takibi') ||
    tokens.has('water') ||
    tokens.has('hydration') ||
    tokens.has('su');

  return (
    habit?.variant === 'hydration' ||
    habit?.id === 'water' ||
    hasWaterLanguage
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
