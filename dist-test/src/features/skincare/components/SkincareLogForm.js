"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkincareLogForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const skincare_validation_1 = require("../validation/skincare.validation");
const RatingBar_1 = require("../../../shared/components/inputs/RatingBar");
const SkincareLogForm = function SkincareLogForm({ visible, routine, isSubmitting = false, onClose, onSubmit, }) {
    const [completedStepIds, setCompletedStepIds] = (0, react_1.useState)(routine.steps.map((s) => s.id));
    const { control, handleSubmit, setValue } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(skincare_validation_1.skincareLogSchema),
        defaultValues: {
            skincareRoutineId: routine.id,
            coreRoutineId: routine.routineId,
            dateStr: new Date().toISOString().split('T')[0],
            timeStr: new Date().toTimeString().split(' ')[0].substring(0, 5),
            completedStepIds: routine.steps.map((s) => s.id),
            skippedStepIds: [],
            appliedProductIds: routine.steps.map((s) => s.productId),
            skinFeeling: 4,
            weather: 'sunny',
            notes: '',
        },
    });
    const toggleStep = (stepId, productId) => {
        let updatedCompleted;
        if (completedStepIds.includes(stepId)) {
            updatedCompleted = completedStepIds.filter((id) => id !== stepId);
        }
        else {
            updatedCompleted = [...completedStepIds, stepId];
        }
        setCompletedStepIds(updatedCompleted);
        setValue('completedStepIds', updatedCompleted);
        const skipped = routine.steps.filter((s) => !updatedCompleted.includes(s.id)).map((s) => s.id);
        setValue('skippedStepIds', skipped);
        const appliedProds = routine.steps
            .filter((s) => updatedCompleted.includes(s.id))
            .map((s) => s.productId);
        setValue('appliedProductIds', appliedProds);
    };
    const onFormSubmit = async (data) => {
        await onSubmit(data);
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.Modal, { visible: visible, animationType: "slide", transparent: true, onRequestClose: onClose, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-black/80 justify-end", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 max-h-[85%] gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between border-b border-zinc-800 pb-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase", children: "Log Execution" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-50 text-lg font-bold", children: [routine.timeOfDayLabel, " Routine"] })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: onClose, className: "p-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-lg font-bold", children: "\u2715" }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { contentContainerStyle: { gap: 16 }, showsVerticalScrollIndicator: false, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Check Completed Steps" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-2", children: routine.steps.map((step) => {
                                            const isChecked = completedStepIds.includes(step.id);
                                            return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => toggleStep(step.id, step.productId), className: `p-3 rounded-xl border flex-row items-center justify-between ${isChecked
                                                    ? 'bg-emerald-500/10 border-emerald-500/40'
                                                    : 'bg-zinc-950 border-zinc-800'}`, children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2 flex-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-sm", children: isChecked ? '✅' : '⚪' }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: `text-xs font-semibold ${isChecked ? 'text-zinc-100' : 'text-zinc-400 line-through'}`, children: ["Step ", step.stepOrder, ": ", step.productName] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px]", children: step.productCategoryLabel })] })] }) }, step.id));
                                        }) })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "skinFeeling", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(RatingBar_1.RatingBar, { label: "Skin Feeling After Routine", value: typeof value === 'number' ? value : 4, max: 5, activeColor: "#10b981", onChange: onChange })) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Weather Condition" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weather", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: ['sunny', 'cloudy', 'rainy', 'humid', 'cold'].map((w) => {
                                                const isSelected = value === w;
                                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => onChange(w), className: `px-3 py-1 rounded-xl border ${isSelected
                                                        ? 'bg-pink-500/20 border-pink-500/50'
                                                        : 'bg-zinc-950 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold capitalize ${isSelected ? 'text-pink-400' : 'text-zinc-400'}`, children: w }) }, w));
                                            }) })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Execution Notes" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "notes", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-xs", placeholder: "e.g. Skin felt extra hydrated, no stinging", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: handleSubmit(onFormSubmit), disabled: isSubmitting, className: "bg-emerald-600 p-3.5 rounded-xl items-center justify-center mt-3 shadow-lg", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-sm font-bold", children: isSubmitting ? 'Saving Execution Log...' : 'Confirm & Save Routine Execution' }) })] })] }) }) }));
};
exports.SkincareLogForm = SkincareLogForm;
