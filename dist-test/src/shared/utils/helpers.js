"use strict";
/**
 * General-Purpose Helpers
 *
 * Only utilities that are immediately reusable across multiple features.
 * No speculative helpers — add when a real need arises.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWeb = exports.isAndroid = exports.isIOS = void 0;
exports.clamp = clamp;
exports.capitalize = capitalize;
exports.truncate = truncate;
exports.sleep = sleep;
exports.isNonNullable = isNonNullable;
const react_native_1 = require("react-native");
/**
 * Clamp a number between a minimum and maximum value.
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * Capitalize the first letter of a string.
 */
function capitalize(str) {
    if (str.length === 0)
        return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Truncate a string to a given length, appending '…' if truncated.
 */
function truncate(str, maxLength) {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - 1) + '…';
}
/**
 * Promise-based delay.
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Type guard to filter out null and undefined values.
 *
 * Usage:
 *   const items = [1, null, 2, undefined].filter(isNonNullable);
 *   // items: number[]
 */
function isNonNullable(value) {
    return value !== null && value !== undefined;
}
/**
 * Check if the current platform is iOS.
 */
exports.isIOS = react_native_1.Platform.OS === 'ios';
/**
 * Check if the current platform is Android.
 */
exports.isAndroid = react_native_1.Platform.OS === 'android';
/**
 * Check if the current platform is web.
 */
exports.isWeb = react_native_1.Platform.OS === 'web';
