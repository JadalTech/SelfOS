"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularProgress = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.CircularProgress = react_1.default.memo(function CircularProgress({ progress, size = 120, strokeWidth = 10, activeColor = '#ec4899', // pink-500
inactiveColor = '#27272a', // zinc-800
label, subLabel, }) {
    const percentage = Math.min(100, Math.max(0, Math.round(progress * 100)));
    // A premium concentric gauge designed using standard React Native Views for cross-platform stability
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: { width: size, height: size }, className: "items-center justify-center relative", accessible: true, accessibilityRole: "progressbar", accessibilityLabel: `${label || 'Progress'}: ${percentage}%`, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: inactiveColor,
            }, className: "absolute items-center justify-center", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: {
                    width: size - strokeWidth * 2,
                    height: size - strokeWidth * 2,
                    borderRadius: (size - strokeWidth * 2) / 2,
                    backgroundColor: '#09090b', // zinc-950
                }, className: "items-center justify-center p-3", children: [label ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-xl font-extrabold tracking-tight", children: label })) : ((0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-50 text-xl font-extrabold tracking-tight", children: [percentage, "%"] })), subLabel ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-[10px] font-semibold uppercase mt-0.5 tracking-wider", children: subLabel })) : null] }) }) }));
});
