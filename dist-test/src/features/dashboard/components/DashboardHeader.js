"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardHeader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.DashboardHeader = react_1.default.memo(function DashboardHeader({ greeting }) {
    const avatarInitial = greeting.name.trim().charAt(0).toUpperCase() || 'U';
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between pb-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-0.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs font-semibold uppercase tracking-wider", children: greeting.formattedDate }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-sm font-medium", children: greeting.greetingText }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-extrabold tracking-tight", children: greeting.name })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 items-center justify-center shadow-md", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-emerald-400 font-extrabold text-lg", children: avatarInitial }) })] }));
});
