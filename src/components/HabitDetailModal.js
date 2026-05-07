import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  Learning: {
    background: '#EEF5FF',
    accent: '#2A62C9',
  },
  Work: {
    background: '#FFF2EB',
    accent: '#B45A25',
  },
  Social: {
    background: '#FFF1F5',
    accent: '#C14D78',
  },
  Other: {
    background: '#F4F5F6',
    accent: '#5F6B76',
  },
};

function getPalette(category) {
  return accentByCategory[category] ?? accentByCategory.Mind;
}

export default function HabitDetailModal({
  habit,
  visible,
  onClose,
  onSaveDescription,
  onToggleComplete,
  primaryDisabled = false,
}) {
  const insight = useMemo(() => buildAiHabitInsight(habit), [habit]);
  const palette = getPalette(habit?.category || insight.category);
  const isManualHabit = habit?.source === 'manual';
  const existingDescription = (habit?.description || '').trim();
  const [draftDescription, setDraftDescription] = useState(existingDescription);
  const [editingDescription, setEditingDescription] = useState(false);

  useEffect(() => {
    setDraftDescription(existingDescription);
    setEditingDescription(Boolean(visible && isManualHabit && !existingDescription));
  }, [existingDescription, isManualHabit, visible, habit?.id]);

  const handleSaveDescription = async () => {
    const nextDescription = draftDescription.trim();
    if (!nextDescription) {
      return;
    }

    const saved = await onSaveDescription?.(habit?.id, nextDescription);
    if (saved !== false) {
      setEditingDescription(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.hero, { backgroundColor: palette.background }]}>
              <View style={[styles.heroOrb, { backgroundColor: palette.accent }]}>
                <Text style={styles.heroIcon}>{habit?.icon || '✨'}</Text>
              </View>
              <Text style={[styles.eyebrow, { color: palette.accent }]}>
                {isManualHabit ? 'Your custom habit' : 'Habit details'}
              </Text>
              <Text style={styles.title}>{habit?.title || insight.title}</Text>
              <Text style={styles.subtitle}>{habit?.schedule || insight.frequency}</Text>
            </View>

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{habit?.category || insight.category}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  {habit?.checked ? 'Completed today' : 'Open for today'}
                </Text>
              </View>
            </View>

            {isManualHabit ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your description</Text>
                {editingDescription ? (
                  <>
                    <TextInput
                      autoCapitalize="sentences"
                      multiline
                      onChangeText={setDraftDescription}
                      placeholder="Describe this habit in your own words."
                      placeholderTextColor="#97A39E"
                      style={styles.textArea}
                      textAlignVertical="top"
                      value={draftDescription}
                    />

                    <View style={styles.inlineActions}>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => {
                          setDraftDescription(existingDescription);
                          setEditingDescription(false);
                        }}
                        style={({ pressed }) => [
                          styles.inlineButton,
                          styles.inlineButtonGhost,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text style={styles.inlineButtonGhostText}>Cancel</Text>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        onPress={
                          primaryDisabled || !draftDescription.trim()
                            ? undefined
                            : handleSaveDescription
                        }
                        style={({ pressed }) => [
                          styles.inlineButton,
                          styles.inlineButtonPrimary,
                          (primaryDisabled || !draftDescription.trim()) && styles.inlineButtonDisabled,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text style={styles.inlineButtonPrimaryText}>Save note</Text>
                      </Pressable>
                    </View>
                  </>
                ) : existingDescription ? (
                  <>
                    <Text style={styles.body}>{existingDescription}</Text>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setEditingDescription(true)}
                      style={({ pressed }) => [styles.notePrompt, pressed && styles.pressed]}
                    >
                      <Text style={styles.notePromptText}>Edit note</Text>
                    </Pressable>
                  </>
                ) : (
                  <View style={styles.emptyNoteCard}>
                    <Text style={styles.emptyNoteTitle}>No personal note yet</Text>
                    <Text style={styles.body}>
                      Add a short explanation so this habit stays personal and easy to
                      remember.
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setEditingDescription(true)}
                      style={({ pressed }) => [styles.notePrompt, pressed && styles.pressed]}
                    >
                      <Text style={styles.notePromptText}>Describe this habit</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ) : (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Why this habit?</Text>
                  <Text style={styles.body}>{habit?.description || insight.description}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Bloomy says</Text>
                  <Text style={styles.body}>{insight.motivation}</Text>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <SecondaryButton title="Back" onPress={onClose} style={styles.footerButton} />
            <PrimaryButton
              title={habit?.checked ? 'Mark as undone' : 'Mark as done'}
              onPress={primaryDisabled ? undefined : onToggleComplete}
              disabled={primaryDisabled}
              style={styles.footerButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '86%',
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
    textAlign: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  textArea: {
    minHeight: 126,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F7FAF8',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
  },
  inlineActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  inlineButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  inlineButtonGhost: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inlineButtonGhostText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  inlineButtonPrimary: {
    backgroundColor: colors.greenDark,
  },
  inlineButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  inlineButtonDisabled: {
    opacity: 0.45,
  },
  emptyNoteCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDE7E2',
    backgroundColor: '#F9FBFA',
    padding: 16,
  },
  emptyNoteTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },
  notePrompt: {
    alignSelf: 'flex-start',
    marginTop: 12,
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenSoft,
  },
  notePromptText: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  footerButton: {
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});
