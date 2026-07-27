"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionBadge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ConditionBadge = react_1.default.memo(function ConditionBadge({ label, value, colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30' }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: `px-2.5 py-1 rounded-lg border flex-row items-center gap-1.5 ${colorClass}`, children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-[10px] font-semibold opacity-75", children: [label, ":"] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs font-bold", children: value })] }));
});
