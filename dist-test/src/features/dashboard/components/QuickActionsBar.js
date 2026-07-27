"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickActionsBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const components_1 = require("@/shared/components");
const TYPE_ICONS = {
    haircare: '💇‍♂️',
    skincare: '🧴',
    water: '💧',
    nutrition: '🥗',
    gym: '🏋️‍♂️',
    sleep: '😴',
    medication: '💊',
    custom: '🎯',
};
exports.QuickActionsBar = react_1.default.memo(function QuickActionsBar({ topPendingRoutine, onComplete, onSkip, isActionPending = false, }) {
    if (!topPendingRoutine)
        return null;
    const icon = TYPE_ICONS[topPendingRoutine.type] ?? '🎯';
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2.5 flex-1 pr-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-8 h-8 rounded-lg bg-emerald-900/60 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-base", children: icon }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-[10px] font-bold uppercase tracking-wider", children: "Up Next Today" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-sm font-bold", numberOfLines: 1, children: topPendingRoutine.title })] })] }), topPendingRoutine.time ? ((0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-emerald-400 text-xs font-semibold", children: ["\u23F0 ", topPendingRoutine.time] })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row gap-2 pt-1 border-t border-emerald-900/40", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "flex-1 bg-emerald-500 active:bg-emerald-600 py-2.5 rounded-xl items-center justify-center shadow-sm", onPress: () => onComplete(topPendingRoutine.id), disabled: isActionPending, accessibilityRole: "button", accessibilityLabel: `Complete ${topPendingRoutine.title}`, children: isActionPending ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "...", color: "#09090b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-xs", children: "\u2713 Complete Now" })) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-4 py-2.5 bg-zinc-900 active:bg-zinc-800 border border-zinc-800 rounded-xl items-center justify-center", onPress: () => onSkip(topPendingRoutine.id), disabled: isActionPending, accessibilityRole: "button", accessibilityLabel: `Skip ${topPendingRoutine.title}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 font-semibold text-xs", children: "Skip" }) })] })] }));
});
