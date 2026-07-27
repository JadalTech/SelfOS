"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineLoader = InlineLoader;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
function InlineLoader({ size = 'small', label, color = '#6366f1', }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-center py-3 gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { size: size, color: color }), label ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-muted-foreground text-sm", children: label })) : null] }));
}
