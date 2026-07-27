"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealDetailsScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useNutrition_1 = require("../../hooks/useNutrition");
const DashboardLayout_1 = require("../layouts/DashboardLayout");
const FeatureHeader_1 = require("../layouts/FeatureHeader");
const SectionLayout_1 = require("../layouts/SectionLayout");
const components_1 = require("../../../../shared/components");
exports.MealDetailsScreen = react_1.default.memo(function MealDetailsScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { mealType, date } = (0, expo_router_1.useLocalSearchParams)();
    const dateStr = date || new Date().toISOString().split('T')[0];
    const { activeDailyLogVM, isLoadingDate, removeFoodFromMeal } = (0, useNutrition_1.useNutritionLogs)(dateStr);
    if (isLoadingDate) {
        return (0, jsx_runtime_1.jsx)(components_1.LoadingState, { message: "Loading meal details..." });
    }
    const mealData = activeDailyLogVM?.meals.find((m) => m.mealType === mealType);
    const foods = mealData?.foods || [];
    return ((0, jsx_runtime_1.jsxs)(DashboardLayout_1.DashboardLayout, { children: [(0, jsx_runtime_1.jsx)(FeatureHeader_1.FeatureHeader, { title: `${mealData?.mealTypeLabel || 'Meal'} Summary`, subtitle: `${activeDailyLogVM?.dateFormatted || dateStr} • ${mealData?.totalCaloriesLabel || '0 kcal'}` }), (0, jsx_runtime_1.jsx)(components_1.ActionCard, { title: "Add Food Items", description: "Search global catalog or custom foods", icon: "\u2795", actionLabel: "Log Food", onPress: () => router.push({ pathname: '/(app)/nutrition/search', params: { mealType, date: dateStr } }) }), (0, jsx_runtime_1.jsx)(SectionLayout_1.SectionLayout, { title: "Logged Foods", children: (0, jsx_runtime_1.jsx)(components_1.VirtualizedList, { data: foods, keyExtractor: (item) => item.id, emptyTitle: "Meal is Empty", emptyDescription: "You haven't logged any food items to this meal yet.", renderItem: ({ item }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-row items-center justify-between mb-2 shadow-sm", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 pr-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-sm font-bold tracking-tight", children: item.foodName }), item.foodBrand ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs mt-0.5", children: item.foodBrand })) : null, (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-xs mt-1", children: [item.quantity, " ", item.servingUnit, " (", item.caloriesLabel, ")"] })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => removeFoodFromMeal({ date: dateStr, mealType, entryId: item.id }), accessible: true, accessibilityRole: "button", accessibilityLabel: `Remove ${item.foodName}`, hitSlop: { top: 8, bottom: 8, left: 8, right: 8 }, className: "w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/25 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs font-bold", children: "\u2715" }) })] })) }) })] }));
});
exports.default = exports.MealDetailsScreen;
