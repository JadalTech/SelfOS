"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSleepDuration = calculateSleepDuration;
exports.calculateTimeDifferenceMinutes = calculateTimeDifferenceMinutes;
exports.getTimeStringFromDate = getTimeStringFromDate;
exports.getDayOfWeekFromDateString = getDayOfWeekFromDateString;
exports.isWeekendNight = isWeekendNight;
exports.getTargetBedtimeAndWakeTime = getTargetBedtimeAndWakeTime;
exports.calculateSleepEfficiency = calculateSleepEfficiency;
exports.calculateBedtimeConsistency = calculateBedtimeConsistency;
exports.calculateWakeTimeConsistency = calculateWakeTimeConsistency;
exports.calculateScheduleConsistency = calculateScheduleConsistency;
exports.calculateSleepDebt = calculateSleepDebt;
exports.getDaysDifference = getDaysDifference;
exports.getPreviousDateString = getPreviousDateString;
exports.calculateSleepStreaks = calculateSleepStreaks;
exports.calculateRollingAverages = calculateRollingAverages;
exports.calculateGoalCompletionPercentage = calculateGoalCompletionPercentage;
/**
 * Calculates sleep duration in minutes between bedtime and wakeTime.
 */
function calculateSleepDuration(bedtime, wakeTime) {
    const diffMs = wakeTime.getTime() - bedtime.getTime();
    if (diffMs <= 0)
        return 0;
    return Math.round(diffMs / (1000 * 60));
}
/**
 * Calculates shortest difference in minutes between two HH:MM time strings on a circular 24-hour clock.
 */
function calculateTimeDifferenceMinutes(time1, time2) {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    const mins1 = h1 * 60 + m1;
    const mins2 = h2 * 60 + m2;
    let diff = Math.abs(mins1 - mins2);
    if (diff > 12 * 60) {
        diff = 24 * 60 - diff;
    }
    return diff;
}
/**
 * Extracts the time-of-day as an HH:MM string from a Date object in a timezone-safe manner.
 */
