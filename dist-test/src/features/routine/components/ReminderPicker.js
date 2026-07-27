"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderPicker = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ReminderPicker = react_1.default.memo(function ReminderPicker({ reminder, timezone = 'UTC', onChange }) {
    const isEnabled = reminder?.enabled ?? false;
    const handleToggle = (enabled) => {
        if (enabled) {
            onChange({
                id: reminder?.id ?? 'rem-1',
                time: reminder?.time ?? '09:00',
                enabled: true,
            });
        }
        else {
            onChange(undefined);
        }
    };
    const handleTimeChange = (time) => {
        if (!reminder)
            return;
        onChange({
            ...reminder,
            time,
        });
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-0.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 font-bold text-sm", children: "Daily Reminder" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs", children: ["Get notified at your scheduled local time (", timezone, ")"] })] }), (0, jsx_runtime_1.jsx)(react_native_1.Switch, { value: isEnabled, onValueChange: handleToggle, trackColor: { false: '#27272a', true: '#10b981' }, thumbColor: isEnabled ? '#09090b' : '#71717a', accessibilityLabel: "Toggle daily reminder" })] }), isEnabled && reminder ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "pt-2 border-t border-zinc-800/80 flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Reminder Time (HH:mm)" }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-100 font-bold text-sm text-center min-w-[70px]", value: reminder.time, onChangeText: handleTimeChange, placeholder: "09:00", placeholderTextColor: "#71717a", maxLength: 5 })] })) : null] }));
});
