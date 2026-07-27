"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.SummaryCard = react_1.default.memo(function SummaryCard({ title, metrics, footerText, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm gap-3", accessible: true, accessibilityRole: "summary", accessibilityLabel: `${title || 'Summary Card'}`, children: [title ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-0.5", children: title })) : null, (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row gap-3", children: metrics.map((item, idx) => {
                    const color = item.color || '#ec4899';
                    const percentage = item.progress !== undefined ? Math.min(100, Math.round(item.progress * 100)) : null;
                    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: item.label }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-sm font-bold", children: item.value }), percentage !== null ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "h-1 bg-zinc-800 rounded-full overflow-hidden mt-1 w-full", children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: { width: `${percentage}%`, backgroundColor: color }, className: "h-full rounded-full" }) })) : null] }, idx));
                }) }), footerText ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-medium border-t border-zinc-800/60 pt-2 mt-1", children: footerText })) : null] }));
});
