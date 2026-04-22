import { Platform } from 'react-native';

export const colors = {
  background: '#F5F7F6',
  surface: '#FFFFFF',
  surfaceSoft: '#EFF5F1',
  ink: '#14211D',
  muted: '#66736E',
  soft: '#B7C0BB',
  border: '#DDE5E1',
  paleGreen: '#DFF3E5',
  green: '#1F8A68',
  greenDark: '#173B31',
  greenSoft: '#E6F4EE',
  blue: '#3867E8',
  tab: '#EAF2FF',
  danger: '#C84E4E',
};

export const radii = {
  button: 8,
  input: 8,
  card: 8,
};

export const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  android: {
    elevation: 3,
  },
  default: {
    boxShadow: '0px 8px 24px rgba(20, 33, 29, 0.08)',
  },
});
