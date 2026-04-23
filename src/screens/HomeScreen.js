import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SmallActionButton } from '../components/Button';
import { BooksArtwork, DeskArtwork } from '../components/Illustrations';
import PageLayout from '../components/PageLayout';
import {
  formatHabitDate,
  getAvailableXp,
  getCompletedCount,
  getEarnedXp,
} from '../data/habits';
import { colors, radii, shadow } from '../theme';

const seed = require('../../assets/bloomy-docs/bloomy-wbg/stage1.png');

const suggestedTemplates = [
  {
    id: 'morning-stretch',
    title: 'Morning stretch',
    body: 'Wake your body up with a short reset before the day gets busy.',
    schedule: 'After waking up',
    category: 'Energy',
    xp: 20,
    artwork: 'stretch',
  },
  {
    id: 'reading-note',
    title: 'Reading note',
    body: 'Write one useful sentence after you read so ideas stick better.',
    schedule: 'After reading',
    category: 'Mind',
    xp: 15,
    artwork: 'books',
  },
  {
    id: 'kitchen-reset',
    title: 'Kitchen reset',
    body: 'Clear one surface before bed to make tomorrow feel lighter.',
    schedule: 'Before sleep',
    category: 'Home',
    xp: 25,
    artwork: 'desk',
  },
  {
    id: 'screen-free-wind-down',
    title: 'Screen-free wind down',
    body: 'Give your eyes and mind thirty calm minutes before sleep.',
    schedule: '30 min before bed',
    category: 'Health',
    xp: 30,
    artwork: 'moon',
  },
];

