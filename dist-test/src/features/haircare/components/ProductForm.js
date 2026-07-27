"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const haircare_validation_1 = require("../validation/haircare.validation");
const components_1 = require("@/shared/components");
const CATEGORY_OPTIONS = [
    { label: 'Shampoo', value: 'shampoo' },
    { label: 'Conditioner', value: 'conditioner' },
    { label: 'Hair Oil', value: 'oil' },
    { label: 'Serum', value: 'serum' },
    { label: 'Deep Mask', value: 'mask' },
    { label: 'Treatment', value: 'treatment' },
    { label: 'Custom', value: 'custom' },
];
exports.ProductForm = react_1.default.memo(function ProductForm({ initialValues, onSubmit, isSubmitting = false, submitLabel = 'Save Product', }) {
    const { control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(haircare_validation_1.hairProductSchema),
        defaultValues: {
            name: initialValues?.name || '',
            brand: initialValues?.brand || '',
            category: initialValues?.category || 'shampoo',
            isFavorite: initialValues?.isFavorite ?? false,
            isActive: initialValues?.isActive ?? true,
            notes: initialValues?.notes || '',
        },
    });
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Product Name" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "name", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-sm font-medium focus:border-emerald-500", placeholder: "e.g. Ketoconazole 2% Shampoo", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) }), errors.name ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-500 text-xs font-medium", children: errors.name.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Brand / Manufacturer" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "brand", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-sm font-medium focus:border-emerald-500", placeholder: "e.g. Nizoral / Ordinary", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) }), errors.brand ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-500 text-xs font-medium", children: errors.brand.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Category" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "category", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: CATEGORY_OPTIONS.map((opt) => {
                                const isSelected = value === opt.value;
                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-3 py-2 rounded-xl border ${isSelected
                                        ? 'bg-amber-500/20 border-amber-500'
                                        : 'bg-zinc-950 border-zinc-800'}`, onPress: () => onChange(opt.value), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                            }) })) })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "isFavorite", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { className: "flex-row items-center justify-between bg-zinc-950 border border-zinc-800 p-3 rounded-xl", onPress: () => onChange(!value), children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 text-xs font-semibold", children: "Mark as Favorite \u2B50" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-base", children: value ? '✓' : '○' })] })) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Usage Notes (Optional)" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "notes", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-sm font-medium focus:border-emerald-500 min-h-[70px]", placeholder: "e.g. Leave on scalp for 5 minutes before rinsing.", placeholderTextColor: "#71717a", multiline: true, onBlur: onBlur, onChangeText: onChange, value: value || '' })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-emerald-500 active:bg-emerald-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-emerald-500/20", onPress: handleSubmit((vals) => void onSubmit(vals)), disabled: isSubmitting, accessibilityRole: "button", children: isSubmitting ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "Saving product...", color: "#09090b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-sm", children: submitLabel })) })] }));
});
