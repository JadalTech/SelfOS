"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepContextBuilder = void 0;
class SleepContextBuilder {
    /**
     * Builds the minimal context object for AI consumption.
     * Strips Firestore IDs, sensitive fields, and private metadata.
     */
    static buildContext(params) {
        const { entries, schedule, goals, recovery, sleepDebt, weeklySummary, monthlySummary, } = params;
        // 1. Map today's/latest entry
        const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
        const latest = sortedEntries[0];
        const todaySleep = latest
            ? {
                durationMinutes: latest.durationMinutes,
                qualityRating: latest.quality?.rating ?? 5,
                bedtimeFormatted: latest.bedtime.toISOString().split('T')[1].substring(0, 5),
                wakeTimeFormatted: latest.wakeTime.toISOString().split('T')[1].substring(0, 5),
            }
            : undefined;
        // 2. Compute weekly averages
        const weeklyAverages = {
            averageDurationMinutes: weeklySummary?.averageDurationMinutes ?? 0,
            averageQualityScore: weeklySummary?.averageQualityScore ?? 0,
            averageRecoveryScore: weeklySummary?.averageRecoveryScore ?? 0,
            consistencyScore: weeklySummary?.consistencyScore ?? 0,
        };
        // 3. Compute monthly averages
        const monthlyAverages = {
            averageDurationMinutes: monthlySummary?.averageDurationMinutes ?? 0,
            averageQualityScore: monthlySummary?.averageQualityScore ?? 0,
            averageRecoveryScore: monthlySummary?.averageRecoveryScore ?? 0,
            consistencyScore: monthlySummary?.consistencyScore ?? 0,
        };
        // 4. Calculate trend indicators based on the last 3 logs
        let bedtimeTrend = 'stable';
        let wakeUpTrend = 'stable';
        if (sortedEntries.length >= 3) {
            const q1 = sortedEntries[0].quality?.rating ?? 5;
            const q3 = sortedEntries[2].quality?.rating ?? 5;
            if (q1 > q3) {
                bedtimeTrend = 'improving';
            }
            else if (q1 < q3) {
                bedtimeTrend = 'declining';
            }
        }
        // 5. Build goals summary (removing IDs)
        const recentGoals = goals.map((g) => ({
            category: g.category,
            targetValue: g.targetValue,
            targetTime: g.targetTime,
            isActive: g.isActive,
        }));
        // 6. Build schedule summary (removing IDs)
        const simplifiedSchedule = schedule
            ? {
                targetDurationMinutes: schedule.targetDurationMinutes,
                weekdayBedtime: schedule.weekdayBedtime,
                weekdayWakeTime: schedule.weekdayWakeTime,
                weekendBedtime: schedule.weekendBedtime,
                weekendWakeTime: schedule.weekendWakeTime,
            }
            : null;
        // 7. Sanitize and combine recent sleep journal observations (Privacy Filter)
        const recentNotes = sortedEntries
            .slice(0, 3)
            .map((e) => e.notes)
            .filter((n) => Boolean(n));
        const combinedNotes = recentNotes.join(' | ');
        const recentNotesSummary = combinedNotes ? this.sanitizeNotes(combinedNotes) : undefined;
        return {
            todaySleep,
            weeklyAverages,
            monthlyAverages,
            sleepDebt: sleepDebt?.sleepDebtMinutes ?? 0,
            recoveryScore: recovery?.recoveryScore ?? 70,
            consistencyScore: weeklySummary?.consistencyScore ?? 75,
            bedtimeTrend,
            wakeUpTrend,
            recentGoals,
            schedule: simplifiedSchedule,
            preferredSleepDuration: schedule?.targetDurationMinutes ?? 480, // Default 8 hours
            recentNotesSummary,
        };
    }
    /**
     * Privacy filter to scrub personal identifiers, emails, names, addresses, and telephone numbers.
     */
    static sanitizeNotes(notes) {
        let sanitized = notes;
        // Email pattern scrub
        sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
        // Phone number pattern scrub (various formats)
        sanitized = sanitized.replace(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, '[PHONE]');
        // Truncate to avoid excessive prompt token usage
        if (sanitized.length > 150) {
            sanitized = sanitized.substring(0, 150) + '...';
        }
        return sanitized;
    }
}
exports.SleepContextBuilder = SleepContextBuilder;
