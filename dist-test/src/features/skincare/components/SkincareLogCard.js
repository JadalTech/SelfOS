"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkincareLogCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.SkincareLogCard = react_1.default.memo(function SkincareLogCard({ log, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2 shadow-sm", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-sm font-bold", children: log.dateFormatted }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-xs", children: ["\u2022 ", log.timeFormatted] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30", children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-emerald-400 text-[10px] font-semibold", children: [log.completedStepsCount, " / ", log.totalStepsCount, " Steps Logged"] }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3 mt-1", children: [log.weatherLabel ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800", children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-[10px]", children: ["\uD83C\uDF24\uFE0F ", log.weatherLabel] }) })) : null, log.skinFeelingLabel ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800", children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-[10px]", children: ["Rating: ", log.skinFeelingLabel] }) })) : null] }), log.notes ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs italic mt-1 bg-zinc-950/60 p-2 rounded-lg", children: `"${log.notes}"` })) : null] }));
});
