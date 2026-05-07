import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SecondaryButton } from '../components/Button';
import AvatarBadge from '../components/AvatarBadge';
import NoticeBanner from '../components/NoticeBanner';
import PageLayout from '../components/PageLayout';
import {
  getDisplayName,
  getEvolutionStageImage,
  getStageLabel,
} from '../api/mappers';
import {
  getCompletedCount,
  getLevelProgress,
} from '../data/habits';
import { avatarOptions } from '../data/avatarOptions';
import { colors, radii, shadow } from '../theme';

const growthPaletteByCategory = {
  Health: {
    surface: '#F4FBFF',
    border: '#D4EAF6',
    accent: '#1481C4',
    soft: '#E8F6FF',
  },
  Mind: {
    surface: '#F8F3FF',
    border: '#E3D8F8',
    accent: '#7A56C5',
    soft: '#F1EAFF',
  },
  Energy: {
    surface: '#FFF8EE',
    border: '#F4DFC1',
    accent: '#C47A12',
    soft: '#FFF1DA',
  },
  Home: {
    surface: '#F3FBF6',
    border: '#D7ECDC',
    accent: '#1D8A63',
    soft: '#E7F6EC',
  },
};

function getGrowthPalette(category) {
  return growthPaletteByCategory[category] ?? growthPaletteByCategory.Mind;
}

