"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.PhotoCard = react_1.default.memo(function PhotoCard({ photo, onPress, onDelete, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { className: "bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm active:border-amber-500/60", onPress: () => onPress?.(photo), disabled: !onPress, accessibilityRole: "button", accessibilityLabel: `Hair photo captured on ${photo.formattedDate}`, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "relative w-full aspect-square bg-zinc-900", children: [(0, jsx_runtime_1.jsx)(react_native_1.Image, { source: { uri: photo.photoUrl }, className: "w-full h-full", resizeMode: "cover" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md border border-white/10", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-[9px] font-bold", children: photo.angleLabel }) }), onDelete ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "absolute top-2 right-2 bg-rose-950/80 p-1.5 rounded-full border border-rose-500/40", onPress: () => onDelete(photo), accessibilityRole: "button", accessibilityLabel: "Delete photo", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs font-bold", children: "\u2715" }) })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "p-2.5 gap-0.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-xs font-bold", children: photo.formattedDate }), photo.notes ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-[10px]", numberOfLines: 1, children: photo.notes })) : null] })] }));
});
