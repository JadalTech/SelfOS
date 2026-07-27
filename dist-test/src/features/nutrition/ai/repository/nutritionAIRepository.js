"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nutritionAIRepository = exports.NutritionAIRepository = void 0;
const types_1 = require("../../../../shared/types");
const AppError_1 = require("../../../../shared/errors/AppError");
const nutritionAIService_1 = require("../services/nutritionAIService");
const providerFactory_1 = require("../providers/providerFactory");
const requestManager_1 = require("../utils/requestManager");
class NutritionAIRepository {
    service;
    constructor(service = nutritionAIService_1.nutritionAIService) {
        this.service = service;
    }
    async fetchConversation(userId) {
        try {
            const messages = await this.service.fetchConversation(userId);
            return (0, types_1.ok)(messages);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch nutrition coach conversation', { originalError: error }));
        }
    }
    async askCoach(userId, question, context, providerType = 'heuristic') {
        try {
            if (!requestManager_1.aiRequestManager.checkCooldown(`ask_${userId}`)) {
                return (0, types_1.err)(new AppError_1.AppError('AI_COOLDOWN', 'Please wait a moment before sending another message'));
            }
            const provider = providerFactory_1.NutritionAIProviderFactory.getProvider(providerType);
            // Save user question
            const userMessage = {
                id: `msg_user_${Date.now()}`,
                sender: 'user',
                text: question,
                timestamp: new Date(),
                providerName: provider.name,
            };
            await this.service.saveMessage(userId, userMessage);
            // Generate AI response
            const answerText = await provider.askCoach(question, context);
            const aiMessage = {
                id: `msg_ai_${Date.now()}`,
                sender: 'ai',
                text: answerText,
                timestamp: new Date(),
                providerName: provider.name,
            };
            await this.service.saveMessage(userId, aiMessage);
            return (0, types_1.ok)(aiMessage);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('AI_SERVICE_ERROR', 'Failed to generate AI Coach response', { originalError: error }));
        }
    }
    async generateRecommendations(userId, context, providerType = 'heuristic') {
        try {
            const provider = providerFactory_1.NutritionAIProviderFactory.getProvider(providerType);
            const finalRecs = await provider.generateRecommendations(context);
            await this.service.saveRecommendations(userId, finalRecs);
            return (0, types_1.ok)(finalRecs);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('AI_SERVICE_ERROR', 'Failed to generate nutrition recommendations', { originalError: error }));
        }
    }
    async generateWeeklyReview(_userId, context, providerType = 'heuristic') {
        try {
            const provider = providerFactory_1.NutritionAIProviderFactory.getProvider(providerType);
            const review = await provider.generateWeeklyReview(context);
            return (0, types_1.ok)(review);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('AI_SERVICE_ERROR', 'Failed to generate weekly review', { originalError: error }));
        }
    }
    async clearConversation(userId) {
        try {
            await this.service.clearConversation(userId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to clear conversation history', { originalError: error }));
        }
    }
}
exports.NutritionAIRepository = NutritionAIRepository;
exports.nutritionAIRepository = new NutritionAIRepository();
