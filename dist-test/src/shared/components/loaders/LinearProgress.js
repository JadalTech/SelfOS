"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearProgress = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.LinearProgress = react_1.default.memo(function LinearProgress({ progress, height = 8, activeColor = '#ec4899', inactiveColor = '#27272a', label, valueLabel, }) {
    const percentage = Math.min(100, Math.max(0, Math.round(progress * 100)));
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "w-full gap-1.5", accessible: true, accessibilityRole: "progressbar", accessibilityLabel: `${label || 'Progress'}: ${percentage}%`, children: [label || valueLabel ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [label ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: label })) : null, valueLabel ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 text-xs font-bold", children: valueLabel })) : null] })) : null, (0, jsx_runtime_1.jsx)(react_native_1.View, { style: { height, backgroundColor: inactiveColor }, className: "w-full rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: activeColor,
                    }, className: "rounded-full" }) })] }));
});
