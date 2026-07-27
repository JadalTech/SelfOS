"use strict";
/**
 * Auth State Listener Hook
 *
 * Listens for Firebase Auth state changes and syncs them to the Zustand store.
 * Mounted once at the application root layout to avoid duplicate listeners.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthState = useAuthState;
const react_1 = require("react");
const auth_1 = require("firebase/auth");
const firebase_1 = require("@/shared/firebase");
const stores_1 = require("@/shared/stores");
const auth_repository_1 = require("../repository/auth.repository");
const utils_1 = require("@/shared/utils");
function useAuthState() {
    const setUser = (0, stores_1.useAuthStore)((state) => state.setUser);
    (0, react_1.useEffect)(() => {
        utils_1.logger.info('AuthStateListener', 'Subscribing to Firebase Auth state changes...');
        const auth = (0, firebase_1.getFirebaseAuth)();
        const unsubscribe = (0, auth_1.onAuthStateChanged)(auth, (user) => {
            if (user) {
                utils_1.logger.info('AuthStateListener', `User session changed: ${user.email} (Verified: ${user.emailVerified})`);
                setUser((0, auth_repository_1.mapFirebaseUser)(user));
            }
            else {
                utils_1.logger.info('AuthStateListener', 'User session changed: signed out');
                setUser(null);
            }
        }, (error) => {
            utils_1.logger.error('AuthStateListener', 'Listener error caught', error);
            setUser(null);
        });
        return () => {
            utils_1.logger.info('AuthStateListener', 'Unsubscribing from state changes...');
            unsubscribe();
        };
    }, [setUser]);
}
