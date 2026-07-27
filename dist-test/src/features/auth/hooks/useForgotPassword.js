"use strict";
/**
 * Custom Hook for Forgot Password Screen Logic
 *
 * Coordinates React Hook Form and dispatches password reset recovery links
 * via the AuthRepository. Tracks success feedback.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useForgotPassword = useForgotPassword;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const auth_schemas_1 = require("../validation/auth.schemas");
const auth_repository_1 = require("../repository/auth.repository");
function useForgotPassword() {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isSent, setIsSent] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(auth_schemas_1.forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });
    const onSubmit = async (data) => {
        setIsLoading(false);
        setError(null);
        setIsSent(false);
        setIsLoading(true);
        const result = await auth_repository_1.authRepository.sendPasswordReset(data.email);
        if (result.success) {
            setIsSent(true);
        }
        else {
            setError(result.error.message);
        }
        setIsLoading(false);
    };
    const resetForm = () => {
        form.reset();
        setIsSent(false);
        setError(null);
    };
    return {
        form,
        isLoading,
        isSent,
        error,
        onSubmit: form.handleSubmit(onSubmit),
        resetForm,
    };
}
