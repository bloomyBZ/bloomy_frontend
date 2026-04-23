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
import {
  cloneHabits,
  createCustomHabit,
  createInitialHabitHistory,
  getDateKey,
  getEarnedXp,
  getLevelProgress,
  initialHabits,
} from './src/data/habits';
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
  const todayKey = useMemo(() => getDateKey(new Date()), []);
  const [habitHistory, setHabitHistory] = useState(() =>
    createInitialHabitHistory(initialHabits)
  );
  const [evolution, setEvolution] = useState(null);
  const todayHabits = habitHistory[todayKey] ?? cloneHabits(initialHabits);
  const earnedXp = getEarnedXp(todayHabits);
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
  const setHabitValues = (dateKey, id, updates) => {
    setHabitHistory((current) => {
      const dayHabits = current[dateKey] ?? cloneHabits(initialHabits);

      return {
        ...current,
        [dateKey]: dayHabits.map((habit) =>
          habit.id === id ? { ...habit, ...updates } : habit
        ),
      };
    });
  };
  const addHabit = (startDateKey, draft) => {
    const newHabit = createCustomHabit(draft);

    setHabitHistory((current) =>
      Object.keys(current)
        .sort((first, second) => first.localeCompare(second))
        .reduce((next, dateKey) => {
          const dayHabits = current[dateKey] ?? cloneHabits(initialHabits);

          next[dateKey] =
            dateKey >= startDateKey ? [...dayHabits, { ...newHabit }] : dayHabits;

          return next;
        }, {})
    );
  };
  const deleteHabit = (startDateKey, id) => {
    setHabitHistory((current) =>
      Object.keys(current)
        .sort((first, second) => first.localeCompare(second))
        .reduce((next, dateKey) => {
          const dayHabits = current[dateKey] ?? cloneHabits(initialHabits);

          next[dateKey] =
            dateKey >= startDateKey
              ? dayHabits.filter((habit) => habit.id !== id)
              : dayHabits;

          return next;
        }, {})
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
    currentScreen = (
      <HomeScreen
        habitHistory={habitHistory}
        habits={todayHabits}
        onAddHabit={addHabit}
        onTabPress={goTab}
        todayKey={todayKey}
      />
    );
  }

  if (screen === screens.habits) {
    currentScreen = (
      <HabitsScreen
        habitHistory={habitHistory}
        todayKey={todayKey}
        onAddHabit={addHabit}
        onDeleteHabit={deleteHabit}
        onSetHabitValues={setHabitValues}
        onTabPress={goTab}
      />
    );
  }

  if (screen === screens.profile) {
    currentScreen = <ProfileScreen habits={todayHabits} onTabPress={goTab} />;
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
