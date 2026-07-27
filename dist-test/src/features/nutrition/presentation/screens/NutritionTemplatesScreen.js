"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionTemplatesScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const useNutrition_1 = require("../../hooks/useNutrition");
const DashboardLayout_1 = require("../layouts/DashboardLayout");
const FeatureHeader_1 = require("../layouts/FeatureHeader");
const SectionLayout_1 = require("../layouts/SectionLayout");
const components_1 = require("../../../../shared/components");
exports.NutritionTemplatesScreen = react_1.default.memo(function NutritionTemplatesScreen() {
    const { templateVMs, isLoading, deleteTemplate } = (0, useNutrition_1.useNutritionTemplates)();
    return ((0, jsx_runtime_1.jsxs)(DashboardLayout_1.DashboardLayout, { children: [(0, jsx_runtime_1.jsx)(FeatureHeader_1.FeatureHeader, { title: "Meal Templates", subtitle: "Instantly log pre-configured meal lists" }), (0, jsx_runtime_1.jsx)(SectionLayout_1.SectionLayout, { title: "Saved Templates", children: isLoading ? ((0, jsx_runtime_1.jsx)(components_1.LoadingState, { message: "Loading templates...", inline: true })) : ((0, jsx_runtime_1.jsx)(components_1.VirtualizedList, { data: templateVMs, keyExtractor: (item) => item.id, emptyTitle: "No Templates", emptyDescription: "Create templates from logged meals to speed up your daily tracking.", renderItem: ({ item }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-row items-center justify-between mb-2.5 shadow-sm", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 pr-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-sm font-bold tracking-tight", children: item.title }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs mt-0.5", children: [item.mealTypeLabel, " \u2022 ", item.foodsCount, " foods (", item.totalCaloriesLabel, ")"] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row items-center gap-2", children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => deleteTemplate(item.id), className: "w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 items-center justify-center", accessible: true, accessibilityRole: "button", accessibilityLabel: `Delete template ${item.title}`, hitSlop: { top: 8, bottom: 8, left: 8, right: 8 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-bold", children: "\u2715" }) }) })] })) })) })] }));
});
exports.default = exports.NutritionTemplatesScreen;
