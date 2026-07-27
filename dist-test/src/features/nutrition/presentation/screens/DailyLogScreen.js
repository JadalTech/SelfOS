"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyLogScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useNutrition_1 = require("../../hooks/useNutrition");
const DashboardLayout_1 = require("../layouts/DashboardLayout");
const FeatureHeader_1 = require("../layouts/FeatureHeader");
const SectionLayout_1 = require("../layouts/SectionLayout");
const components_1 = require("../../../../shared/components");
exports.DailyLogScreen = react_1.default.memo(function DailyLogScreen() {
    const { date } = (0, expo_router_1.useLocalSearchParams)();
    const dateStr = date || new Date().toISOString().split('T')[0];
    const { activeDailyLogVM, isLoadingDate } = (0, useNutrition_1.useNutritionLogs)(dateStr);
    if (isLoadingDate) {
        return (0, jsx_runtime_1.jsx)(components_1.LoadingState, { message: "Loading daily log..." });
    }
    const totals = activeDailyLogVM;
    const macroMetrics = [
        { label: 'Protein', value: totals ? totals.totalProteinLabel : '0g' },
        { label: 'Carbs', value: totals ? totals.totalCarbsLabel : '0g' },
        { label: 'Fats', value: totals ? totals.totalFatsLabel : '0g' },
    ];
    return ((0, jsx_runtime_1.jsxs)(DashboardLayout_1.DashboardLayout, { children: [(0, jsx_runtime_1.jsx)(FeatureHeader_1.FeatureHeader, { title: "Daily Summary", subtitle: totals?.dateFormatted || dateStr }), totals ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-5", children: [(0, jsx_runtime_1.jsx)(components_1.SummaryCard, { title: "Day's Total Consumption", metrics: macroMetrics, footerText: `Calories: ${totals.totalCaloriesLabel}` }), (0, jsx_runtime_1.jsx)(SectionLayout_1.SectionLayout, { title: "Meals Logged", children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-3.5", children: totals.meals.map((meal) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2 shadow-sm", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-sm font-bold", children: meal.mealTypeLabel }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-pink-400 text-xs font-bold", children: meal.totalCaloriesLabel })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-1 mt-1", children: meal.foods.map((food) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs", children: food.foodName }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-xs", children: [food.quantity, "g"] })] }, food.id))) })] }, meal.id))) }) })] })) : ((0, jsx_runtime_1.jsx)(components_1.NoDataCard, { title: "Empty Log", description: "No food has been tracked for this date yet." }))] }));
});
exports.default = exports.DailyLogScreen;
