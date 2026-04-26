import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';

export function PrimaryButton({ title, onPress, style, textStyle, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles.primary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.primaryText, textStyle]} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, style, textStyle, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles.secondary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.secondaryText, textStyle]} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

export function SmallActionButton({ title, onPress, style, textStyle, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.small,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.smallText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

export function IconDot({ active }) {
  return <View style={[styles.iconDot, active && styles.iconDotActive]} />;
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: colors.greenDark,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  secondaryText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  small: {
    minHeight: 34,
    borderRadius: 8,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  smallText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
  iconDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.soft,
  },
  iconDotActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  pressed: {
    opacity: 0.78,
  },
  disabled: {
    opacity: 0.45,
  },
});
