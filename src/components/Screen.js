import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export default function Screen({
  children,
  scroll = false,
  padded = true,
  style,
  contentStyle,
}) {
  const innerStyle = [
    scroll ? styles.scrollContent : styles.content,
    padded && styles.padded,
    contentStyle,
  ];

  return (
    <SafeAreaView style={[styles.safe, style]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={innerStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={innerStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function HomeIndicator() {
  return (
    <View style={styles.homeIndicatorWrap} pointerEvents="none">
      <View style={styles.homeIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: 24,
  },
  homeIndicatorWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#111111',
  },
});
