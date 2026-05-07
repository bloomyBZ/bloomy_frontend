import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  Platform,
  Pressable,
  StatusBar as NativeStatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  completeHabit,
  createHabit,
  deleteHabit,
  getHabitRecommendations,
  getHabitStreak,
  getPlant,
  getUserHabits,
  getUserNotifications,
  getUserProfile,
  getUserStats,
  logoutUser,
  registerUser,
  undoDeleteHabit,
  uncompleteHabit,
  updateHabit,
  updateUserNotifications,
  updateUserProfile,
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
import NotificationsScreen from './src/screens/NotificationsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import {
  getDateKey,
  getLevelProgress,
  WATER_GOAL,
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
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [notificationsBusy, setNotificationsBusy] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState('');
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotNotice, setForgotNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [deletedHabitId, setDeletedHabitId] = useState(null);
  const [evolution, setEvolution] = useState(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const [todayKey, setTodayKey] = useState(() => getDateKey(new Date()));
  const { width: windowWidth } = useWindowDimensions();
  const habitHistory = useMemo(() => ({ [todayKey]: habits }), [habits, todayKey]);
  const totalXp = stats?.total_points ?? 0;
  const levelProgress = useMemo(() => getLevelProgress(totalXp), [totalXp]);
  const previousLevelRef = useRef(levelProgress.level);
  const previousTodayKeyRef = useRef(todayKey);
  const notificationOverlayOpacity = useRef(new Animated.Value(0)).current;
  const notificationPanelTranslateX = useRef(new Animated.Value(420)).current;
  const notificationPanelWidth = Math.min(392, Math.max(windowWidth - 18, 300));
  const notificationPanelTopInset =
    Platform.OS === 'ios' ? 48 : (NativeStatusBar.currentHeight || 0) + 10;
  const notificationPanelBottomInset = Platform.OS === 'ios' ? 12 : 8;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextTodayKey = getDateKey(new Date());
      setTodayKey((current) => (current === nextTodayKey ? current : nextTodayKey));
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

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
    setActionNotice('');
    setDeletedHabitId(null);
    setRecommendationsError('');
    setAvatarBusy(false);
    setNotificationsBusy(false);
    setNotificationsVisible(false);
    notificationOverlayOpacity.setValue(0);
    notificationPanelTranslateX.setValue(notificationPanelWidth + 32);
  };

  useEffect(() => {
    if (!notificationsVisible) {
      notificationOverlayOpacity.setValue(0);
      notificationPanelTranslateX.setValue(notificationPanelWidth + 32);
    }
  }, [
    notificationOverlayOpacity,
    notificationPanelTranslateX,
    notificationPanelWidth,
    notificationsVisible,
  ]);

  const fetchRecommendationCards = async (session) => {
    try {
      const response = await getHabitRecommendations({
        idToken: session.idToken,
        uid: session.uid,
        limit: 8,
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
      const [nextProfile, nextNotifications, nextStats, nextPlant, nextHabits, nextRecommendations] =
        await Promise.all([
          getUserProfile({
            idToken: session.idToken,
            uid: session.uid,
          }),
          getUserNotifications({
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

      setProfile({
        ...nextProfile,
        ...nextNotifications,
      });
      setStats(nextStats);
      setPlant(nextPlant);
      setHabits(nextHabits);
      setRecommendations(nextRecommendations);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  useEffect(() => {
    if (previousTodayKeyRef.current === todayKey) {
      return;
    }

    previousTodayKeyRef.current = todayKey;
    setCompletionState({});
    setActionNotice('');

    if (authSession) {
      refreshSessionData(authSession, {}).catch(() => {
        // Keep the last successful state visible if the background refresh fails.
      });
    }
  }, [todayKey, authSession]);

  const goLogin = () => {
    setAuthError('');
    setForgotError('');
    setForgotNotice('');
    setScreen(screens.login);
  };

  const goTab = (tab) => setScreen(screens[tab] ?? screens.home);

  const openNotifications = () => {
    if (notificationsVisible) {
      return;
    }

    notificationOverlayOpacity.setValue(0);
    notificationPanelTranslateX.setValue(notificationPanelWidth + 32);
    setNotificationsVisible(true);

    Animated.parallel([
      Animated.timing(notificationOverlayOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(notificationPanelTranslateX, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeNotifications = () => {
    if (!notificationsVisible) {
      return;
    }

    Animated.parallel([
      Animated.timing(notificationOverlayOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(notificationPanelTranslateX, {
        toValue: notificationPanelWidth + 32,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setNotificationsVisible(false);
      }
    });
  };

  useEffect(() => {
    if (!notificationsVisible) {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      closeNotifications();
      return true;
    });

    return () => subscription.remove();
  }, [notificationsVisible]);

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

      setLoginForm({
        email,
        password: '',
      });
      setRegisterForm(createRegisterForm());
      setAuthNotice('Registration complete. You can continue by signing in.');
      setScreen(screens.login);
    } catch (error) {
      setAuthError(error.message);
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
    setActionNotice('');

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
    setActionNotice('');

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
      const [nextHabits, nextRecommendations, nextStats, nextPlant] = await Promise.all([
        fetchHabitsWithStreaks(authSession, {}),
        fetchRecommendationCards(authSession),
        getUserStats({
          idToken: authSession.idToken,
          uid: authSession.uid,
        }),
        getPlant({
          idToken: authSession.idToken,
          uid: authSession.uid,
        }),
      ]);

      setHabits(nextHabits);
      setRecommendations(nextRecommendations);
      setStats(nextStats);
      setPlant(nextPlant);
      setDeletedHabitId(habitId);
      setActionNotice('Habit deleted. You can undo this if you change your mind.');
    } catch (error) {
      setActionError(error.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleCompleteHabit = async (habitId, payload = {}) => {
    if (!authSession || actionBusy) {
      return false;
    }

    setActionBusy(true);
    setActionError('');
    setActionNotice('');

    try {
      const completion = await completeHabit({
        idToken: authSession.idToken,
        habitId,
        payload: {
          notes: 'Completed from Bloomy mobile app',
          ...payload,
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
                cups:
                  typeof payload.water_intake === 'number' ? payload.water_intake : habit.cups,
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

  const handleUncompleteHabit = async (habitId) => {
    if (!authSession || actionBusy) {
      return false;
    }

    setActionBusy(true);
    setActionError('');
    setActionNotice('');

    try {
      const uncompletion = await uncompleteHabit({
        idToken: authSession.idToken,
        habitId,
      });
      const [nextStats, nextPlant, nextHabits] = await Promise.all([
        getUserStats({
          idToken: authSession.idToken,
          uid: authSession.uid,
        }),
        getPlant({
          idToken: authSession.idToken,
          uid: authSession.uid,
        }),
        fetchHabitsWithStreaks(authSession, {}),
      ]);

      setCompletionState((current) => {
        const next = { ...current };
        delete next[habitId];
        return next;
      });
      setStats(nextStats);
      setPlant(nextPlant);
      setHabits(nextHabits);
      if (uncompletion?.points_removed) {
        setActionNotice(`Habit marked as undone. ${uncompletion.points_removed} XP was removed.`);
      }
      return true;
    } catch (error) {
      setActionError(error.message);
      return false;
    } finally {
      setActionBusy(false);
    }
  };

  const handleUpdateHabit = async (habitId, payload) => {
    if (!authSession || actionBusy) {
      return false;
    }

    setActionBusy(true);
    setActionError('');
    setActionNotice('');

    try {
      const updatedHabit = await updateHabit({
        idToken: authSession.idToken,
        habitId,
        payload,
      });

      const isWaterOnlyUpdate =
        Object.keys(payload || {}).length === 1 && typeof payload.water_intake === 'number';

      if (isWaterOnlyUpdate) {
        setHabits((current) =>
          current.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  cups:
                    typeof updatedHabit?.water_intake === 'number'
                      ? updatedHabit.water_intake
                      : payload.water_intake,
                  checked:
                    typeof updatedHabit?.water_intake === 'number'
                      ? updatedHabit.water_intake >= WATER_GOAL
                      : habit.checked,
                }
              : habit
          )
        );
      } else {
        const nextHabits = await fetchHabitsWithStreaks(authSession, completionState);
        setHabits(nextHabits);
      }

      return true;
    } catch (error) {
      setActionError(error.message);
      return false;
    } finally {
      setActionBusy(false);
    }
  };

  const handleRefreshRecommendations = async () => {
    if (!authSession || recommendationsLoading) {
      return;
    }

    setRecommendationsLoading(true);

    try {
      const nextRecommendations = await fetchRecommendationCards(authSession);
      setRecommendations(nextRecommendations);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const handleSelectAvatar = async (avatarId) => {
    if (!authSession || avatarBusy || profile?.avatar_id === avatarId) {
      return;
    }

    setAvatarBusy(true);
    setActionError('');
    setActionNotice('');

    try {
      const nextProfile = await updateUserProfile({
        idToken: authSession.idToken,
        uid: authSession.uid,
        payload: {
          avatar_id: avatarId,
        },
      });

      setProfile(nextProfile);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleUpdateNotifications = async (payload) => {
    if (!authSession || notificationsBusy) {
      return false;
    }

    setNotificationsBusy(true);
    setActionError('');

    try {
      const updatedNotifications = await updateUserNotifications({
        idToken: authSession.idToken,
        uid: authSession.uid,
        payload,
      });

      setProfile((current) =>
        current
          ? {
              ...current,
              ...updatedNotifications,
            }
          : updatedNotifications
      );

      return true;
    } catch (error) {
      setActionError(error.message);
      return false;
    } finally {
      setNotificationsBusy(false);
    }
  };

  const handleUndoDeleteHabit = async (habitId) => {
    if (!authSession || actionBusy || !habitId) {
      return;
    }

    setActionBusy(true);
    setActionError('');

    try {
      await undoDeleteHabit({
        idToken: authSession.idToken,
        habitId,
      });

      const [nextHabits, nextRecommendations] = await Promise.all([
        fetchHabitsWithStreaks(authSession, completionState),
        fetchRecommendationCards(authSession),
      ]);

      setHabits(nextHabits);
      setRecommendations(nextRecommendations);
      setDeletedHabitId(null);
      setActionNotice('Habit restored successfully.');
    } catch (error) {
      setActionError(error.message);
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
        noticeMessage={authNotice}
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
        onNotificationPress={openNotifications}
        onRefreshRecommendations={handleRefreshRecommendations}
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
        actionNotice={actionNotice}
        deletedHabitId={deletedHabitId}
        habitHistory={habitHistory}
        onAddHabit={handleAddHabit}
        onCompleteHabit={handleCompleteHabit}
        onDeleteHabit={handleDeleteHabit}
        onNotificationPress={openNotifications}
        onTabPress={goTab}
        onUncompleteHabit={handleUncompleteHabit}
        onUndoDeleteHabit={handleUndoDeleteHabit}
        onUpdateHabit={handleUpdateHabit}
        profile={profile}
        todayKey={todayKey}
      />
    );
  }

  if (screen === screens.profile) {
    currentScreen = (
      <ProfileScreen
        actionError={actionError}
        avatarSaving={avatarBusy}
        habits={habits}
        logoutBusy={logoutBusy}
        onLogout={handleLogout}
        onNotificationPress={openNotifications}
        onUpdateNotifications={handleUpdateNotifications}
        onSelectAvatar={handleSelectAvatar}
        onTabPress={goTab}
        notificationsSaving={notificationsBusy}
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
      {notificationsVisible ? (
        <View pointerEvents="box-none" style={styles.notificationsOverlay}>
          <Animated.View
            pointerEvents="box-none"
            style={[styles.notificationsBackdrop, { opacity: notificationOverlayOpacity }]}
          >
            <Pressable style={styles.backdropTouchArea} onPress={closeNotifications} />
          </Animated.View>
          <Animated.View
            style={[
              styles.notificationsPanelWrap,
              {
                paddingTop: notificationPanelTopInset,
                paddingBottom: notificationPanelBottomInset,
                width: notificationPanelWidth,
                transform: [{ translateX: notificationPanelTranslateX }],
              },
            ]}
          >
            <NotificationsScreen
              actionError={actionError}
              habits={habits}
              notificationsSaving={notificationsBusy}
              onClose={closeNotifications}
              onUpdateNotifications={handleUpdateNotifications}
              profile={profile}
            />
          </Animated.View>
        </View>
      ) : null}
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
  notificationsOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  notificationsBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 24, 39, 0.22)',
  },
  backdropTouchArea: {
    flex: 1,
  },
  notificationsPanelWrap: {
    height: '100%',
    paddingVertical: 10,
    paddingLeft: 12,
  },
});
