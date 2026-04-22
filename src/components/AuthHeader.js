import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function AuthHeader({ title, onBack }) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <Text style={styles.backText}>‹</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.headerSlot} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerSlot: {
    width: 42,
    height: 42,
  },
  backText: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 28,
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.65,
  },
});
