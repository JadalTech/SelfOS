"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const FrequencySelector_1 = require("./FrequencySelector");
const WEEKDAYS = [
    { label: 'S', value: 0 },
    { label: 'M', value: 1 },
    { label: 'T', value: 2 },
    { label: 'W', value: 3 },
    { label: 'T', value: 4 },
    { label: 'F', value: 5 },
    { label: 'S', value: 6 },
];
exports.ScheduleSelector = react_1.default.memo(function ScheduleSelector({ value, onChange, errors = {} }) {
    const handleFrequencyChange = (freq) => {
        onChange({
            ...value,
            frequency: freq,
            interval: 1,
            daysOfWeek: freq === 'weekly' ? [1, 3] : undefined, // Default Mon & Wed
            daysOfMonth: freq === 'monthly' ? [1, 15] : undefined, // Default 1st & 15th
        });
    };
    const toggleWeekday = (day) => {
        const currentDays = value.daysOfWeek ?? [];
        const updated = currentDays.includes(day)
            ? currentDays.filter((d) => d !== day)
            : [...currentDays, day].sort();
        onChange({
            ...value,
            daysOfWeek: updated,
        });
    };
    const handleIntervalChange = (text) => {
        const parsed = parseInt(text, 10);
        onChange({
            ...value,
            interval: isNaN(parsed) || parsed < 1 ? 1 : parsed,
        });
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-4", children: [(0, jsx_runtime_1.jsx)(FrequencySelector_1.FrequencySelector, { selectedFrequency: value.frequency, onChange: handleFrequencyChange }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Repeat Interval" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-sm mr-2", children: "Every" }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "text-zinc-100 font-bold text-sm min-w-[40px]", keyboardType: "number-pad", value: String(value.interval), onChangeText: handleIntervalChange, maxLength: 3 }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-sm ml-2", children: value.frequency === 'daily'
                                    ? 'day(s)'
                                    : value.frequency === 'weekly'
                                        ? 'week(s)'
                                        : value.frequency === 'monthly'
                                            ? 'month(s)'
                                            : 'days' })] })] }), value.frequency === 'weekly' ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Repeat On" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row justify-between gap-1", children: WEEKDAYS.map((day) => {
                            const isSelected = value.daysOfWeek?.includes(day.value);
                            return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `w-10 h-10 rounded-xl items-center justify-center border ${isSelected
                                    ? 'bg-emerald-500 border-emerald-400 shadow-sm'
                                    : 'bg-zinc-900 border-zinc-800'}`, onPress: () => toggleWeekday(day.value), accessibilityRole: "button", accessibilityLabel: `Select weekday ${day.label}`, accessibilityState: { selected: Boolean(isSelected) }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-sm font-bold ${isSelected ? 'text-zinc-950' : 'text-zinc-400'}`, children: day.label }) }, day.value));
                        }) }), errors.daysOfWeek ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-500 text-xs mt-1", children: errors.daysOfWeek })) : null] })) : null, (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Start Date" }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm font-medium", placeholder: "YYYY-MM-DD", placeholderTextColor: "#71717a", value: value.startDate, onChangeText: (startDate) => onChange({ ...value, startDate }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Timezone" }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm font-medium", placeholder: "Asia/Kolkata", placeholderTextColor: "#71717a", value: value.timezone, onChangeText: (timezone) => onChange({ ...value, timezone }) })] })] })] }));
});
