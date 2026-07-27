"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingHaircare = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.LoadingHaircare = react_1.default.memo(function LoadingHaircare() {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-zinc-950 p-4 gap-4 animate-pulse", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "h-32 bg-zinc-900 border border-zinc-800 rounded-2xl" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "h-24 bg-zinc-900 border border-zinc-800 rounded-2xl" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "h-40 bg-zinc-900 border border-zinc-800 rounded-2xl" })] }));
});
