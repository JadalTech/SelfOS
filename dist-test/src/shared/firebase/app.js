"use strict";
/**
 * Firebase App Initialization
 *
 * Lazy singleton pattern — Firebase is NOT initialized at import time.
 * Instead, `getFirebaseApp()` initializes on first call and returns
 * the cached instance on subsequent calls.
 *
 * This avoids eager initialization during app startup and ensures
 * Firebase is only loaded when actually needed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseApp = getFirebaseApp;
const app_1 = require("firebase/app");
const config_1 = require("@/shared/config");
let _app = null;
/**
 * Returns the Firebase app instance, initializing it on first call.
 *
 * - Singleton: always returns the same instance.
 * - Safe to call from multiple modules/files.
 * - Guards against duplicate initialization via `getApps()`.
 */
function getFirebaseApp() {
    if (_app) {
        return _app;
    }
    // Guard: if Firebase was already initialized elsewhere (e.g., hot reload),
    // reuse the existing app instead of creating a duplicate.
    if ((0, app_1.getApps)().length > 0) {
        _app = (0, app_1.getApp)();
        return _app;
    }
    _app = (0, app_1.initializeApp)({
        apiKey: config_1.config.firebase.apiKey,
        authDomain: config_1.config.firebase.authDomain,
        projectId: config_1.config.firebase.projectId,
        storageBucket: config_1.config.firebase.storageBucket,
        messagingSenderId: config_1.config.firebase.messagingSenderId,
        appId: config_1.config.firebase.appId,
        measurementId: config_1.config.firebase.measurementId,
    });
    return _app;
}
