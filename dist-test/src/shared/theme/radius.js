"use strict";
/**
 * Border Radius Design Tokens
 *
 * Matches the CSS `--radius: 12px` from global.css.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.radius = void 0;
const BASE_RADIUS = 12;
exports.radius = {
    /** 0px */
    none: 0,
    /** 4px */
    sm: BASE_RADIUS - 8,
    /** 8px */
    md: BASE_RADIUS - 4,
    /** 12px — default, matches CSS --radius */
    lg: BASE_RADIUS,
    /** 16px */
    xl: BASE_RADIUS + 4,
    /** 24px */
    '2xl': BASE_RADIUS + 12,
    /** 9999px — fully rounded / pill shape */
    full: 9999,
};
