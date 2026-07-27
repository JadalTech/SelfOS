"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const completion_1 = require("../engine/completion");
const RoutineStatusBadge_1 = require("./RoutineStatusBadge");
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
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
exports.RoutineCard = react_1.default.memo(function RoutineCard({ routine, logs = [], onPress, }) {
    const icon = TYPE_ICONS[routine.type] ?? '🎯';
    // Compute status for today relative to routine timezone
    const todayStatus = (0, react_1.useMemo)(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return (0, completion_1.getRoutineStatusForDate)(routine, logs, todayStr);
    }, [routine, logs]);
    // Format human readable frequency summary string
    const frequencySummary = (0, react_1.useMemo)(() => {
        const { frequency, interval, daysOfWeek, daysOfMonth } = routine.schedule;
        if (frequency === 'daily') {
            return interval === 1 ? 'Every day' : `Every ${interval} days`;
        }
        if (frequency === 'weekly') {
            const daysStr = daysOfWeek?.map((d) => DAY_NAMES[d]).join(', ') ?? '';
            return interval === 1
                ? `Weekly (${daysStr})`
                : `Every ${interval} wks (${daysStr})`;
        }
        if (frequency === 'monthly') {
            const daysStr = daysOfMonth?.join(', ') ?? '';
            return interval === 1
                ? `Monthly (${daysStr})`
                : `Every ${interval} mos (${daysStr})`;
        }
        return `Custom (${interval} days)`;
    }, [routine.schedule]);
    const activeReminder = routine.reminders.find((r) => r.enabled);
    return ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { className: "bg-zinc-900/90 border border-zinc-800/80 active:border-zinc-700/80 rounded-2xl p-4 mb-3 gap-3 shadow-md", onPress: () => onPress(routine.id), accessibilityRole: "button", accessibilityLabel: `Routine ${routine.title}, ${frequencySummary}, Streak ${routine.currentStreak} days`, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3 flex-1 pr-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-10 h-10 rounded-xl bg-zinc-800/90 border border-zinc-700/50 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xl", children: icon }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-base font-bold tracking-tight numberOfLines={1}", children: routine.title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-medium", children: frequencySummary })] })] }), (0, jsx_runtime_1.jsx)(RoutineStatusBadge_1.RoutineStatusBadge, { status: todayStatus, size: "sm" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between pt-2 border-t border-zinc-800/60", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-1.5", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-amber-500 text-xs font-bold", children: ["\uD83D\uDD25 ", routine.currentStreak] }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-medium", children: ["day streak (Best: ", routine.longestStreak, ")"] })] }), activeReminder ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row items-center gap-1", children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs", children: ["\u23F0 ", activeReminder.time] }) })) : null] })] }));
});
