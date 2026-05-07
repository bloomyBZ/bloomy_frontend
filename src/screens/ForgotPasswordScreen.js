import { StyleSheet, Text, View } from 'react-native';
import AuthHeader from '../components/AuthHeader';
import { PrimaryButton } from '../components/Button';
import { ForgotIllustration } from '../components/Illustrations';
import InputField from '../components/InputField';
import NoticeBanner from '../components/NoticeBanner';
import Screen from '../components/Screen';
import { colors } from '../theme';

export default function ForgotPasswordScreen({
  onBack,
  onVerify,
  email,
  onChangeEmail,
  errorMessage,
  noticeMessage,
  isSubmitting,
}) {
  return (
    <Screen scroll contentStyle={styles.content}>
      <AuthHeader title="Forgot" onBack={onBack} />

      <View style={styles.illustrationPanel}>
        <ForgotIllustration />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.body}>
          Enter the email on your account and we will send a password reset link.
        </Text>
      </View>

      <NoticeBanner message={errorMessage} tone="error" style={styles.notice} />
      <NoticeBanner message={noticeMessage} tone="success" style={styles.notice} />

      <InputField
        label="Email"
        value={email}
        onChangeText={onChangeEmail}
        keyboardType="email-address"
        placeholder="you@example.com"
        right={null}
      />

      <PrimaryButton
        title={isSubmitting ? 'Sending...' : 'Send reset link'}
        onPress={onVerify}
        style={styles.button}
        disabled={isSubmitting}
      />

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
  notice: {
    marginBottom: 14,
  },
  spacer: {
    flex: 1,
    minHeight: 16,
  },
});
