"use strict";
/**
 * Streak Calculation Engine
 *
 * Implements calculations for streaks and consecutive verification.
 * Strictly pure functions - no database operations, no side effects.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConsecutiveCompletion = isConsecutiveCompletion;
exports.calculateCompletionStreak = calculateCompletionStreak;
exports.rebuildStreakFromLogs = rebuildStreakFromLogs;
const scheduler_1 = require("./scheduler");
/**
 * Checks if completing a routine on completedDateStr is consecutive with lastCompletedDate.
 *
 * A completion is consecutive if there were NO scheduled days between
 * lastCompletedDate and completedDateStr that were left uncompleted.
 */
function isConsecutiveCompletion(routine, completedDateStr // YYYY-MM-DD
) {
    const lastDateStr = routine.lastCompletedDate;
    if (!lastDateStr) {
        return false; // First time completing, not consecutive with anything
    }
    // Guard: if somehow the date is prior or equal to last completed date
    if (completedDateStr <= lastDateStr) {
        return false;
    }
    const lastDate = (0, scheduler_1.parseLocalDateString)(lastDateStr);
    const completedDate = (0, scheduler_1.parseLocalDateString)(completedDateStr);
    const dayDiff = (0, scheduler_1.getDaysDiff)(lastDate, completedDate);
    // If completed on the very next day, it is always consecutive
    if (dayDiff === 1) {
        return true;
    }
    // If difference is large (e.g., over 365 days), break early to avoid large loops
    if (dayDiff > 365) {
        return false;
    }
    // Walk all days between lastDate (exclusive) and completedDate (exclusive).
    // If any day in between was scheduled, it means the user missed a scheduled day,
    // so the streak is broken.
    for (let i = 1; i < dayDiff; i++) {
        const checkDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + i);
        if ((0, scheduler_1.isRoutineScheduledForDate)(routine, checkDate)) {
            return false; // Missed a scheduled day in between
        }
    }
    return true;
}
/**
 * Calculates updated streak values when marking a routine as completed.
 *
 * Handles daily, weekly, monthly, and custom schedules.
 * If the completion date is already the last completed date (multiple logs on same day),
 * does not change streaks.
 */
function calculateCompletionStreak(routine, completedDateStr // YYYY-MM-DD
) {
    const currentLastDate = routine.lastCompletedDate;
    // Guard: if logging for an already-completed date, keep existing streaks
    if (currentLastDate === completedDateStr) {
        return {
            currentStreak: routine.currentStreak,
            longestStreak: routine.longestStreak,
            lastCompletedDate: routine.lastCompletedDate,
        };
    }
    // Determine if it is consecutive
    const isConsecutive = isConsecutiveCompletion(routine, completedDateStr);
    const nextStreak = isConsecutive ? routine.currentStreak + 1 : 1;
    const nextLongest = Math.max(routine.longestStreak, nextStreak);
    return {
        currentStreak: nextStreak,
        longestStreak: nextLongest,
        lastCompletedDate: completedDateStr,
    };
}
/**
 * Rebuilds the streak values from a chronological list of logs.
 * Useful for recalculating streaks after logs are deleted (undo) or modified.
 *
 * @param logs List of completed logs, ordered by date ASC.
 */
function rebuildStreakFromLogs(routine, completedLogs) {
    // Reset streak to base state
    let currentStreak = 0;
    let longestStreak = 0;
    let lastCompletedDate = undefined;
    // Filter logs to include only 'completed' status and unique dates (sorted ASC)
    const sortedCompletedDates = completedLogs
        .filter((log) => log.status === 'completed')
        .map((log) => log.date)
        .filter((value, index, self) => self.indexOf(value) === index) // Unique dates only
        .sort(); // Sort YYYY-MM-DD strings ascending
    for (const dateStr of sortedCompletedDates) {
        // Construct a temporary routine object at the current state
        const tempRoutine = {
            ...routine,
            currentStreak,
            longestStreak,
            lastCompletedDate,
        };
        const update = calculateCompletionStreak(tempRoutine, dateStr);
        currentStreak = update.currentStreak;
        longestStreak = update.longestStreak;
        lastCompletedDate = update.lastCompletedDate;
    }
    return {
        currentStreak,
        longestStreak,
        lastCompletedDate,
    };
}
