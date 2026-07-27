"use strict";
/**
 * Custom Hook for Registration Screen Logic
 *
 * Coordinates React Hook Form and signs up a new user via AuthRepository.
 * Redirects directly to verify-email on successful user creation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRegister = useRegister;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const expo_router_1 = require("expo-router");
const auth_schemas_1 = require("../validation/auth.schemas");
const auth_repository_1 = require("../repository/auth.repository");
const stores_1 = require("@/shared/stores");
function useRegister() {
    const router = (0, expo_router_1.useRouter)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const setChecking = (0, stores_1.useAuthStore)((state) => state.setChecking);
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(auth_schemas_1.registerSchema),
        defaultValues: {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });
    const onSubmit = async (data) => {
        setIsLoading(false);
        setError(null);
        setIsLoading(true);
        setChecking(); // Transition store status to checking
        const result = await auth_repository_1.authRepository.signUp(data);
        if (result.success) {
            // Trigger verification email send-out immediately after registration
            await auth_repository_1.authRepository.sendVerificationEmail();
            // Redirect to email verification page
            router.replace('/(auth)/verify-email');
        }
        else {
            setError(result.error.message);
            setIsLoading(false);
        }
    };
    return {
        form,
        isLoading,
        error,
        onSubmit: form.handleSubmit(onSubmit),
    };
}
