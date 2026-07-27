"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairRoutineForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const haircare_validation_1 = require("../validation/haircare.validation");
const components_1 = require("@/shared/components");
const CATEGORY_OPTIONS = [
    { label: 'Wash Day', value: 'wash-day' },
    { label: 'Hair Oiling', value: 'oiling' },
    { label: 'Scalp Massage', value: 'scalp-massage' },
    { label: 'Deep Condition', value: 'deep-conditioning' },
    { label: 'Custom', value: 'custom' },
];
exports.HairRoutineForm = react_1.default.memo(function HairRoutineForm({ availableProducts, onSubmit, isSubmitting = false }) {
    const { control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(haircare_validation_1.hairRoutineSchema),
        defaultValues: {
            title: '',
            haircareCategory: 'wash-day',
            productIds: [],
            frequency: 'weekly',
            instructions: '',
        },
    });
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Routine Name" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "title", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-sm font-medium focus:border-emerald-500", placeholder: "e.g. Sunday Ketoconazole Wash Day", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) }), errors.title ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-500 text-xs font-medium", children: errors.title.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Haircare Category" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "haircareCategory", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: CATEGORY_OPTIONS.map((cat) => {
                                const isSelected = value === cat.value;
                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-3 py-2 rounded-xl border ${isSelected
                                        ? 'bg-emerald-500/20 border-emerald-500'
                                        : 'bg-zinc-950 border-zinc-800'}`, onPress: () => onChange(cat.value), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`, children: cat.label }) }, cat.value));
                            }) })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Link Hair Products" }), availableProducts.length === 0 ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-medium bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20", children: "No products found. Create a product first to link it to your wash day." })) : ((0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "productIds", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-2", children: availableProducts.map((p) => {
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
                                    }, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-100 text-xs font-bold", children: [p.brand, " ", p.name] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px]", children: p.categoryLabel })] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-emerald-400 font-bold", children: isSelected ? '✓' : '+' })] }, p.id));
                            }) })) })), errors.productIds ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-500 text-xs font-medium", children: errors.productIds.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Repeat Frequency" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "frequency", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row gap-2", children: ['daily', 'weekly', 'monthly'].map((freq) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `flex-1 py-2.5 rounded-xl border items-center capitalize ${value === freq
                                    ? 'bg-emerald-500/20 border-emerald-500'
                                    : 'bg-zinc-950 border-zinc-800'}`, onPress: () => onChange(freq), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold capitalize ${value === freq ? 'text-emerald-400' : 'text-zinc-400'}`, children: freq }) }, freq))) })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-emerald-500 active:bg-emerald-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-emerald-500/20", onPress: handleSubmit((vals) => void onSubmit(vals)), disabled: isSubmitting, accessibilityRole: "button", children: isSubmitting ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "Saving routine...", color: "#09090b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-sm", children: "Save Hair Routine" })) })] }));
});
