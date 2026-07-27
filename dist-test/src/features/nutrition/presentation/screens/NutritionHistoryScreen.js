"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionHistoryScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const useNutrition_1 = require("../../hooks/useNutrition");
const DashboardLayout_1 = require("../layouts/DashboardLayout");
const FeatureHeader_1 = require("../layouts/FeatureHeader");
const SectionLayout_1 = require("../layouts/SectionLayout");
const MetricGrid_1 = require("../layouts/MetricGrid");
const components_1 = require("../../../../shared/components");
exports.NutritionHistoryScreen = react_1.default.memo(function NutritionHistoryScreen() {
    const { analyticsRecords, isLoading, isError, error, refetch } = (0, useNutrition_1.useNutritionAnalytics)(30);
    const { dailyNutritionVMs } = (0, useNutrition_1.useNutritionLogs)();
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(components_1.LoadingState, { message: "Loading nutrition history..." });
    }
    if (isError) {
        return (0, jsx_runtime_1.jsx)(components_1.RetryCard, { onRetry: refetch, message: error?.message });
    }
    // Map analytics metrics to ViewModels
    const calorieRecord = analyticsRecords.find((r) => r.metric === 'calorie-intake');
    const qualityRecord = analyticsRecords.find((r) => r.metric === 'quality-score');
    const consistencyRecord = analyticsRecords.find((r) => r.metric === 'consistency');
    // Calorie trends chart data (convert daily logs to point arrays)
    const chartData = dailyNutritionVMs.slice(0, 7).map((log) => ({
        label: log.date.split('-')[2], // Day of month
        value: log.totalCalories,
    })).reverse();
    // Macro distribution split mock segments for chart
    const macroSegments = [
        { label: 'Protein', percentage: 30, color: '#f43f5e' },
        { label: 'Carbs', percentage: 50, color: '#0ea5e9' },
        { label: 'Fats', percentage: 20, color: '#10b981' },
    ];
    return ((0, jsx_runtime_1.jsxs)(DashboardLayout_1.DashboardLayout, { onRefresh: refetch, children: [(0, jsx_runtime_1.jsx)(FeatureHeader_1.FeatureHeader, { title: "Analytics & History", subtitle: "Track progress over past 30 days" }), (0, jsx_runtime_1.jsxs)(MetricGrid_1.MetricGrid, { children: [(0, jsx_runtime_1.jsx)(components_1.TrendCard, { title: "Average Calories", value: calorieRecord ? `${calorieRecord.value}` : '0', metricUnit: "kcal", changePercent: calorieRecord?.trend === 'improving' ? 5 : -4 }), (0, jsx_runtime_1.jsx)(components_1.TrendCard, { title: "Nutrition Score", value: qualityRecord ? `${qualityRecord.value}` : '0', metricUnit: "/10", changePercent: qualityRecord?.trend === 'improving' ? 12 : 0 }), (0, jsx_runtime_1.jsx)(components_1.TrendCard, { title: "Consistency Ratio", value: consistencyRecord ? `${consistencyRecord.value}%` : '0%' })] }), (0, jsx_runtime_1.jsx)(SectionLayout_1.SectionLayout, { title: "Calorie Trend (Past 7 Logs)", children: (0, jsx_runtime_1.jsx)(components_1.LineTrendChart, { data: chartData, unit: " kcal", color: "#ec4899" }) }), (0, jsx_runtime_1.jsx)(SectionLayout_1.SectionLayout, { title: "Macronutrients Balance Ratio", children: (0, jsx_runtime_1.jsx)(components_1.DistributionChart, { segments: macroSegments }) })] }));
});
exports.default = exports.NutritionHistoryScreen;
