"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrequencySelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const FREQUENCY_OPTIONS = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Custom', value: 'custom' },
];
exports.FrequencySelector = react_1.default.memo(function FrequencySelector({ selectedFrequency, onChange }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Frequency" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl", children: FREQUENCY_OPTIONS.map((opt) => {
                    const isSelected = selectedFrequency === opt.value;
                    return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `flex-1 py-2.5 rounded-lg items-center justify-center ${isSelected ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-transparent'}`, onPress: () => onChange(opt.value), accessibilityRole: "button", accessibilityLabel: `Select frequency ${opt.label}`, accessibilityState: { selected: isSelected }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold ${isSelected ? 'text-zinc-950' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                }) })] }));
});
