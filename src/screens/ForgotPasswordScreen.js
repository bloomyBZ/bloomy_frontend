import { StyleSheet, Text, View } from 'react-native';
import AuthHeader from '../components/AuthHeader';
import { PrimaryButton } from '../components/Button';
import { ForgotIllustration } from '../components/Illustrations';
import InputField from '../components/InputField';
import Screen, { HomeIndicator } from '../components/Screen';
import { colors } from '../theme';

export default function ForgotPasswordScreen({ onBack, onVerify }) {
  return (
    <Screen scroll contentStyle={styles.content}>
      <AuthHeader title="Forgot" onBack={onBack} />

      <View style={styles.illustrationPanel}>
        <ForgotIllustration />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.body}>
          Enter the phone number connected to your account and we'll send a verification code.
        </Text>
      </View>

      <InputField
        label="Mobile number"
        prefix="+90"
        defaultValue="514-234-57-56"
        keyboardType="phone-pad"
      />

      <PrimaryButton title="Get OTP" onPress={onVerify} style={styles.button} />

      <View style={styles.spacer} />
      <HomeIndicator />
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
    marginBottom: 28,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 10,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  button: {
    marginTop: 20,
  },
  spacer: {
    flex: 1,
    minHeight: 16,
  },
});
