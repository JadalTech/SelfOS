"use strict";
/**
 * Cloud Functions Centralized Configuration
 *
 * Single source of truth for Cloud Functions v2 region, memory limits,
 * runtime options, and emulator environment detection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FUNCTION_CONFIG = void 0;
exports.FUNCTION_CONFIG = {
    region: process.env.LOCATION_ID || 'asia-south1',
    defaultMemory: '256MiB',
    defaultTimeoutSeconds: 60,
    isEmulator: process.env.FUNCTIONS_EMULATOR === 'true' || Boolean(process.env.FIREBASE_EMULATOR_HUB),
    environment: process.env.NODE_ENV || 'development',
};
//# sourceMappingURL=config.js.map