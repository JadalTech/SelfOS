"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFoodFormScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const expo_router_1 = require("expo-router");
const useNutrition_1 = require("../../hooks/useNutrition");
const DashboardLayout_1 = require("../layouts/DashboardLayout");
const FeatureHeader_1 = require("../layouts/FeatureHeader");
const FoodForm_1 = require("../forms/FoodForm");
exports.AddFoodFormScreen = react_1.default.memo(function AddFoodFormScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { createUserFood, isCreating } = (0, useNutrition_1.useNutritionFoods)();
    const handleSubmit = async (data) => {
        // Save to Firestore using repository mutate hook
        await createUserFood(data);
        router.back();
    };
    return ((0, jsx_runtime_1.jsxs)(DashboardLayout_1.DashboardLayout, { children: [(0, jsx_runtime_1.jsx)(FeatureHeader_1.FeatureHeader, { title: "Create Food", subtitle: "Add custom recipes or items" }), (0, jsx_runtime_1.jsx)(FoodForm_1.FoodForm, { onSubmit: handleSubmit, onCancel: () => router.back(), isSubmitting: isCreating })] }));
});
exports.default = exports.AddFoodFormScreen;
