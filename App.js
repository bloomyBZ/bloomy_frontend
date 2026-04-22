import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import EvolutionModal from './src/components/EvolutionModal';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HabitsScreen from './src/screens/HabitsScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import { getEarnedXp, getLevelProgress, initialHabits } from './src/data/habits';
import { colors } from './src/theme';

const screens = {
  onboardingIntro: 'onboardingIntro',
  onboardingHabits: 'onboardingHabits',
  onboardingReady: 'onboardingReady',
  onboardingClarity: 'onboardingClarity',
  login: 'login',
  forgot: 'forgot',
  verify: 'verify',
  register: 'register',
  home: 'home',
  habits: 'habits',
  profile: 'profile',
};

export default function App() {
  const [screen, setScreen] = useState(screens.onboardingIntro);
  const [habits, setHabits] = useState(initialHabits);
  const [evolution, setEvolution] = useState(null);
  const earnedXp = getEarnedXp(habits);
  const levelProgress = useMemo(() => getLevelProgress(earnedXp), [earnedXp]);
  const previousLevelRef = useRef(levelProgress.level);

  useEffect(() => {
    const previousLevel = previousLevelRef.current;

    if (levelProgress.level > previousLevel) {
      setEvolution({
        level: levelProgress.level,
        xp: earnedXp,
      });
    }

    previousLevelRef.current = levelProgress.level;
  }, [earnedXp, levelProgress.level]);

  const goLogin = () => setScreen(screens.login);
  const goHome = () => setScreen(screens.home);
  const goTab = (tab) => setScreen(screens[tab] ?? screens.home);
  const toggleHabit = (id) => {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === id ? { ...habit, checked: !habit.checked } : habit
      )
    );
  };
  const setHabitChecked = (id, checked) => {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === id ? { ...habit, checked } : habit
      )
    );
  };

  let currentScreen = null;

  if (screen === screens.onboardingIntro) {
    currentScreen = (
      <OnboardingScreen
        page="intro"
        onNext={() => setScreen(screens.onboardingHabits)}
        onSkip={() => setScreen(screens.register)}
      />
    );
  }

  if (screen === screens.onboardingHabits) {
    currentScreen = (
      <OnboardingScreen
        page="habits"
        onNext={() => setScreen(screens.onboardingReady)}
      />
    );
  }

  if (screen === screens.onboardingReady) {
    currentScreen = (
      <OnboardingScreen
        page="ready"
        onNext={() => setScreen(screens.onboardingClarity)}
      />
    );
  }

  if (screen === screens.onboardingClarity) {
    currentScreen = (
      <OnboardingScreen page="clarity" onGetStarted={goLogin} />
    );
  }

  if (screen === screens.login) {
    currentScreen = (
      <LoginScreen
        onLogin={goHome}
        onForgot={() => setScreen(screens.forgot)}
        onSignUp={() => setScreen(screens.register)}
      />
    );
  }

  if (screen === screens.forgot) {
    currentScreen = (
      <ForgotPasswordScreen
        onBack={goLogin}
        onVerify={() => setScreen(screens.verify)}
      />
    );
  }

  if (screen === screens.verify) {
    currentScreen = (
      <VerifyScreen onBack={() => setScreen(screens.forgot)} onVerify={goLogin} />
    );
  }

  if (screen === screens.register) {
    currentScreen = (
      <RegisterScreen
        onBack={goLogin}
        onRegister={goHome}
        onSignIn={goLogin}
      />
    );
  }

  if (screen === screens.home) {
    currentScreen = <HomeScreen onTabPress={goTab} />;
  }

  if (screen === screens.habits) {
    currentScreen = (
      <HabitsScreen
        habits={habits}
        onToggleHabit={toggleHabit}
        onSetHabitChecked={setHabitChecked}
        onTabPress={goTab}
      />
    );
  }

  if (screen === screens.profile) {
    currentScreen = <ProfileScreen habits={habits} onTabPress={goTab} />;
  }

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      {currentScreen}
      <EvolutionModal
        visible={Boolean(evolution)}
        level={evolution?.level ?? levelProgress.level}
        xp={evolution?.xp ?? earnedXp}
        onClose={() => setEvolution(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
