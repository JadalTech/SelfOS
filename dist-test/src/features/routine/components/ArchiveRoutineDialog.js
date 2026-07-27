"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveRoutineDialog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ArchiveRoutineDialog = react_1.default.memo(function ArchiveRoutineDialog({ visible, routineTitle, isArchived = false, isLoading = false, onConfirm, onCancel, }) {
    if (!visible)
        return null;
    const actionText = isArchived ? 'Restore' : 'Archive';
    const descriptionText = isArchived
        ? `This will restore "${routineTitle}" back to your active routines.`
        : `Archiving "${routineTitle}" will pause reminders and hide it from your active list. Your completion history will be preserved.`;
    return ((0, jsx_runtime_1.jsx)(react_native_1.Modal, { visible: visible, transparent: true, animationType: "fade", onRequestClose: onCancel, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-black/70 justify-center items-center p-4", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm gap-4 shadow-2xl", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-100 text-lg font-bold", children: [actionText, " Routine?"] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-sm leading-relaxed", children: descriptionText }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-end gap-3 pt-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-4 py-2.5 rounded-xl bg-zinc-800 active:bg-zinc-700", onPress: onCancel, disabled: isLoading, accessibilityRole: "button", accessibilityLabel: "Cancel", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 font-semibold text-sm", children: "Cancel" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-4 py-2.5 rounded-xl active:opacity-80 ${isArchived ? 'bg-emerald-500' : 'bg-amber-500'}`, onPress: onConfirm, disabled: isLoading, accessibilityRole: "button", accessibilityLabel: `Confirm ${actionText}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-bold text-sm", children: isLoading ? 'Processing...' : actionText }) })] })] }) }) }));
});
