import { StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';

export default function NoticeBanner({ message, tone = 'info', style }) {
  if (!message) {
    return null;
  }

  return (
    <View
      style={[
        styles.banner,
        tone === 'error' && styles.errorBanner,
        tone === 'success' && styles.successBanner,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          tone === 'error' && styles.errorText,
          tone === 'success' && styles.successText,
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radii.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#EEF5F1',
    borderWidth: 1,
    borderColor: '#D5E5DD',
  },
  errorBanner: {
    backgroundColor: '#FFF3F1',
    borderColor: '#F2C8C0',
  },
  successBanner: {
    backgroundColor: '#EDF8F0',
    borderColor: '#C8E5D0',
  },
  text: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#8D2E1D',
  },
  successText: {
    color: '#2E6E45',
  },
});
