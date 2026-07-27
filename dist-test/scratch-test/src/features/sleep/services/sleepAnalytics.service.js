"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepAnalyticsService = exports.SleepAnalyticsService = void 0;
const SleepEngine = __importStar(require("../engine/sleepEngine"));
class SleepAnalyticsService {
    /**
     * Generates a weekly sleep summary from a list of entries and context.
     */
    calculateWeeklySummary(userId, entries, schedule, goals, weekStartDate, weekEndDate) {
        // Filter entries that fall within the week
        const weekEntries = entries.filter((e) => e.date >= weekStartDate && e.date <= weekEndDate);
        const count = weekEntries.length;
        if (count === 0) {
            return {
                userId,
                weekStartDate,
                weekEndDate,
                averageDurationMinutes: 0,
                averageQualityScore: 0,
                averageRecoveryScore: 0,
                averageSleepDebtMinutes: 0,
                consistencyScore: 100,
                averageBedtimeDeviationMinutes: 0,
                averageWakeTimeDeviationMinutes: 0,
                goalCompletionRate: 0,
                entriesCount: 0,
            };
        }
        // Averages calculation
        const totalDuration = weekEntries.reduce((sum, e) => sum + e.durationMinutes, 0);
        const totalQuality = weekEntries.reduce((sum, e) => sum + e.quality.rating, 0);
        const recoveryEntries = weekEntries.filter((e) => e.recoveryScore !== undefined);
        const totalRecovery = recoveryEntries.reduce((sum, e) => sum + (e.recoveryScore || 0), 0);
        // Deviations
        let totalBedtimeDev = 0;
        let totalWakeTimeDev = 0;
        for (const entry of weekEntries) {
            const { targetBedtime, targetWakeTime } = SleepEngine.getTargetBedtimeAndWakeTime(entry.date, schedule);
            const actualBedtimeStr = SleepEngine.getTimeStringFromDate(entry.bedtime);
            const actualWakeTimeStr = SleepEngine.getTimeStringFromDate(entry.wakeTime);
            totalBedtimeDev += SleepEngine.calculateTimeDifferenceMinutes(actualBedtimeStr, targetBedtime);
            totalWakeTimeDev += SleepEngine.calculateTimeDifferenceMinutes(actualWakeTimeStr, targetWakeTime);
        }
        // Consistency score
        const consistencyScore = SleepEngine.calculateScheduleConsistency(weekEntries, schedule);
        // Sleep Debt: calculate average debt for the week relative to schedule targets
        const targetDuration = schedule.targetDurationMinutes || 480;
        const debtMinutes = SleepEngine.calculateSleepDebt(weekEntries, targetDuration);
        // Goal Completion Rate (0.0 to 1.0)
        let totalCompletion = 0;
        for (const entry of weekEntries) {
            const entryCompletion = SleepEngine.calculateGoalCompletionPercentage(entry, goals, schedule, consistencyScore);
            totalCompletion += entryCompletion;
        }
        const goalCompletionRate = count > 0 ? (totalCompletion / count) / 100 : 0;
        return {
            userId,
            weekStartDate,
            weekEndDate,
            averageDurationMinutes: Math.round(totalDuration / count),
            averageQualityScore: Math.round((totalQuality / count) * 10) / 10,
            averageRecoveryScore: recoveryEntries.length > 0 ? Math.round(totalRecovery / recoveryEntries.length) : 0,
            averageSleepDebtMinutes: Math.round(debtMinutes / count),
            consistencyScore,
            averageBedtimeDeviationMinutes: Math.round(totalBedtimeDev / count),
            averageWakeTimeDeviationMinutes: Math.round(totalWakeTimeDev / count),
            goalCompletionRate: Math.round(goalCompletionRate * 100) / 100, // round to 2 decimals
            entriesCount: count,
        };
    }
    /**
     * Generates a monthly sleep summary from a list of entries and context.
     */
    calculateMonthlySummary(userId, entries, schedule, goals, year, month) {
        const padMonth = String(month).padStart(2, '0');
        const prefix = `${year}-${padMonth}`;
        const monthEntries = entries.filter((e) => e.date.startsWith(prefix));
        const count = monthEntries.length;
        if (count === 0) {
            return {
                userId,
                year,
                month,
                averageDurationMinutes: 0,
                averageQualityScore: 0,
                averageRecoveryScore: 0,
                averageSleepDebtMinutes: 0,
                consistencyScore: 100,
                goalCompletionRate: 0,
                entriesCount: 0,
            };
        }
        const totalDuration = monthEntries.reduce((sum, e) => sum + e.durationMinutes, 0);
        const totalQuality = monthEntries.reduce((sum, e) => sum + e.quality.rating, 0);
        const recoveryEntries = monthEntries.filter((e) => e.recoveryScore !== undefined);
        const totalRecovery = recoveryEntries.reduce((sum, e) => sum + (e.recoveryScore || 0), 0);
        const targetDuration = schedule.targetDurationMinutes || 480;
        const debtMinutes = SleepEngine.calculateSleepDebt(monthEntries, targetDuration);
        const consistencyScore = SleepEngine.calculateScheduleConsistency(monthEntries, schedule);
        let totalCompletion = 0;
        for (const entry of monthEntries) {
            const entryCompletion = SleepEngine.calculateGoalCompletionPercentage(entry, goals, schedule, consistencyScore);
            totalCompletion += entryCompletion;
        }
        const goalCompletionRate = count > 0 ? (totalCompletion / count) / 100 : 0;
        return {
            userId,
            year,
            month,
            averageDurationMinutes: Math.round(totalDuration / count),
            averageQualityScore: Math.round((totalQuality / count) * 10) / 10,
            averageRecoveryScore: recoveryEntries.length > 0 ? Math.round(totalRecovery / recoveryEntries.length) : 0,
            averageSleepDebtMinutes: Math.round(debtMinutes / count),
            consistencyScore,
            goalCompletionRate: Math.round(goalCompletionRate * 100) / 100,
            entriesCount: count,
        };
    }
    /**
     * Generates FeatureAnalytics objects for system integrations.
     */
    mapToFeatureAnalytics(userId, entries, schedule, goals) {
        if (entries.length === 0)
            return [];
        const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
        const latestEntry = sorted[0];
        const timestamp = latestEntry.createdAt;
        const weeklyAvg = SleepEngine.calculateRollingAverages(entries, 7, latestEntry.date);
        const targetDuration = schedule.targetDurationMinutes || 480;
        const debt = SleepEngine.calculateSleepDebt(entries.slice(0, 7), targetDuration);
        const consistency = SleepEngine.calculateScheduleConsistency(entries.slice(0, 7), schedule);
        // Goal completion for the latest entry
        const goalCompletion = SleepEngine.calculateGoalCompletionPercentage(latestEntry, goals, schedule, consistency);
        return [
            {
                feature: 'sleep',
                metric: 'average_duration',
                value: weeklyAvg.averageDurationMinutes,
                score: Math.min(1.0, weeklyAvg.averageDurationMinutes / targetDuration),
                trend: weeklyAvg.averageDurationMinutes >= targetDuration ? 'stable' : 'declining',
                timestamp,
            },
            {
                feature: 'sleep',
                metric: 'average_quality',
                value: weeklyAvg.averageQualityScore,
                score: weeklyAvg.averageQualityScore / 10, // scaled to 0.0 - 1.0
                trend: weeklyAvg.averageQualityScore >= 7 ? 'improving' : 'stable',
                timestamp,
            },
            {
                feature: 'sleep',
                metric: 'consistency_score',
                value: consistency,
                score: consistency / 100, // scaled to 0.0 - 1.0
                trend: consistency >= 80 ? 'stable' : 'declining',
                timestamp,
            },
            {
                feature: 'sleep',
                metric: 'sleep_debt',
                value: debt,
                score: Math.max(0, 1 - debt / 480), // penalty scale
                trend: debt > 0 ? 'declining' : 'improving',
                timestamp,
            },
            {
                feature: 'sleep',
                metric: 'recovery_score',
                value: weeklyAvg.averageRecoveryScore,
                score: weeklyAvg.averageRecoveryScore / 100, // scaled to 0.0 - 1.0
                trend: weeklyAvg.averageRecoveryScore >= 75 ? 'improving' : 'stable',
                timestamp,
            },
            {
                feature: 'sleep',
                metric: 'goal_completion',
                value: goalCompletion,
                score: goalCompletion / 100,
                trend: goalCompletion >= 70 ? 'stable' : 'declining',
                timestamp,
            },
        ];
    }
}
exports.SleepAnalyticsService = SleepAnalyticsService;
exports.sleepAnalyticsService = new SleepAnalyticsService();
