"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const PRIORITY_BADGES = {
    high: 'bg-rose-500/20 border-rose-500/40 text-rose-400',
    medium: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
    low: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
};
exports.RecommendationCard = react_1.default.memo(function RecommendationCard({ recommendation }) {
    const router = (0, expo_router_1.useRouter)();
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2.5 shadow-md", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xl", children: "\uD83D\uDCA1" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-sm font-extrabold", children: recommendation.title })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: `px-2 py-0.5 rounded-md border ${PRIORITY_BADGES[recommendation.priority]}`, children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-[10px] font-bold uppercase", children: [recommendation.priority, " priority"] }) })] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs leading-relaxed", children: recommendation.description }), recommendation.actionLabel && recommendation.actionRoute ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "self-start bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl mt-1", onPress: () => router.push(recommendation.actionRoute), accessibilityRole: "button", children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-amber-400 text-xs font-bold", children: [recommendation.actionLabel, " \u2192"] }) })) : null] }));
});
