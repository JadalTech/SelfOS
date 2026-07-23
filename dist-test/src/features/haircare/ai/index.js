"use strict";
/**
 * Haircare AI Submodule Export
 */
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairCoachScreen = exports.EmptyConversation = exports.PromptInput = exports.AICoachCard = exports.RecommendationCard = exports.ChatMessage = exports.useWeeklyHairReview = exports.useAskHairCoach = exports.useHairRecommendations = exports.HairAIRepository = exports.hairAIRepository = exports.FallbackHeuristicAIProvider = exports.HairAIService = exports.hairAIService = exports.PromptBuilder = exports.HairAIContextBuilder = void 0;
__exportStar(require("./types/ai.types"), exports);
var contextBuilder_1 = require("./utils/contextBuilder");
Object.defineProperty(exports, "HairAIContextBuilder", { enumerable: true, get: function () { return contextBuilder_1.HairAIContextBuilder; } });
var promptBuilder_1 = require("./prompts/promptBuilder");
Object.defineProperty(exports, "PromptBuilder", { enumerable: true, get: function () { return promptBuilder_1.PromptBuilder; } });
var hairAI_service_1 = require("./services/hairAI.service");
Object.defineProperty(exports, "hairAIService", { enumerable: true, get: function () { return hairAI_service_1.hairAIService; } });
Object.defineProperty(exports, "HairAIService", { enumerable: true, get: function () { return hairAI_service_1.HairAIService; } });
Object.defineProperty(exports, "FallbackHeuristicAIProvider", { enumerable: true, get: function () { return hairAI_service_1.FallbackHeuristicAIProvider; } });
var hairAIRepository_1 = require("./repository/hairAIRepository");
Object.defineProperty(exports, "hairAIRepository", { enumerable: true, get: function () { return hairAIRepository_1.hairAIRepository; } });
Object.defineProperty(exports, "HairAIRepository", { enumerable: true, get: function () { return hairAIRepository_1.HairAIRepository; } });
var useHairRecommendations_1 = require("./hooks/useHairRecommendations");
Object.defineProperty(exports, "useHairRecommendations", { enumerable: true, get: function () { return useHairRecommendations_1.useHairRecommendations; } });
var useAskHairCoach_1 = require("./hooks/useAskHairCoach");
Object.defineProperty(exports, "useAskHairCoach", { enumerable: true, get: function () { return useAskHairCoach_1.useAskHairCoach; } });
var useWeeklyHairReview_1 = require("./hooks/useWeeklyHairReview");
Object.defineProperty(exports, "useWeeklyHairReview", { enumerable: true, get: function () { return useWeeklyHairReview_1.useWeeklyHairReview; } });
var ChatMessage_1 = require("./components/ChatMessage");
Object.defineProperty(exports, "ChatMessage", { enumerable: true, get: function () { return ChatMessage_1.ChatMessage; } });
var RecommendationCard_1 = require("./components/RecommendationCard");
Object.defineProperty(exports, "RecommendationCard", { enumerable: true, get: function () { return RecommendationCard_1.RecommendationCard; } });
var AICoachCard_1 = require("./components/AICoachCard");
Object.defineProperty(exports, "AICoachCard", { enumerable: true, get: function () { return AICoachCard_1.AICoachCard; } });
var PromptInput_1 = require("./components/PromptInput");
Object.defineProperty(exports, "PromptInput", { enumerable: true, get: function () { return PromptInput_1.PromptInput; } });
var EmptyConversation_1 = require("./components/EmptyConversation");
Object.defineProperty(exports, "EmptyConversation", { enumerable: true, get: function () { return EmptyConversation_1.EmptyConversation; } });
var HairCoachScreen_1 = require("./screens/HairCoachScreen");
Object.defineProperty(exports, "HairCoachScreen", { enumerable: true, get: function () { return HairCoachScreen_1.HairCoachScreen; } });
