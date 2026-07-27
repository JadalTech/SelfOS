"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
exports.DashboardLayout = react_1.default.memo(function DashboardLayout({ children, onRefresh, isRefreshing = false, }) {
    return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", edges: ['top', 'left', 'right'], children: (0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { paddingBottom: 32 }, showsVerticalScrollIndicator: false, refreshControl: onRefresh ? ((0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isRefreshing, onRefresh: onRefresh, tintColor: "#ec4899", colors: ['#ec4899'] })) : undefined, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "px-4.5 gap-5 pt-3", children: children }) }) }));
});
