import { rgba } from 'polished';
export { default as AVATAR_BACKGROUND } from './assets/slime-background.png';

const GRADIENT_ROTATION = '315deg' as const;

export const COLORS = {
  blackBase: '#363436',
  blackLight: '#444144',
  blackShadow: '#272627',
  blackest: '#171717',
  blueBase: '#2F80ED',
  blueLight: '#4D92F0',
  blueShadow: '#1470EB',
  greenBase: '#27AE60',
  greenLight: '#2DC86E',
  greenShadow: '#229653',
  redBase: '#EB5757',
  redLight: '#EE7272',
  redShadow: '#E83B3B',
  yellowBase: '#F2C94C',
  yellowLight: '#F4D167',
  yellowShadow: '#F0C02E',
  white: '#FFFFFF',
  whiteSmoke: '#CCC',
  border: '#F0EFF0',
};

export type ThemeColors = keyof typeof COLORS;

export const GRADIENTS = {
  blackGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.blackBase} 0%, ${COLORS.blackLight} 100%)`,
  blackestGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.blackest} 0%, ${COLORS.blackShadow} 100%)`,
  blueGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.blueBase} 0%, ${COLORS.blueLight} 100%)`,
  greenGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.greenBase} 0%, ${COLORS.greenLight} 100%)`,
  redGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.redBase} 0%, ${COLORS.redLight} 100%)`,
  whiteGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.border} 0%, ${COLORS.white} 100%)`,
  yellowGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.yellowBase} 0%, ${COLORS.yellowLight} 100%)`,
};

export type ThemeGradients = keyof typeof GRADIENTS;

export const THEME = {
  backgrounds: {
    base: COLORS.blackBase,
    card: COLORS.white,
    whiteSmoke: COLORS.whiteSmoke,
    admin: GRADIENTS.blueGradient,
    ready: GRADIENTS.greenGradient,
    notReady: GRADIENTS.redGradient,
    winner: GRADIENTS.greenGradient,
    closest: GRADIENTS.blueGradient,
    others: COLORS.white,
    primaryButton: COLORS.blueBase,
    secondaryButton: COLORS.greenBase,
  },
  playingCards: {
    back: GRADIENTS.blackestGradient,
    black: GRADIENTS.blackGradient,
    blue: GRADIENTS.blueGradient,
    green: GRADIENTS.greenGradient,
    red: GRADIENTS.redGradient,
    yellow: GRADIENTS.yellowGradient,
  },
  colors: COLORS,
  gradients: GRADIENTS,
  spacing: {
    none: 0,
    small: 4,
    base: 8,
    medium: 16,
    mediumLarge: 24,
    large: 32,
    huge: 48,
    high: 64,
    highest: 96,
  },
  radius: {
    small: 4,
    base: 8,
    board: 16,
  },
  shadows: {
    base: `0 1px 8px ${rgba(COLORS.blackest, 0.14)}`,
    lighter: `0 2px 8px ${rgba(COLORS.blackShadow, 0.24)}`,
    darker: `0px 0px 16px ${COLORS.blackShadow}`,
  },
  fonts: {
    Ubuntu: '"Ubuntu", "Roboto", "Helvetica Neue", sans-serif',
  },
};

export type MinimalSoloTheme = typeof THEME;

export type WithMinimalSoloTheme = { theme: MinimalSoloTheme };
