"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepTrendConverter = exports.sleepGoalConverter = exports.sleepScheduleConverter = exports.sleepEntryConverter = void 0;
const firestore_1 = require("firebase/firestore");
exports.sleepEntryConverter = {
    toFirestore(entry) {
        const quality = entry.quality;
        return {
            userId: entry.userId,
            date: entry.date,
            bedtime: entry.bedtime instanceof Date ? firestore_1.Timestamp.fromDate(entry.bedtime) : firestore_1.Timestamp.now(),
            wakeTime: entry.wakeTime instanceof Date ? firestore_1.Timestamp.fromDate(entry.wakeTime) : firestore_1.Timestamp.now(),
            durationMinutes: entry.durationMinutes,
            quality: {
                rating: quality?.rating || 0,
                efficiencyPercentage: quality?.efficiencyPercentage ?? null,
                deepSleepMinutes: quality?.deepSleepMinutes ?? null,
                remSleepMinutes: quality?.remSleepMinutes ?? null,
                lightSleepMinutes: quality?.lightSleepMinutes ?? null,
                awakeMinutes: quality?.awakeMinutes ?? null,
            },
            recoveryScore: entry.recoveryScore ?? null,
            notes: entry.notes ?? null,
            timezone: entry.timezone ?? null,
            sleepSource: entry.sleepSource || 'manual',
            sleepEfficiency: entry.sleepEfficiency ?? null,
            sleepLatency: entry.sleepLatency ?? null,
            awakeDuration: entry.awakeDuration ?? null,
            interruptionsCount: entry.interruptionsCount ?? null,
            tags: entry.tags || [],
            createdAt: entry.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(entry.createdAt) : firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            date: data.date || '',
            bedtime: data.bedtime instanceof firestore_1.Timestamp ? data.bedtime.toDate() : new Date(),
            wakeTime: data.wakeTime instanceof firestore_1.Timestamp ? data.wakeTime.toDate() : new Date(),
            durationMinutes: typeof data.durationMinutes === 'number' ? data.durationMinutes : 0,
            quality: {
                rating: data.quality?.rating || 0,
                efficiencyPercentage: typeof data.quality?.efficiencyPercentage === 'number' ? data.quality.efficiencyPercentage : undefined,
                deepSleepMinutes: typeof data.quality?.deepSleepMinutes === 'number' ? data.quality.deepSleepMinutes : undefined,
                remSleepMinutes: typeof data.quality?.remSleepMinutes === 'number' ? data.quality.remSleepMinutes : undefined,
                lightSleepMinutes: typeof data.quality?.lightSleepMinutes === 'number' ? data.quality.lightSleepMinutes : undefined,
                awakeMinutes: typeof data.quality?.awakeMinutes === 'number' ? data.quality.awakeMinutes : undefined,
            },
            recoveryScore: typeof data.recoveryScore === 'number' ? data.recoveryScore : undefined,
            notes: data.notes || undefined,
            timezone: data.timezone || undefined,
            sleepSource: data.sleepSource || 'manual',
            sleepEfficiency: typeof data.sleepEfficiency === 'number' ? data.sleepEfficiency : undefined,
            sleepLatency: typeof data.sleepLatency === 'number' ? data.sleepLatency : undefined,
            awakeDuration: typeof data.awakeDuration === 'number' ? data.awakeDuration : undefined,
            interruptionsCount: typeof data.interruptionsCount === 'number' ? data.interruptionsCount : undefined,
            tags: Array.isArray(data.tags) ? data.tags : [],
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof firestore_1.Timestamp ? data.updatedAt.toDate() : new Date(),
        };
    },
};
exports.sleepScheduleConverter = {
    toFirestore(schedule) {
        return {
            userId: schedule.userId,
            targetBedtime: schedule.targetBedtime,
            targetWakeTime: schedule.targetWakeTime,
            targetDurationMinutes: schedule.targetDurationMinutes,
            weekdayBedtime: schedule.weekdayBedtime,
            weekdayWakeTime: schedule.weekdayWakeTime,
            weekendBedtime: schedule.weekendBedtime,
            weekendWakeTime: schedule.weekendWakeTime,
            isActive: schedule.isActive ?? true,
            effectiveFrom: schedule.effectiveFrom,
            effectiveUntil: schedule.effectiveUntil ?? null,
            createdAt: schedule.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(schedule.createdAt) : firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            targetBedtime: data.targetBedtime || '23:00',
            targetWakeTime: data.targetWakeTime || '07:00',
            targetDurationMinutes: typeof data.targetDurationMinutes === 'number' ? data.targetDurationMinutes : 480,
            weekdayBedtime: data.weekdayBedtime || '23:00',
            weekdayWakeTime: data.weekdayWakeTime || '07:00',
            weekendBedtime: data.weekendBedtime || '23:00',
            weekendWakeTime: data.weekendWakeTime || '07:00',
            isActive: data.isActive ?? true,
            effectiveFrom: data.effectiveFrom || '',
            effectiveUntil: data.effectiveUntil || undefined,
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof firestore_1.Timestamp ? data.updatedAt.toDate() : new Date(),
        };
    },
};
exports.sleepGoalConverter = {
    toFirestore(goal) {
        return {
            userId: goal.userId,
            category: goal.category,
            targetValue: goal.targetValue,
            targetTime: goal.targetTime ?? null,
            isActive: goal.isActive ?? true,
            createdAt: goal.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(goal.createdAt) : firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            category: data.category || 'duration',
            targetValue: typeof data.targetValue === 'number' ? data.targetValue : 0,
            targetTime: data.targetTime || undefined,
            isActive: data.isActive ?? true,
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof firestore_1.Timestamp ? data.updatedAt.toDate() : new Date(),
        };
    },
};
exports.sleepTrendConverter = {
    toFirestore(trend) {
        return {
            userId: trend.userId,
            startDate: trend.startDate,
            endDate: trend.endDate,
            averageDurationMinutes: trend.averageDurationMinutes,
            averageQualityScore: trend.averageQualityScore,
            averageRecoveryScore: trend.averageRecoveryScore,
            consistencyScore: trend.consistencyScore,
            trendDirection: trend.trendDirection,
            dataPoints: trend.dataPoints || [],
            calculatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            userId: data.userId || '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            averageDurationMinutes: typeof data.averageDurationMinutes === 'number' ? data.averageDurationMinutes : 0,
            averageQualityScore: typeof data.averageQualityScore === 'number' ? data.averageQualityScore : 0,
            averageRecoveryScore: typeof data.averageRecoveryScore === 'number' ? data.averageRecoveryScore : 0,
            consistencyScore: typeof data.consistencyScore === 'number' ? data.consistencyScore : 0,
            trendDirection: data.trendDirection || 'stable',
            dataPoints: Array.isArray(data.dataPoints) ? data.dataPoints : [],
        };
    },
};
