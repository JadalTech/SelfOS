"use strict";
/**
 * Firebase Authentication
 *
 * Exports a lazily-initialized Auth instance.
 * Uses `getReactNativePersistence` with AsyncStorage for auth state persistence.
 *
 * Note: Firebase v12 exports `getReactNativePersistence` from the
 * `firebase/auth/react-native` subpath for React Native projects.
 * If that subpath is unavailable, we fall back to importing from
 * `firebase/auth` with a type assertion (the function exists at runtime
 * even though the default .d.ts does not declare it).
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseAuth = getFirebaseAuth;
const auth_1 = require("firebase/auth");
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const app_1 = require("./app");
// Firebase JS SDK v10.12+ / v12 ships getReactNativePersistence in the
// main firebase/auth bundle but the TS typings don't always expose it.
// We import the entire module and extract it to avoid the TS2305 error.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require('firebase/auth');
let _auth = null;
/**
 * Returns the Firebase Auth instance, initializing it on first call.
 *
 * Configures auth state persistence with AsyncStorage so that
 * the user's session survives app restarts.
 */
function getFirebaseAuth() {
    if (_auth) {
        return _auth;
    }
    const app = (0, app_1.getFirebaseApp)();
    try {
        // Initialize with React Native persistence on first call
        _auth = (0, auth_1.initializeAuth)(app, {
            persistence: getReactNativePersistence(async_storage_1.default),
        });
    }
    catch {
        // If auth was already initialized (e.g., hot reload), retrieve existing
        _auth = (0, auth_1.getAuth)(app);
    }
    return _auth;
}
