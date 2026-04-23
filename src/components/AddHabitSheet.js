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
import { habitCategories, habitXpOptions } from '../data/habits';
import { colors, radii, shadow } from '../theme';
import { PrimaryButton, SecondaryButton } from './Button';

const defaultXp = habitXpOptions.includes(20) ? 20 : habitXpOptions[0];

function createInitialForm() {
  return {
    title: '',
    schedule: '',
    category: habitCategories[0],
    xp: defaultXp,
  };
}

export default function AddHabitSheet({ visible, dateLabel, onClose, onSubmit }) {
  const [form, setForm] = useState(createInitialForm);
  const canSubmit = form.title.trim().length > 0 && form.schedule.trim().length > 0;

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
      xp: form.xp,
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
                Pick a name, rhythm, and category. We will add it from this day
                forward.
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
              <TextInput
                autoCapitalize="sentences"
                onChangeText={(schedule) =>
                  setForm((current) => ({ ...current, schedule }))
                }
                placeholder="Every evening"
                placeholderTextColor="#97A39E"
                style={styles.input}
                value={form.schedule}
              />
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
              <View style={styles.chipRow}>
                {habitXpOptions.map((xp) => {
                  const active = form.xp === xp;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={xp}
                      onPress={() => setForm((current) => ({ ...current, xp }))}
                      style={({ pressed }) => [
                        styles.chip,
                        active && styles.xpChipActive,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.chipText, active && styles.xpChipTextActive]}>
                        +{xp} XP
                      </Text>
                    </Pressable>
                  );
                })}
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
  xpChipActive: {
    backgroundColor: '#FFF4D7',
    borderColor: '#F2D289',
  },
  chipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  chipTextActive: {
    color: colors.greenDark,
  },
  xpChipTextActive: {
    color: '#85620D',
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
