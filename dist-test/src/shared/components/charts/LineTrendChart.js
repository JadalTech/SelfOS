"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineTrendChart = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.LineTrendChart = react_1.default.memo(function LineTrendChart({ title, data, color = '#ec4899', unit = '', height = 140, }) {
    if (data.length === 0) {
        return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: { height }, className: "items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs font-semibold", children: "No chart data available" }) }));
    }
    const values = data.map((d) => d.value);
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values, 0);
    const valRange = maxVal - minVal;
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm gap-2", accessible: true, accessibilityRole: "image", accessibilityLabel: `Chart showing ${title || 'Trend'}`, children: [title ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1", children: title })) : null, (0, jsx_runtime_1.jsx)(react_native_1.View, { style: { height }, className: "flex-row items-end justify-between pt-4 pb-1 px-1", children: data.map((point, idx) => {
                    // Calculate height percentage relative to range
                    const pct = valRange > 0 ? (point.value - minVal) / valRange : 0.5;
                    const barHeight = Math.max(12, Math.round(pct * (height - 36)));
                    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center flex-1 gap-1.5", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-300 text-[10px] font-bold", children: [point.value, unit] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                                    height: barHeight,
                                    backgroundColor: color,
                                    width: 14,
                                    borderRadius: 4,
                                    opacity: 0.85,
                                } }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold mt-0.5", children: point.label })] }, idx));
                }) })] }));
});
