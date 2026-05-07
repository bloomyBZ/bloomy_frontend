import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AvatarBadge from './AvatarBadge';
import { colors } from '../theme';

const topInset = Platform.OS === 'ios' ? 44 : NativeStatusBar.currentHeight || 0;
const bottomInset = Platform.OS === 'ios' ? 20 : 8;

const tabs = [
  { key: 'home', label: 'Home' },
  { key: 'habits', label: 'Habits' },
  { key: 'profile', label: 'Profile' },
];

export default function PageLayout({
  title,
  subtitle,
  activeTab,
  onTabPress,
  onNotificationPress,
  avatarId,
  avatarFallbackText,
  children,
  scroll = false,
  contentStyle,
}) {
  const content = [
    styles.pageContent,
    scroll ? styles.scrollContent : styles.content,
    contentStyle,
  ];

  return (
    <View style={styles.shell}>
      <View style={styles.appBar}>
        <View style={styles.appBarRow}>
          <AvatarBadge
            avatarId={avatarId}
            fallbackText={avatarFallbackText}
            size={42}
            style={styles.avatar}
            imageStyle={styles.avatarImage}
          />
          <View style={styles.appBarText}>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open notifications"
            accessibilityState={{ disabled: !onNotificationPress }}
            disabled={!onNotificationPress}
            onPress={onNotificationPress}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <BellIcon />
            <View style={styles.notificationBadge} />
          </Pressable>
        </View>
      </View>

      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={content}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={content}>{children}</View>
      )}

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;

          return (
            <Pressable
              accessibilityRole="button"
              key={tab.key}
              onPress={() => onTabPress?.(tab.key)}
              style={({ pressed }) => [
                styles.tabItem,
                active && styles.tabItemActive,
                pressed && styles.pressed,
              ]}
            >
              <TabIcon name={tab.key} active={active} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function BellIcon() {
  return (
    <View style={styles.bell}>
      <View style={styles.bellBody} />
      <View style={styles.bellClapper} />
    </View>
  );
}

function TabIcon({ name, active }) {
  if (name === 'home') {
    return (
      <View style={styles.icon}>
        <View style={[styles.homeRoofLeft, active && styles.iconActive]} />
        <View style={[styles.homeRoofRight, active && styles.iconActive]} />
        <View style={[styles.homeBase, active && styles.iconBorderActive]} />
      </View>
    );
  }

  if (name === 'habits') {
    return (
      <View style={[styles.icon, styles.habitsIcon]}>
        <View style={[styles.habitCheck, active && styles.iconBorderActive]}>
          {active ? <View style={styles.habitCheckFill} /> : null}
        </View>
        <View style={styles.habitLines}>
          <View style={[styles.habitLine, active && styles.iconActive]} />
          <View style={[styles.habitLineShort, active && styles.iconActive]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.icon}>
      <View style={[styles.profileHead, active && styles.iconBorderActive]} />
      <View style={[styles.profileBody, active && styles.iconBorderActive]} />
    </View>
  );
}

const inactive = '#AEB4BE';

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    backgroundColor: colors.background,
  },
  appBar: {
    paddingTop: topInset,
    height: topInset + 72,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        boxShadow: '0px 4px 16px rgba(20, 33, 29, 0.05)',
      },
    }),
  },
  appBarRow: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    marginRight: 14,
  },
  avatarImage: {
    marginTop: 1,
  },
  appBarText: {
    flex: 1,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
    letterSpacing: 0,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bell: {
    width: 21,
    height: 23,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bellBody: {
    width: 15,
    height: 17,
    borderWidth: 1.7,
    borderColor: colors.ink,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomWidth: 0,
  },
  bellClapper: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.ink,
    marginTop: 1,
  },
  notificationBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF7A59',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  pageContent: {
    paddingHorizontal: 18,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 18,
  },
  tabBar: {
    minHeight: 72 + bottomInset,
    paddingTop: 9,
    paddingBottom: bottomInset,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 12,
      },
      default: {
        boxShadow: '0px -4px 18px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  tabItem: {
    flex: 1,
    height: 54,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: colors.greenSoft,
  },
  tabLabel: {
    color: inactive,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 4,
  },
  tabLabelActive: {
    color: colors.greenDark,
  },
  icon: {
    width: 24,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: colors.greenDark,
  },
  iconBorderActive: {
    borderColor: colors.greenDark,
  },
  homeRoofLeft: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: inactive,
    transform: [{ rotate: '-42deg' }],
  },
  homeRoofRight: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: inactive,
    transform: [{ rotate: '42deg' }],
  },
  homeBase: {
    position: 'absolute',
    bottom: 2,
    width: 15,
    height: 12,
    borderWidth: 1.8,
    borderColor: inactive,
    borderRadius: 3,
    borderTopWidth: 0,
  },
  habitsIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  habitCheck: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.7,
    borderColor: inactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCheckFill: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.greenDark,
  },
  habitLines: {
    gap: 4,
  },
  habitLine: {
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: inactive,
  },
  habitLineShort: {
    width: 9,
    height: 2,
    borderRadius: 1,
    backgroundColor: inactive,
  },
  profileHead: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.8,
    borderColor: inactive,
    marginBottom: 2,
  },
  profileBody: {
    width: 17,
    height: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderWidth: 1.8,
    borderColor: inactive,
    borderBottomWidth: 0,
  },
  pressed: {
    opacity: 0.72,
  },
});
