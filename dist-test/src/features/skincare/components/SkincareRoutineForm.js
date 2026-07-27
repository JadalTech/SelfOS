"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkincareRoutineForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const skincare_validation_1 = require("../validation/skincare.validation");
const skincare_constants_1 = require("../constants/skincare.constants");
const SkincareRoutineForm = function SkincareRoutineForm({ visible, availableProducts, isSubmitting = false, onClose, onSubmit, }) {
    const { control, handleSubmit, setValue, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(skincare_validation_1.skincareRoutineSchema),
        defaultValues: {
            title: 'Morning Skincare Routine',
            timeOfDay: 'morning',
            steps: [],
            targetedConcerns: [],
            frequency: 'daily',
        },
    });
    const currentTimeOfDay = (0, react_hook_form_1.useWatch)({ control, name: 'timeOfDay' });
    const [selectedSteps, setSelectedSteps] = (0, react_1.useState)([]);
    const toggleProductStep = (product) => {
        const existingIndex = selectedSteps.findIndex((s) => s.productId === product.id);
        let updated;
        if (existingIndex >= 0) {
            updated = selectedSteps.filter((s) => s.productId !== product.id);
        }
        else {
            updated = [
                ...selectedSteps,
                {
                    productId: product.id,
                    stepOrder: selectedSteps.length + 1,
                    timeOfDay: currentTimeOfDay || 'morning',
                    isOptional: false,
                    waitTimeMinutes: 0,
                },
            ];
        }
        // Re-index step orders
        updated = updated.map((s, idx) => ({ ...s, stepOrder: idx + 1 }));
        setSelectedSteps(updated);
        setValue('steps', updated);
    };
    const toggleConcern = (concern, currentList = []) => {
        let updated;
        if (currentList.includes(concern)) {
            updated = currentList.filter((c) => c !== concern);
        }
        else {
            updated = [...currentList, concern];
        }
        setValue('targetedConcerns', updated);
    };
    const onFormSubmit = async (data) => {
        const formattedSteps = selectedSteps.map((s, idx) => ({
            ...s,
            stepOrder: idx + 1,
            timeOfDay: data.timeOfDay,
            isOptional: false,
        }));
        await onSubmit({ ...data, steps: formattedSteps });
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.Modal, { visible: visible, animationType: "slide", transparent: true, onRequestClose: onClose, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-black/80 justify-end", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 max-h-[90%] gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between border-b border-zinc-800 pb-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-lg font-bold", children: "Routine Builder" }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: onClose, className: "p-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-lg font-bold", children: "\u2715" }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { contentContainerStyle: { gap: 16 }, showsVerticalScrollIndicator: false, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Routine Name *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "title", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm", placeholder: "e.g. Daily Glow Morning Routine", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) }), errors.title ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs", children: errors.title.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Time of Day *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "timeOfDay", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: skincare_constants_1.ROUTINE_TIME_OPTIONS.map((opt) => {
                                                const isSelected = value === opt.value;
                                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => onChange(opt.value), className: `px-3 py-1.5 rounded-xl border ${isSelected
                                                        ? 'bg-pink-500/20 border-pink-500/50'
                                                        : 'bg-zinc-950 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-pink-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                                            }) })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: ["Select Routine Products & Steps (", selectedSteps.length, " selected) *"] }), availableProducts.length === 0 ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs", children: "No active products available. Please add products to your vanity first." })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-2", children: availableProducts.map((prod) => {
                                            const stepItem = selectedSteps.find((s) => s.productId === prod.id);
                                            const isSelected = !!stepItem;
                                            return ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { onPress: () => toggleProductStep(prod), className: `p-3 rounded-xl border flex-row items-center justify-between ${isSelected
                                                    ? 'bg-pink-500/10 border-pink-500/40'
                                                    : 'bg-zinc-950 border-zinc-800'}`, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 pr-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 text-xs font-bold", children: prod.name }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-[10px]", children: [prod.brand, " \u2022 ", prod.categoryLabel] })] }), isSelected ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-6 h-6 rounded-full bg-pink-500 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-xs font-bold", children: stepItem.stepOrder }) })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-6 h-6 rounded-full border border-zinc-700 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-600 text-xs", children: "+" }) }))] }, prod.id));
                                        }) }))] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Targeted Skin Concerns" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "targetedConcerns", render: ({ field: { value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: skincare_constants_1.SKIN_CONCERN_OPTIONS.map((opt) => {
                                                const isSelected = (value || []).includes(opt.value);
                                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => toggleConcern(opt.value, value), className: `px-2.5 py-1 rounded-lg border ${isSelected
                                                        ? 'bg-amber-500/20 border-amber-500/50'
                                                        : 'bg-zinc-950 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-[11px] font-medium ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                                            }) })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: handleSubmit(onFormSubmit), disabled: isSubmitting || selectedSteps.length === 0, className: "bg-pink-600 p-3.5 rounded-xl items-center justify-center mt-3 shadow-lg", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-sm font-bold", children: isSubmitting ? 'Creating Routine...' : 'Save Skincare Routine' }) })] })] }) }) }));
};
exports.SkincareRoutineForm = SkincareRoutineForm;
