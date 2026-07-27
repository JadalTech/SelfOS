"use strict";
/**
 * Firebase Auth Service
 *
 * Communicates directly with the Firebase JS SDK.
 * Lazily fetches the Auth instance to avoid eager initialization.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAuthService = exports.FirebaseAuthService = void 0;
const auth_1 = require("firebase/auth");
const firebase_1 = require("@/shared/firebase");
class FirebaseAuthService {
    /**
     * Logs in a user with email and password.
     */
    async signIn({ email, password }) {
        const auth = (0, firebase_1.getFirebaseAuth)();
        return (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
    }
    /**
     * Registers a new user and updates their display name.
     */
    async signUp({ email, password, displayName }) {
        const auth = (0, firebase_1.getFirebaseAuth)();
        const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
        const user = userCredential.user;
        // Update the profile display name immediately after registration
        await (0, auth_1.updateProfile)(user, { displayName });
        return user;
    }
    /**
     * Logs out the current user.
     */
    async signOut() {
        const auth = (0, firebase_1.getFirebaseAuth)();
        await (0, auth_1.signOut)(auth);
    }
    /**
     * Sends a password reset email.
     */
    async sendPasswordReset(email) {
        const auth = (0, firebase_1.getFirebaseAuth)();
        await (0, auth_1.sendPasswordResetEmail)(auth, email);
    }
    /**
     * Sends a verification email to the currently logged in user.
     */
    async sendVerificationEmail() {
        const auth = (0, firebase_1.getFirebaseAuth)();
        const user = auth.currentUser;
        if (user) {
            await (0, auth_1.sendEmailVerification)(user);
        }
        else {
            throw new Error('No user currently authenticated to send verification email to.');
        }
    }
    /**
     * Reloads the current user profile from Firebase to fetch updated status (e.g. email verification).
     */
    async reloadCurrentUser() {
        const auth = (0, firebase_1.getFirebaseAuth)();
        const user = auth.currentUser;
        if (user) {
            await user.reload();
            return auth.currentUser;
        }
        return null;
    }
}
exports.FirebaseAuthService = FirebaseAuthService;
exports.firebaseAuthService = new FirebaseAuthService();
