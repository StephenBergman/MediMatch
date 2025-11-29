/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const palette = {
  midnight: '#1E263E',
  black: '#000000',
  gold: '#E8A026',
  violet: '#AC63ED',
  teal: '#26A6C0',
  sky: '#A7C5E8',
  white: '#FFFFFF',
  crimson: '#C32626',
  orange: '#CA5A16',
  blush: '#F19B85',
  green: '#5FA965',
  sage: '#AEC8A1',
} as const;

export const Colors = {
  palette,
  light: {
    text: palette.midnight,
    inverseText: palette.white,
    background: palette.white,
    surface: palette.sky,
    card: palette.white,
    border: palette.sky,
    muted: palette.sky,
    tint: palette.teal,
    primary: palette.teal,
    secondary: palette.violet,
    accent: palette.gold,
    success: palette.green,
    warning: palette.gold,
    danger: palette.crimson,
    icon: palette.midnight,
    tabIconDefault: palette.midnight,
    tabIconSelected: palette.teal,
  },
  dark: {
    text: palette.sky,
    inverseText: palette.midnight,
    background: palette.midnight,
    surface: palette.black,
    card: palette.black,
    border: palette.midnight,
    muted: palette.black,
    tint: palette.teal,
    primary: palette.teal,
    secondary: palette.violet,
    accent: palette.gold,
    success: palette.sage,
    warning: palette.gold,
    danger: palette.crimson,
    icon: palette.sky,
    tabIconDefault: palette.sky,
    tabIconSelected: palette.teal,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
