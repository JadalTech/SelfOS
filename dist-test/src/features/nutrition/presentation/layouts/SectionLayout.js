"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.SectionLayout = react_1.default.memo(function SectionLayout({ title, children, subtitle, actionLabel, onAction, actionColor = '#ec4899', }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3 w-full", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 pr-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-base font-extrabold tracking-tight", children: title }), subtitle ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs mt-0.5", children: subtitle })) : null] }), actionLabel && onAction ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: onAction, accessible: true, accessibilityRole: "button", accessibilityLabel: actionLabel, hitSlop: { top: 8, bottom: 8, left: 12, right: 12 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs font-bold", style: { color: actionColor }, children: actionLabel }) })) : null] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-full", children: children })] }));
});
