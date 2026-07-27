"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const nutrition_validation_1 = require("../../validation/nutrition.validation");
const nutrition_constants_1 = require("../../constants/nutrition.constants");
exports.TemplateForm = react_1.default.memo(function TemplateForm({ defaultValues, onSubmit, onCancel, isSubmitting = false, }) {
    const { control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(nutrition_validation_1.nutritionTemplateSchema),
        defaultValues: {
            title: '',
            mealType: 'breakfast',
            foods: [],
            ...defaultValues,
        },
    });
    return ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { paddingBottom: 24 }, showsVerticalScrollIndicator: false, children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-5", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-xs font-bold", children: "Template Title *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "title", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { value: value, onChangeText: onChange, placeholder: "e.g. Oatmeal Breakfast Bowl", placeholderTextColor: "#71717a", className: "bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm" })) }), errors.title && (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs font-medium", children: errors.title.message })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-xs font-bold", children: "Meal Type *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "mealType", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-1.5 mt-1", children: nutrition_constants_1.MEAL_TYPE_OPTIONS.map((cat) => {
                                    const isSel = cat.value === value;
                                    return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => onChange(cat.value), className: "px-3.5 py-2 rounded-xl border", style: {
                                            backgroundColor: isSel ? '#ec489915' : '#18181b',
                                            borderColor: isSel ? '#ec4899' : '#27272a',
                                        }, children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-xs font-bold", style: { color: isSel ? '#ec4899' : '#a1a1aa' }, children: [cat.icon, " ", cat.label] }) }, cat.value));
                                }) })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row gap-3 mt-4 border-t border-zinc-800/60 pt-5", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: onCancel, className: "flex-1 bg-zinc-900 border border-zinc-800 py-3 rounded-xl items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-bold uppercase tracking-wider", children: "Cancel" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { disabled: isSubmitting, onPress: handleSubmit(onSubmit), className: "flex-1 bg-pink-500 py-3 rounded-xl items-center justify-center", style: { opacity: isSubmitting ? 0.6 : 1 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 text-xs font-extrabold uppercase tracking-wider", children: "Save Template" }) })] })] }) }));
});
