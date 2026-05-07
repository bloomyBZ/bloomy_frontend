import { Image, StyleSheet, Text, View } from 'react-native';
import { getAvatarOptionById } from '../data/avatarOptions';
import { colors } from '../theme';

export default function AvatarBadge({
  avatarId,
  fallbackText = 'B',
  size = 46,
  style,
  imageStyle,
}) {
  const avatar = getAvatarOptionById(avatarId);

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          backgroundColor: avatar.backgroundColor,
        },
        style,
      ]}
    >
      {avatar?.source ? (
        <Image
          source={avatar.source}
          resizeMode="contain"
          style={[
            styles.image,
            {
              width: size * 0.82,
              height: size * 0.82,
            },
            imageStyle,
          ]}
        />
      ) : (
        <Text style={[styles.fallbackText, { fontSize: Math.max(16, size * 0.42) }]}>
          {fallbackText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  fallbackText: {
    color: colors.greenDark,
    fontWeight: '900',
  },
});
