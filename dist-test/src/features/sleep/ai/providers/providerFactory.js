"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepAIProviderFactory = void 0;
const GeminiSleepAIProvider_1 = require("./GeminiSleepAIProvider");
const FallbackHeuristicSleepAIProvider_1 = require("./FallbackHeuristicSleepAIProvider");
const MockSleepAIProvider_1 = require("./MockSleepAIProvider");
class SleepAIProviderFactory {
    static instances = new Map();
    static getProvider(type = 'heuristic', apiKey) {
        if (this.instances.has(type)) {
            return this.instances.get(type);
        }
        let instance;
        switch (type) {
            case 'gemini':
                instance = new GeminiSleepAIProvider_1.GeminiSleepAIProvider(apiKey);
                break;
            case 'mock':
                instance = new MockSleepAIProvider_1.MockSleepAIProvider();
                break;
            case 'heuristic':
            default:
                instance = new FallbackHeuristicSleepAIProvider_1.FallbackHeuristicSleepAIProvider();
                break;
        }
        this.instances.set(type, instance);
        return instance;
    }
    static clearCache() {
        this.instances.clear();
    }
}
exports.SleepAIProviderFactory = SleepAIProviderFactory;
