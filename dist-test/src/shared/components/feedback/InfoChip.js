"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoChip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.InfoChip = react_1.default.memo(function InfoChip({ label, type = 'default', icon, }) {
    const typeStyles = {
        default: { bg: 'bg-zinc-800 border-zinc-700/60', text: 'text-zinc-300' },
        success: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400' },
        warning: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400' },
        error: { bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-400' },
        accent: { bg: 'bg-pink-500/15 border-pink-500/30', text: 'text-pink-400' },
    };
    const style = typeStyles[type];
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: `flex-row items-center gap-1.5 px-2.5 py-1 rounded-full border ${style.bg}`, accessible: true, accessibilityRole: "text", accessibilityLabel: label, children: [icon ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs", style: { color: style.text.replace('text-', '') }, children: icon })) : null, (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-[10px] font-bold uppercase tracking-wider ${style.text}`, children: label })] }));
});
