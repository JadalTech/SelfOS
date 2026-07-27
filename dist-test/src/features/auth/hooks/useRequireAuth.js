"use strict";
/**
 * Reusable Auth Guard Hook
 *
 * Checks authentication status and coordinates redirection using Expo Router.
 * Emits loading state during initial session check or redirects.
 *
 * Safe for layouts to reuse, preventing navigation duplication.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequireAuth = useRequireAuth;
const react_1 = require("react");
const expo_router_1 = require("expo-router");
const stores_1 = require("@/shared/stores");
function useRequireAuth() {
    const router = (0, expo_router_1.useRouter)();
    const segments = (0, expo_router_1.useSegments)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const status = (0, stores_1.useAuthStore)((state) => state.status);
    const isInitialized = (0, stores_1.useAuthStore)((state) => state.isInitialized);
    const isLoading = !isInitialized || status === 'unknown';
    (0, react_1.useEffect)(() => {
        if (!isInitialized)
            return;
        const inAppGroup = segments[0] === '(app)';
        const inAuthGroup = segments[0] === '(auth)';
        if (status === 'authenticated') {
            // If user is authenticated and verified, and trying to access auth screens, redirect to app root
            if (inAuthGroup) {
                router.replace('/(app)');
            }
        }
        else {
            // Status is unauthenticated or checking
            if (inAppGroup) {
                if (user && !user.emailVerified) {
                    // Logged in but email not verified
                    router.replace('/(auth)/verify-email');
                }
                else {
                    // Not logged in
                    router.replace('/(auth)/login');
                }
            }
        }
    }, [user, status, isInitialized, segments, router]);
    return {
        status,
        isLoading,
    };
}
