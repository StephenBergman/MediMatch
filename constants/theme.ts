/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const palette = {
  midnight: '#1B2A41',
  black: '#0B0F14',
  gold: '#D9A441',
  violet: '#4D6B8A',
  teal: '#2BA6CB',
  sky: '#CFE3F6',
  white: '#FFFFFF',
  crimson: '#C4424C',
  orange: '#D07A3B',
  blush: '#F2B6A0',
  green: '#2FB5A3',
  sage: '#7BC4B4',
} as const;

export const Colors = {
  palette,
  light: {
    text: palette.midnight,
    inverseText: palette.white,
    background: palette.white,
    surface: '#EAF3FB',
    card: palette.white,
    border: '#D5E5F3',
    muted: '#E1EEF9',
    tint: palette.teal,
    primary: palette.teal,
    secondary: palette.violet,
    accent: palette.gold,
    success: palette.green,
    warning: palette.orange,
    danger: palette.crimson,
    icon: palette.midnight,
    tabIconDefault: '#5B6F86',
    tabIconSelected: palette.teal,
  },
  dark: {
    text: '#E6EEF7',
    inverseText: palette.midnight,
    background: palette.midnight,
    surface: '#121A26',
    card: '#0F1722',
    border: '#1E2A3B',
    muted: '#152031',
    tint: palette.teal,
    primary: palette.teal,
    secondary: palette.violet,
    accent: palette.gold,
    success: palette.sage,
    warning: palette.orange,
    danger: palette.crimson,
    icon: '#C8D6E6',
    tabIconDefault: '#A9B8C8',
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