export default function ProfileScreen({
  habits,
  profile,
  stats,
  plant,
  onLogout,
  logoutBusy,
  onTabPress,
  onSelectAvatar,
  avatarSaving,
  actionError,
}) {
  const totalXp = stats?.total_points ?? 0;
  const completedCount = getCompletedCount(habits);
  const completionRate = habits.length
    ? Math.round((completedCount / habits.length) * 100)
    : 0;
  const longestStreak = habits.length
    ? Math.max(...habits.map((habit) => habit.streak))
    : 0;
  const levelProgress = getLevelProgress(totalXp);
  const stageImage = getEvolutionStageImage(levelProgress.level);
  const stageLabel = getStageLabel(levelProgress.level);
  const nextXp = levelProgress.nextLevelXp - levelProgress.currentLevelXp;
  const displayName = getDisplayName(profile);
  const healthScore = plant?.health_score ?? stats?.plant_health ?? 0;

  return (
    <PageLayout
      title="Profile"
      subtitle="Growth and rewards"
      activeTab="profile"
      avatarFallbackText={displayName.charAt(0).toUpperCase() || 'B'}
      avatarId={profile?.avatar_id}
      onTabPress={onTabPress}
      scroll
      contentStyle={styles.content}
    >
      <NoticeBanner message={actionError} tone="error" style={styles.notice} />

      <View style={styles.profileHero}>
        <View style={styles.profileHeader}>
          <AvatarBadge
            avatarId={profile?.avatar_id}
            fallbackText={displayName.charAt(0).toUpperCase() || 'B'}
            size={46}
            style={styles.avatar}
          />
          <View style={styles.identity}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.role}>Habit gardener</Text>
          </View>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>Level {levelProgress.level}</Text>
          </View>
        </View>

        <View style={styles.stageWrap}>
          <Image
            source={stageImage}
            style={styles.stageImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.heroTitle}>{totalXp} XP earned</Text>
        <Text style={styles.heroBody}>
          {nextXp} XP left until your next Bloomy evolution. Plant health is {healthScore}
          /100 and your current form is {stageLabel}.
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
        <StatCard label="Total XP" value={`${totalXp}`} detail="all time" />
        <StatCard label="Done" value={`${completionRate}%`} detail="completion" />
        <StatCard label="Best streak" value={`${longestStreak}`} detail="days" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Growth areas</Text>
        <Text style={styles.sectionMeta}>{completedCount} completed today</Text>
      </View>

      {habits.map((habit) => (
        <GrowthRow key={habit.id} habit={habit} />
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Choose your avatar</Text>
        <Text style={styles.sectionMeta}>
          {avatarSaving ? 'Saving...' : ''}
        </Text>
      </View>

      <View style={styles.avatarGrid}>
        {avatarOptions.map((avatar) => {
          const active = avatar.id === profile?.avatar_id;

          return (
            <Pressable
              accessibilityRole="button"
              key={avatar.id}
              onPress={() => onSelectAvatar?.(avatar.id)}
              style={({ pressed }) => [
                styles.avatarOption,
                active && styles.avatarOptionActive,
                pressed && styles.pressed,
              ]}
            >
              <AvatarBadge
                avatarId={avatar.id}
                fallbackText={displayName.charAt(0).toUpperCase() || 'B'}
                size={58}
              />
              <Text style={[styles.avatarOptionText, active && styles.avatarOptionTextActive]}>
                {avatar.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SecondaryButton
        title={logoutBusy ? 'Signing out...' : 'Log out'}
        onPress={onLogout}
        disabled={logoutBusy}
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
      />
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
  const palette = getGrowthPalette(habit.category);

  return (
    <View
      style={[
        styles.growthRow,
        { backgroundColor: palette.surface, borderColor: palette.border },
      ]}
    >
      <View style={styles.growthTop}>
        <View style={styles.growthTitleRow}>
          <View style={[styles.growthAccent, { backgroundColor: palette.accent }]} />
          <View style={styles.growthCopy}>
            <Text style={styles.growthTitle}>{habit.title}</Text>
            <Text style={[styles.growthSubtitle, { color: palette.accent }]}>
              {habit.category}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.growthStatusPill,
            habit.checked ? styles.growthStatusPillDone : styles.growthStatusPillPending,
          ]}
        >
          <Text
            style={[
              styles.growthStatusText,
              habit.checked ? styles.growthStatusTextDone : { color: palette.accent },
            ]}
          >
            {habit.checked ? 'Done' : 'In play'}
          </Text>
        </View>
      </View>

      <View style={styles.growthMetricsRow}>
        <GrowthMetric label="Streak" value={`${habit.streak}d`} />
        <GrowthMetric label="XP" value={`${earned}/${habit.xp}`} />
      </View>
    </View>
  );
}

function GrowthMetric({ label, value }) {
  return (
    <View style={styles.growthMetric}>
      <Text style={styles.growthMetricValue}>{value}</Text>
      <Text style={styles.growthMetricLabel}>{label}</Text>
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
  logoutButton: {
    marginTop: 18,
    borderColor: '#F4D0D0',
    backgroundColor: '#FFF6F6',
  },
  logoutButtonText: {
    color: colors.danger,
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
    marginRight: 12,
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
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  avatarOption: {
    width: '30%',
    minWidth: 102,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 10,
    ...shadow,
  },
  avatarOptionActive: {
    borderColor: '#B8DCCB',
    backgroundColor: '#F7FBF9',
  },
  avatarOptionText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  avatarOptionTextActive: {
    color: colors.greenDark,
  },
  growthRow: {
    borderRadius: radii.card,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    ...shadow,
  },
  growthTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  growthTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  growthAccent: {
    width: 8,
    height: 44,
    borderRadius: 999,
  },
  growthCopy: {
    flex: 1,
  },
  growthTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  growthSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  growthStatusPill: {
    minHeight: 30,
    borderRadius: 999,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  growthStatusPillDone: {
    backgroundColor: '#E8F7EE',
    borderColor: '#CBE8D5',
  },
  growthStatusPillPending: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8E1DC',
  },
  growthStatusText: {
    fontSize: 11,
    fontWeight: '900',
  },
  growthStatusTextDone: {
    color: colors.greenDark,
  },
  growthMetricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  growthMetric: {
    flex: 1,
    minHeight: 72,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E8E4',
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  growthMetricValue: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  growthMetricLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  growthNote: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
  },
  pressed: {
    opacity: 0.78,
  },
});
