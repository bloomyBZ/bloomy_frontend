import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii } from '../theme';

export default function InputField({
  label,
  placeholder,
  defaultValue,
  value,
  onChangeText,
  secure = false,
  keyboardType = 'default',
  prefix,
  right = 'check',
  style,
  editable = true,
  autoCapitalize = 'none',
  autoCorrect = false,
}) {
  const [secureVisible, setSecureVisible] = useState(false);
  const shouldHideText = secure && !secureVisible;

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputShell}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          defaultValue={defaultValue}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#97918E"
          secureTextEntry={shouldHideText}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          style={styles.input}
        />
        {right === 'check' ? (
          <CheckIcon />
        ) : null}
        {right === 'eye' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={shouldHideText ? 'Show password' : 'Hide password'}
            hitSlop={8}
            onPress={() => setSecureVisible((current) => !current)}
            style={({ pressed }) => [styles.eyeButton, pressed && styles.pressed]}
          >
            <EyeIcon visible={!shouldHideText} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function CheckIcon() {
  return (
    <View style={styles.check}>
      <View style={styles.checkStem} />
      <View style={styles.checkArm} />
    </View>
  );
}

function EyeIcon({ visible }) {
  return (
    <View style={styles.eye}>
      <View style={styles.eyeDot} />
      {!visible ? <View style={styles.eyeSlash} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 7,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  inputShell: {
    height: 52,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  prefix: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    paddingVertical: 0,
    letterSpacing: 0,
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  checkStem: {
    position: 'absolute',
    width: 5,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: 1 }, { rotate: '45deg' }],
  },
  checkArm: {
    position: 'absolute',
    width: 9,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: 2 }, { rotate: '-45deg' }],
  },
  eye: {
    width: 20,
    height: 13,
    borderWidth: 1.5,
    borderColor: colors.soft,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.soft,
  },
  eyeSlash: {
    position: 'absolute',
    width: 22,
    height: 1.5,
    borderRadius: 2,
    backgroundColor: colors.soft,
    transform: [{ rotate: '-32deg' }],
  },
  eyeButton: {
    marginLeft: 8,
    padding: 2,
  },
  pressed: {
    opacity: 0.72,
  },
});
