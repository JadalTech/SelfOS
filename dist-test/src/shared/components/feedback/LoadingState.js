"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.LoadingState = react_1.default.memo(function LoadingState({ message = 'Loading...', inline = false, color = '#ec4899', }) {
    if (inline) {
        return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-center p-4 gap-2.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { size: "small", color: color }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: message })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-zinc-950 items-center justify-center p-6 gap-3.5", accessible: true, accessibilityRole: "image", accessibilityLabel: message, children: [(0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { size: "large", color: color }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-sm font-bold tracking-tight", children: message })] }));
});
