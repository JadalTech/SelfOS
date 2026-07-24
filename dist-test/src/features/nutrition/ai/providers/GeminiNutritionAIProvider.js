"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiNutritionAIProvider = void 0;
const FallbackHeuristicNutritionAIProvider_1 = require("./FallbackHeuristicNutritionAIProvider");
const NutritionPrompts_1 = require("../prompts/templates/NutritionPrompts");
class GeminiNutritionAIProvider {
    name = 'gemini';
    fallbackProvider = new FallbackHeuristicNutritionAIProvider_1.FallbackHeuristicNutritionAIProvider();
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
    }
    async askCoach(question, context) {
        if (!this.apiKey) {
            return this.fallbackProvider.askCoach(question, context);
        }
        try {
            const prompt = NutritionPrompts_1.NutritionPromptBuilder.buildChatPrompt(question, context);
            const systemPrompt = NutritionPrompts_1.NutritionPromptBuilder.buildSystemPrompt();
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
            return `${text}\n\n(Dietitian Disclaimer: Educational advice only. Please consult a registered dietitian or healthcare provider for medical nutritional guidance.)`;
        }
        catch {
            return this.fallbackProvider.askCoach(question, context);
        }
    }
    async generateRecommendations(context) {
        if (!this.apiKey) {
            return this.fallbackProvider.generateRecommendations(context);
        }
        try {
            const prompt = NutritionPrompts_1.NutritionPromptBuilder.buildRecommendationsPrompt(context);
            const systemPrompt = NutritionPrompts_1.NutritionPromptBuilder.buildSystemPrompt();
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
                    generationConfig: {
                        responseMimeType: 'application/json',
                    },
                }),
            });
            if (!response.ok) {
                return this.fallbackProvider.generateRecommendations(context);
            }
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
                return this.fallbackProvider.generateRecommendations(context);
            }
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed?.recommendations)) {
                return parsed.recommendations;
            }
            return this.fallbackProvider.generateRecommendations(context);
        }
        catch {
            return this.fallbackProvider.generateRecommendations(context);
        }
    }
    async generateWeeklyReview(context) {
        if (!this.apiKey) {
            return this.fallbackProvider.generateWeeklyReview(context);
        }
        try {
            const prompt = NutritionPrompts_1.NutritionPromptBuilder.buildWeeklyReviewPrompt(context);
            const systemPrompt = NutritionPrompts_1.NutritionPromptBuilder.buildSystemPrompt();
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
                    generationConfig: {
                        responseMimeType: 'application/json',
                    },
                }),
            });
            if (!response.ok) {
                return this.fallbackProvider.generateWeeklyReview(context);
            }
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
                return this.fallbackProvider.generateWeeklyReview(context);
            }
            const parsed = JSON.parse(text);
            if (parsed?.summary && Array.isArray(parsed?.highlights)) {
                return parsed;
            }
            return this.fallbackProvider.generateWeeklyReview(context);
        }
        catch {
            return this.fallbackProvider.generateWeeklyReview(context);
        }
    }
}
exports.GeminiNutritionAIProvider = GeminiNutritionAIProvider;
