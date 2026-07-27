"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skincareAIRepository = exports.SkincareAIRepository = void 0;
const types_1 = require("../../../../shared/types");
const AppError_1 = require("../../../../shared/errors/AppError");
const skincareAI_service_1 = require("../services/skincareAI.service");
const providerFactory_1 = require("../providers/providerFactory");
const ruleRecommendationEngine_1 = require("../engine/ruleRecommendationEngine");
const requestManager_1 = require("../utils/requestManager");
class SkincareAIRepository {
    service;
    constructor(service = skincareAI_service_1.skincareAIService) {
        this.service = service;
    }
    async fetchConversation(userId) {
        try {
            const messages = await this.service.fetchConversation(userId);
            return (0, types_1.ok)(messages);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch skin coach conversation', { originalError: error }));
        }
    }
    async askCoach(userId, question, context, providerType = 'heuristic') {
        try {
            if (!requestManager_1.aiRequestManager.checkCooldown(`ask_${userId}`)) {
                return (0, types_1.err)(new AppError_1.AppError('AI_COOLDOWN', 'Please wait a moment before sending another message'));
            }
            const provider = providerFactory_1.SkinAIProviderFactory.getProvider(providerType);
            // Save user question first
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
            // Stage 1: Objective Rule-Based Detection
            const stage1Recs = ruleRecommendationEngine_1.RuleRecommendationEngine.detectRecommendations(context);
            // Stage 2: Provider AI Personalization & Prioritization
            const provider = providerFactory_1.SkinAIProviderFactory.getProvider(providerType);
            const finalRecs = await provider.generateRecommendations(context, stage1Recs);
            await this.service.saveRecommendations(userId, finalRecs);
            return (0, types_1.ok)(finalRecs);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('AI_SERVICE_ERROR', 'Failed to generate skin recommendations', { originalError: error }));
        }
    }
    async generateWeeklyReview(_userId, context, providerType = 'heuristic') {
        try {
            const provider = providerFactory_1.SkinAIProviderFactory.getProvider(providerType);
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
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to clear conversation', { originalError: error }));
        }
    }
}
exports.SkincareAIRepository = SkincareAIRepository;
exports.skincareAIRepository = new SkincareAIRepository();
