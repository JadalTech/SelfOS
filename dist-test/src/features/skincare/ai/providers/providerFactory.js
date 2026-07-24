"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinAIProviderFactory = void 0;
const GeminiSkinAIProvider_1 = require("./GeminiSkinAIProvider");
const FallbackHeuristicSkinAIProvider_1 = require("./FallbackHeuristicSkinAIProvider");
const MockSkinAIProvider_1 = require("./MockSkinAIProvider");
class SkinAIProviderFactory {
    static cachedProvider = null;
    static getProvider(type = 'heuristic') {
        if (this.cachedProvider && this.cachedProvider.name === type) {
            return this.cachedProvider;
        }
        switch (type) {
            case 'gemini':
                this.cachedProvider = new GeminiSkinAIProvider_1.GeminiSkinAIProvider();
                break;
            case 'mock':
                this.cachedProvider = new MockSkinAIProvider_1.MockSkinAIProvider();
                break;
            case 'heuristic':
            default:
                this.cachedProvider = new FallbackHeuristicSkinAIProvider_1.FallbackHeuristicSkinAIProvider();
                break;
        }
        return this.cachedProvider;
    }
}
exports.SkinAIProviderFactory = SkinAIProviderFactory;
