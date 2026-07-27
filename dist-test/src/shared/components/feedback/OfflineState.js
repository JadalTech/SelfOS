"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.OfflineState = react_1.default.memo(function OfflineState({ message = 'You are currently offline. Viewing cached local data.', }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex-row items-center justify-center gap-2", accessible: true, accessibilityRole: "alert", accessibilityLabel: message, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-300 text-[10px] font-bold uppercase tracking-wider text-center", children: message })] }));
});
