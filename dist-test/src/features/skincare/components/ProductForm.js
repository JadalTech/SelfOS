"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const skincare_validation_1 = require("../validation/skincare.validation");
const skincare_constants_1 = require("../constants/skincare.constants");
const ProductForm = function ProductForm({ visible, initialValues, isSubmitting = false, onClose, onSubmit, }) {
    const { control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(skincare_validation_1.skincareProductSchema),
        defaultValues: {
            name: initialValues?.name || '',
            brand: initialValues?.brand || '',
            category: initialValues?.category || 'moisturizer',
            type: initialValues?.type || 'cream',
            keyIngredients: initialValues?.keyIngredients || [],
            openedDate: initialValues?.openedDate || '',
            shelfLifeMonths: initialValues?.shelfLifeMonths || 12,
            isFavorite: initialValues?.isFavorite ?? false,
            notes: initialValues?.notes || '',
        },
    });
    const onFormSubmit = async (data) => {
        await onSubmit(data);
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.Modal, { visible: visible, animationType: "slide", transparent: true, onRequestClose: onClose, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-black/80 justify-end", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 max-h-[85%] gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between border-b border-zinc-800 pb-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-lg font-bold", children: initialValues ? 'Edit Skincare Product' : 'Add Skincare Product' }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: onClose, className: "p-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-lg font-bold", children: "\u2715" }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { contentContainerStyle: { gap: 16 }, showsVerticalScrollIndicator: false, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Brand Name *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "brand", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm", placeholder: "e.g. CeraVe, La Roche-Posay, Paula's Choice", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) }), errors.brand ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs", children: errors.brand.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Product Name *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "name", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm", placeholder: "e.g. Hydrating Facial Cleanser", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) }), errors.name ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs", children: errors.name.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Product Category *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "category", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: skincare_constants_1.PRODUCT_CATEGORY_OPTIONS.map((opt) => {
                                                const isSelected = value === opt.value;
                                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => onChange(opt.value), className: `px-3 py-1.5 rounded-xl border ${isSelected
                                                        ? 'bg-pink-500/20 border-pink-500/50'
                                                        : 'bg-zinc-950 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-pink-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                                            }) })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Texture / Formula Type *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "type", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: skincare_constants_1.PRODUCT_TYPE_OPTIONS.map((opt) => {
                                                const isSelected = value === opt.value;
                                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => onChange(opt.value), className: `px-3 py-1.5 rounded-xl border ${isSelected
                                                        ? 'bg-emerald-500/20 border-emerald-500/50'
                                                        : 'bg-zinc-950 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                                            }) })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Active Ingredients (comma separated)" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "keyIngredients", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm", placeholder: "e.g. Niacinamide, Salicylic Acid, Hyaluronic Acid", placeholderTextColor: "#71717a", onChangeText: (val) => onChange(val
                                                .split(',')
                                                .map((s) => s.trim())
                                                .filter(Boolean)), value: Array.isArray(value) ? value.join(', ') : '' })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Shelf Life (Months)" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "shelfLifeMonths", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm", placeholder: "12", placeholderTextColor: "#71717a", keyboardType: "number-pad", onChangeText: (val) => onChange(parseInt(val, 10) || 12), value: value ? String(value) : '12' })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: handleSubmit(onFormSubmit), disabled: isSubmitting, className: "bg-pink-600 p-3.5 rounded-xl items-center justify-center mt-3 shadow-lg", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-sm font-bold", children: isSubmitting ? 'Saving...' : initialValues ? 'Update Product' : 'Add Product' }) })] })] }) }) }));
};
exports.ProductForm = ProductForm;
