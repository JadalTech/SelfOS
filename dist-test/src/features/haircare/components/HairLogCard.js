"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairLogCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.HairLogCard = react_1.default.memo(function HairLogCard({ log }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-950/60 border border-zinc-800/60 p-3.5 rounded-2xl gap-2", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-sm font-bold", children: log.routineTitle }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-[10px]", children: [log.date, " at ", log.time] })] }), log.appliedProducts.length > 0 ? ((0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs", children: ["Applied: ", (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 font-medium", children: log.appliedProducts.join(', ') })] })) : null, log.notes ? ((0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs italic", children: ["\"", log.notes, "\""] })) : null] }));
});
