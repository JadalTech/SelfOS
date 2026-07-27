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
exports.NutritionCoachScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const useNutritionCoach_1 = require("../../ai/hooks/useNutritionCoach");
const NutritionChatMessage_1 = require("../components/NutritionChatMessage");
const NutritionRecommendationCard_1 = require("../components/NutritionRecommendationCard");
const NutritionWeeklyReviewCard_1 = require("../components/NutritionWeeklyReviewCard");
const DashboardLayout_1 = require("../layouts/DashboardLayout");
const FeatureHeader_1 = require("../layouts/FeatureHeader");
const components_1 = require("../../../../shared/components");
const QUICK_PROMPTS = [
    'How do I increase my dietary protein intake?',
    'What are some high fiber meal substitutions?',
    'Explain calories target vs remaining budget.',
    'How does excess sugar affect body energy levels?',
];
exports.NutritionCoachScreen = react_1.default.memo(function NutritionCoachScreen() {
    const [activeTab, setActiveTab] = (0, react_1.useState)('chat');
    const [providerType, setProviderType] = (0, react_1.useState)('heuristic');
    const [inputQuery, setInputQuery] = (0, react_1.useState)('');
    const { messages, isLoadingMessages, askCoach, isAsking, clearConversation, recommendations, isLoadingRecommendations, weeklyReview, isLoadingWeeklyReview, } = (0, useNutritionCoach_1.useNutritionCoach)(providerType);
    const handleSend = async (textToSend) => {
        const queryText = textToSend || inputQuery;
        if (!queryText.trim() || isAsking)
            return;
        setInputQuery('');
        await askCoach(queryText.trim());
    };
    return ((0, jsx_runtime_1.jsxs)(DashboardLayout_1.DashboardLayout, { children: [(0, jsx_runtime_1.jsx)(FeatureHeader_1.FeatureHeader, { title: "Nutrition AI Coach", subtitle: "Dietary guidance & reviews", showBackButton: true, actionLabel: "Clear Chat", onAction: () => clearConversation() }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row bg-zinc-900 p-1.5 rounded-xl border border-zinc-800", children: ['chat', 'recommendations', 'review'].map((tab) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setActiveTab(tab), className: `flex-1 py-2 items-center rounded-lg ${activeTab === tab ? 'bg-pink-600' : 'bg-transparent'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold uppercase ${activeTab === tab ? 'text-white' : 'text-zinc-400'}`, children: tab === 'chat' ? '💬 Chat' : tab === 'recommendations' ? '💡 Recs' : '📊 Weekly' }) }, tab))) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-2xl", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "AI Provider Engine:" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row gap-1.5", children: ['heuristic', 'gemini', 'mock'].map((p) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setProviderType(p), className: `px-3 py-1.5 rounded-lg border ${providerType === p ? 'bg-pink-500/20 border-pink-500/50' : 'bg-zinc-950 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-[10px] font-bold uppercase ${providerType === p ? 'text-pink-400' : 'text-zinc-500'}`, children: p }) }, p))) })] }), activeTab === 'chat' ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "max-h-[360px]", showsVerticalScrollIndicator: false, children: [isLoadingMessages ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3 py-2", children: [(0, jsx_runtime_1.jsx)(components_1.SkeletonLoader, { height: 50 }), (0, jsx_runtime_1.jsx)(components_1.SkeletonLoader, { height: 50 })] })) : messages.length === 0 ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-4", children: [(0, jsx_runtime_1.jsx)(components_1.NoDataCard, { title: "Ask Your Dietitian Coach", description: "Type questions about fiber, carb targets, fat splits, or recipe guidelines.", icon: "\uD83E\uDD16" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2 mt-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-bold uppercase tracking-wider", children: "Suggested Questions:" }), QUICK_PROMPTS.map((prompt, idx) => ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { onPress: () => handleSend(prompt), className: "bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-xs font-medium flex-1 pr-2", children: prompt }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-pink-400 text-xs font-bold", children: "\u2794" })] }, idx)))] })] })) : (messages.map((msg) => (0, jsx_runtime_1.jsx)(NutritionChatMessage_1.NutritionChatMessage, { message: msg }, msg.id))), isAsking ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl mt-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { color: "#ec4899", size: "small" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-bold", children: "Coach is formulating response..." })] })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl shadow-lg mt-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.TextInput, { value: inputQuery, onChangeText: setInputQuery, onSubmitEditing: () => handleSend(), placeholder: "Ask AI Nutrition Coach...", placeholderTextColor: "#71717a", className: "flex-1 px-3 py-2 text-zinc-100 text-sm max-h-16" }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => handleSend(), disabled: isAsking || !inputQuery.trim(), className: `w-10 h-10 rounded-xl items-center justify-center ${inputQuery.trim() ? 'bg-pink-600' : 'bg-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-base font-extrabold", children: "\u2191" }) })] })] })) : activeTab === 'recommendations' ? ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { className: "max-h-[420px]", showsVerticalScrollIndicator: false, children: isLoadingRecommendations ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3", children: [(0, jsx_runtime_1.jsx)(components_1.SkeletonLoader, { height: 100 }), (0, jsx_runtime_1.jsx)(components_1.SkeletonLoader, { height: 100 })] })) : recommendations.length === 0 ? ((0, jsx_runtime_1.jsx)(components_1.NoDataCard, { title: "No Tips Available", description: "Your calorie logs are fully balanced today!" })) : (recommendations.map((rec) => (0, jsx_runtime_1.jsx)(NutritionRecommendationCard_1.NutritionRecommendationCard, { recommendation: rec }, rec.id))) })) : ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { className: "max-h-[420px]", showsVerticalScrollIndicator: false, children: isLoadingWeeklyReview ? ((0, jsx_runtime_1.jsx)(components_1.SkeletonLoader, { height: 180 })) : weeklyReview ? ((0, jsx_runtime_1.jsx)(NutritionWeeklyReviewCard_1.NutritionWeeklyReviewCard, { review: weeklyReview })) : ((0, jsx_runtime_1.jsx)(components_1.NoDataCard, { title: "Review Unavailable", description: "Please log more food items to generate weekly summaries." })) }))] }));
});
exports.default = exports.NutritionCoachScreen;
