"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiSkinAIProvider = void 0;
const SkinPromptBuilder_1 = require("../utils/SkinPromptBuilder");
const FallbackHeuristicSkinAIProvider_1 = require("./FallbackHeuristicSkinAIProvider");
class GeminiSkinAIProvider {
    name = 'gemini';
    fallbackProvider = new FallbackHeuristicSkinAIProvider_1.FallbackHeuristicSkinAIProvider();
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
    }
    async askCoach(question, context) {
        if (!this.apiKey) {
            return this.fallbackProvider.askCoach(question, context);
        }
        try {
            const prompt = SkinPromptBuilder_1.SkinPromptBuilder.buildChatPrompt(question, context);
            const systemPrompt = SkinPromptBuilder_1.SkinPromptBuilder.buildSystemPrompt();
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `${systemPrompt}\n\n${prompt}` }],
                        },
                    ],
                }),
            });
            if (!response.ok) {
                return this.fallbackProvider.askCoach(question, context);
            }
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
                return this.fallbackProvider.askCoach(question, context);
            }
            return `${text}\n\n(Medical Disclaimer: Educational advice only. Please consult a board-certified dermatologist for medical skin conditions.)`;
        }
        catch {
            return this.fallbackProvider.askCoach(question, context);
        }
    }
    async streamResponse(question, context, onChunk) {
        const fullText = await this.askCoach(question, context);
        const words = fullText.split(' ');
        let current = '';
        for (const word of words) {
            current += (current ? ' ' : '') + word;
            onChunk(current);
            await new Promise((resolve) => setTimeout(resolve, 20));
        }
        return fullText;
    }
    async generateRecommendations(context, ruleRecommendations) {
        return this.fallbackProvider.generateRecommendations(context, ruleRecommendations);
    }
    async generateWeeklyReview(context) {
        return this.fallbackProvider.generateWeeklyReview(context);
    }
}
exports.GeminiSkinAIProvider = GeminiSkinAIProvider;
