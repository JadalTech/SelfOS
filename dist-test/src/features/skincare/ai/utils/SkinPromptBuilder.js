"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinPromptBuilder = void 0;
const SystemPrompt_1 = require("./PromptTemplates/SystemPrompt");
const ChatPrompt_1 = require("./PromptTemplates/ChatPrompt");
const RecommendationPrompt_1 = require("./PromptTemplates/RecommendationPrompt");
const WeeklyReviewPrompt_1 = require("./PromptTemplates/WeeklyReviewPrompt");
class SkinPromptBuilder {
    static buildSystemPrompt() {
        return (0, SystemPrompt_1.getSystemPrompt)();
    }
    static buildChatPrompt(question, context) {
        return (0, ChatPrompt_1.getChatPrompt)(question, context);
    }
    static buildRecommendationPrompt(context, ruleRecommendations) {
        return (0, RecommendationPrompt_1.getRecommendationPrompt)(context, ruleRecommendations);
    }
    static buildWeeklyReviewPrompt(context) {
        return (0, WeeklyReviewPrompt_1.getWeeklyReviewPrompt)(context);
    }
}
exports.SkinPromptBuilder = SkinPromptBuilder;
