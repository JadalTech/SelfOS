"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentActivityCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
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
exports.RecentActivityCard = react_1.default.memo(function RecentActivityCard({ activities }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Recent Activity Log" }), activities.length === 0 ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs py-3 text-center", children: "No activity logs recorded yet." })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-2", children: activities.map((act) => {
                    const icon = TYPE_ICONS[act.type] ?? '🎯';
                    const statusColor = act.status === 'completed'
                        ? 'text-emerald-400 font-semibold'
                        : act.status === 'skipped'
                            ? 'text-amber-400 font-semibold'
                            : 'text-rose-400 font-semibold';
                    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between bg-zinc-950/60 border border-zinc-800/60 p-3 rounded-xl", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3 flex-1 pr-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-base", children: icon }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 text-xs font-bold", numberOfLines: 1, children: act.title }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-[10px]", children: [act.date, " at ", act.time] })] })] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs capitalize ${statusColor}`, children: act.status })] }, act.id));
                }) }))] }));
});
