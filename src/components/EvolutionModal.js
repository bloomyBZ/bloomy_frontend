import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PrimaryButton } from './Button';
import { colors, radii } from '../theme';

const stageImages = [
  require('../../assets/bloomy-docs/bloomy-wbg/stage1.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage2.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage4nobg.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage7nobg.png'),
  require('../../assets/bloomy-docs/bloomy-wbg/stage8nobg.png'),
];

export default function EvolutionModal({ visible, level, xp, onClose }) {
  const fade = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.88)).current;
  const imageScale = useRef(new Animated.Value(0.72)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    fade.setValue(0);
    cardScale.setValue(0.88);
    imageScale.setValue(0.72);
    float.setValue(0);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(120),
        Animated.spring(imageScale, {
          toValue: 1,
          friction: 5,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 950,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [cardScale, fade, float, imageScale, visible]);

  const stageImage = stageImages[Math.min(stageImages.length - 1, level - 1)];
  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -9],
  });
  const sparkleScale = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.15],
  });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity: fade }]}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View style={[styles.card, { transform: [{ scale: cardScale }] }]}>
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkleOne,
              { transform: [{ scale: sparkleScale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkleTwo,
              { transform: [{ scale: sparkleScale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkleThree,
              { transform: [{ scale: sparkleScale }] },
            ]}
          />

          <Text style={styles.eyebrow}>Evolution unlocked</Text>

          <Animated.View
            style={[
              styles.imageHalo,
              { transform: [{ translateY }, { scale: imageScale }] },
            ]}
          >
            <Image source={stageImage} style={styles.image} resizeMode="contain" />
          </Animated.View>

          <Text style={styles.title}>Bloomy reached Level {level}</Text>
          <Text style={styles.body}>
            You earned {xp} XP. Your consistency just helped Bloomy grow into a new
            stage.
          </Text>

          <PrimaryButton title="Keep growing" onPress={onClose} style={styles.button} />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(9, 18, 15, 0.62)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 370,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  sparkle: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#F2C94C',
  },
  sparkleOne: {
    top: 34,
    left: 44,
  },
  sparkleTwo: {
    top: 70,
    right: 50,
    backgroundColor: '#A9E5B5',
  },
  sparkleThree: {
    bottom: 118,
    left: 58,
    backgroundColor: '#72D6C9',
  },
  eyebrow: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: 12,
  },
  imageHalo: {
    width: 206,
    height: 206,
    borderRadius: 103,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenSoft,
    marginBottom: 18,
  },
  image: {
    width: 210,
    height: 210,
  },
  title: {
    color: colors.ink,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    width: '100%',
  },
});
