"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hairAIRepository = exports.HairAIRepository = void 0;
const types_1 = require("@/shared/types");
const errors_1 = require("@/shared/errors");
const haircare_repository_1 = require("../../repository/haircare.repository");
const hairPhoto_repository_1 = require("../../repository/hairPhoto.repository");
const hairCondition_repository_1 = require("../../repository/hairCondition.repository");
const routine_1 = require("@/features/routine");
const hairAnalytics_1 = require("../../analytics/utils/hairAnalytics");
const contextBuilder_1 = require("../utils/contextBuilder");
const hairAI_service_1 = require("../services/hairAI.service");
class HairAIRepository {
    aiService;
    constructor(aiService = hairAI_service_1.hairAIService) {
        this.aiService = aiService;
    }
    /**
     * Helper to build aggregated context payload for current user.
     */
    async getContext(userId) {
        try {
            const [prodsRes, routinesRes, logsRes, photosRes, condsRes, coreRoutinesRes] = await Promise.all([
                haircare_repository_1.haircareRepository.fetchProducts(userId),
                haircare_repository_1.haircareRepository.fetchHairRoutines(userId),
                haircare_repository_1.haircareRepository.fetchHairLogs(userId, 50),
                hairPhoto_repository_1.hairPhotoRepository.fetchPhotos(userId, 50),
                hairCondition_repository_1.hairConditionRepository.fetchConditions(userId, 50),
                routine_1.routineRepository.fetchRoutines({ type: 'haircare' }),
            ]);
            const products = prodsRes.success ? prodsRes.data : [];
            const hairRoutines = routinesRes.success ? routinesRes.data : [];
            const logs = logsRes.success ? logsRes.data : [];
            const photos = photosRes.success ? photosRes.data : [];
            const conditions = condsRes.success ? condsRes.data : [];
            const coreRoutines = coreRoutinesRes.success ? coreRoutinesRes.data : [];
            const analytics = (0, hairAnalytics_1.buildHairAnalyticsVM)(products, hairRoutines, coreRoutines, logs, photos, conditions);
            const ctx = contextBuilder_1.HairAIContextBuilder.buildContext(products, hairRoutines, coreRoutines, logs, photos, conditions, analytics);
            return (0, types_1.ok)(ctx);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to build AI context', { originalError: error }));
        }
    }
    async getRecommendations(userId) {
        const ctxRes = await this.getContext(userId);
        if (!ctxRes.success)
            return ctxRes;
        try {
            const recs = await this.aiService.generateRecommendations(ctxRes.data);
            return (0, types_1.ok)(recs);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('UNKNOWN_ERROR', 'Failed to generate recommendations', { originalError: error }));
        }
    }
    async askCoach(userId, userMessage, history = []) {
        const ctxRes = await this.getContext(userId);
        if (!ctxRes.success)
            return ctxRes;
        try {
            const answer = await this.aiService.askCoach(ctxRes.data, userMessage, history);
            return (0, types_1.ok)(answer);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('UNKNOWN_ERROR', 'Failed to consult AI Hair Coach', { originalError: error }));
        }
    }
    async getWeeklyReview(userId) {
        const ctxRes = await this.getContext(userId);
        if (!ctxRes.success)
            return ctxRes;
        try {
            const review = await this.aiService.generateWeeklyReview(ctxRes.data);
            return (0, types_1.ok)(review);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('UNKNOWN_ERROR', 'Failed to generate weekly review', { originalError: error }));
        }
    }
}
exports.HairAIRepository = HairAIRepository;
exports.hairAIRepository = new HairAIRepository();
