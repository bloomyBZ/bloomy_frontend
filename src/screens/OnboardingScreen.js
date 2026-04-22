import { Image, StyleSheet, Text, View } from 'react-native';
import { IconDot, PrimaryButton, SecondaryButton } from '../components/Button';
import Screen, { HomeIndicator } from '../components/Screen';
import { colors } from '../theme';

const bloomFlower = require('../../assets/bloomy-docs/bloomy-wbg/stage7nobg.png');
const bloomTree = require('../../assets/bloomy-docs/bloomy-wbg/stage8nobg.png');
const bloomSprout = require('../../assets/bloomy-docs/bloomy-wbg/stage2.png');
const bloomPlant = require('../../assets/bloomy-docs/bloomy-wbg/stage4nobg.png');

const pageOrder = ['intro', 'habits', 'ready', 'clarity'];

const tourPages = {
  intro: {
    eyebrow: 'Habit growth, visualized',
    title: 'Welcome to Bloomy',
    body: 'Build your habits, unlock your potential, and watch your progress take shape.',
    image: bloomFlower,
  },
  habits: {
    eyebrow: 'Start small',
    title: 'Create your first habit',
    body: 'Start building better habits by adding your first one.',
    image: bloomSprout,
  },
  ready: {
    eyebrow: 'Stay consistent',
    title: 'Your habits are ready',
    body: 'Start completing them and build your streak.',
    image: bloomTree,
  },
  clarity: {
    eyebrow: 'Grow with intention',
    title: 'From Chaos to Clarity',
    body: 'Build better habits and become the calm, focused version of yourself.',
    image: bloomPlant,
  },
};

export default function OnboardingScreen({
  page = 'intro',
  onNext,
  onSkip,
  onGetStarted,
}) {
  const data = tourPages[page] ?? tourPages.intro;
  const activeIndex = pageOrder.indexOf(page);
  const isIntro = page === 'intro';
  const isLast = page === 'clarity';

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <View style={styles.brandLeaf} />
        </View>
        <Text style={styles.brandText}>Bloomy</Text>
      </View>

      <View style={styles.imagePanel}>
        <Image source={data.image} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{data.eyebrow}</Text>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.body}>{data.body}</Text>
      </View>

      <View style={styles.dots}>
        {pageOrder.map((item, index) => (
          <IconDot key={item} active={index === activeIndex} />
        ))}
      </View>

      <View style={styles.buttonStack}>
        <PrimaryButton
          title={isLast ? 'Get Started' : isIntro ? 'Start the tour' : 'Next'}
          onPress={isLast ? onGetStarted : onNext}
        />
        {isIntro ? (
          <SecondaryButton title="Skip and Sign Up" onPress={onSkip} />
        ) : null}
      </View>
      <HomeIndicator />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 24,
    paddingBottom: 2,
  },
  brandRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenDark,
    marginRight: 10,
  },
  brandLeaf: {
    width: 12,
    height: 18,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#A9E5B5',
    transform: [{ rotate: '38deg' }],
  },
  brandText: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
  },
  imagePanel: {
    flex: 1,
    minHeight: 270,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    maxWidth: 300,
    height: 300,
  },
  copy: {
    paddingBottom: 18,
  },
  eyebrow: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 10,
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 12,
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
    maxWidth: 330,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
  },
  buttonStack: {
    gap: 12,
  },
});