function MetricCard({ label, value, detail }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

function AiCoachCard() {
  return (
    <View style={styles.aiCard}>
      <Text style={styles.aiEyebrow}>AI coach placeholder</Text>
      <Text style={styles.aiTitle}>Personalized suggestions are coming soon</Text>
      <Text style={styles.aiBody}>
        Bloomy will soon learn from your streaks, completed habits, and favorite
        categories to recommend better routines just for you.
      </Text>

      <View style={styles.aiChipRow}>
        <InfoChip label="Learns your rhythm" />
        <InfoChip label="Tracks favorite categories" />
        <InfoChip label="Suggests what fits next" />
      </View>

      <Text style={styles.aiFootnote}>
        Until AI is ready, you can browse the starter library below and add any
        habit you like directly to your list.
      </Text>
    </View>
  );
}

function InfoChip({ label }) {
  return (
    <View style={styles.infoChip}>
      <Text style={styles.infoChipText}>{label}</Text>
    </View>
  );
}

function TodayHabitRow({ habit }) {
  return (
    <View style={styles.todayRow}>
      <View
        style={[
          styles.todayStatusDot,
          habit.checked && styles.todayStatusDotDone,
        ]}
      />
      <Text style={styles.todayRowTitle} numberOfLines={1}>
        {habit.title}
      </Text>
      <Text style={[styles.todayRowState, habit.checked && styles.todayRowStateDone]}>
        {habit.checked ? 'Done' : 'Pending'}
      </Text>
    </View>
  );
}

function StarterCard({ added, onAdd, template }) {
  return (
    <View style={[styles.starterCard, added && styles.starterCardAdded]}>
      <View style={styles.artColumn}>{renderArtwork(template.artwork)}</View>

      <View style={styles.cardCopy}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{template.title}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{template.category}</Text>
          </View>
        </View>

        <Text style={styles.cardBody}>{template.body}</Text>

        <View style={styles.cardMetaRow}>
          <View style={styles.inlinePill}>
            <Text style={styles.inlinePillText}>{template.schedule}</Text>
          </View>
          <View style={[styles.inlinePill, styles.inlinePillWarm]}>
            <Text style={[styles.inlinePillText, styles.inlinePillWarmText]}>
              +{template.xp} XP
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <SmallActionButton
            onPress={added ? undefined : onAdd}
            style={[styles.cardButton, added && styles.cardButtonAdded]}
            textStyle={added && styles.cardButtonAddedText}
            title={added ? 'Added' : '+ Add to my habits'}
          />
        </View>
      </View>
    </View>
  );
}

function renderArtwork(artwork) {
  if (artwork === 'books') {
    return <BooksArtwork />;
  }

  if (artwork === 'desk') {
    return <DeskArtwork />;
  }

  if (artwork === 'moon') {
    return <MoonArtwork />;
  }

  return <StretchArtwork />;
}

function StretchArtwork() {
  return (
    <View style={styles.miniArt}>
      <View style={styles.stretchSun} />
      <View style={styles.stretchBody} />
      <View style={styles.stretchArmLeft} />
      <View style={styles.stretchArmRight} />
      <View style={styles.stretchLegLeft} />
      <View style={styles.stretchLegRight} />
    </View>
  );
}

function MoonArtwork() {
  return (
    <View style={styles.miniArt}>
      <View style={styles.moonShape} />
      <View style={styles.moonCut} />
      <View style={styles.starOne} />
      <View style={styles.starTwo} />
      <View style={styles.starThree} />
    </View>
  );
}

function getTemplateSignature({ category, schedule, title }) {
  return `${title}::${schedule}::${category}`.toLowerCase();
}

export default function HomeScreen({
  habitHistory,
  habits,
  onAddHabit,
  onTabPress,
  todayKey,
}) {
  const completedCount = getCompletedCount(habits);
  const availableXp = getAvailableXp(habits);
  const earnedXp = getEarnedXp(habits);
  const pendingCount = Math.max(0, habits.length - completedCount);
  const completionRate = habits.length
    ? Math.round((completedCount / habits.length) * 100)
    : 0;
  const todayLabel = formatHabitDate(todayKey);
  const addedHabitSet = new Set(habits.map((habit) => getTemplateSignature(habit)));
  const previewHabits = [...habits]
    .sort((first, second) => Number(first.checked) - Number(second.checked))
    .slice(0, 4);
  const weekEntries = Object.keys(habitHistory)
    .sort((first, second) => first.localeCompare(second))
    .slice(-7);
  const consistentDays = weekEntries.filter((dateKey) => {
    const dayHabits = habitHistory[dateKey] ?? [];

    if (dayHabits.length === 0) {
      return false;
    }

    return getCompletedCount(dayHabits) / dayHabits.length >= 0.5;
  }).length;

  return (
    <PageLayout
      title="Welcome Betul!"
      subtitle={todayLabel}
      activeTab="home"
      onTabPress={onTabPress}
      scroll
      contentStyle={styles.scrollContent}
    >
      <View style={styles.summaryCard}>
        <View style={styles.summaryCopy}>
          <Text style={styles.eyebrow}>Today's focus</Text>
          <Text style={styles.summaryTitle}>
            {pendingCount > 0 ? `${pendingCount} habits waiting` : 'All habits completed'}
          </Text>
          <Text style={styles.summaryBody}>
            {pendingCount > 0
              ? `You already completed ${completedCount}. Keep Bloomy growing with one more small action.`
              : 'Everything on your list is done. Browse the starter library below if you want something new.'}
          </Text>
          <SmallActionButton
            onPress={() => onTabPress?.('habits')}
            style={styles.heroButton}
            title="Open habits"
          />
        </View>
        <View style={styles.plantBadge}>
          <Image source={seed} style={styles.seedImage} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.metricGrid}>
        <MetricCard
          detail={`${completedCount}/${habits.length} done`}
          label="Completion"
          value={`${completionRate}%`}
        />
        <MetricCard
          detail={`of ${availableXp} available`}
          label="XP today"
          value={`${earnedXp}`}
        />
      </View>

      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Today's lineup</Text>
          <Pressable onPress={() => onTabPress?.('habits')}>
            <Text style={styles.sectionAction}>Open list</Text>
          </Pressable>
        </View>

        {previewHabits.map((habit) => (
          <TodayHabitRow key={habit.id} habit={habit} />
        ))}

        <View style={styles.overviewFooter}>
          <Text style={styles.overviewFootText}>
            {consistentDays}/7 days hit at least half of your plan this week.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suggested habits</Text>
        <Text style={styles.sectionAction}>AI soon</Text>
      </View>

      <AiCoachCard />

      <View style={styles.libraryHeader}>
        <Text style={styles.libraryTitle}>Ready habits library</Text>
        <Text style={styles.libraryBody}>
          Pick any starter you like and we will add it to your habit list from today.
        </Text>
      </View>

      {suggestedTemplates.map((template) => {
        const added = addedHabitSet.has(getTemplateSignature(template));

        return (
          <StarterCard
            added={added}
            key={template.id}
            onAdd={() => onAddHabit?.(todayKey, template)}
            template={template}
          />
        );
      })}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 18,
    paddingBottom: 20,
  },
  summaryCard: {
    width: '100%',
    minHeight: 176,
    borderRadius: radii.card,
    backgroundColor: colors.greenDark,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 18,
    marginBottom: 14,
  },
  summaryCopy: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  eyebrow: {
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
    marginBottom: 8,
  },
  summaryBody: {
    color: '#D6EAE1',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  heroButton: {
    alignSelf: 'flex-start',
    minHeight: 36,
  },
  plantBadge: {
    width: 118,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedImage: {
    width: 138,
    height: 138,
  },
  metricGrid: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    minHeight: 104,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    justifyContent: 'center',
    ...shadow,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 31,
  },
  metricLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  metricDetail: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  overviewCard: {
    width: '100%',
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 20,
    ...shadow,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  overviewTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  todayRow: {
    minHeight: 42,
    borderRadius: 12,
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: '#E6EEEA',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  todayStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#F1B84A',
    marginRight: 10,
  },
  todayStatusDotDone: {
    backgroundColor: colors.green,
  },
  todayRowTitle: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  todayRowState: {
    color: '#9C7A1C',
    fontSize: 12,
    fontWeight: '800',
  },
  todayRowStateDone: {
    color: colors.green,
  },
  overviewFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  overviewFootText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  sectionHeader: {
    width: '100%',
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
  sectionAction: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '800',
  },
  aiCard: {
    width: '100%',
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 18,
    ...shadow,
  },
  aiEyebrow: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
  },
  aiTitle: {
    color: colors.ink,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
  },
  aiBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  aiChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  infoChip: {
    minHeight: 30,
    borderRadius: 999,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenSoft,
  },
  infoChipText: {
    color: colors.greenDark,
    fontSize: 11,
    fontWeight: '800',
  },
  aiFootnote: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
  },
  libraryHeader: {
    marginBottom: 10,
  },
  libraryTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  libraryBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  starterCard: {
    width: '100%',
    minHeight: 146,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    ...shadow,
  },
  starterCardAdded: {
    borderColor: '#CAE8D9',
    backgroundColor: '#FBFDFC',
  },
  artColumn: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniArt: {
    width: 82,
    height: 82,
    borderRadius: 22,
    backgroundColor: '#F1F6F4',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stretchSun: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: '#F2C94C',
  },
  stretchBody: {
    width: 16,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.greenDark,
  },
  stretchArmLeft: {
    position: 'absolute',
    top: 31,
    left: 20,
    width: 24,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#72D6C9',
    transform: [{ rotate: '-22deg' }],
  },
  stretchArmRight: {
    position: 'absolute',
    top: 31,
    right: 20,
    width: 24,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#72D6C9',
    transform: [{ rotate: '22deg' }],
  },
  stretchLegLeft: {
    position: 'absolute',
    bottom: 18,
    left: 26,
    width: 8,
    height: 22,
    borderRadius: 999,
    backgroundColor: colors.green,
    transform: [{ rotate: '12deg' }],
  },
  stretchLegRight: {
    position: 'absolute',
    bottom: 18,
    right: 26,
    width: 8,
    height: 22,
    borderRadius: 999,
    backgroundColor: colors.green,
    transform: [{ rotate: '-12deg' }],
  },
  moonShape: {
    position: 'absolute',
    top: 15,
    left: 18,
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#203C3D',
  },
  moonCut: {
    position: 'absolute',
    top: 13,
    left: 29,
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#F1F6F4',
  },
  starOne: {
    position: 'absolute',
    top: 22,
    right: 18,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#F2C94C',
  },
  starTwo: {
    position: 'absolute',
    bottom: 24,
    right: 25,
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#72D6C9',
  },
  starThree: {
    position: 'absolute',
    bottom: 18,
    left: 24,
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#A9E5B5',
  },
  cardCopy: {
    flex: 1,
    paddingLeft: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  tag: {
    minHeight: 24,
    borderRadius: 8,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenSoft,
  },
  tagText: {
    color: colors.greenDark,
    fontSize: 11,
    fontWeight: '800',
  },
  cardBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  inlinePill: {
    minHeight: 24,
    borderRadius: 8,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  inlinePillWarm: {
    backgroundColor: '#FFF4D7',
  },
  inlinePillText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  inlinePillWarmText: {
    color: '#85620D',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardButton: {
    minHeight: 32,
    paddingHorizontal: 12,
  },
  cardButtonAdded: {
    backgroundColor: colors.surfaceSoft,
  },
  cardButtonAddedText: {
    color: colors.greenDark,
  },
});
