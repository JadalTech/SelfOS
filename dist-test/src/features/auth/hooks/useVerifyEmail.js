"use strict";
/**
 * Custom Hook for Email Verification Screen Logic
 *
 * Coordinates verification resend actions, manages a resend button
 * cooldown timer, and runs explicit reloads to verify if the session
 * verification status changed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVerifyEmail = useVerifyEmail;
const react_1 = require("react");
const auth_repository_1 = require("../repository/auth.repository");
const stores_1 = require("@/shared/stores");
function useVerifyEmail() {
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const setUser = (0, stores_1.useAuthStore)((state) => state.setUser);
    const resetStore = (0, stores_1.useAuthStore)((state) => state.reset);
    const [isChecking, setIsChecking] = (0, react_1.useState)(false);
    const [isResending, setIsResending] = (0, react_1.useState)(false);
    const [cooldownSeconds, setCooldownSeconds] = (0, react_1.useState)(0);
    const [error, setError] = (0, react_1.useState)(null);
    const [resendSuccess, setResendSuccess] = (0, react_1.useState)(false);
    const timerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (cooldownSeconds > 0) {
            timerRef.current = setTimeout(() => {
                setCooldownSeconds((prev) => prev - 1);
            }, 1000);
        }
        else {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [cooldownSeconds]);
    const handleResend = async () => {
        if (cooldownSeconds > 0 || isResending)
            return;
        setIsResending(true);
        setError(null);
        setResendSuccess(false);
        const result = await auth_repository_1.authRepository.sendVerificationEmail();
        if (result.success) {
            setResendSuccess(true);
            setCooldownSeconds(60); // 60 seconds cooldown
        }
        else {
            setError(result.error.message);
        }
        setIsResending(false);
    };
    const handleRefresh = async () => {
        if (isChecking)
            return;
        setIsChecking(true);
        setError(null);
        const result = await auth_repository_1.authRepository.reloadCurrentUser();
        if (result.success) {
            const updatedUser = result.data;
            if (updatedUser) {
                setUser(updatedUser); // Update Zustand store with the reloaded verification status
            }
        }
        else {
            setError(result.error.message);
        }
        setIsChecking(false);
    };
    const handleSignOut = async () => {
        setError(null);
        const result = await auth_repository_1.authRepository.signOut();
        if (result.success) {
            resetStore();
        }
        else {
            setError(result.error.message);
        }
    };
    return {
        email: user?.email ?? null,
        isChecking,
        isResending,
        cooldownSeconds,
        error,
        resendSuccess,
        handleResend,
        handleRefresh,
        handleSignOut,
    };
}
