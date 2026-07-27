"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalSettingsFormScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const expo_router_1 = require("expo-router");
const useNutrition_1 = require("../../hooks/useNutrition");
const DashboardLayout_1 = require("../layouts/DashboardLayout");
const FeatureHeader_1 = require("../layouts/FeatureHeader");
const GoalForm_1 = require("../forms/GoalForm");
exports.GoalSettingsFormScreen = react_1.default.memo(function GoalSettingsFormScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { activeGoalVM, saveGoal, isSaving } = (0, useNutrition_1.useNutritionGoals)();
    const handleSubmit = async (data) => {
        await saveGoal({
            ...data,
            isActive: true,
        });
        router.back();
    };
    const defaultValues = activeGoalVM ? {
        calorieTarget: activeGoalVM.calorieTarget,
        proteinTarget: activeGoalVM.proteinTarget,
        carbTarget: activeGoalVM.carbTarget,
        fatTarget: activeGoalVM.fatTarget,
        fiberTarget: activeGoalVM.fiberTarget,
    } : undefined;
    return ((0, jsx_runtime_1.jsxs)(DashboardLayout_1.DashboardLayout, { children: [(0, jsx_runtime_1.jsx)(FeatureHeader_1.FeatureHeader, { title: "Nutrition Goals", subtitle: "Configure daily calorie & macro targets" }), (0, jsx_runtime_1.jsx)(GoalForm_1.GoalForm, { defaultValues: defaultValues, onSubmit: handleSubmit, onCancel: () => router.back(), isSubmitting: isSaving })] }));
});
exports.default = exports.GoalSettingsFormScreen;
