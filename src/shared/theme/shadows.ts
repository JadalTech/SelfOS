/**
 * Shadow Design Tokens
 *
 * Platform-aware shadow definitions.
 * iOS uses shadow* properties; Android uses elevation.
 */

import { Platform } from 'react-native';
import type { ViewStyle } from 'react-native';

interface ShadowPreset {
  ios: ViewStyle;
  android: ViewStyle;
}

function createShadow(
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number,
): ShadowPreset {
  return {
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
  };
}

const shadowPresets = {
  sm: createShadow(1, 2, 0.05, 1),
  md: createShadow(2, 4, 0.1, 3),
  lg: createShadow(4, 8, 0.15, 6),
  xl: createShadow(8, 16, 0.2, 10),
} as const;

/**
 * Returns platform-appropriate shadow styles.
 *
 * Usage:
 *   const styles = StyleSheet.create({
 *     card: { ...shadow('md'), borderRadius: 12 },
 *   });
 */
export function shadow(size: keyof typeof shadowPresets): ViewStyle {
  const preset = shadowPresets[size];
  return Platform.OS === 'ios' ? preset.ios : preset.android;
}

export { shadowPresets as shadows };
