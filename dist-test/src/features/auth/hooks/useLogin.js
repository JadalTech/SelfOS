"use strict";
/**
 * Custom Hook for Login Screen Logic
 *
 * Coordinates React Hook Form, local submission states, and calls the
 * AuthRepository. Relies on the root router guard for successful redirects.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogin = useLogin;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const auth_schemas_1 = require("../validation/auth.schemas");
const auth_repository_1 = require("../repository/auth.repository");
const stores_1 = require("@/shared/stores");
function useLogin() {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const setChecking = (0, stores_1.useAuthStore)((state) => state.setChecking);
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(auth_schemas_1.loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const onSubmit = async (data) => {
        setIsLoading(false);
        setError(null);
        setIsLoading(true);
        setChecking(); // Transition store status to checking
        const result = await auth_repository_1.authRepository.signIn(data);
        if (result.success) {
            // The root onAuthStateChanged listener will automatically detect the
            // new session, update the Zustand store, and trigger the layout redirects.
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
