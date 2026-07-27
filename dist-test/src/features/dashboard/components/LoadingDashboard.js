"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingDashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.LoadingDashboard = react_1.default.memo(function LoadingDashboard() {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-zinc-950 p-4 gap-4 animate-pulse", accessibilityLabel: "Loading dashboard summary", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between pb-2", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-24 h-3 bg-zinc-800 rounded" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-36 h-4 bg-zinc-800 rounded" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-48 h-6 bg-zinc-800 rounded" })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-12 h-12 rounded-full bg-zinc-800" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "h-24 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-32 h-4 bg-zinc-800 rounded" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-full h-3 bg-zinc-800 rounded-full" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "h-36 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-40 h-4 bg-zinc-800 rounded" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-full h-12 bg-zinc-800/60 rounded-xl" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl" })] })] }));
});
