import { StyleSheet, Text, View } from 'react-native';
import { colors, shadow } from '../theme';

export function ForgotIllustration() {
  return (
    <View style={styles.illustration}>
      <View style={styles.browser}>
        <View style={styles.browserTop}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <View style={styles.lock} />
        <View style={styles.lineLong} />
        <View style={styles.lineShort} />
        <View style={styles.darkButton} />
      </View>
      <View style={styles.person}>
        <View style={styles.head} />
        <View style={styles.body} />
        <View style={styles.leg} />
      </View>
      <View style={styles.questionBubble}>
        <Text style={styles.questionText}>?</Text>
      </View>
      <View style={styles.plant}>
        <View style={styles.plantLeaf} />
        <View style={[styles.plantLeaf, styles.plantLeafRight]} />
      </View>
    </View>
  );
}

export function VerifyIllustration() {
  return (
    <View style={styles.illustration}>
      <View style={[styles.browser, styles.verifyBrowser]}>
        <View style={styles.verifyRow}>
          <View style={styles.otpBoxTiny} />
          <View style={styles.otpBoxTiny} />
          <View style={styles.otpBoxTiny} />
          <View style={styles.otpBoxTiny} />
        </View>
        <View style={styles.lineLong} />
        <View style={styles.darkButton} />
      </View>
      <View style={styles.personLow}>
        <View style={styles.head} />
        <View style={[styles.body, styles.bodyDark]} />
        <View style={styles.legWide} />
      </View>
      <View style={styles.shield}>
        <Text style={styles.shieldText}>✓</Text>
      </View>
      <View style={styles.plant}>
        <View style={styles.plantLeaf} />
        <View style={[styles.plantLeaf, styles.plantLeafRight]} />
      </View>
    </View>
  );
}

export function BooksArtwork() {
  return (
    <View style={styles.booksArt}>
      <View style={[styles.book, styles.bookRed]} />
      <View style={[styles.book, styles.bookYellow]} />
      <View style={[styles.book, styles.bookGreen]} />
    </View>
  );
}

export function DeskArtwork() {
  return (
    <View style={styles.deskArt}>
      <View style={styles.paper} />
      <View style={styles.folder} />
      <View style={styles.noteLine} />
      <View style={[styles.noteLine, styles.noteLineTwo]} />
    </View>
  );
}

const styles = StyleSheet.create({
  illustration: {
    width: 260,
    height: 190,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  browser: {
    position: 'absolute',
    right: 28,
    top: 18,
    width: 132,
    height: 128,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    alignItems: 'center',
    paddingTop: 26,
    ...shadow,
  },
  browserTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 22,
    backgroundColor: '#171717',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  lock: {
    width: 34,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#CCD4D6',
    marginBottom: 14,
  },
  lineLong: {
    width: 82,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EEF0F2',
    marginBottom: 10,
  },
  lineShort: {
    width: 58,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EEF0F2',
    marginBottom: 12,
  },
  darkButton: {
    width: 86,
    height: 15,
    borderRadius: 2,
    backgroundColor: '#171717',
  },
  person: {
    position: 'absolute',
    left: 34,
    bottom: 24,
    width: 82,
    height: 92,
  },
  personLow: {
    position: 'absolute',
    left: 42,
    bottom: 24,
    width: 86,
    height: 84,
  },
  head: {
    width: 21,
    height: 21,
    borderRadius: 12,
    backgroundColor: '#F06151',
    marginLeft: 32,
  },
  body: {
    width: 58,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#203C3D',
    transform: [{ rotate: '-8deg' }],
  },
  bodyDark: {
    backgroundColor: '#1B2E31',
  },
  leg: {
    width: 84,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#203C3D',
    marginTop: 12,
    transform: [{ rotate: '11deg' }],
  },
  legWide: {
    width: 80,
    height: 14,
    borderRadius: 8,
    backgroundColor: '#203C3D',
    marginTop: 11,
    transform: [{ rotate: '-15deg' }],
  },
  questionBubble: {
    position: 'absolute',
    left: 86,
    top: 52,
    width: 38,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '800',
  },
  plant: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 40,
    height: 54,
    borderBottomWidth: 8,
    borderBottomColor: '#203C3D',
  },
  plantLeaf: {
    position: 'absolute',
    bottom: 20,
    left: 5,
    width: 24,
    height: 16,
    borderRadius: 12,
    backgroundColor: '#203C3D',
    transform: [{ rotate: '-32deg' }],
  },
  plantLeafRight: {
    left: 16,
    bottom: 30,
    transform: [{ rotate: '28deg' }],
  },
  verifyBrowser: {
    top: 24,
    paddingTop: 48,
  },
  verifyRow: {
    position: 'absolute',
    top: 34,
    flexDirection: 'row',
    gap: 7,
  },
  otpBoxTiny: {
    width: 23,
    height: 22,
    borderRadius: 2,
    backgroundColor: '#E5E7E8',
  },
  shield: {
    position: 'absolute',
    right: 36,
    top: 22,
    width: 48,
    height: 54,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#203C3D',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '10deg' }],
  },
  shieldText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  booksArt: {
    width: 88,
    height: 74,
    justifyContent: 'flex-end',
  },
  book: {
    height: 13,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#E5E1DC',
    marginBottom: 3,
    transform: [{ rotate: '8deg' }],
  },
  bookRed: {
    width: 72,
    backgroundColor: '#C4285A',
    marginLeft: 12,
  },
  bookYellow: {
    width: 84,
    backgroundColor: '#F1C453',
    marginLeft: 4,
  },
  bookGreen: {
    width: 74,
    backgroundColor: '#62B96E',
    marginLeft: 0,
  },
  deskArt: {
    width: 90,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    width: 62,
    height: 70,
    borderRadius: 6,
    backgroundColor: '#A9A9EE',
    transform: [{ rotate: '8deg' }],
  },
  folder: {
    width: 54,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#95BF42',
    transform: [{ rotate: '-15deg' }],
  },
  noteLine: {
    position: 'absolute',
    width: 46,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#F77A42',
    transform: [{ rotate: '-15deg' }],
  },
  noteLineTwo: {
    marginTop: 16,
    width: 38,
  },
});
