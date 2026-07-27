"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingRoutineCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.LoadingRoutineCard = react_1.default.memo(function LoadingRoutineCard() {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 mb-3 gap-3 animate-pulse", accessibilityLabel: "Loading routine details", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-10 h-10 rounded-xl bg-zinc-800" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-32 h-4 rounded bg-zinc-800" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-20 h-3 rounded bg-zinc-800/60" })] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-16 h-6 rounded-full bg-zinc-800" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between pt-2 border-t border-zinc-800/60", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-24 h-3 rounded bg-zinc-800/60" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-16 h-3 rounded bg-zinc-800/60" })] })] }));
});
