"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreakOverviewCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.StreakOverviewCard = react_1.default.memo(function StreakOverviewCard({ stats }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-amber-950/30 border border-amber-800/50 rounded-2xl p-4 gap-2", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-500 text-xs font-semibold uppercase tracking-wider", children: "Best Active Streak" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-bold", children: "\uD83D\uDD25 Longest Record" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-baseline gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-3xl font-black", children: stats.topStreakCount }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-sm font-medium", children: "consecutive days" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs", numberOfLines: 1, children: ["Top performer: ", (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 font-bold", children: stats.topStreakTitle })] })] }));
});
