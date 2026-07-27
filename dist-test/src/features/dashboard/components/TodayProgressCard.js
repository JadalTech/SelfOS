"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodayProgressCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.TodayProgressCard = react_1.default.memo(function TodayProgressCard({ progress }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-0.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Today's Focus" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-base font-extrabold", children: progress.statusText })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-end", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-emerald-400 text-2xl font-black", children: [progress.percentage, "%"] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] uppercase font-bold tracking-widest", children: "Completed" })] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "h-2.5 bg-zinc-800 rounded-full overflow-hidden w-full", children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "h-full bg-emerald-500 rounded-full", style: { width: `${Math.min(Math.max(progress.percentage, 0), 100)}%` } }) })] }));
});
