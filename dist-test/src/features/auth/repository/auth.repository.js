"use strict";
/**
 * Authentication Repository
 *
 * Implements the domain boundary for authentication.
 * Responsible for mapping Firebase SDK results to domain models (AppUser),
 * catching and normalizing database errors, and returning Result wrappers.
 *
 * Has NO knowledge of navigation, stores, alerts, or UI state.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = exports.AuthRepository = void 0;
exports.mapFirebaseUser = mapFirebaseUser;
const types_1 = require("@/shared/types");
const errors_1 = require("@/shared/errors");
const firebase_auth_service_1 = require("../services/firebase-auth.service");
/**
 * Maps a Firebase SDK User object into the lightweight AppUser type.
 */
function mapFirebaseUser(user) {
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
    };
}
class AuthRepository {
    /**
     * Log in user, map response to AppUser, and catch errors.
     */
    async signIn(credentials) {
        try {
            const userCredential = await firebase_auth_service_1.firebaseAuthService.signIn(credentials);
            const appUser = mapFirebaseUser(userCredential.user);
            return (0, types_1.ok)(appUser);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Register a new user, update display name, and return AppUser.
     */
    async signUp(credentials) {
        try {
            const user = await firebase_auth_service_1.firebaseAuthService.signUp(credentials);
            const appUser = mapFirebaseUser(user);
            return (0, types_1.ok)(appUser);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Log out the current user.
     */
    async signOut() {
        try {
            await firebase_auth_service_1.firebaseAuthService.signOut();
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Send a recovery email.
     */
    async sendPasswordReset(email) {
        try {
            await firebase_auth_service_1.firebaseAuthService.sendPasswordReset(email);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Send verification link.
     */
    async sendVerificationEmail() {
        try {
            await firebase_auth_service_1.firebaseAuthService.sendVerificationEmail();
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Reload current user to verify email verification status change.
     */
    async reloadCurrentUser() {
        try {
            const user = await firebase_auth_service_1.firebaseAuthService.reloadCurrentUser();
            if (!user) {
                return (0, types_1.ok)(null);
            }
            const appUser = mapFirebaseUser(user);
            return (0, types_1.ok)(appUser);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();
