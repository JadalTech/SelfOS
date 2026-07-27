"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairLogForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const haircare_validation_1 = require("../validation/haircare.validation");
const components_1 = require("@/shared/components");
exports.HairLogForm = react_1.default.memo(function HairLogForm({ routine, availableProducts, onSubmit, isSubmitting = false }) {
    const defaultProductIds = routine.products.map((p) => p.id);
    const { control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(haircare_validation_1.hairLogSchema),
        defaultValues: {
            hairRoutineId: routine.id,
            appliedProductIds: defaultProductIds.length > 0 ? defaultProductIds : availableProducts.map((p) => p.id),
            notes: '',
        },
    });
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: "Logging Completion" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-lg font-extrabold", children: routine.title })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Select Applied Products" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "appliedProductIds", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-2", children: availableProducts.map((p) => {
                                const isSelected = value.includes(p.id);
                                return ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { className: `flex-row items-center justify-between p-3 rounded-xl border ${isSelected
                                        ? 'bg-emerald-950/60 border-emerald-500/60'
                                        : 'bg-zinc-950 border-zinc-800'}`, onPress: () => {
                                        if (isSelected) {
                                            onChange(value.filter((id) => id !== p.id));
                                        }
                                        else {
                                            onChange([...value, p.id]);
                                        }
                                    }, children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-100 text-xs font-bold", children: [p.brand, " ", p.name] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-emerald-400 font-bold", children: isSelected ? '✓' : '+' })] }, p.id));
                            }) })) }), errors.appliedProductIds ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-500 text-xs font-medium", children: errors.appliedProductIds.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Notes / Scalp Observations" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "notes", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-sm font-medium focus:border-emerald-500 min-h-[60px]", placeholder: "e.g. Scalp felt refreshed after ketoconazole treatment.", placeholderTextColor: "#71717a", multiline: true, onBlur: onBlur, onChangeText: onChange, value: value || '' })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-emerald-500 active:bg-emerald-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-emerald-500/20", onPress: handleSubmit((vals) => void onSubmit(vals)), disabled: isSubmitting, accessibilityRole: "button", children: isSubmitting ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "Saving wash log...", color: "#09090b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-sm", children: "\u2713 Complete Wash Day" })) })] }));
});
