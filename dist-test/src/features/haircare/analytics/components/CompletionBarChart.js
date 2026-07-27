"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionBarChart = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
exports.CompletionBarChart = react_1.default.memo(function CompletionBarChart({ weekly }) {
    const maxVal = Math.max(...Object.values(weekly.dailyCompletionMap), 1);
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-md", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Weekly Wash Frequency Breakdown" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-100 text-sm font-extrabold mt-0.5", children: ["Most Active Day: ", (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400", children: weekly.mostActiveDayLabel })] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg", children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-amber-400 text-xs font-black", children: [weekly.completionRate, "% Adherence"] }) })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row items-end justify-between h-32 pt-4 border-b border-zinc-800 pb-2", children: DAY_LABELS.map((dayLabel, index) => {
                    const count = weekly.dailyCompletionMap[index] || 0;
                    const heightPercent = Math.min(100, Math.max(12, (count / maxVal) * 100));
                    const hasData = count > 0;
                    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center flex-1 gap-1.5 h-full justify-end", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-[10px] font-bold", children: count }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: `w-full max-w-[24px] rounded-t-lg transition-all ${hasData ? 'bg-amber-500' : 'bg-zinc-800/60'}`, style: { height: `${heightPercent}%` } }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-medium", children: dayLabel })] }, dayLabel));
                }) })] }));
});
