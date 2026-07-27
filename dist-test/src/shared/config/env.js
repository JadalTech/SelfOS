"use strict";
/**
 * Environment Configuration
 *
 * Validates and exports all required environment variables.
 * Fails early with descriptive errors if required values are missing.
 *
 * - In development: logs a detailed table of missing variables.
 * - In production: fails safely without leaking variable names.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const expo_constants_1 = __importDefault(require("expo-constants"));
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * Reads an environment variable from Expo's extra config or process.env.
 * Expo SDK 49+ exposes EXPO_PUBLIC_* vars on process.env automatically.
 */
function readEnv(key) {
    // Expo injects EXPO_PUBLIC_* onto process.env at build time
    const value = expo_constants_1.default.expoConfig?.extra?.[key] ??
        process.env[key];
    // Treat empty strings as undefined
    return value && value.trim().length > 0 ? value.trim() : undefined;
}
/**
 * Validates that all required environment variables are present.
 * Throws a descriptive error if any are missing.
 */
function validateEnv() {
    const requiredKeys = [
        'EXPO_PUBLIC_FIREBASE_API_KEY',
        'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
        'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'EXPO_PUBLIC_FIREBASE_APP_ID',
    ];
    const missing = [];
    const values = {};
    for (const key of requiredKeys) {
        const value = readEnv(key);
        if (!value) {
            missing.push(key);
        }
        else {
            values[key] = value;
        }
    }
    if (missing.length > 0) {
        if (__DEV__) {
            // Development: provide a detailed, actionable error message.
            const missingList = missing.map((k) => `  • ${k}`).join('\n');
            throw new Error(`[SelfOS] Missing required environment variables:\n\n${missingList}\n\n` +
                'Create a .env file in the project root using .env.example as a template.\n' +
                'Then restart the development server.');
        }
        else {
            // Production: fail safely without exposing variable names.
            throw new Error('[SelfOS] Application configuration is incomplete. ' +
                'Please contact support or check deployment environment.');
        }
    }
    return {
        apiKey: values['EXPO_PUBLIC_FIREBASE_API_KEY'],
        authDomain: values['EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'],
        projectId: values['EXPO_PUBLIC_FIREBASE_PROJECT_ID'],
        storageBucket: values['EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'],
        messagingSenderId: values['EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'],
        appId: values['EXPO_PUBLIC_FIREBASE_APP_ID'],
        measurementId: readEnv('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID'),
    };
}
// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
/**
 * Validated, frozen application configuration.
 * Import this wherever environment values are needed.
 *
 * Will throw immediately on import if required values are missing,
 * ensuring the app fails fast during startup rather than at an
 * unpredictable later point.
 */
exports.config = Object.freeze({
    firebase: Object.freeze(validateEnv()),
    isDev: __DEV__,
    isProd: !__DEV__,
});
