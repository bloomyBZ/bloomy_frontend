import { Pressable, StyleSheet, Text, View } from 'react-native';
import AuthHeader from '../components/AuthHeader';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import InputField from '../components/InputField';
import NoticeBanner from '../components/NoticeBanner';
import Screen, { HomeIndicator } from '../components/Screen';
import { colors } from '../theme';

function SocialButton({ icon, title }) {
  return (
    <SecondaryButton
      title={`${icon}  ${title}`}
      style={styles.socialButton}
      textStyle={styles.socialText}
    />
  );
}

export default function RegisterScreen({
  onBack,
  onRegister,
  onSignIn,
  displayName,
  email,
  password,
  confirmPassword,
  onChangeDisplayName,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
  errorMessage,
  isSubmitting,
}) {
  return (
    <Screen scroll contentStyle={styles.content}>
      <AuthHeader title="Register" onBack={onBack} />

      <View style={styles.hero}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Set up your profile and start building a calmer routine.
        </Text>
      </View>

      <View style={styles.form}>
        <InputField
          label="Display name"
          value={displayName}
          onChangeText={onChangeDisplayName}
          placeholder="Betul"
          right={null}
          autoCapitalize="words"
        />
        <InputField
          label="Email"
          value={email}
          onChangeText={onChangeEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          right={null}
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={onChangePassword}
          placeholder="Create a password"
          secure
          right="eye"
        />
        <InputField
          label="Confirm password"
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
          placeholder="Repeat your password"
          secure
          right="eye"
        />

        <NoticeBanner message={errorMessage} tone="error" />
      </View>

      <PrimaryButton
        title={isSubmitting ? 'Creating account...' : 'Sign Up'}
        onPress={onRegister}
        style={styles.button}
        disabled={isSubmitting}
      />

      <View style={styles.signinRow}>
        <Text style={styles.muted}>Already have an account? </Text>
        <Pressable onPress={onSignIn}>
          <Text style={styles.link}>Sign in</Text>
        </Pressable>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.or}>or</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialStack}>
        <SocialButton icon="G" title="Continue with Google" />
        <SocialButton icon="A" title="Continue with Apple" />
      </View>

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
  hero: {
    marginTop: 18,
    marginBottom: 22,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  form: {
    gap: 15,
  },
  button: {
    marginTop: 20,
  },
  signinRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muted: {
    color: colors.muted,
    fontSize: 13,
  },
  link: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  or: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  socialStack: {
    gap: 14,
  },
  socialButton: {
    minHeight: 42,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  socialText: {
    color: '#4B4745',
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
    minHeight: 14,
  },
});
