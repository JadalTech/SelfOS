"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.SectionCard = react_1.default.memo(function SectionCard({ title, children, description, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm gap-2", children: [title ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "mb-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-sm font-bold tracking-tight", children: title }), description ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs mt-0.5 leading-relaxed", children: description })) : null] })) : null, (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-full", children: children })] }));
});
