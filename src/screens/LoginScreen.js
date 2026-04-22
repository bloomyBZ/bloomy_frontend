import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import InputField from '../components/InputField';
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

export default function LoginScreen({ onLogin, onForgot, onSignUp }) {
  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.brandMark}>
        <View style={styles.brandLeaf} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue tracking your habits.
        </Text>
      </View>

      <View style={styles.form}>
        <InputField
          label="Mobile number"
          prefix="+90"
          defaultValue="514-234-57-56"
          keyboardType="phone-pad"
        />

        <InputField
          label="Password"
          defaultValue="password123"
          secure
          right="eye"
        />
      </View>

      <Pressable onPress={onForgot} style={styles.forgotLink}>
        <Text style={styles.forgotText}>forgot password?</Text>
      </Pressable>

      <PrimaryButton title="Login" onPress={onLogin} style={styles.loginButton} />

      <View style={styles.signupRow}>
        <Text style={styles.muted}>Don't have an account? </Text>
        <Pressable onPress={onSignUp}>
          <Text style={styles.link}>Sign Up</Text>
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
    paddingTop: 54,
    paddingBottom: 2,
  },
  brandMark: {
    width: 54,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenDark,
    marginBottom: 24,
  },
  brandLeaf: {
    width: 19,
    height: 28,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: '#A9E5B5',
    transform: [{ rotate: '38deg' }],
  },
  hero: {
    marginBottom: 34,
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  form: {
    gap: 18,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
  },
  forgotText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '800',
  },
  loginButton: {
    marginTop: 0,
  },
  signupRow: {
    marginTop: 34,
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
    marginVertical: 18,
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
    gap: 16,
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
    minHeight: 34,
  },
});
