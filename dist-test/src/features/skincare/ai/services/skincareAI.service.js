"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skincareAIService = exports.SkincareAIService = void 0;
const FallbackHeuristicSkinAIProvider_1 = require("../providers/FallbackHeuristicSkinAIProvider");
class SkincareAIService {
    provider;
    constructor(provider = new FallbackHeuristicSkinAIProvider_1.FallbackHeuristicSkinAIProvider()) {
        this.provider = provider;
    }
    async askCoach(question, context) {
        return this.provider.askCoach(question, context);
    }
    async getRecommendations(context) {
        return this.provider.generateRecommendations(context);
    }
    async getWeeklyReview(context) {
        return this.provider.generateWeeklyReview(context);
    }
}
exports.SkincareAIService = SkincareAIService;
exports.skincareAIService = new SkincareAIService();
