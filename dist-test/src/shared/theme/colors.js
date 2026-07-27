"use strict";
/**
 * Color Design Tokens
 *
 * Semantic color palette for both light and dark themes.
 * Maps to the CSS custom properties defined in global.css.
 *
 * NativeWind/Tailwind classes are preferred for styling.
 * Use these tokens only when programmatic access to colors is required
 * (e.g., in charts, dynamic styles, or platform APIs).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = void 0;
exports.colors = {
    light: {
        background: '#ffffff',
        foreground: '#09090b',
        card: '#f4f4f5',
        cardForeground: '#09090b',
        popover: '#ffffff',
        popoverForeground: '#09090b',
        primary: '#6366f1',
        primaryForeground: '#ffffff',
        secondary: '#f4f4f5',
        secondaryForeground: '#0f172a',
        muted: '#f4f4f5',
        mutedForeground: '#71717a',
        accent: '#f4f4f5',
        accentForeground: '#09090b',
        destructive: '#ef4444',
        destructiveForeground: '#ffffff',
        border: '#e4e4e7',
        input: '#e4e4e7',
        ring: '#6366f1',
    },
    dark: {
        background: '#09090b',
        foreground: '#fafafa',
        card: '#18181b',
        cardForeground: '#fafafa',
        popover: '#09090b',
        popoverForeground: '#fafafa',
        primary: '#6366f1',
        primaryForeground: '#ffffff',
        secondary: '#27272a',
        secondaryForeground: '#fafafa',
        muted: '#27272a',
        mutedForeground: '#a1a1aa',
        accent: '#27272a',
        accentForeground: '#fafafa',
        destructive: '#ef4444',
        destructiveForeground: '#fafafa',
        border: '#27272a',
        input: '#27272a',
        ring: '#6366f1',
    },
    /** Semantic colors not in the CSS theme (always the same in both modes) */
    shared: {
        success: '#22c55e',
        successForeground: '#ffffff',
        warning: '#f59e0b',
        warningForeground: '#000000',
        info: '#3b82f6',
        infoForeground: '#ffffff',
        /** Brand indigo shades */
        indigo: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
        },
    },
};
