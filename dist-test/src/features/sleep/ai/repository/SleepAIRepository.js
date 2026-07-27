"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepAIRepository = exports.SleepAIRepository = void 0;
const types_1 = require("@/shared/types");
const AppError_1 = require("@/shared/errors/AppError");
const SleepContextBuilder_1 = require("../utils/SleepContextBuilder");
const providerFactory_1 = require("../providers/providerFactory");
const sleepAI_service_1 = require("../services/sleepAI.service");
const requestManager_1 = require("../utils/requestManager");
const sleep_repository_1 = require("../../repository/sleep.repository");
const sleepAnalytics_service_1 = require("../../services/sleepAnalytics.service");
class SleepAIRepository {
    service;
    requestManager;
    constructor(service = sleepAI_service_1.sleepAIService, requestManager = requestManager_1.sleepAIRequestManager) {
        this.service = service;
        this.requestManager = requestManager;
    }
    /**
     * Compiles the sleep context by loading all dependencies in parallel.
     * Resilient to individual repository failures by falling back to empty/null values.
     */
    async compileContext(userId) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        const formatDate = (d) => d.toISOString().split('T')[0];
        const weekStart = formatDate(start);
        const weekEnd = formatDate(end);
        const year = end.getFullYear();
        const month = end.getMonth() + 1;
        const [entriesRes, schedulesRes, goalsRes,] = await Promise.all([
            sleep_repository_1.sleepRepository.fetchEntries(userId, 30),
            sleep_repository_1.sleepScheduleRepository.fetchSchedules(userId),
            sleep_repository_1.sleepGoalRepository.fetchGoals(userId),
        ]);
        const entries = entriesRes.success ? entriesRes.data : [];
        const schedules = schedulesRes.success ? schedulesRes.data : [];
        const activeSchedule = schedules.find((s) => s.isActive) || null;
        const goals = goalsRes.success ? goalsRes.data : [];
        // Calculate weekly and monthly summaries from loaded raw database entries
        const weeklySummary = activeSchedule
            ? sleepAnalytics_service_1.sleepAnalyticsService.calculateWeeklySummary(userId, entries, activeSchedule, goals, weekStart, weekEnd)
            : null;
        const monthlySummary = activeSchedule
            ? sleepAnalytics_service_1.sleepAnalyticsService.calculateMonthlySummary(userId, entries, activeSchedule, goals, year, month)
            : null;
        // Resolve sleep debt and recovery from latest values
        const sleepDebt = weeklySummary
            ? { userId, date: weekEnd, sleepDebtMinutes: weeklySummary.averageSleepDebtMinutes, dailyDeficitMinutes: 0, calculatedAt: new Date() }
            : null;
        const recovery = weeklySummary
            ? { userId, date: weekEnd, recoveryScore: weeklySummary.averageRecoveryScore, status: 'good', components: { durationScore: 0, qualityScore: 0, consistencyScore: 0, debtPenalty: 0 }, calculatedAt: new Date() }
            : null;
        return SleepContextBuilder_1.SleepContextBuilder.buildContext({
            entries,
            schedule: activeSchedule,
            goals,
            recovery,
            sleepDebt,
            weeklySummary,
            monthlySummary,
        });
    }
    /**
     * Sends a message to the AI coach.
     */
    async askCoach(userId, conversationId, question, providerType = 'heuristic') {
        const requestKey = `chat_${userId}_${conversationId}`;
        try {
            // 1. Compile context
            const context = await this.compileContext(userId);
            // 2. Save the user's message to Firestore
            const userMessage = {
                id: `msg_user_${Date.now()}`,
                conversationId,
                sender: 'user',
                text: question,
                timestamp: new Date(),
            };
            await this.service.saveMessage(userId, conversationId, userMessage);
            // 3. Resolve AI provider and execute request via manager (with Fallback Coordination)
            let provider = providerFactory_1.SleepAIProviderFactory.getProvider(providerType);
            let aiText = '';
            let latencyMs = 0;
            const startTime = Date.now();
            try {
                aiText = await this.requestManager.execute(requestKey, async () => {
                    return await provider.askCoach(question, context);
                }, { cooldownMs: 1500, timeoutMs: 15000 });
                latencyMs = Date.now() - startTime;
            }
            catch (error) {
                if (providerType === 'gemini') {
                    // Coordinate fallback to heuristic
                    provider = providerFactory_1.SleepAIProviderFactory.getProvider('heuristic');
                    aiText = await this.requestManager.execute(requestKey, async () => {
                        return await provider.askCoach(question, context);
                    }, { cooldownMs: 0, timeoutMs: 15000 });
                    latencyMs = Date.now() - startTime;
                }
                else {
                    throw error;
                }
            }
            // 4. Save and return the AI's response message
            const aiMessage = {
                id: `msg_ai_${Date.now()}`,
                conversationId,
                sender: 'ai',
                text: aiText,
                timestamp: new Date(),
                providerName: provider.name,
                latencyMs,
            };
            await this.service.saveMessage(userId, conversationId, aiMessage);
            return (0, types_1.ok)(aiMessage);
        }
        catch (error) {
            const normalized = error instanceof AppError_1.AppError
                ? error
                : new AppError_1.AppError('AI_SERVICE_ERROR', error.message || 'Failed to get response from AI Coach', { originalError: error });
            return (0, types_1.err)(normalized);
        }
    }
    /**
     * Generates sleep recommendations based on context.
     */
    async generateRecommendations(userId, providerType = 'heuristic') {
        const requestKey = `recs_${userId}`;
        try {
            const context = await this.compileContext(userId);
            let provider = providerFactory_1.SleepAIProviderFactory.getProvider(providerType);
            let recommendations = [];
            try {
                recommendations = await this.requestManager.execute(requestKey, async () => {
                    return await provider.generateRecommendations(context);
                }, { cooldownMs: 3000, timeoutMs: 15000 });
            }
            catch (error) {
                if (providerType === 'gemini') {
                    // Coordinate fallback to heuristic
                    provider = providerFactory_1.SleepAIProviderFactory.getProvider('heuristic');
                    recommendations = await this.requestManager.execute(requestKey, async () => {
                        return await provider.generateRecommendations(context);
                    }, { cooldownMs: 0, timeoutMs: 15000 });
                }
                else {
                    throw error;
                }
            }
            // Save mapped provider name to recommendations
            const mappedRecs = recommendations.map((r) => ({
                ...r,
                providerName: provider.name,
            }));
            await this.service.saveRecommendations(userId, mappedRecs);
            return (0, types_1.ok)(mappedRecs);
        }
        catch (error) {
            const normalized = error instanceof AppError_1.AppError
                ? error
                : new AppError_1.AppError('AI_SERVICE_ERROR', error.message || 'Failed to generate sleep recommendations', { originalError: error });
            return (0, types_1.err)(normalized);
        }
    }
    /**
     * Generates the weekly review.
     */
    async generateWeeklyReview(userId, providerType = 'heuristic') {
        const requestKey = `review_${userId}`;
        try {
            const context = await this.compileContext(userId);
            let provider = providerFactory_1.SleepAIProviderFactory.getProvider(providerType);
            let review;
            try {
                review = await this.requestManager.execute(requestKey, async () => {
                    return await provider.generateWeeklyReview(context);
                }, { cooldownMs: 5000, timeoutMs: 15000 });
            }
            catch (error) {
                if (providerType === 'gemini') {
                    // Coordinate fallback to heuristic
                    provider = providerFactory_1.SleepAIProviderFactory.getProvider('heuristic');
                    review = await this.requestManager.execute(requestKey, async () => {
                        return await provider.generateWeeklyReview(context);
                    }, { cooldownMs: 0, timeoutMs: 15000 });
                }
                else {
                    throw error;
                }
            }
            const mappedReview = {
                ...review,
                providerName: provider.name,
            };
            await this.service.saveWeeklyReview(userId, mappedReview);
            return (0, types_1.ok)(mappedReview);
        }
        catch (error) {
            const normalized = error instanceof AppError_1.AppError
                ? error
                : new AppError_1.AppError('AI_SERVICE_ERROR', error.message || 'Failed to generate weekly sleep review', { originalError: error });
            return (0, types_1.err)(normalized);
        }
    }
}
exports.SleepAIRepository = SleepAIRepository;
exports.sleepAIRepository = new SleepAIRepository();
