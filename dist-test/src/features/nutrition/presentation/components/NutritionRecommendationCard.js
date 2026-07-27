"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionRecommendationCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.NutritionRecommendationCard = react_1.default.memo(function NutritionRecommendationCard({ recommendation, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4.5 rounded-2xl shadow-sm gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between border-b border-zinc-850 pb-2.5", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 pr-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-sm font-extrabold tracking-tight", children: recommendation.title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs mt-0.5", children: recommendation.targetConcern })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg", children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-emerald-400 text-[9px] font-bold", children: [Math.round(recommendation.confidenceScore * 100), "% Match"] }) })] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-xs leading-relaxed", children: recommendation.summary }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2 mt-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: "Action Steps:" }), recommendation.actionableSteps.map((step, idx) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row gap-2.5 items-start pl-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-pink-400 text-xs font-bold mt-0.5", children: "\u2022" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-xs leading-relaxed flex-1", children: step })] }, idx)))] })] }));
});
