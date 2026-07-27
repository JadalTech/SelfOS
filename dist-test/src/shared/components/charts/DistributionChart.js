"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionChart = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.DistributionChart = react_1.default.memo(function DistributionChart({ title, segments, }) {
    const activeSegments = segments.filter((s) => s.percentage > 0);
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm gap-3", accessible: true, accessibilityRole: "image", accessibilityLabel: `Distribution split: ${segments.map((s) => `${s.label} ${s.percentage}%`).join(', ')}`, children: [title ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: title })) : null, (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "h-6 w-full rounded-xl overflow-hidden flex-row bg-zinc-850", children: activeSegments.map((seg, idx) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                        width: `${seg.percentage}%`,
                        backgroundColor: seg.color,
                    }, className: "h-full items-center justify-center", children: seg.percentage >= 15 ? ((0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-950 text-[10px] font-extrabold", children: [seg.percentage, "%"] })) : null }, idx))) }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-x-4 gap-y-1.5 mt-1", children: segments.map((seg, idx) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { style: { backgroundColor: seg.color }, className: "w-2.5 h-2.5 rounded-full" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-medium", children: [seg.label, " ", (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-300 font-bold", children: ["(", seg.percentage, "%)"] })] })] }, idx))) })] }));
});
