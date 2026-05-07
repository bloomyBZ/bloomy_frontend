import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { buildAiHabitInsight } from '../api/mappers';
import { PrimaryButton, SecondaryButton } from './Button';
import { colors, radii, shadow } from '../theme';

const accentByCategory = {
  Health: {
    background: '#E8F6FF',
    accent: '#1583C6',
  },
  Mind: {
    background: '#F3EEFF',
    accent: '#7056C8',
  },
  Energy: {
    background: '#FFF4E1',
    accent: '#C47A12',
  },
  Home: {
    background: '#EAF7EF',
    accent: '#1D8A63',
  },
};

export default function HabitIdeaModal({
  idea,
  visible,
  added,
  onAdd,
  onClose,
  primaryLabel,
  secondaryLabel = 'Close',
  primaryDisabled = false,
}) {
  const insight = buildAiHabitInsight(idea);
  const palette = accentByCategory[insight.category] ?? accentByCategory.Mind;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={[styles.hero, { backgroundColor: palette.background }]}>
              <View style={[styles.heroOrb, { backgroundColor: palette.accent }]}>
                <Text style={styles.heroIcon}>{idea?.icon || '✨'}</Text>
              </View>
              <Text style={[styles.eyebrow, { color: palette.accent }]}>AI Suggested Habit</Text>
              <Text style={styles.title}>{insight.title}</Text>
              <Text style={styles.subtitle}>{insight.frequency}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why this habit?</Text>
              <Text style={styles.body}>{insight.description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bloomy AI says</Text>
              <Text style={styles.body}>{insight.motivation}</Text>
            </View>

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{insight.category}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{insight.frequency}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <SecondaryButton title={secondaryLabel} onPress={onClose} style={styles.footerButton} />
            <PrimaryButton
              title={primaryLabel || (added ? 'Already added' : 'Add this habit')}
              onPress={primaryDisabled || added ? undefined : onAdd}
              disabled={primaryDisabled || added}
              style={styles.footerButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(12, 24, 20, 0.28)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    maxHeight: '84%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
    ...shadow,
  },
  handle: {
    width: 52,
    height: 5,
    borderRadius: 999,
    alignSelf: 'center',
    backgroundColor: '#D0D8D4',
    marginBottom: 18,
  },
  content: {
    paddingBottom: 8,
  },
  hero: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 18,
  },
  heroOrb: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    fontSize: 34,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 7,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  tag: {
    minHeight: 34,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  tagText: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  footerButton: {
    flex: 1,
  },
});
