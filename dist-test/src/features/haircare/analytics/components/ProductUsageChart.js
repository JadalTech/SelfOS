"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductUsageChart = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ProductUsageChart = react_1.default.memo(function ProductUsageChart({ productUsage }) {
    if (productUsage.length === 0) {
        return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2 shadow-md", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Product Usage Distribution" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs py-2 text-center", children: "No products logged in wash day executions yet." })] }));
    }
    const topProducts = productUsage.slice(0, 5);
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-md", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Product Usage Ranking" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-xs", children: [topProducts.length, " items ranked"] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-2.5 pt-1", children: topProducts.map((item, idx) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-100 text-xs font-bold", numberOfLines: 1, children: ["#", idx + 1, " ", item.productName, " ", (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 font-normal", children: ["(", item.brand, ")"] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-amber-400 text-xs font-black", children: [item.usageCount, " uses (", item.percentage, "%)"] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-full h-2 bg-zinc-950 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "h-full bg-amber-500 rounded-full", style: { width: `${Math.max(5, item.percentage)}%` } }) })] }, item.productId))) })] }));
});
