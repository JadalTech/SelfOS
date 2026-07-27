"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyHaircare = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.EmptyHaircare = react_1.default.memo(function EmptyHaircare({ title = 'No Haircare Items Found', message = 'Start building your haircare regimen by adding your first hair product or routine.', actionLabel, onAction, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 items-center gap-3 my-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-2xl", children: "\uD83D\uDC87\u200D\u2642\uFE0F" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-base font-bold text-center", children: title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center leading-relaxed max-w-xs", children: message }), actionLabel && onAction ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-emerald-500 active:bg-emerald-600 px-5 py-3 rounded-xl mt-1", onPress: onAction, accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-xs", children: actionLabel }) })) : null] }));
});
