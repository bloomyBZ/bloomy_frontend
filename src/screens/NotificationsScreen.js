import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { isHydrationHabit } from '../api/mappers';
import NoticeBanner from '../components/NoticeBanner';
import { colors, radii, shadow } from '../theme';

const notificationTimeOptions = [
  { key: 'morning', label: 'Morning' },
  { key: 'afternoon', label: 'Afternoon' },
  { key: 'evening', label: 'Evening' },
];

function titleCase(value) {
  return (value || '').charAt(0).toUpperCase() + (value || '').slice(1);
}

function buildNotificationFeed(habits, profile) {
  const notificationsEnabled = profile?.notifications_enabled ?? true;
  const notificationTime = profile?.notification_time || 'evening';
  const streakAlertsEnabled = profile?.streak_alerts_enabled ?? true;
  const eveningReflectionEnabled = profile?.evening_reflection_enabled ?? false;
  const pendingHabits = habits.filter((habit) => !habit.checked);
  const hydrationHabit = habits.find(isHydrationHabit);
  const longestStreakHabit = habits.reduce(
    (currentBest, habit) =>
      !currentBest || habit.streak > currentBest.streak ? habit : currentBest,
    null
  );

  if (!notificationsEnabled) {
    return [
      {
        id: 'notifications-paused',
        eyebrow: 'Paused',
        title: 'Notifications are turned off',
        body: 'Turn reminders back on below whenever you want Bloomy to start nudging you again.',
      },
    ];
  }

  const feed = [];

  if (pendingHabits.length > 0) {
    feed.push({
      id: 'pending-habits',
      eyebrow: `${titleCase(notificationTime)} reminder`,
      title: `${pendingHabits.length} habits are still open today`,
      body: `A good next step is "${pendingHabits[0].title}". Keeping one promise to yourself is enough to build momentum.`,
    });
  }

  if (streakAlertsEnabled && longestStreakHabit?.streak > 0) {
    feed.push({
      id: 'streak-alert',
      eyebrow: 'Streak watch',
      title: `Protect your ${longestStreakHabit.streak}-day streak`,
      body: `${longestStreakHabit.title} is your strongest run right now. Finishing it today keeps the streak alive.`,
    });
  }

  if (hydrationHabit && !hydrationHabit.checked) {
    feed.push({
      id: 'hydration',
      eyebrow: 'Health',
      title: 'Hydration tracker is still waiting',
      body: 'Your water habit is still open today. A few glasses now will make the evening feel easier.',
    });
  }

  if (eveningReflectionEnabled) {
    feed.push({
      id: 'reflection',
      eyebrow: 'Reflection',
      title: 'Evening check-in is enabled',
      body: 'Bloomy will keep space for a short end-of-day reflection so you can close the day intentionally.',
    });
  }

  if (feed.length === 0) {
    return [
      {
        id: 'all-clear',
        eyebrow: 'All caught up',
        title: 'No urgent reminders right now',
        body: 'Your habits look calm for the moment. You can still adjust reminder timing below if you want a different rhythm.',
      },
    ];
  }

  return feed;
}

export default function NotificationsScreen({
  habits,
  profile,
  onClose,
  onUpdateNotifications,
  notificationsSaving,
  actionError,
}) {
  const notificationsEnabled = profile?.notifications_enabled ?? true;
  const notificationTime = profile?.notification_time || 'evening';
  const streakAlertsEnabled = profile?.streak_alerts_enabled ?? true;
  const eveningReflectionEnabled = profile?.evening_reflection_enabled ?? false;
  const feed = buildNotificationFeed(habits, profile);

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>Notification center</Text>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close notifications"
          onPress={onClose}
          style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <NoticeBanner message={actionError} tone="error" style={styles.notice} />

        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Right now</Text>
          <Text style={styles.heroTitle}>Your latest Bloomy nudges</Text>
          <Text style={styles.heroBody}>
            This panel groups quick reminders and the settings that control when they
            appear.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent notifications</Text>
          <Text style={styles.sectionMeta}>{feed.length} items</Text>
        </View>

        {feed.map((item) => (
          <View key={item.id} style={styles.notificationItem}>
            <Text style={styles.notificationEyebrow}>{item.eyebrow}</Text>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationBody}>{item.body}</Text>
          </View>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Text style={styles.sectionMeta}>
            {notificationsSaving ? 'Saving...' : 'Synced with backend'}
          </Text>
        </View>

        <View style={styles.settingsCard}>
          <NotificationRow
            description="Receive your main Bloomy reminder for planned habits."
            disabled={notificationsSaving}
            onToggle={() =>
              onUpdateNotifications?.({
                notifications_enabled: !notificationsEnabled,
              })
            }
            title="Habit reminders"
            value={notificationsEnabled}
          />

          <View style={styles.divider} />

          <Text style={styles.label}>Reminder time</Text>
          <View style={styles.timeRow}>
            {notificationTimeOptions.map((option) => {
              const active = notificationTime === option.key;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={option.key}
                  onPress={() =>
                    notificationsSaving || !notificationsEnabled
                      ? undefined
                      : onUpdateNotifications?.({ notification_time: option.key })
                  }
                  style={({ pressed }) => [
                    styles.timeChip,
                    active && styles.timeChipActive,
                    (!notificationsEnabled || notificationsSaving) && styles.timeChipDisabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.timeChipText, active && styles.timeChipTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          <NotificationRow
            description="Get a nudge when your streak is close to slipping."
            disabled={notificationsSaving || !notificationsEnabled}
            onToggle={() =>
              onUpdateNotifications?.({
                streak_alerts_enabled: !streakAlertsEnabled,
              })
            }
            title="Streak alerts"
            value={streakAlertsEnabled}
          />

          <NotificationRow
            description="Send a short evening check-in to close the day mindfully."
            disabled={notificationsSaving || !notificationsEnabled}
            onToggle={() =>
              onUpdateNotifications?.({
                evening_reflection_enabled: !eveningReflectionEnabled,
              })
            }
            title="Evening reflection"
            value={eveningReflectionEnabled}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function NotificationRow({ title, description, value, onToggle, disabled }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowBody}>{description}</Text>
      </View>
      <Switch
        disabled={disabled}
        ios_backgroundColor="#DCE5E1"
        onValueChange={onToggle}
        thumbColor={value ? '#FFFFFF' : '#F8FBFA'}
        trackColor={{ false: '#DCE5E1', true: '#8FD0B2' }}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderLeftWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerEyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '900',
    marginTop: 4,
  },
  closeButton: {
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
  },
  notice: {
    marginBottom: 14,
  },
  heroCard: {
    borderRadius: radii.card,
    backgroundColor: colors.greenDark,
    padding: 18,
    marginBottom: 16,
  },
  heroEyebrow: {
    color: '#BDE2D1',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '900',
  },
  heroBody: {
    color: '#D6EAE1',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
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
  notificationItem: {
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    ...shadow,
  },
  notificationEyebrow: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 6,
  },
  notificationTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  notificationBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  settingsCard: {
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 18,
    ...shadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  rowBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E4ECE8',
    marginVertical: 14,
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeChip: {
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: {
    backgroundColor: '#EAF3FF',
    borderColor: '#C8D8FF',
  },
  timeChipDisabled: {
    opacity: 0.45,
  },
  timeChipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  timeChipTextActive: {
    color: colors.blue,
  },
  pressed: {
    opacity: 0.78,
  },
});
