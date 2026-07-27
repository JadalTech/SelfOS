"use strict";
/**
 * Typography Design Tokens
 *
 * Font sizes, line heights, weights, and named presets.
 * System font is used by default (San Francisco on iOS, Roboto on Android).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.typography = exports.lineHeights = exports.fontWeights = exports.fontSizes = void 0;
exports.fontSizes = {
    /** 10px */
    '2xs': 10,
    /** 12px */
    xs: 12,
    /** 14px */
    sm: 14,
    /** 16px */
    base: 16,
    /** 18px */
    lg: 18,
    /** 20px */
    xl: 20,
    /** 24px */
    '2xl': 24,
    /** 30px */
    '3xl': 30,
    /** 36px */
    '4xl': 36,
};
exports.fontWeights = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
};
exports.lineHeights = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
};
/** Named typography presets for use in StyleSheet.create() */
exports.typography = {
    heading1: {
        fontSize: exports.fontSizes['3xl'],
        fontWeight: exports.fontWeights.bold,
        lineHeight: exports.fontSizes['3xl'] * exports.lineHeights.tight,
    },
    heading2: {
        fontSize: exports.fontSizes['2xl'],
        fontWeight: exports.fontWeights.bold,
        lineHeight: exports.fontSizes['2xl'] * exports.lineHeights.tight,
    },
    heading3: {
        fontSize: exports.fontSizes.xl,
        fontWeight: exports.fontWeights.semibold,
        lineHeight: exports.fontSizes.xl * exports.lineHeights.tight,
    },
    body: {
        fontSize: exports.fontSizes.base,
        fontWeight: exports.fontWeights.regular,
        lineHeight: exports.fontSizes.base * exports.lineHeights.normal,
    },
    bodyMedium: {
        fontSize: exports.fontSizes.base,
        fontWeight: exports.fontWeights.medium,
        lineHeight: exports.fontSizes.base * exports.lineHeights.normal,
    },
    caption: {
        fontSize: exports.fontSizes.xs,
        fontWeight: exports.fontWeights.regular,
        lineHeight: exports.fontSizes.xs * exports.lineHeights.normal,
    },
    label: {
        fontSize: exports.fontSizes.sm,
        fontWeight: exports.fontWeights.medium,
        lineHeight: exports.fontSizes.sm * exports.lineHeights.normal,
    },
};
