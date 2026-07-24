const shared = {
  colors: {
    blue: '#4D8BFF',
    green: '#4DFF8B',
    purple: '#8B4DFF',
    orange: '#FF8B4D',
    teal: '#4DFFDB',
    pink: '#FF4D8B',
    yellow: '#FFD74D',
    red: '#FF4D4D',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, full: 999 },
  font: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24, xxxl: 32 },
};

export const darkTheme = {
  ...shared,
  mode: 'dark' as const,
  bg: '#0B0B0F',
  surface: '#13131A',
  surface2: '#1C1C26',
  surface3: '#252532',
  card: '#16161F',
  border: '#2A2A3A',
  borderLight: '#383848',
  text: '#F0F0F8',
  textSoft: '#B0B0C8',
  textMuted: '#707088',
  accent: '#FF5C4D',
  accentSoft: '#FF5C4D22',
  accentGlow: '#FF5C4D44',
};

// A warm, yellowish-white light theme — cream canvas with clean white cards,
// and a deepened accent shade so it still passes contrast on a light ground.
export const lightTheme = {
  ...shared,
  mode: 'light' as const,
  bg: '#FBF6E9',
  surface: '#FFFFFF',
  surface2: '#F5EFDD',
  surface3: '#EDE4CC',
  card: '#FFFFFF',
  border: '#E8DFC8',
  borderLight: '#F0E9D6',
  text: '#2A2416',
  textSoft: '#5C5340',
  textMuted: '#8C8168',
  accent: '#E24F3D',
  accentSoft: '#E24F3D1A',
  accentGlow: '#E24F3D33',
};

export type Theme = typeof darkTheme | typeof lightTheme;

// Static default, kept only for any code path that hasn't migrated to useTheme() yet.
export const theme = darkTheme;
