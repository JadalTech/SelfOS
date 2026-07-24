"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionAIProviderFactory = void 0;
const GeminiNutritionAIProvider_1 = require("./GeminiNutritionAIProvider");
const FallbackHeuristicNutritionAIProvider_1 = require("./FallbackHeuristicNutritionAIProvider");
const MockNutritionAIProvider_1 = require("./MockNutritionAIProvider");
class NutritionAIProviderFactory {
    static cachedProvider = null;
    static getProvider(type = 'heuristic') {
        if (this.cachedProvider && this.cachedProvider.name === type) {
            return this.cachedProvider;
        }
        switch (type) {
            case 'gemini':
                this.cachedProvider = new GeminiNutritionAIProvider_1.GeminiNutritionAIProvider();
                break;
            case 'mock':
                this.cachedProvider = new MockNutritionAIProvider_1.MockNutritionAIProvider();
                break;
            case 'heuristic':
            default:
                this.cachedProvider = new FallbackHeuristicNutritionAIProvider_1.FallbackHeuristicNutritionAIProvider();
                break;
        }
        return this.cachedProvider;
    }
}
exports.NutritionAIProviderFactory = NutritionAIProviderFactory;
