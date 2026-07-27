"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsGrid = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.StatsGrid = react_1.default.memo(function StatsGrid({ stats }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row flex-wrap gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 min-w-[140px] bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: "Active Routines" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-2xl font-extrabold", children: stats.activeRoutinesCount }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px]", children: "Tracked foundations" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 min-w-[140px] bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: "30-Day Rate" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-emerald-400 text-2xl font-extrabold", children: [stats.completionRate30Days, "%"] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px]", children: "Consistency score" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 min-w-[140px] bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: "Total Logs" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-2xl font-extrabold", children: stats.totalCompletionsAllTime }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px]", children: "Completed tasks" })] })] }));
});
