import { Pressable, StyleSheet, Text, View } from 'react-native';
import AuthHeader from '../components/AuthHeader';
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

export default function RegisterScreen({ onBack, onRegister, onSignIn }) {
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
          label="Mobile number"
          prefix="+91"
          defaultValue="1712345678"
          keyboardType="phone-pad"
        />
        <InputField
          label="Email"
          defaultValue="abc12@gmail.com"
          keyboardType="email-address"
          right={null}
        />
        <InputField
          label="Password"
          defaultValue="password123"
          secure
          right="eye"
        />
        <InputField
          label="Confirm password"
          defaultValue="password123"
          secure
          right="eye"
        />
      </View>

      <PrimaryButton title="Sign Up" onPress={onRegister} style={styles.button} />

      <View style={styles.signinRow}>
        <Text style={styles.muted}>Don't have an account? </Text>
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
