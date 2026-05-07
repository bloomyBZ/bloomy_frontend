import { StyleSheet, Text, TextInput, View } from 'react-native';
import AuthHeader from '../components/AuthHeader';
import { PrimaryButton } from '../components/Button';
import { VerifyIllustration } from '../components/Illustrations';
import Screen from '../components/Screen';
import { colors, radii } from '../theme';

export default function VerifyScreen({ onBack, onVerify }) {
  return (
    <Screen scroll contentStyle={styles.content}>
      <AuthHeader title="Verify" onBack={onBack} />

      <View style={styles.illustrationPanel}>
        <VerifyIllustration />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.body}>A 4 digit OTP has been sent to</Text>
        <Text style={styles.phone}>514-234-57-56</Text>
      </View>

      <View style={styles.otpRow}>
        {[0, 1, 2, 3].map((item) => (
          <TextInput
            key={item}
            maxLength={1}
            keyboardType="number-pad"
            style={styles.otpBox}
          />
        ))}
      </View>

      <PrimaryButton title="Verify" onPress={onVerify} style={styles.button} />

      <View style={styles.spacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 14,
    paddingBottom: 2,
  },
  illustrationPanel: {
    height: 214,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  copy: {
    marginBottom: 34,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 8,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  phone: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 22,
  },
  otpBox: {
    flex: 1,
    minWidth: 54,
    height: 54,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  button: {
    marginTop: 0,
  },
  spacer: {
    flex: 1,
    minHeight: 22,
  },
});
