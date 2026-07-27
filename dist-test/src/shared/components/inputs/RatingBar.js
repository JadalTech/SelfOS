"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.RatingBar = react_1.default.memo(function RatingBar({ value, max = 5, label, onChange, activeColor = '#ec4899', disabled = false, }) {
    const steps = Array.from({ length: max }, (_, i) => i + 1);
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", accessible: true, accessibilityRole: "adjustable", accessibilityLabel: `${label || 'Rating'}: ${value} out of ${max}`, children: [label ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-medium", children: label }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-200 text-xs font-bold", children: [value, " / ", max] })] })) : null, (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row gap-1.5 items-center", children: steps.map((num) => {
                    const isActive = num <= value;
                    const isSelected = num === value;
                    if (onChange && !disabled) {
                        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.7, onPress: () => onChange(num), accessible: true, accessibilityRole: "button", accessibilityLabel: `Set rating to ${num}`, hitSlop: { top: 6, bottom: 6, left: 2, right: 2 }, className: "flex-1 h-9 rounded-lg items-center justify-center border", style: {
                                backgroundColor: isActive ? `${activeColor}20` : '#18181b',
                                borderColor: isSelected ? activeColor : isActive ? `${activeColor}50` : '#27272a',
                            }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs font-semibold", style: { color: isActive ? activeColor : '#71717a' }, children: num }) }, num));
                    }
                    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 h-2 rounded-full overflow-hidden bg-zinc-800", style: {
                            backgroundColor: isActive ? activeColor : '#27272a',
                        } }, num));
                }) })] }));
});
