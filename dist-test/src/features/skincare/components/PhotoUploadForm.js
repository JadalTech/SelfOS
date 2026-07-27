"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoUploadForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const skincare_validation_1 = require("../validation/skincare.validation");
const skincare_constants_1 = require("../constants/skincare.constants");
const PhotoUploadForm = function PhotoUploadForm({ visible, isSubmitting = false, onClose, onSubmit, }) {
    const { control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(skincare_validation_1.progressPhotoUploadSchema),
        defaultValues: {
            photoUri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
            date: new Date().toISOString().split('T')[0],
            timeOfDay: 'morning',
            angle: 'front',
            lightingCondition: 'natural-daylight',
            notes: '',
        },
    });
    const onFormSubmit = async (data) => {
        await onSubmit(data);
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.Modal, { visible: visible, animationType: "slide", transparent: true, onRequestClose: onClose, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-black/80 justify-end", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 max-h-[85%] gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between border-b border-zinc-800 pb-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-lg font-bold", children: "Add Progress Photo" }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: onClose, className: "p-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-lg font-bold", children: "\u2715" }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { contentContainerStyle: { gap: 16 }, showsVerticalScrollIndicator: false, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Photo File Path / URL *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "photoUri", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm", placeholder: "file:///... or image URL", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) }), errors.photoUri ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs", children: errors.photoUri.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Capture Date (YYYY-MM-DD) *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "date", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm", onBlur: onBlur, onChangeText: onChange, value: value })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Photo Angle *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "angle", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: skincare_constants_1.PHOTO_ANGLE_OPTIONS.map((opt) => {
                                                const isSelected = value === opt.value;
                                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => onChange(opt.value), className: `px-3 py-1.5 rounded-xl border ${isSelected
                                                        ? 'bg-cyan-500/20 border-cyan-500/50'
                                                        : 'bg-zinc-950 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-cyan-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                                            }) })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Lighting / Notes" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "notes", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-xs", placeholder: "e.g. Natural daylight, 1 week after starting vitamin C", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: handleSubmit(onFormSubmit), disabled: isSubmitting, className: "bg-cyan-600 p-3.5 rounded-xl items-center justify-center mt-3 shadow-lg", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-sm font-bold", children: isSubmitting ? 'Uploading...' : 'Save Progress Photo' }) })] })] }) }) }));
};
exports.PhotoUploadForm = PhotoUploadForm;
