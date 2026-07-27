"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoutineScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useRoutineMutations_1 = require("../hooks/useRoutineMutations");
const RoutineForm_1 = require("../components/RoutineForm");
const CreateRoutineScreen = function CreateRoutineScreen() {
    const router = (0, expo_router_1.useRouter)();
    const createMutation = (0, useRoutineMutations_1.useCreateRoutine)();
    const [errorMessage, setErrorMessage] = (0, react_1.useState)(null);
    const handleSubmit = async (values) => {
        setErrorMessage(null);
        try {
            await createMutation.mutateAsync(values);
            router.back();
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to create routine';
            setErrorMessage(msg);
            react_native_1.Alert.alert('Create Routine Error', msg);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between px-4 py-3 border-b border-zinc-900", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800", onPress: () => router.back(), accessibilityRole: "button", accessibilityLabel: "Go back", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 font-semibold text-xs", children: "\u2190 Back" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 font-extrabold text-lg", children: "Create Routine" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-16" })] }), errorMessage ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "mx-4 mt-3 bg-rose-950/80 border border-rose-800/60 p-3 rounded-xl", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs font-semibold", children: errorMessage }) })) : null, (0, jsx_runtime_1.jsx)(RoutineForm_1.RoutineForm, { submitLabel: "Create Routine", isSubmitting: createMutation.isPending, onSubmit: handleSubmit })] }));
};
exports.CreateRoutineScreen = CreateRoutineScreen;
