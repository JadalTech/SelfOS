"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skincareAIRepository = exports.SkincareAIRepository = void 0;
const types_1 = require("../../../../shared/types");
const AppError_1 = require("../../../../shared/errors/AppError");
const skincareAI_service_1 = require("../services/skincareAI.service");
class SkincareAIRepository {
    service;
    constructor(service = skincareAI_service_1.skincareAIService) {
        this.service = service;
    }
    async askCoach(question, context) {
        try {
            const answer = await this.service.askCoach(question, context);
            return (0, types_1.ok)(answer);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to generate AI Skin Coach answer', { originalError: error }));
        }
    }
    async getRecommendations(context) {
        try {
            const recs = await this.service.getRecommendations(context);
            return (0, types_1.ok)(recs);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to generate skin recommendations', { originalError: error }));
        }
    }
    async getWeeklyReview(context) {
        try {
            const review = await this.service.getWeeklyReview(context);
            return (0, types_1.ok)(review);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to generate weekly skin review', { originalError: error }));
        }
    }
}
exports.SkincareAIRepository = SkincareAIRepository;
exports.skincareAIRepository = new SkincareAIRepository();
