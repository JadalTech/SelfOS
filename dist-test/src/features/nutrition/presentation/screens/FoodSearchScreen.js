"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodSearchScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useNutrition_1 = require("../../hooks/useNutrition");
const DashboardLayout_1 = require("../layouts/DashboardLayout");
const FeatureHeader_1 = require("../layouts/FeatureHeader");
const SectionLayout_1 = require("../layouts/SectionLayout");
const components_1 = require("../../../../shared/components");
exports.FoodSearchScreen = react_1.default.memo(function FoodSearchScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { mealType, date } = (0, expo_router_1.useLocalSearchParams)();
    const dateStr = date || new Date().toISOString().split('T')[0];
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [selectedTab, setSelectedTab] = (0, react_1.useState)('all');
    const [loggingFoodId, setLoggingFoodId] = (0, react_1.useState)(null);
    const [quantity, setQuantity] = (0, react_1.useState)('100');
    const { foodVMs, isLoading } = (0, useNutrition_1.useNutritionFoods)(searchTerm);
    const { addFoodToMeal, isAdding } = (0, useNutrition_1.useNutritionLogs)(dateStr);
    const filterOptions = [
        { value: 'all', label: 'All Foods' },
        { value: 'custom', label: 'My Foods' },
        { value: 'global', label: 'Global Catalog' },
    ];
    const filteredFoods = foodVMs.filter((food) => {
        if (selectedTab === 'custom')
            return food.isCustom;
        if (selectedTab === 'global')
            return !food.isCustom;
        return true;
    });
    const handleLogFood = async (foodId) => {
        const food = foodVMs.find((f) => f.id === foodId);
        if (!food || !mealType)
            return;
        // Convert VM back to domain model shape for mutation parameter
        const domainFoodShape = {
            id: food.id,
            name: food.name,
            brand: food.brand,
            category: food.category,
            servingSize: food.servingSize,
            servingUnit: food.servingUnit,
            nutritionFacts: {
                calories: food.calories,
                protein: food.protein,
                carbohydrates: food.carbohydrates,
                fats: food.fats,
                fiber: food.fiber,
                sugar: food.sugar,
                sodium: food.sodium,
                allergens: food.allergens,
                dietTags: food.dietTags,
            },
        };
        await addFoodToMeal({
            date: dateStr,
            mealType,
            food: domainFoodShape,
            quantity: parseFloat(quantity) || 100,
        });
        setLoggingFoodId(null);
        router.back();
    };
    return ((0, jsx_runtime_1.jsxs)(DashboardLayout_1.DashboardLayout, { children: [(0, jsx_runtime_1.jsx)(FeatureHeader_1.FeatureHeader, { title: "Find Food", subtitle: `Adding to ${mealType || 'Meal'}`, actionIcon: "\u2795", actionLabel: "Create Custom", onAction: () => router.push('/(app)/nutrition/add-food') }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { value: searchTerm, onChangeText: setSearchTerm, placeholder: "Search oats, apple, chicken...", placeholderTextColor: "#71717a", className: "bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm mb-1" }), (0, jsx_runtime_1.jsx)(components_1.FilterBar, { options: filterOptions, selectedValue: selectedTab, onSelect: setSelectedTab }), (0, jsx_runtime_1.jsx)(SectionLayout_1.SectionLayout, { title: "Search Results", children: isLoading ? ((0, jsx_runtime_1.jsx)(components_1.LoadingState, { message: "Searching catalogue...", inline: true })) : ((0, jsx_runtime_1.jsx)(components_1.VirtualizedList, { data: filteredFoods, keyExtractor: (item) => item.id, emptyTitle: "No Foods Found", emptyDescription: "Try adjusting search terms or add a custom recipe.", renderItem: ({ item }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-2.5 shadow-sm gap-2", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 pr-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-sm font-bold tracking-tight", children: item.name }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs mt-0.5", children: [item.brand || 'Standard', " \u2022 ", item.caloriesLabel, " (", item.servingSize, item.servingUnit, ")"] })] }), loggingFoodId === item.id ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { disabled: isAdding, onPress: () => handleLogFood(item.id), className: "bg-pink-500 px-3 py-1.5 rounded-lg", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 text-xs font-bold uppercase", children: "Log" }) })) : ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setLoggingFoodId(item.id), className: "bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-xs font-bold uppercase", children: "Select" }) }))] }), loggingFoodId === item.id ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2 mt-2 pt-2 border-t border-zinc-850", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: ["Quantity (", item.servingUnit, "):"] }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { value: quantity, onChangeText: setQuantity, keyboardType: "numeric", className: "bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-100 text-xs w-20 text-center" }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setLoggingFoodId(null), className: "ml-auto px-2 py-1", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs", children: "Cancel" }) })] })) : null] })) })) })] }));
});
exports.default = exports.FoodSearchScreen;
