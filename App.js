import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  completeHabit,
  createHabit,
  deleteHabit,
  getHabitRecommendations,
  getHabitStreak,
  getPlant,
  getUserHabits,
  getUserProfile,
  getUserStats,
  logoutUser,
  registerUser,
} from './src/api/bloomyApi';
import {
  buildHabitCreatePayload,
  mapBackendHabitToUi,
  mapRecommendationToCard,
} from './src/api/mappers';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from './src/api/firebaseIdentity';
import EvolutionModal from './src/components/EvolutionModal';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HabitsScreen from './src/screens/HabitsScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import {
  getDateKey,
  getLevelProgress,
} from './src/data/habits';
import { colors } from './src/theme';

const screens = {
  onboardingIntro: 'onboardingIntro',
  onboardingHabits: 'onboardingHabits',
  onboardingReady: 'onboardingReady',
  onboardingClarity: 'onboardingClarity',
  login: 'login',
  forgot: 'forgot',
  register: 'register',
  home: 'home',
  habits: 'habits',
  profile: 'profile',
};

function createLoginForm() {
  return {
    email: '',
    password: '',
  };
}

function createRegisterForm() {
  return {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function toSession(identityResponse) {
  return {
    idToken: identityResponse.idToken,
    refreshToken: identityResponse.refreshToken,
    uid: identityResponse.localId,
    email: identityResponse.email,
  };
}

export default function App() {
  const [screen, setScreen] = useState(screens.onboardingIntro);
  const [authSession, setAuthSession] = useState(null);
  const [loginForm, setLoginForm] = useState(createLoginForm);
  const [registerForm, setRegisterForm] = useState(createRegisterForm);
  const [forgotEmail, setForgotEmail] = useState('');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [plant, setPlant] = useState(null);
  const [habits, setHabits] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [completionState, setCompletionState] = useState({});
  const [authBusy, setAuthBusy] = useState(false);
  const [forgotBusy, setForgotBusy] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState('');
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotNotice, setForgotNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [evolution, setEvolution] = useState(null);

  const todayKey = useMemo(() => getDateKey(new Date()), []);
  const habitHistory = useMemo(() => ({ [todayKey]: habits }), [habits, todayKey]);
  const totalXp = stats?.total_points ?? 0;
  const levelProgress = useMemo(() => getLevelProgress(totalXp), [totalXp]);
  const previousLevelRef = useRef(levelProgress.level);

  useEffect(() => {
    const previousLevel = previousLevelRef.current;

    if (levelProgress.level > previousLevel) {
      setEvolution({
        level: levelProgress.level,
        xp: totalXp,
      });
    }

    previousLevelRef.current = levelProgress.level;
  }, [levelProgress.level, totalXp]);

  const clearUserData = () => {
    setAuthSession(null);
    setProfile(null);
    setStats(null);
    setPlant(null);
    setHabits([]);
    setRecommendations([]);
    setCompletionState({});
    setActionError('');
    setRecommendationsError('');
  };

  const fetchRecommendationCards = async (session) => {
    try {
      const response = await getHabitRecommendations({
        idToken: session.idToken,
        uid: session.uid,
        limit: 4,
      });

      setRecommendationsError('');
      return (response?.recommendations || []).map((recommendation, index) =>
        mapRecommendationToCard(recommendation, index)
      );
    } catch (error) {
      setRecommendationsError(error.message || 'AI suggestions could not be loaded.');
      return [];
    }
  };

  const fetchHabitsWithStreaks = async (session, nextCompletionState = completionState) => {
    const response = await getUserHabits({
      idToken: session.idToken,
      uid: session.uid,
    });
    const backendHabits = response?.habits || [];
    const streakResults = await Promise.allSettled(
      backendHabits.map((habit) =>
        getHabitStreak({
          idToken: session.idToken,
          habitId: habit.habit_id,
          uid: session.uid,
        })
      )
    );

    return backendHabits.map((habit, index) => {
      const completion = nextCompletionState[habit.habit_id];
      const streak = streakResults[index]?.status === 'fulfilled'
        ? streakResults[index].value?.current_streak
        : undefined;

      return mapBackendHabitToUi(habit, {
        checked: completion?.checked,
        streak,
        pointsEarned: completion?.pointsEarned,
      });
    });
  };

  const refreshSessionData = async (session, nextCompletionState = completionState) => {
    setRecommendationsLoading(true);

    try {
      const [nextProfile, nextStats, nextPlant, nextHabits, nextRecommendations] =
        await Promise.all([
          getUserProfile({
            idToken: session.idToken,
            uid: session.uid,
          }),
          getUserStats({
            idToken: session.idToken,
            uid: session.uid,
          }),
          getPlant({
            idToken: session.idToken,
            uid: session.uid,
          }),
          fetchHabitsWithStreaks(session, nextCompletionState),
          fetchRecommendationCards(session),
        ]);

      setProfile(nextProfile);
      setStats(nextStats);
      setPlant(nextPlant);
      setHabits(nextHabits);
      setRecommendations(nextRecommendations);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const goLogin = () => {
    setAuthError('');
    setForgotError('');
    setForgotNotice('');
    setScreen(screens.login);
  };

  const goTab = (tab) => setScreen(screens[tab] ?? screens.home);

  const handleLogin = async () => {
    const email = normalizeEmail(loginForm.email);
    const password = loginForm.password;

    if (!email || !password) {
      setAuthError('Email and password are required.');
      return;
    }

    setAuthBusy(true);
    setAuthError('');
    setAuthNotice('');

    try {
      const identity = await signInWithEmailAndPassword(email, password);
      const session = toSession(identity);

      setAuthSession(session);
      await refreshSessionData(session, {});
      setCompletionState({});
      setScreen(screens.home);
    } catch (error) {
      setAuthError(error.message);
      clearUserData();
    } finally {
      setAuthBusy(false);
    }
  };

  const handleRegister = async () => {
    const displayName = registerForm.displayName.trim();
    const email = normalizeEmail(registerForm.email);
    const password = registerForm.password;
    const confirmPassword = registerForm.confirmPassword;

    if (!displayName || !email || !password || !confirmPassword) {
      setAuthError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setAuthBusy(true);
    setAuthError('');
    setAuthNotice('');

    try {
      await registerUser({
        email,
        password,
        display_name: displayName,
      });

      const identity = await signInWithEmailAndPassword(email, password);
      const session = toSession(identity);

      setAuthSession(session);
      setLoginForm({
        email,
        password,
      });
      await refreshSessionData(session, {});
      setCompletionState({});
      setRegisterForm(createRegisterForm());
      setScreen(screens.home);
    } catch (error) {
      setAuthError(error.message);
      if (error.message.includes('Firebase Web API key')) {
        setAuthNotice(
          'The backend account may have been created, but frontend sign-in still needs a valid Firebase Web API key.'
        );
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = normalizeEmail(forgotEmail);

    if (!email) {
      setForgotError('Please enter your email address.');
      return;
    }

    setForgotBusy(true);
    setForgotError('');
    setForgotNotice('');

    try {
      await sendPasswordResetEmail(email);
      setForgotEmail('');
      setAuthNotice('Password reset email sent. Check your inbox.');
      setScreen(screens.login);
    } catch (error) {
      setForgotError(error.message);
    } finally {
      setForgotBusy(false);
    }
  };

  const handleLogout = async () => {
    setLogoutBusy(true);

    try {
      await logoutUser();
    } catch {
      // Logout is client-driven; backend failure should not block sign-out.
    } finally {
      clearUserData();
      setLoginForm(createLoginForm());
      setRegisterForm(createRegisterForm());
      setForgotEmail('');
      setAuthNotice('Signed out successfully.');
      setLogoutBusy(false);
      setScreen(screens.login);
    }
  };

  const handleAddHabit = async (_, source) => {
    if (!authSession || actionBusy) {
      return;
    }

    const payload = buildHabitCreatePayload(source);
    if (!payload.name) {
      setActionError('Habit name is required.');
      return;
    }

    setActionBusy(true);
    setActionError('');

    try {
      await createHabit({
        idToken: authSession.idToken,
        payload,
      });

      const [nextHabits, nextRecommendations] = await Promise.all([
        fetchHabitsWithStreaks(authSession, completionState),
        fetchRecommendationCards(authSession),
      ]);

      setHabits(nextHabits);
      setRecommendations(nextRecommendations);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleDeleteHabit = async (_, habitId) => {
    if (!authSession || actionBusy) {
      return;
    }

    setActionBusy(true);
    setActionError('');

    try {
      await deleteHabit({
        idToken: authSession.idToken,
        habitId,
      });

      setCompletionState((current) => {
        const nextState = { ...current };
        delete nextState[habitId];
        return nextState;
      });
      setHabits((current) => current.filter((habit) => habit.id !== habitId));
      setRecommendations(await fetchRecommendationCards(authSession));
    } catch (error) {
      setActionError(error.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    if (!authSession || actionBusy) {
      return false;
    }

    setActionBusy(true);
    setActionError('');

    try {
      const completion = await completeHabit({
        idToken: authSession.idToken,
        habitId,
        payload: {
          notes: 'Completed from Bloomy mobile app',
        },
      });
      const [nextStats, nextPlant, nextStreak] = await Promise.all([
        getUserStats({
          idToken: authSession.idToken,
          uid: authSession.uid,
        }),
        getPlant({
          idToken: authSession.idToken,
          uid: authSession.uid,
        }),
        getHabitStreak({
          idToken: authSession.idToken,
          habitId,
          uid: authSession.uid,
        }).catch(() => null),
      ]);

      const nextHabitStreak =
        nextStreak?.current_streak ?? completion.current_streak ?? 1;
      const pointsEarned = completion.points_earned ?? 10;

      setCompletionState((current) => ({
        ...current,
        [habitId]: {
          checked: true,
          pointsEarned,
          streak: nextHabitStreak,
        },
      }));
      setHabits((current) =>
        current.map((habit) =>
          habit.id === habitId
            ? {
                ...habit,
                checked: true,
                streak: nextHabitStreak,
                progress: 100,
                xp: pointsEarned,
              }
            : habit
        )
      );
      setStats(nextStats);
      setPlant(nextPlant);

      return true;
    } catch (error) {
      setActionError(error.message);
      return false;
    } finally {
      setActionBusy(false);
    }
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
    currentScreen = <OnboardingScreen page="clarity" onGetStarted={goLogin} />;
  }

  if (screen === screens.login) {
    currentScreen = (
      <LoginScreen
        email={loginForm.email}
        errorMessage={authError}
        isSubmitting={authBusy}
        noticeMessage={authNotice}
        onChangeEmail={(email) =>
          setLoginForm((current) => ({ ...current, email }))
        }
        onChangePassword={(password) =>
          setLoginForm((current) => ({ ...current, password }))
        }
        onForgot={() => {
          setAuthError('');
          setAuthNotice('');
          setScreen(screens.forgot);
        }}
        onLogin={handleLogin}
        onSignUp={() => {
          setAuthError('');
          setAuthNotice('');
          setScreen(screens.register);
        }}
        password={loginForm.password}
      />
    );
  }

  if (screen === screens.forgot) {
    currentScreen = (
      <ForgotPasswordScreen
        email={forgotEmail}
        errorMessage={forgotError}
        isSubmitting={forgotBusy}
        noticeMessage={forgotNotice}
        onBack={goLogin}
        onChangeEmail={setForgotEmail}
        onVerify={handleForgotPassword}
      />
    );
  }

  if (screen === screens.register) {
    currentScreen = (
      <RegisterScreen
        confirmPassword={registerForm.confirmPassword}
        displayName={registerForm.displayName}
        email={registerForm.email}
        errorMessage={authError}
        isSubmitting={authBusy}
        onBack={goLogin}
        onChangeConfirmPassword={(confirmPassword) =>
          setRegisterForm((current) => ({ ...current, confirmPassword }))
        }
        onChangeDisplayName={(displayName) =>
          setRegisterForm((current) => ({ ...current, displayName }))
        }
        onChangeEmail={(email) =>
          setRegisterForm((current) => ({ ...current, email }))
        }
        onChangePassword={(password) =>
          setRegisterForm((current) => ({ ...current, password }))
        }
        onRegister={handleRegister}
        onSignIn={goLogin}
        password={registerForm.password}
      />
    );
  }

  if (screen === screens.home) {
    currentScreen = (
      <HomeScreen
        actionError={actionError}
        habitHistory={habitHistory}
        habits={habits}
        onAddHabit={handleAddHabit}
        onTabPress={goTab}
        plant={plant}
        profile={profile}
        recommendations={recommendations}
        recommendationsError={recommendationsError}
        recommendationsLoading={recommendationsLoading}
        stats={stats}
        todayKey={todayKey}
      />
    );
  }

  if (screen === screens.habits) {
    currentScreen = (
      <HabitsScreen
        actionBusy={actionBusy}
        actionError={actionError}
        habitHistory={habitHistory}
        onAddHabit={handleAddHabit}
        onCompleteHabit={handleCompleteHabit}
        onDeleteHabit={handleDeleteHabit}
        onTabPress={goTab}
        todayKey={todayKey}
      />
    );
  }

  if (screen === screens.profile) {
    currentScreen = (
      <ProfileScreen
        habits={habits}
        logoutBusy={logoutBusy}
        onLogout={handleLogout}
        onTabPress={goTab}
        plant={plant}
        profile={profile}
        stats={stats}
      />
    );
  }

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      {currentScreen}
      <EvolutionModal
        visible={Boolean(evolution)}
        level={evolution?.level ?? levelProgress.level}
        xp={evolution?.xp ?? totalXp}
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
