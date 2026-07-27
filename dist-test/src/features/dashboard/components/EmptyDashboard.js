"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyDashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.EmptyDashboard = react_1.default.memo(function EmptyDashboard({ onCreateRoutine }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 items-center gap-4 my-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-3xl", children: "\uD83D\uDE80" }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-lg font-bold text-center", children: "Welcome to SelfOS!" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center leading-relaxed max-w-xs", children: "Build your personal habit engine by creating your first daily or weekly routine." })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-emerald-500 active:bg-emerald-600 px-6 py-3.5 rounded-xl flex-row items-center justify-center shadow-lg shadow-emerald-500/20", onPress: onCreateRoutine, accessibilityRole: "button", accessibilityLabel: "Create your first routine", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-sm", children: "+ Create First Routine" }) })] }));
});
