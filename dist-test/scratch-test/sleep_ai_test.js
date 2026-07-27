"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
globalThis.__DEV__ = true;
if (typeof require !== 'undefined') {
    const Module = require('module');
    const path = require('path');
    const originalRequire = Module.prototype.require;
    // Resolve `@/` alias to the compiled `dist-test/src/` directory
    const srcPath = path.resolve(__dirname, '../src');
    Module.prototype.require = function (name) {
        if (name.startsWith('@/')) {
            const resolvedPath = name.replace('@/', srcPath + '/');
            return originalRequire.call(this, resolvedPath);
        }
        if (name === 'react-native') {
            return {
                Platform: { OS: 'ios' },
            };
        }
        if (name === '@react-native-async-storage/async-storage') {
            return {};
        }
        if (name === 'expo-constants') {
            return {
                default: {
                    expoConfig: {
                        extra: {},
                    },
                },
            };
        }
        return originalRequire.apply(this, arguments);
    };
}
/**
 * Scratch Unit Verification Script for Sleep AI Coach
 */
const SleepPromptBuilder_1 = require("../src/features/sleep/ai/prompts/SleepPromptBuilder");
const SleepContextBuilder_1 = require("../src/features/sleep/ai/utils/SleepContextBuilder");
const FallbackHeuristicSleepAIProvider_1 = require("../src/features/sleep/ai/providers/FallbackHeuristicSleepAIProvider");
const providerFactory_1 = require("../src/features/sleep/ai/providers/providerFactory");
const requestManager_1 = require("../src/features/sleep/ai/utils/requestManager");
const SleepAIRepository_1 = require("../src/features/sleep/ai/repository/SleepAIRepository");
const AppError_1 = require("../src/shared/errors/AppError");
const sleep_repository_1 = require("../src/features/sleep/repository/sleep.repository");
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}
async function runTests() {
    console.log('=== Starting Sleep AI Coach Unit & Integration Tests ===');
    // ==========================================
    // Test 1: SleepPromptBuilder
    // ==========================================
    console.log('Running Test 1: Prompt Builder...');
    const systemPrompt = SleepPromptBuilder_1.SleepPromptBuilder.buildSystemPrompt();
    assert(systemPrompt.includes('Sleep Coach'), 'System prompt should describe persona');
    const safetySection = SleepPromptBuilder_1.SleepPromptBuilder.buildSafetySection();
    assert(safetySection.includes('NEVER diagnose'), 'Safety section should restrict medical diagnostics');
    const sampleContext = {
        weeklyAverages: { averageDurationMinutes: 450, averageQualityScore: 7.2, averageRecoveryScore: 68, consistencyScore: 72 },
        monthlyAverages: { averageDurationMinutes: 440, averageQualityScore: 7.0, averageRecoveryScore: 65, consistencyScore: 70 },
        sleepDebt: 120,
        recoveryScore: 68,
        consistencyScore: 72,
        bedtimeTrend: 'stable',
        wakeUpTrend: 'stable',
        recentGoals: [{ category: 'duration', targetValue: 480, isActive: true }],
        schedule: { targetDurationMinutes: 480, weekdayBedtime: '23:00', weekdayWakeTime: '07:00', weekendBedtime: '23:30', weekendWakeTime: '07:30' },
        preferredSleepDuration: 480,
    };
    const contextPrompt = SleepPromptBuilder_1.SleepPromptBuilder.buildContextSection(sampleContext);
    assert(contextPrompt.includes('Sleep Debt: 120 minutes'), 'Context prompt should contain sleep debt');
    assert(contextPrompt.includes('Recovery Rating: 68%'), 'Context prompt should contain recovery rating');
    console.log('✅ Test 1 Passed');
    // ==========================================
    // Test 2: SleepContextBuilder & Privacy Filters
    // ==========================================
    console.log('Running Test 2: Context Builder & Privacy scrub...');
    const mockEntries = [
        {
            id: 'db_id_123',
            userId: 'user_123',
            date: '2026-07-27',
            bedtime: new Date('2026-07-26T23:00:00Z'),
            wakeTime: new Date('2026-07-27T07:00:00Z'),
            durationMinutes: 480,
            quality: { rating: 8, efficiencyPercentage: 92, deepSleepMinutes: 120, remSleepMinutes: 90, lightSleepMinutes: 270, awakeMinutes: 40 },
            sleepSource: 'manual',
            createdAt: new Date(),
            updatedAt: new Date(),
            notes: 'Contact doctor at test@example.com or call 555-0199 about sleep. Let John Doe know.',
        },
    ];
    const mockGoals = [
        {
            id: 'goal_db_id',
            userId: 'user_123',
            category: 'duration',
            targetValue: 480,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];
    const mockSchedule = {
        id: 'sched_db_id',
        userId: 'user_123',
        weekdayBedtime: '23:00',
        weekdayWakeTime: '07:00',
        weekendBedtime: '23:00',
        weekendWakeTime: '07:00',
        targetBedtime: '23:00',
        targetWakeTime: '07:00',
        targetDurationMinutes: 480,
        isActive: true,
        effectiveFrom: '2026-07-01',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const context = SleepContextBuilder_1.SleepContextBuilder.buildContext({
        entries: mockEntries,
        goals: mockGoals,
        schedule: mockSchedule,
        recovery: null,
        sleepDebt: null,
        weeklySummary: null,
        monthlySummary: null,
    });
    // Verify DB keys are stripped
    assert(!context.id, 'Database identifier should be stripped');
    assert(!context.recentGoals[0].id, 'Goal DB ID should be stripped');
    assert(!context.schedule.id, 'Schedule DB ID should be stripped');
    // Verify privacy scrubbing in notes
    const sanitizedNotes = context.recentNotesSummary || '';
    assert(sanitizedNotes.includes('[EMAIL]'), 'Email address should be scrubbed');
    assert(sanitizedNotes.includes('[PHONE]'), 'Phone number should be scrubbed');
    assert(!sanitizedNotes.includes('test@example.com'), 'Raw email must not exist');
    console.log('✅ Test 2 Passed');
    // ==========================================
    // Test 3: Heuristic offline recommendations rules
    // ==========================================
    console.log('Running Test 3: Fallback Heuristic rules...');
    const provider = new FallbackHeuristicSleepAIProvider_1.FallbackHeuristicSleepAIProvider();
    // Test chronic sleep debt rule
    const debtContext = {
        ...sampleContext,
        sleepDebt: 240, // high debt
    };
    const debtRecs = await provider.generateRecommendations(debtContext);
    assert(debtRecs.some((r) => r.id === 'rec_sleep_debt_chronic'), 'Should trigger chronic sleep debt recommendation');
    // Test low recovery score rule
    const recoveryContext = {
        ...sampleContext,
        recoveryScore: 40,
    };
    const recoveryRecs = await provider.generateRecommendations(recoveryContext);
    assert(recoveryRecs.some((r) => r.id === 'rec_recovery_decline'), 'Should trigger recovery decline recommendation');
    // Test social jetlag rule
    const jetlagContext = {
        ...sampleContext,
        schedule: {
            targetDurationMinutes: 480,
            weekdayBedtime: '22:00',
            weekdayWakeTime: '06:00',
            weekendBedtime: '00:30', // shifts by 2.5 hours!
            weekendWakeTime: '08:30',
        },
    };
    const jetlagRecs = await provider.generateRecommendations(jetlagContext);
    assert(jetlagRecs.some((r) => r.id === 'rec_social_jetlag'), 'Should trigger Social Jetlag warning');
    // Test low consistency rule
    const consistencyContext = {
        ...sampleContext,
        consistencyScore: 50,
    };
    const consistencyRecs = await provider.generateRecommendations(consistencyContext);
    assert(consistencyRecs.some((r) => r.id === 'rec_improve_consistency'), 'Should trigger schedule consistency recommendations');
    console.log('✅ Test 3 Passed');
    // ==========================================
    // Test 4: SleepAIProviderFactory caching
    // ==========================================
    console.log('Running Test 4: Provider Factory...');
    const mockProv1 = providerFactory_1.SleepAIProviderFactory.getProvider('mock');
    const mockProv2 = providerFactory_1.SleepAIProviderFactory.getProvider('mock');
    assert(mockProv1.name === 'mock', 'Factory should return correct mock provider');
    assert(mockProv1 === mockProv2, 'Factory should return cached provider instances');
    const heurProv = providerFactory_1.SleepAIProviderFactory.getProvider('heuristic');
    assert(heurProv.name === 'heuristic', 'Factory should return heuristic provider');
    console.log('✅ Test 4 Passed');
    // ==========================================
    // Test 5: RequestManager concurrency and rate limits
    // ==========================================
    console.log('Running Test 5: Request Manager queueing and rate limits...');
    const manager = new requestManager_1.RequestManager();
    // Test cooldown rate-limiting
    let callCount = 0;
    const action = async () => {
        callCount++;
        return 'response';
    };
    const res1 = await manager.execute('test_user', action, { cooldownMs: 1000 });
    assert(res1 === 'response', 'First request should execute successfully');
    try {
        await manager.execute('test_user', action, { cooldownMs: 1000 });
        assert(false, 'Should throw rate limit error on rapid calls');
    }
    catch (err) {
        assert(err instanceof AppError_1.AppError && err.code === 'AI_COOLDOWN', 'Should throw Rate Limit AppError');
    }
    // Test duplicate request deduplication (cancels previous)
    const slowAction = async (signal) => {
        return new Promise((resolve, reject) => {
            const id = setTimeout(() => resolve('done'), 100);
            signal.addEventListener('abort', () => {
                clearTimeout(id);
                reject(new Error('aborted'));
            });
        });
    };
    // Trigger two overlapping requests for the same key. The second should cancel the first.
    const promise1 = manager.execute('overlap_key', slowAction, { cooldownMs: 0 });
    const promise2 = manager.execute('overlap_key', slowAction, { cooldownMs: 0 });
    try {
        await promise1;
        assert(false, 'First promise should have aborted');
    }
    catch (err) {
        assert(err.message === 'Request aborted.' || err.name === 'AbortError' || err.code === 'NETWORK_ERROR', 'First promise should abort');
    }
    const resOverlap = await promise2;
    assert(resOverlap === 'done', 'Second promise should complete');
    console.log('✅ Test 5 Passed');
    // ==========================================
    // Test 6: SleepAIRepository pipelines & fallbacks
    // ==========================================
    console.log('Running Test 6: Repository and Fallbacks...');
    // Mock service layer
    const mockService = {
        saveMessage: async () => { },
        getConversation: async () => [],
        saveRecommendations: async () => { },
        getLatestRecommendations: async () => [],
        saveWeeklyReview: async () => { },
        getLatestWeeklyReview: async () => null,
    };
    // Instantiating repository with mock service
    const repo = new SleepAIRepository_1.SleepAIRepository(mockService, manager);
    // Set mock database data mocks
    // Mocking imports of repository functions
    sleep_repository_1.sleepRepository.fetchEntries = async () => ({ success: true, data: mockEntries });
    sleep_repository_1.sleepScheduleRepository.fetchSchedules = async () => ({ success: true, data: [mockSchedule] });
    sleep_repository_1.sleepGoalRepository.fetchGoals = async () => ({ success: true, data: mockGoals });
    // Test askCoach with Gemini 500 error fallback
    // Mocking the global fetch method
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
        return {
            ok: false,
            status: 500,
            json: async () => ({}),
        };
    };
    // Calling askCoach with 'gemini'. Since fetch fails, it must fall back to Heuristic provider
    const chatRes = await repo.askCoach('user_123', 'conv_123', 'Tell me about sleep debt', 'gemini');
    assert(chatRes.success, 'askCoach should return successfully');
    if (chatRes.success) {
        assert(chatRes.data.providerName === 'heuristic', 'Should fallback to heuristic provider on Gemini error');
        assert(chatRes.data.text.includes('sleep debt'), 'Should return heuristic reply');
    }
    // Restore fetch
    globalThis.fetch = originalFetch;
    console.log('✅ Test 6 Passed');
    console.log('=== All Sleep AI Coach Tests Passed Successfully! ===');
}
runTests().catch((err) => {
    console.error('Test run failed with error:', err);
    process.exit(1);
});