function getTimeStringFromDate(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
/**
 * Determines day of the week from a date string (YYYY-MM-DD) avoiding timezone shifts.
 * Returns 0 for Sunday, 6 for Saturday.
 */
function getDayOfWeekFromDateString(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDay();
}
/**
 * Determines if a date string represents a weekend night (Friday night or Saturday night).
 */
function isWeekendNight(dateStr) {
    const day = getDayOfWeekFromDateString(dateStr);
    return day === 5 || day === 6; // Friday = 5, Saturday = 6
}
/**
 * Resolves target bedtime and wakeTime for a specific date string under a schedule.
 */
function getTargetBedtimeAndWakeTime(dateStr, schedule) {
    const weekend = isWeekendNight(dateStr);
    return {
        targetBedtime: weekend ? schedule.weekendBedtime : schedule.weekdayBedtime,
        targetWakeTime: weekend ? schedule.weekendWakeTime : schedule.weekdayWakeTime,
    };
}
/**
 * Calculates sleep efficiency percentage.
 */
function calculateSleepEfficiency(durationMinutes, awakeDurationMinutes) {
    if (durationMinutes <= 0)
        return undefined;
    const awake = awakeDurationMinutes ?? 0;
    if (awake >= durationMinutes)
        return 0;
    return Math.round(((durationMinutes - awake) / durationMinutes) * 100);
}
/**
 * Calculates consistency score (0-100) based on average bedtime deviation from schedule targets.
 * Deviation is circular.
 */
function calculateBedtimeConsistency(entries, schedule) {
    if (entries.length === 0)
        return 100;
    let totalDeviation = 0;
    let count = 0;
    for (const entry of entries) {
        const { targetBedtime } = getTargetBedtimeAndWakeTime(entry.date, schedule);
        const actualTimeStr = getTimeStringFromDate(entry.bedtime);
        totalDeviation += calculateTimeDifferenceMinutes(actualTimeStr, targetBedtime);
        count++;
    }
    const avgDeviation = totalDeviation / count;
    // If average deviation is 2 hours (120 mins) or more, score is 0.
    // Otherwise, scale linearly from 100 (0 deviation) to 0 (120 mins deviation).
    return Math.round(Math.max(0, 100 - (avgDeviation / 1.2)));
}
/**
 * Calculates consistency score (0-100) based on average wake-up deviation from schedule targets.
 */
function calculateWakeTimeConsistency(entries, schedule) {
    if (entries.length === 0)
        return 100;
    let totalDeviation = 0;
    let count = 0;
    for (const entry of entries) {
        const { targetWakeTime } = getTargetBedtimeAndWakeTime(entry.date, schedule);
        const actualTimeStr = getTimeStringFromDate(entry.wakeTime);
        totalDeviation += calculateTimeDifferenceMinutes(actualTimeStr, targetWakeTime);
        count++;
    }
    const avgDeviation = totalDeviation / count;
    return Math.round(Math.max(0, 100 - (avgDeviation / 1.2)));
}
/**
 * Combines bedtime and wake-up consistency scores.
 */
function calculateScheduleConsistency(entries, schedule) {
    const bedtimeScore = calculateBedtimeConsistency(entries, schedule);
    const wakeTimeScore = calculateWakeTimeConsistency(entries, schedule);
    return Math.round((bedtimeScore + wakeTimeScore) / 2);
}
/**
 * Calculates cumulative sleep debt in minutes relative to a target duration.
 * Positive value represents deficit, negative value represents surplus.
 */
function calculateSleepDebt(entries, targetDurationMinutes) {
    return entries.reduce((acc, entry) => {
        const dailyDeficit = targetDurationMinutes - entry.durationMinutes;
        return acc + dailyDeficit;
    }, 0);
}
/**
 * Helper to calculate the difference in calendar days between two YYYY-MM-DD date strings.
 */
function getDaysDifference(dateStr1, dateStr2) {
    const [y1, m1, d1] = dateStr1.split('-').map(Number);
    const [y2, m2, d2] = dateStr2.split('-').map(Number);
    const date1 = new Date(Date.UTC(y1, m1 - 1, d1));
    const date2 = new Date(Date.UTC(y2, m2 - 1, d2));
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
/**
 * Helper to get the previous calendar day's YYYY-MM-DD date string.
 */
function getPreviousDateString(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() - 1);
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
/**
 * Calculates sleep streaks: consecutive days of logging sleep entries AND meeting the sleep target.
 */
function calculateSleepStreaks(entries, targetDurationMinutes, referenceDateStr) {
    if (entries.length === 0)
        return 0;
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    const latestDateStr = sorted[0].date;
    const todayStr = referenceDateStr ?? new Date().toISOString().split('T')[0];
    const daysDiff = getDaysDifference(latestDateStr, todayStr);
    if (daysDiff > 1) {
        // If the latest logged entry is older than yesterday, the active streak is broken (0)
        return 0;
    }
    let currentStreak = 0;
    let expectedDateStr = latestDateStr;
    for (const entry of sorted) {
        if (entry.date !== expectedDateStr) {
            break;
        }
        if (entry.durationMinutes >= targetDurationMinutes) {
            currentStreak++;
            expectedDateStr = getPreviousDateString(expectedDateStr);
        }
        else {
            break;
        }
    }
    return currentStreak;
}
/**
 * Calculates rolling average statistics for entries in a given date range.
 */
function calculateRollingAverages(entries, days, referenceDateStr) {
    const [refY, refM, refD] = referenceDateStr.split('-').map(Number);
    const refDate = new Date(Date.UTC(refY, refM - 1, refD));
    const minDate = new Date(refDate);
    minDate.setUTCDate(minDate.getUTCDate() - days + 1);
    const minDateStr = minDate.toISOString().split('T')[0];
    const filtered = entries.filter((entry) => entry.date >= minDateStr && entry.date <= referenceDateStr);
    if (filtered.length === 0) {
        return {
            averageDurationMinutes: 0,
            averageQualityScore: 0,
            averageRecoveryScore: 0,
            averageEfficiencyPercentage: 0,
        };
    }
    let totalDuration = 0;
    let totalQuality = 0;
    let totalRecovery = 0;
    let totalEfficiency = 0;
    let efficiencyCount = 0;
    let recoveryCount = 0;
    for (const entry of filtered) {
        totalDuration += entry.durationMinutes;
        totalQuality += entry.quality.rating;
        if (entry.recoveryScore !== undefined) {
            totalRecovery += entry.recoveryScore;
            recoveryCount++;
        }
        const efficiency = entry.sleepEfficiency ?? calculateSleepEfficiency(entry.durationMinutes, entry.awakeDuration);
        if (efficiency !== undefined) {
            totalEfficiency += efficiency;
            efficiencyCount++;
        }
    }
    return {
        averageDurationMinutes: Math.round(totalDuration / filtered.length),
        averageQualityScore: Math.round((totalQuality / filtered.length) * 10) / 10,
        averageRecoveryScore: recoveryCount > 0 ? Math.round(totalRecovery / recoveryCount) : 0,
        averageEfficiencyPercentage: efficiencyCount > 0 ? Math.round(totalEfficiency / efficiencyCount) : 0,
    };
}
/**
 * Calculates goal completion rate (0-100) for a set of goals against a single sleep entry and active schedule context.
 */
function calculateGoalCompletionPercentage(entry, goals, schedule, consistencyScore) {
    if (goals.length === 0)
        return 0;
    let completed = 0;
    const { targetBedtime, targetWakeTime } = getTargetBedtimeAndWakeTime(entry.date, schedule);
    for (const goal of goals) {
        switch (goal.category) {
            case 'duration':
                if (entry.durationMinutes >= goal.targetValue) {
                    completed++;
                }
                break;
            case 'bedtime': {
                const goalBedtime = goal.targetTime ?? targetBedtime;
                const actualBedtimeStr = getTimeStringFromDate(entry.bedtime);
                const deviation = calculateTimeDifferenceMinutes(actualBedtimeStr, goalBedtime);
                if (deviation <= goal.targetValue) {
                    completed++;
                }
                break;
            }
            case 'wake_time': {
                const goalWakeTime = goal.targetTime ?? targetWakeTime;
                const actualWakeTimeStr = getTimeStringFromDate(entry.wakeTime);
                const deviation = calculateTimeDifferenceMinutes(actualWakeTimeStr, goalWakeTime);
                if (deviation <= goal.targetValue) {
                    completed++;
                }
                break;
            }
            case 'consistency':
                if (consistencyScore >= goal.targetValue) {
                    completed++;
                }
                break;
            case 'recovery':
                if (entry.recoveryScore !== undefined && entry.recoveryScore >= goal.targetValue) {
                    completed++;
                }
                break;
        }
    }
    return Math.round((completed / goals.length) * 100);
}
