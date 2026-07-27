"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyProgressCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.WeeklyProgressCard = react_1.default.memo(function WeeklyProgressCard({ weekly }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "7-Day Activity Matrix" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-emerald-400 text-xs font-bold", children: [weekly.activeWeeklyDaysCount, " / 7 days active"] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row justify-between gap-1.5 pt-1", children: weekly.days.map((day) => {
                    let circleBg = 'bg-zinc-800 border-zinc-700';
                    let circleText = 'text-zinc-500';
                    if (day.isCompleted) {
                        circleBg = 'bg-emerald-500 border-emerald-400';
                        circleText = 'text-zinc-950 font-bold';
                    }
                    else if (day.isScheduled) {
                        circleBg = 'bg-zinc-800 border-amber-500/60';
                        circleText = 'text-amber-400';
                    }
                    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center gap-1.5 flex-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: `w-9 h-9 rounded-xl items-center justify-center border ${circleBg} ${day.isToday ? 'ring-2 ring-emerald-500' : ''}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs ${circleText}`, children: day.isCompleted ? '✓' : day.isScheduled ? '•' : '' }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-[10px] ${day.isToday ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`, children: day.dayName })] }, day.dateStr));
                }) })] }));
});
