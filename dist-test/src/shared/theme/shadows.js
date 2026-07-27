"use strict";
/**
 * Shadow Design Tokens
 *
 * Platform-aware shadow definitions.
 * iOS uses shadow* properties; Android uses elevation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.shadows = void 0;
exports.shadow = shadow;
const react_native_1 = require("react-native");
function createShadow(offsetY, radius, opacity, elevation) {
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
};
exports.shadows = shadowPresets;
/**
 * Returns platform-appropriate shadow styles.
 *
 * Usage:
 *   const styles = StyleSheet.create({
 *     card: { ...shadow('md'), borderRadius: 12 },
 *   });
 */
function shadow(size) {
    const preset = shadowPresets[size];
    return react_native_1.Platform.OS === 'ios' ? preset.ios : preset.android;
}
