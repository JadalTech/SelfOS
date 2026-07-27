"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairConditionFormScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useHairConditions_1 = require("../hooks/useHairConditions");
const useCreateHairCondition_1 = require("../hooks/useCreateHairCondition");
const useUpdateHairCondition_1 = require("../hooks/useUpdateHairCondition");
const components_1 = require("../components");
const HairConditionFormScreen = function HairConditionFormScreen() {
    const router = (0, expo_router_1.useRouter)();
    const params = (0, expo_router_1.useLocalSearchParams)();
    const conditionId = params.id;
    const { conditions, isLoading, isError, error } = (0, useHairConditions_1.useHairConditions)();
    const { createCondition, isCreating } = (0, useCreateHairCondition_1.useCreateHairCondition)();
    const { updateCondition, isUpdating } = (0, useUpdateHairCondition_1.useUpdateHairCondition)();
    const isEditMode = Boolean(conditionId);
    const existingRecord = (0, react_1.useMemo)(() => {
        if (!conditionId)
            return null;
        return conditions.find((c) => c.id === conditionId) || null;
    }, [conditionId, conditions]);
    if (isLoading && isEditMode) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.LoadingHaircare, {}) }));
    }
    if (isError && isEditMode) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.ErrorHaircare, { errorMessage: error?.message }) }));
    }
    const initialFormValues = existingRecord
        ? {
            recordDate: existingRecord.recordDate,
            hairType: existingRecord.hairType,
            porosity: existingRecord.porosity,
            scalpType: existingRecord.scalpType,
            hairDensity: existingRecord.hairDensity,
            sheddingLevel: existingRecord.sheddingLevel,
            dandruffLevel: existingRecord.dandruffLevel,
            itchinessLevel: existingRecord.itchinessLevel,
            oilinessLevel: existingRecord.oilinessLevel,
            drynessLevel: existingRecord.drynessLevel,
            breakageLevel: existingRecord.breakageLevel,
            frizzLevel: existingRecord.frizzLevel,
            shineLevel: existingRecord.shineLevel,
            overallHealth: existingRecord.overallHealth,
            notes: existingRecord.notes,
        }
        : undefined;
    return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row items-center justify-between", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold mb-1", children: "\u2190 Cancel" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-extrabold", children: isEditMode ? 'Edit Assessment' : 'New Health Assessment' })] }) }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl", children: (0, jsx_runtime_1.jsx)(components_1.ConditionForm, { initialValues: initialFormValues, isSubmitting: isCreating || isUpdating, submitLabel: isEditMode ? 'Update Assessment Record' : 'Save Health Assessment', onSubmit: async (vals) => {
                            if (isEditMode && conditionId) {
                                await updateCondition({
                                    id: conditionId,
                                    updates: vals,
                                });
                            }
                            else {
                                await createCondition(vals);
                            }
                            router.back();
                        } }) })] }) }));
};
exports.HairConditionFormScreen = HairConditionFormScreen;
