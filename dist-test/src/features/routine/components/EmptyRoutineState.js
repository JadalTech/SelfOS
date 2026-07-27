"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyRoutineState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.EmptyRoutineState = react_1.default.memo(function EmptyRoutineState({ title = 'No Routines Found', message = 'Get started by creating your first daily or weekly routine foundation.', actionLabel = 'Create New Routine', onAction, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 items-center justify-center p-6 my-8 gap-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-20 h-20 bg-emerald-500/10 rounded-full items-center justify-center border border-emerald-500/20", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-3xl", children: "\uD83C\uDF31" }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center gap-1 max-w-xs", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-lg font-bold text-center tracking-tight", children: title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-sm text-center font-normal leading-relaxed", children: message })] }), onAction ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "mt-2 bg-emerald-500 active:bg-emerald-600 px-5 py-3 rounded-xl flex-row items-center justify-center shadow-lg shadow-emerald-500/20", onPress: onAction, accessibilityRole: "button", accessibilityLabel: actionLabel, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-bold text-sm", children: actionLabel }) })) : null] }));
});
