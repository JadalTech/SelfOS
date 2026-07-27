"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineStatusBadge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.RoutineStatusBadge = react_1.default.memo(function RoutineStatusBadge({ status, size = 'md' }) {
    let badgeBg = 'bg-zinc-800/80 border-zinc-700';
    let textStyle = 'text-zinc-400';
    let label = 'Pending';
    switch (status) {
        case 'completed':
            badgeBg = 'bg-emerald-950/80 border-emerald-800/60';
            textStyle = 'text-emerald-400 font-semibold';
            label = 'Completed';
            break;
        case 'skipped':
            badgeBg = 'bg-amber-950/80 border-amber-800/60';
            textStyle = 'text-amber-400 font-semibold';
            label = 'Skipped';
            break;
        case 'missed':
            badgeBg = 'bg-rose-950/80 border-rose-800/60';
            textStyle = 'text-rose-400 font-semibold';
            label = 'Missed';
            break;
        case 'not-scheduled':
            badgeBg = 'bg-zinc-900 border-zinc-800';
            textStyle = 'text-zinc-500 font-medium';
            label = 'Off-Schedule';
            break;
        case 'pending':
        default:
            badgeBg = 'bg-zinc-900 border-zinc-800';
            textStyle = 'text-zinc-400 font-medium';
            label = 'Pending';
            break;
    }
    const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
    const textSize = size === 'sm' ? 'text-xs' : 'text-xs';
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: `rounded-full border ${badgeBg} ${padding} items-center justify-center`, accessibilityRole: "text", accessibilityLabel: `Status: ${label}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `${textSize} ${textStyle}`, children: label }) }));
});
