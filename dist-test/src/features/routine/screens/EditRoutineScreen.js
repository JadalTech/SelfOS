"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditRoutineScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useRoutine_1 = require("../hooks/useRoutine");
const useRoutineMutations_1 = require("../hooks/useRoutineMutations");
const RoutineForm_1 = require("../components/RoutineForm");
const ArchiveRoutineDialog_1 = require("../components/ArchiveRoutineDialog");
const components_1 = require("@/shared/components");
const EditRoutineScreen = function EditRoutineScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { id } = (0, expo_router_1.useLocalSearchParams)();
    const routineId = id ?? '';
    const { routine, isLoading, isError, error } = (0, useRoutine_1.useRoutine)(routineId);
    const updateMutation = (0, useRoutineMutations_1.useUpdateRoutine)();
    const archiveMutation = (0, useRoutineMutations_1.useArchiveRoutine)();
    const restoreMutation = (0, useRoutineMutations_1.useRestoreRoutine)();
    const [showArchiveDialog, setShowArchiveDialog] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)(null);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(components_1.FullScreenLoader, { message: "Loading routine configuration..." });
    }
    if (isError || !routine) {
        return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950 items-center justify-center p-6 gap-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-500 font-bold text-lg", children: "Routine Not Found" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center", children: error?.message ?? 'The requested routine does not exist.' }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl", onPress: () => router.back(), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 font-semibold text-xs", children: "Go Back" }) })] }));
    }
    const isArchived = routine.status === 'archived';
    const handleSubmit = async (values) => {
        setErrorMessage(null);
        try {
            await updateMutation.mutateAsync({
                routineId,
                formValues: values,
            });
            router.back();
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to update routine';
            setErrorMessage(msg);
            react_native_1.Alert.alert('Update Error', msg);
        }
    };
    const handleArchiveConfirm = async () => {
        try {
            if (isArchived) {
                await restoreMutation.mutateAsync(routineId);
            }
            else {
                await archiveMutation.mutateAsync(routineId);
            }
            setShowArchiveDialog(false);
            router.back();
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Action failed';
            react_native_1.Alert.alert('Archive Error', msg);
        }
    };
    const initialFormValues = {
        title: routine.title,
        description: routine.description,
        type: routine.type,
        status: routine.status,
        schedule: routine.schedule,
        reminders: routine.reminders,
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between px-4 py-3 border-b border-zinc-900", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800", onPress: () => router.back(), accessibilityRole: "button", accessibilityLabel: "Cancel edit", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 font-semibold text-xs", children: "Cancel" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 font-extrabold text-lg", children: "Edit Routine" }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800", onPress: () => setShowArchiveDialog(true), accessibilityRole: "button", accessibilityLabel: isArchived ? 'Restore routine' : 'Archive routine', children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `font-semibold text-xs ${isArchived ? 'text-emerald-400' : 'text-amber-400'}`, children: isArchived ? 'Restore' : 'Archive' }) })] }), errorMessage ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "mx-4 mt-3 bg-rose-950/80 border border-rose-800/60 p-3 rounded-xl", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs font-semibold", children: errorMessage }) })) : null, (0, jsx_runtime_1.jsx)(RoutineForm_1.RoutineForm, { initialValues: initialFormValues, submitLabel: "Save Changes", isSubmitting: updateMutation.isPending, onSubmit: handleSubmit }), (0, jsx_runtime_1.jsx)(ArchiveRoutineDialog_1.ArchiveRoutineDialog, { visible: showArchiveDialog, routineTitle: routine.title, isArchived: isArchived, isLoading: archiveMutation.isPending || restoreMutation.isPending, onConfirm: handleArchiveConfirm, onCancel: () => setShowArchiveDialog(false) })] }));
};
exports.EditRoutineScreen = EditRoutineScreen;
