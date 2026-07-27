"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.InsightCard = react_1.default.memo(function InsightCard({ card }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-2 shadow-md flex-1 min-w-[150px]", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-2xl", children: card.icon }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: card.type })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-0.5 mt-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-lg font-black tracking-tight", children: card.value }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-xs font-bold", children: card.title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-[10px] leading-tight", numberOfLines: 2, children: card.subtitle })] })] }));
});
