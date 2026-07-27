"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiSleepAIProvider = void 0;
const SleepPromptBuilder_1 = require("../prompts/SleepPromptBuilder");
const AppError_1 = require("@/shared/errors/AppError");
class GeminiSleepAIProvider {
    name = 'gemini';
    apiKey;
    constructor(apiKey) {
        this.apiKey =
            apiKey ||
                process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
                process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
                '';
    }
    async askCoach(question, context) {
        if (!this.apiKey) {
            throw new AppError_1.AppError('AI_SERVICE_ERROR', 'Gemini API key is not configured.');
        }
        const prompt = SleepPromptBuilder_1.SleepPromptBuilder.buildChatPrompt(question, context);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        });
        if (!response.ok) {
            throw new AppError_1.AppError('AI_SERVICE_ERROR', `Gemini request failed with status: ${response.status}`);
        }
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new AppError_1.AppError('AI_SERVICE_ERROR', 'Gemini returned an empty response.');
        }
        return `${text.trim()}\n\n(Coach Disclaimer: Educational advice only. Consult a physician for chronic sleep problems.)`;
    }
    async generateRecommendations(context) {
        if (!this.apiKey) {
            throw new AppError_1.AppError('AI_SERVICE_ERROR', 'Gemini API key is not configured.');
        }
        const prompt = SleepPromptBuilder_1.SleepPromptBuilder.buildRecommendationsPrompt(context);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    responseMimeType: 'application/json',
                },
            }),
        });
        if (!response.ok) {
            throw new AppError_1.AppError('AI_SERVICE_ERROR', `Gemini recommendations failed with status: ${response.status}`);
        }
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new AppError_1.AppError('AI_SERVICE_ERROR', 'Gemini returned empty recommendations.');
        }
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed?.recommendations)) {
            return parsed.recommendations;
        }
        throw new AppError_1.AppError('AI_SERVICE_ERROR', 'Failed to parse Gemini recommendations array.');
    }
    async generateWeeklyReview(context) {
        if (!this.apiKey) {
            throw new AppError_1.AppError('AI_SERVICE_ERROR', 'Gemini API key is not configured.');
        }
        const prompt = SleepPromptBuilder_1.SleepPromptBuilder.buildWeeklyReviewPrompt(context);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    responseMimeType: 'application/json',
                },
            }),
        });
        if (!response.ok) {
            throw new AppError_1.AppError('AI_SERVICE_ERROR', `Gemini weekly review failed with status: ${response.status}`);
        }
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new AppError_1.AppError('AI_SERVICE_ERROR', 'Gemini returned empty weekly review.');
        }
        const parsed = JSON.parse(text);
        if (parsed?.summary && Array.isArray(parsed?.highlights)) {
            return parsed;
        }
        throw new AppError_1.AppError('AI_SERVICE_ERROR', 'Failed to parse Gemini weekly review structure.');
    }
}
exports.GeminiSleepAIProvider = GeminiSleepAIProvider;
