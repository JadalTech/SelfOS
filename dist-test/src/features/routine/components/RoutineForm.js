"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const routine_validation_1 = require("../validation/routine.validation");
const ScheduleSelector_1 = require("./ScheduleSelector");
const ReminderPicker_1 = require("./ReminderPicker");
const components_1 = require("@/shared/components");
const ROUTINE_TYPES = [
    { type: 'haircare', label: 'Haircare', icon: '💇‍♂️' },
    { type: 'skincare', label: 'Skincare', icon: '🧴' },
    { type: 'water', label: 'Water', icon: '💧' },
    { type: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { type: 'gym', label: 'Gym', icon: '🏋️‍♂️' },
    { type: 'sleep', label: 'Sleep', icon: '😴' },
    { type: 'medication', label: 'Meds', icon: '💊' },
    { type: 'custom', label: 'Custom', icon: '🎯' },
];
const DEFAULT_FORM_VALUES = {
    title: '',
    description: '',
    type: 'haircare',
    status: 'active',
    schedule: {
        frequency: 'daily',
        interval: 1,
        startDate: new Date().toISOString().split('T')[0],
        timezone: 'Asia/Kolkata',
    },
    reminders: [],
};
exports.RoutineForm = react_1.default.memo(function RoutineForm({ initialValues, submitLabel = 'Save Routine', isSubmitting = false, onSubmit, }) {
    const defaultValues = {
        ...DEFAULT_FORM_VALUES,
        ...initialValues,
        schedule: {
            ...DEFAULT_FORM_VALUES.schedule,
            ...initialValues?.schedule,
        },
    };
    const { control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(routine_validation_1.routineFormSchema),
        defaultValues,
    });
    const watchedSchedule = (0, react_hook_form_1.useWatch)({ control, name: 'schedule' });
    return ((0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 20 }, showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: "handled", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Routine Name *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "title", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: `bg-zinc-900 border ${errors.title ? 'border-rose-500' : 'border-zinc-800'} rounded-xl px-4 py-3 text-zinc-100 text-base font-semibold`, placeholder: "e.g. Ketoconazole Scalp Wash", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) }), errors.title ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-500 text-xs font-medium mt-0.5", children: errors.title.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Description (Optional)" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "description", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm font-normal min-h-[80px]", placeholder: "Add notes, steps, or products...", placeholderTextColor: "#71717a", multiline: true, numberOfLines: 3, onBlur: onBlur, onChangeText: onChange, value: value ?? '' })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Category Type" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "type", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: ROUTINE_TYPES.map((item) => {
                                const isSelected = value === item.type;
                                return ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { className: `px-3 py-2 rounded-xl flex-row items-center gap-1.5 border ${isSelected
                                        ? 'bg-emerald-500/10 border-emerald-500'
                                        : 'bg-zinc-900 border-zinc-800'}`, onPress: () => onChange(item.type), accessibilityRole: "button", accessibilityLabel: `Select category ${item.label}`, accessibilityState: { selected: isSelected }, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-base", children: item.icon }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`, children: item.label })] }, item.type));
                            }) })) })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "schedule", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(ScheduleSelector_1.ScheduleSelector, { value: value, onChange: onChange, errors: {
                        daysOfWeek: errors.schedule?.daysOfWeek?.message,
                    } })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "reminders", render: ({ field: { onChange, value } }) => {
                    const firstReminder = value && value.length > 0 ? value[0] : undefined;
                    return ((0, jsx_runtime_1.jsx)(ReminderPicker_1.ReminderPicker, { reminder: firstReminder, timezone: watchedSchedule?.timezone ?? 'Asia/Kolkata', onChange: (updated) => {
                            onChange(updated ? [updated] : []);
                        } }));
                } }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Initial Status" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "status", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row gap-2", children: ['active', 'paused', 'draft'].map((st) => {
                                const isSelected = value === st;
                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `flex-1 py-2.5 rounded-xl border items-center justify-center capitalize ${isSelected
                                        ? 'bg-zinc-800 border-zinc-600'
                                        : 'bg-zinc-900 border-zinc-800'}`, onPress: () => onChange(st), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold capitalize ${isSelected ? 'text-zinc-100' : 'text-zinc-400'}`, children: st }) }, st));
                            }) })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "mt-4 bg-emerald-500 active:bg-emerald-600 py-4 rounded-xl items-center justify-center shadow-lg shadow-emerald-500/20", onPress: handleSubmit((data) => void onSubmit(data)), disabled: isSubmitting, accessibilityRole: "button", accessibilityLabel: submitLabel, children: isSubmitting ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "Saving...", color: "#09090b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-base", children: submitLabel })) })] }));
});
