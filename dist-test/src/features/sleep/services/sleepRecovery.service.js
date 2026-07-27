"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepRecoveryService = exports.SleepRecoveryService = void 0;
class SleepRecoveryService {
    /**
     * Calculates a detailed SleepRecovery score and status.
     * Weight distribution:
     * - Sleep Duration Adherence: 40%
     * - Sleep Quality Score: 40%
     * - Schedule Consistency: 20%
     * - Penalty: -1 point per 30 minutes of cumulative sleep debt (max deduction of 20 points)
     */
    calculateRecovery(userId, entry, schedule, sleepDebtMinutes, consistencyScore) {
        // 1. Duration score: how close did we get to the target duration?
        const targetDuration = schedule.targetDurationMinutes || 480;
        const durationScore = Math.min(100, (entry.durationMinutes / targetDuration) * 100);
        // 2. Quality score: scale perceived rating (1-10) to 0-100
        const qualityScore = entry.quality.rating * 10;
        // 3. Debt penalty: deduct 1 point for every 30 mins of sleep debt
        // If debt is negative (surplus), there is no penalty (debtPenalty = 0)
        const debtPenalty = Math.min(20, Math.max(0, sleepDebtMinutes / 30));
        // 4. Base weighted score
        const baseScore = (durationScore * 0.4) + (qualityScore * 0.4) + (consistencyScore * 0.2);
        // 5. Final recovery score (bounded between 0 and 100)
        const recoveryScore = Math.round(Math.min(100, Math.max(0, baseScore - debtPenalty)));
        // 6. Status classification
        let status = 'poor';
        if (recoveryScore >= 90) {
            status = 'optimal';
        }
        else if (recoveryScore >= 70) {
            status = 'good';
        }
        else if (recoveryScore >= 50) {
            status = 'fair';
        }
        return {
            userId,
            date: entry.date,
            recoveryScore,
            status,
            components: {
                durationScore: Math.round(durationScore),
                qualityScore: Math.round(qualityScore),
                consistencyScore: Math.round(consistencyScore),
                debtPenalty: Math.round(debtPenalty * 10) / 10,
            },
            calculatedAt: new Date(),
        };
    }
}
exports.SleepRecoveryService = SleepRecoveryService;
exports.sleepRecoveryService = new SleepRecoveryService();
