"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullScreenLoader = FullScreenLoader;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
function FullScreenLoader({ message }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-background items-center justify-center", children: [(0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { size: "large", color: "#6366f1" }), message ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-muted-foreground text-sm mt-4", children: message })) : null] }));
}
