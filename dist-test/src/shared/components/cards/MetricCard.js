"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.MetricCard = react_1.default.memo(function MetricCard({ label, value, icon, color = '#ec4899', subLabel, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex-1 min-w-[120px] justify-between shadow-sm", accessible: true, accessibilityRole: "text", accessibilityLabel: `${label}: ${value}`, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between gap-1 mb-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: label }), icon ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-sm", style: { color }, children: icon })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "mt-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-lg font-bold tracking-tight", children: value }), subLabel ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-medium mt-0.5", children: subLabel })) : null] })] }));
});
