import { useEffect, useState } from 'react';
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
import {
  habitCategories,
  MANUAL_HABIT_XP,
  manualHabitScheduleOptions,
} from '../data/habits';
import { colors, radii, shadow } from '../theme';
import { PrimaryButton, SecondaryButton } from './Button';

function createInitialForm() {
  return {
    title: '',
    schedule: manualHabitScheduleOptions[0],
    category: habitCategories[0],
  };
}

export default function AddHabitSheet({ visible, dateLabel, onClose, onSubmit }) {
  const [form, setForm] = useState(createInitialForm);
  const canSubmit = form.title.trim().length > 0;

  useEffect(() => {
    if (!visible) {
      setForm(createInitialForm());
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    onSubmit?.({
      title: form.title.trim(),
      schedule: form.schedule.trim(),
      category: form.category,
    });
    setForm(createInitialForm());
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

          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>New habit</Text>
              <Text style={styles.title}>Add a habit for {dateLabel}</Text>
              <Text style={styles.body}>
                Pick a name, schedule, and category. You can write the habit's own
                description later from the detail view.
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
          >
            <Field label="Habit name">
              <TextInput
                autoCapitalize="sentences"
                onChangeText={(title) => setForm((current) => ({ ...current, title }))}
                placeholder="Read before bed"
                placeholderTextColor="#97A39E"
                style={styles.input}
                value={form.title}
              />
            </Field>

            <Field label="Schedule">
              <View style={styles.chipRow}>
                {manualHabitScheduleOptions.map((schedule) => {
                  const active = form.schedule === schedule;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={schedule}
                      onPress={() => setForm((current) => ({ ...current, schedule }))}
                      style={({ pressed }) => [
                        styles.chip,
                        active && styles.scheduleChipActive,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.chipText, active && styles.scheduleChipTextActive]}>
                        {schedule}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Field>

            <Field label="Category">
              <View style={styles.chipRow}>
                {habitCategories.map((category) => {
                  const active = form.category === category;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={category}
                      onPress={() => setForm((current) => ({ ...current, category }))}
                      style={({ pressed }) => [
                        styles.chip,
                        active && styles.chipActive,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Field>

            <Field label="Reward XP">
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>+{MANUAL_HABIT_XP} XP</Text>
                <Text style={styles.infoBody}>
                  Manual habits start with a fixed reward.
                </Text>
              </View>
            </Field>
          </ScrollView>

          <View style={styles.footer}>
            <SecondaryButton onPress={onClose} style={styles.footerButton} title="Cancel" />
            <PrimaryButton
              onPress={handleSubmit}
              style={[styles.footerButton, !canSubmit && styles.footerButtonDisabled]}
              title="Add Habit"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(9, 18, 15, 0.32)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 22,
    maxHeight: '88%',
    ...shadow,
  },
  handle: {
    width: 54,
    height: 5,
    borderRadius: 999,
    alignSelf: 'center',
    backgroundColor: '#CED7D3',
    marginBottom: 18,
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    gap: 6,
  },
  eyebrow: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    color: colors.ink,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '900',
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  formContent: {
    paddingBottom: 8,
    gap: 18,
  },
  field: {
    gap: 10,
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    minHeight: 54,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F7FAF8',
    paddingHorizontal: 16,
    color: colors.ink,
    fontSize: 15,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.greenSoft,
    borderColor: '#B6DBC9',
  },
  scheduleChipActive: {
    backgroundColor: '#EEF4FF',
    borderColor: '#C5D8FF',
  },
  chipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  chipTextActive: {
    color: colors.greenDark,
  },
  scheduleChipTextActive: {
    color: '#2854A6',
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F2D289',
    backgroundColor: '#FFF9E8',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  infoTitle: {
    color: '#85620D',
    fontSize: 16,
    fontWeight: '900',
  },
  infoBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  footerButton: {
    flex: 1,
  },
  footerButtonDisabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.75,
  },
});
