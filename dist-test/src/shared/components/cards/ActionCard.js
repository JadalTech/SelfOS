"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ActionCard = react_1.default.memo(function ActionCard({ title, description, icon, onPress, actionLabel, color = '#ec4899', }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: onPress, accessible: true, accessibilityRole: "button", accessibilityLabel: `${title}. ${description || ''}`, accessibilityHint: actionLabel ? `Tap to ${actionLabel.toLowerCase()}` : 'Tap to open', hitSlop: { top: 8, bottom: 8, left: 8, right: 8 }, className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-row items-center justify-between shadow-sm", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3.5 flex-1 pr-3", children: [icon ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: { backgroundColor: `${color}15`, borderColor: `${color}30` }, className: "w-10 h-10 rounded-xl items-center justify-center border", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-lg", children: icon }) })) : null, (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 gap-0.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-sm font-bold tracking-tight", children: title }), description ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs leading-relaxed", children: description })) : null] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-1", children: [actionLabel ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs font-bold mr-0.5", style: { color }, children: actionLabel })) : null, (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-sm font-bold", children: "\u2794" })] })] }));
});
