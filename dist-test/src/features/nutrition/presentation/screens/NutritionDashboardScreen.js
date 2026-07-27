"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionDashboardScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useNutrition_1 = require("../../hooks/useNutrition");
const DashboardLayout_1 = require("../layouts/DashboardLayout");
const FeatureHeader_1 = require("../layouts/FeatureHeader");
const SectionLayout_1 = require("../layouts/SectionLayout");
const MetricGrid_1 = require("../layouts/MetricGrid");
const components_1 = require("../../../../shared/components");
const nutrition_constants_1 = require("../../constants/nutrition.constants");
exports.NutritionDashboardScreen = react_1.default.memo(function NutritionDashboardScreen() {
    const router = (0, expo_router_1.useRouter)();
    const todayStr = new Date().toISOString().split('T')[0];
    // Retrieve data using React Query hooks
    const { activeDailyLogVM, isLoadingDate, refetchLogs, isError, error } = (0, useNutrition_1.useNutritionLogs)(todayStr);
    const { activeGoalVM, isLoading: isLoadingGoal } = (0, useNutrition_1.useNutritionGoals)();
    if (isLoadingDate || isLoadingGoal) {
        return (0, jsx_runtime_1.jsx)(components_1.LoadingState, { message: "Loading dashboard..." });
    }
    if (isError) {
        return (0, jsx_runtime_1.jsx)(components_1.RetryCard, { onRetry: () => refetchLogs(), message: error?.message });
    }
    // Fallback defaults if log or goals are empty
    const calorieTarget = activeGoalVM?.calorieTarget || 2000;
    const consumedCalories = activeDailyLogVM?.totalCalories || 0;
    const caloriesRatio = consumedCalories / calorieTarget;
    const proteinTarget = activeGoalVM?.proteinTarget || 150;
    const carbTarget = activeGoalVM?.carbTarget || 200;
    const fatTarget = activeGoalVM?.fatTarget || 65;
    const proteinConsumed = activeDailyLogVM?.totalProtein || 0;
    const carbsConsumed = activeDailyLogVM?.totalCarbs || 0;
    const fatsConsumed = activeDailyLogVM?.totalFats || 0;
    const macroMetrics = [
        { label: 'Protein', value: `${proteinConsumed} / ${proteinTarget}g`, progress: proteinConsumed / proteinTarget, color: '#f43f5e' },
        { label: 'Carbs', value: `${carbsConsumed} / ${carbTarget}g`, progress: carbsConsumed / carbTarget, color: '#0ea5e9' },
        { label: 'Fats', value: `${fatsConsumed} / ${fatTarget}g`, progress: fatsConsumed / fatTarget, color: '#10b981' },
    ];
    return ((0, jsx_runtime_1.jsxs)(DashboardLayout_1.DashboardLayout, { onRefresh: refetchLogs, children: [(0, jsx_runtime_1.jsx)(FeatureHeader_1.FeatureHeader, { title: "Nutrition Tracker", subtitle: "Fuel your fitness goals", showBackButton: true, actionIcon: "\u2699\uFE0F", actionLabel: "Goals", onAction: () => router.push('/(app)/nutrition/goals') }), (0, jsx_runtime_1.jsxs)(MetricGrid_1.MetricGrid, { children: [(0, jsx_runtime_1.jsx)(components_1.ProgressCard, { title: "Daily Calorie Budget", value: `${consumedCalories} kcal`, progress: caloriesRatio, type: "circular", subLabel: `Goal: ${calorieTarget}` }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 gap-3.5", children: [(0, jsx_runtime_1.jsx)(components_1.ActionCard, { title: "Search Catalog", description: "Log standard or custom foods", icon: "\uD83E\uDD57", actionLabel: "Search", onPress: () => router.push('/(app)/nutrition/search') }), (0, jsx_runtime_1.jsx)(components_1.ActionCard, { title: "Saved Templates", description: "Quickly reuse meal setups", icon: "\uD83D\uDCCB", actionLabel: "View", onPress: () => router.push('/(app)/nutrition/templates') })] })] }), (0, jsx_runtime_1.jsx)(components_1.SummaryCard, { title: "Macronutrients Balance", metrics: macroMetrics }), (0, jsx_runtime_1.jsx)(SectionLayout_1.SectionLayout, { title: "Today's Meal Log", subtitle: "Manage daily logs", actionLabel: "Full History", onAction: () => router.push('/(app)/nutrition/history'), children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-3", children: nutrition_constants_1.MEAL_TYPE_OPTIONS.map((mealType) => {
                        const mealData = activeDailyLogVM?.meals.find((m) => m.mealType === mealType.value);
                        const mealCalories = mealData?.totalCalories || 0;
                        const itemsCount = mealData?.foods.length || 0;
                        return ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: () => router.push({
                                pathname: '/(app)/nutrition/meal',
                                params: { mealType: mealType.value, date: todayStr },
                            }), className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-row items-center justify-between shadow-sm", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xl", children: mealType.icon }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-sm font-bold tracking-tight", children: mealType.label }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold mt-0.5", children: [itemsCount, " ", itemsCount === 1 ? 'food logged' : 'foods logged'] })] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-200 text-sm font-extrabold", children: [mealCalories, " kcal"] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 font-bold", children: "\u2794" })] })] }, mealType.value));
                    }) }) })] }));
});
exports.default = exports.NutritionDashboardScreen;
