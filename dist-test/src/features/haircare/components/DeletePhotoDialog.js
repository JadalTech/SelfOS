"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePhotoDialog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const components_1 = require("@/shared/components");
exports.DeletePhotoDialog = react_1.default.memo(function DeletePhotoDialog({ visible, photo, isDeleting = false, onConfirm, onCancel }) {
    if (!photo)
        return null;
    return ((0, jsx_runtime_1.jsx)(react_native_1.Modal, { visible: visible, transparent: true, animationType: "fade", onRequestClose: onCancel, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-black/80 justify-center items-center p-6", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-5 w-full max-w-sm gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-lg font-bold", children: "Delete Progress Photo?" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center", children: ["Are you sure you want to delete this photo captured on ", photo.formattedDate, "? This action cannot be undone."] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row gap-3 pt-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "flex-1 bg-zinc-800 border border-zinc-700 py-3 rounded-xl items-center", onPress: onCancel, disabled: isDeleting, accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 font-semibold text-xs", children: "Cancel" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "flex-1 bg-rose-600 active:bg-rose-700 py-3 rounded-xl items-center shadow-md shadow-rose-600/30", onPress: () => void onConfirm(), disabled: isDeleting, accessibilityRole: "button", children: isDeleting ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "...", color: "#ffffff" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white font-extrabold text-xs", children: "Delete Photo" })) })] })] }) }) }));
});
