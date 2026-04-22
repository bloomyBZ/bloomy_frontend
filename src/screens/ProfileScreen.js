import { Image, StyleSheet, Text, View } from 'react-native';
import PageLayout from '../components/PageLayout';
import {
  getAvailableXp,
  getCompletedCount,
  getEarnedXp,
  getLevelProgress,
} from '../data/habits';
import { colors, radii, shadow } from '../theme';

const stageImages = [
  require('../../assets/bloomy-docs/bloomy-wbg/stage1.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage2.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage4nobg.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage7nobg.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage8nobg.png'),
];

export default function ProfileScreen({ habits, onTabPress }) {
  const earnedXp = getEarnedXp(habits);
  const availableXp = getAvailableXp(habits);
  const completedCount = getCompletedCount(habits);
  const completionRate = Math.round((completedCount / habits.length) * 100);
  const longestStreak = Math.max(...habits.map((habit) => habit.streak));
  const levelProgress = getLevelProgress(earnedXp);
  const stageIndex = Math.min(stageImages.length - 1, levelProgress.level - 1);
  const nextXp = levelProgress.nextLevelXp - levelProgress.currentLevelXp;

  return (
    <PageLayout
      title="Profile"
      subtitle="Growth and rewards"
      activeTab="profile"
      onTabPress={onTabPress}
      scroll
      contentStyle={styles.content}
    >
      <View style={styles.profileHero}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>B</Text>
          </View>
          <View style={styles.identity}>
            <Text style={styles.name}>Betul</Text>
            <Text style={styles.role}>Habit gardener</Text>
          </View>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>Level {levelProgress.level}</Text>
          </View>
        </View>

        <View style={styles.stageWrap}>
          <Image
            source={stageImages[stageIndex]}
            style={styles.stageImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.heroTitle}>{earnedXp} XP earned</Text>
        <Text style={styles.heroBody}>
          {nextXp} XP left until your next Bloomy evolution.
        </Text>

        <View style={styles.levelTrack}>
          <View
            style={[styles.levelFill, { width: `${levelProgress.progress}%` }]}
          />
        </View>
        <View style={styles.levelMeta}>
          <Text style={styles.levelMetaText}>
            {levelProgress.currentLevelXp}/{levelProgress.nextLevelXp} XP
          </Text>
          <Text style={styles.levelMetaText}>Next level</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Today XP" value={`${earnedXp}`} detail={`of ${availableXp}`} />
        <StatCard label="Done" value={`${completionRate}%`} detail="completion" />
        <StatCard label="Best streak" value={`${longestStreak}`} detail="days" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Growth areas</Text>
        <Text style={styles.sectionMeta}>{completedCount} active wins</Text>
      </View>

      {habits.map((habit) => (
        <GrowthRow key={habit.id} habit={habit} />
      ))}
    </PageLayout>
  );
}

function StatCard({ label, value, detail }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statDetail}>{detail}</Text>
    </View>
  );
}

function GrowthRow({ habit }) {
  const earned = habit.checked ? habit.xp : 0;

  return (
    <View style={styles.growthRow}>
      <View style={styles.growthTop}>
        <View>
          <Text style={styles.growthTitle}>{habit.title}</Text>
          <Text style={styles.growthSubtitle}>{habit.category}</Text>
        </View>
        <Text style={[styles.growthXp, habit.checked && styles.growthXpDone]}>
          {earned}/{habit.xp} XP
        </Text>
      </View>
      <View style={styles.growthTrack}>
        <View
          style={[
            styles.growthFill,
            { width: `${habit.checked ? 100 : habit.progress}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 18,
    paddingBottom: 20,
  },
  profileHero: {
    borderRadius: radii.card,
    backgroundColor: colors.greenDark,
    padding: 18,
    marginBottom: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A9E5B5',
    marginRight: 12,
  },
  avatarText: {
    color: colors.greenDark,
    fontSize: 20,
    fontWeight: '900',
  },
  identity: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  role: {
    color: '#CDE6DB',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  levelPill: {
    minHeight: 30,
    borderRadius: 8,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  levelPillText: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
  },
  stageWrap: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageImage: {
    width: 220,
    height: 210,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroBody: {
    color: '#D6EAE1',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  levelTrack: {
    height: 9,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
  },
  levelFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#A9E5B5',
  },
  levelMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  levelMetaText: {
    color: '#D6EAE1',
    fontSize: 12,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minHeight: 98,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    justifyContent: 'center',
    ...shadow,
  },
  statValue: {
    color: colors.ink,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 3,
  },
  statDetail: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
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
    fontWeight: '900',
  },
  sectionMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  growthRow: {
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  growthTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  growthTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  growthSubtitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  growthXp: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  growthXpDone: {
    color: colors.green,
  },
  growthTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.surfaceSoft,
    overflow: 'hidden',
  },
  growthFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.green,
  },
});
