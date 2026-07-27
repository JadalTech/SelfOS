"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodayRoutinesList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const routine_1 = require("@/features/routine");
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
exports.TodayRoutinesList = react_1.default.memo(function TodayRoutinesList({ items, onItemPress, onViewAllPress }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: ["Today's Routines (", items.length, ")"] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: onViewAllPress, accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-emerald-400 text-xs font-semibold", children: "View All \u2192" }) })] }), items.length === 0 ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs py-3 text-center", children: "No routines scheduled for today. Take a break! \uD83C\uDF89" })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-2", children: items.map((item) => {
                    const icon = TYPE_ICONS[item.type] ?? '🎯';
                    return ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { className: "flex-row items-center justify-between bg-zinc-950/60 border border-zinc-800/60 p-3 rounded-xl active:border-zinc-700", onPress: () => onItemPress(item.id), accessibilityRole: "button", accessibilityLabel: `Open ${item.title}`, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3 flex-1 pr-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-lg", children: icon }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-sm font-bold", numberOfLines: 1, children: item.title }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-[10px]", children: ["\uD83D\uDD25 ", item.currentStreak, " day streak"] })] })] }), (0, jsx_runtime_1.jsx)(routine_1.RoutineStatusBadge, { status: item.status, size: "sm" })] }, item.id));
                }) }))] }));
});
