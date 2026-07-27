"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.TrendCard = react_1.default.memo(function TrendCard({ title, value, targetValue, changePercent, metricUnit, isBetterLower = false, }) {
    const hasChange = changePercent !== undefined;
    const isPositive = hasChange ? changePercent > 0 : false;
    // Decide color representation
    const isGoodChange = hasChange
        ? (isPositive && !isBetterLower) || (!isPositive && isBetterLower)
        : false;
    const changeColorClass = isGoodChange ? 'text-emerald-400' : 'text-rose-400';
    const changePrefix = isPositive ? '+' : '';
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm justify-between gap-2", accessible: true, accessibilityRole: "text", accessibilityLabel: `${title}: ${value}. ${hasChange ? `Trend ${changePrefix}${changePercent}%` : ''}`, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: title }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-baseline gap-1.5 mt-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-bold tracking-tight", children: value }), metricUnit ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: metricUnit })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between border-t border-zinc-800/60 pt-2.5 mt-1", children: [targetValue ? ((0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-medium", children: ["Goal: ", (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 font-bold", children: targetValue })] })) : (0, jsx_runtime_1.jsx)(react_native_1.View, {}), hasChange ? ((0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: `text-xs font-bold ${changeColorClass}`, children: [changePrefix, changePercent, "%"] })) : null] })] }));
});
