/**
 * Spacing Design Tokens
 *
 * 4px-base spacing scale for consistent layout rhythm.
 * Named tokens for common use cases.
 */

export const spacing = {
  /** 0px */
  none: 0,
  /** 2px */
  '2xs': 2,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  '2xl': 24,
  /** 32px */
  '3xl': 32,
  /** 40px */
  '4xl': 40,
  /** 48px */
  '5xl': 48,
  /** 64px */
  '6xl': 64,

  // Named semantic spacing
  /** Screen horizontal padding (16px) */
  screenHorizontal: 16,
  /** Screen vertical padding (24px) */
  screenVertical: 24,
  /** Card internal padding (16px) */
  cardPadding: 16,
  /** Gap between list items (12px) */
  listGap: 12,
  /** Gap between sections (24px) */
  sectionGap: 24,
} as const;
