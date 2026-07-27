"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ProductCard = react_1.default.memo(function ProductCard({ product, onToggleFavorite, onToggleActive, onEdit, onDelete, }) {
    const handleDeleteConfirm = () => {
        react_native_1.Alert.alert('Delete Product', `Are you sure you want to delete ${product.brand} ${product.name}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: onDelete },
        ]);
    };
    let expiryBadgeStyle = 'bg-zinc-800 text-zinc-400';
    if (product.expiryStatus === 'expired') {
        expiryBadgeStyle = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    }
    else if (product.expiryStatus === 'expiring-soon') {
        expiryBadgeStyle = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    }
    else if (product.expiryStatus === 'good') {
        expiryBadgeStyle = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: `bg-zinc-900 border ${product.isActive ? 'border-zinc-800' : 'border-zinc-800/40 opacity-60'} p-4 rounded-2xl gap-2.5 shadow-sm`, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-start justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 pr-2", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: product.brand }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-pink-400 text-[10px] font-semibold", children: product.categoryLabel }) })] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-base font-bold mt-0.5", children: product.name })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2", children: [onToggleFavorite ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: onToggleFavorite, className: "p-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-base", children: product.isFavorite ? '⭐' : '☆' }) })) : null, onToggleActive ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: onToggleActive, className: `px-2 py-1 rounded-lg border ${product.isActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-800 border-zinc-700'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-[10px] font-bold ${product.isActive ? 'text-emerald-400' : 'text-zinc-400'}`, children: product.isActive ? 'Active' : 'Inactive' }) })) : null] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 font-semibold", children: "Actives: " }), product.ingredientsListFormatted] }), product.expiryStatusLabel ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "self-start", children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: `px-2 py-0.5 rounded-md ${expiryBadgeStyle}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-[10px] font-semibold", children: product.expiryStatusLabel }) }) })) : null, (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-end gap-3 pt-2 border-t border-zinc-800/60 mt-1", children: [onEdit ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: onEdit, className: "py-1 px-2", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Edit" }) })) : null, onDelete ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleDeleteConfirm, className: "py-1 px-2", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs font-semibold", children: "Delete" }) })) : null] })] }));
});
