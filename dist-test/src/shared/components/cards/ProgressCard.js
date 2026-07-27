"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const CircularProgress_1 = require("../loaders/CircularProgress");
const LinearProgress_1 = require("../loaders/LinearProgress");
exports.ProgressCard = react_1.default.memo(function ProgressCard({ title, value, progress, type = 'linear', activeColor = '#ec4899', subLabel, }) {
    const percentage = Math.min(100, Math.max(0, Math.round(progress * 100)));
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm justify-between gap-3", accessible: true, accessibilityRole: "summary", accessibilityLabel: `${title}: ${value}. ${percentage}% complete.`, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-medium uppercase tracking-wider", children: title }), subLabel ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-medium", children: subLabel })) : null] }), type === 'circular' ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "items-center py-2", children: (0, jsx_runtime_1.jsx)(CircularProgress_1.CircularProgress, { progress: progress, label: value.toString(), subLabel: `${percentage}%`, activeColor: activeColor }) })) : ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-bold tracking-tight", children: value }), (0, jsx_runtime_1.jsx)(LinearProgress_1.LinearProgress, { progress: progress, activeColor: activeColor })] }))] }));
});
