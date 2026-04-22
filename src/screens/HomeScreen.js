import { Image, StyleSheet, Text, View } from 'react-native';
import { SmallActionButton } from '../components/Button';
import { BooksArtwork, DeskArtwork } from '../components/Illustrations';
import PageLayout from '../components/PageLayout';
import { colors, radii, shadow } from '../theme';

const seed = require('../../assets/bloomy-docs/bloomy-wbg/stage1.png');

function MetricCard({ label, value, detail }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

function HabitCard({ title, body, artwork, tag, progress }) {
  return (
    <View style={styles.habitCard}>
      <View style={styles.artColumn}>{artwork}</View>
      <View style={styles.cardCopy}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        </View>
        <Text style={styles.cardBody}>{body}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <SmallActionButton title="+ Add Now" style={styles.cardButton} />
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen({ onTabPress }) {
  return (
    <PageLayout
      title="Welcome Betul!"
      subtitle="18 April, Saturday"
      activeTab="home"
      onTabPress={onTabPress}
      scroll
      contentStyle={styles.scrollContent}
    >
      <View style={styles.summaryCard}>
        <View style={styles.summaryCopy}>
          <Text style={styles.eyebrow}>Today's focus</Text>
          <Text style={styles.summaryTitle}>3 habits waiting</Text>
          <Text style={styles.summaryBody}>
            Complete one small action to keep your Bloomy growing.
          </Text>
          <SmallActionButton title="+ Add Habit" style={styles.heroButton} />
        </View>
        <View style={styles.plantBadge}>
          <Image source={seed} style={styles.seedImage} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.metricGrid}>
        <MetricCard label="Streak" value="12" detail="days in a row" />
        <MetricCard label="Completion" value="76%" detail="this week" />
      </View>

      <View style={styles.weekCard}>
        <View style={styles.weekHeader}>
          <Text style={styles.weekTitle}>Weekly consistency</Text>
          <Text style={styles.weekValue}>5/7</Text>
        </View>
        <View style={styles.weekTrack}>
          <View style={styles.weekFill} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suggested habits</Text>
        <Text style={styles.sectionAction}>View all</Text>
      </View>

      <HabitCard
        title="Track What You Read"
        body="Log books you've finished, loved, or plan to read next."
        tag="Mind"
        progress={68}
        artwork={<BooksArtwork />}
      />

      <HabitCard
        title="Keep Your Space in Order"
        body="Stay organized with small daily habits."
        tag="Home"
        progress={42}
        artwork={<DeskArtwork />}
      />
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
    letterSpacing: 0,
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
  weekCard: {
    width: '100%',
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 20,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  weekValue: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '800',
  },
  weekTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceSoft,
    overflow: 'hidden',
  },
  weekFill: {
    width: '72%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.green,
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
  habitCard: {
    width: '100%',
    minHeight: 134,
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
  artColumn: {
    width: 98,
    alignItems: 'center',
    justifyContent: 'center',
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
    letterSpacing: 0,
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
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
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
  cardButton: {
    minHeight: 32,
    paddingHorizontal: 12,
  },
});
