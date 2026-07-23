"use strict";
/**
 * Completion Status Engine
 *
 * Provides utility methods to map and audit completion logs.
 * Strictly pure functions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutineStatusForDate = getRoutineStatusForDate;
exports.calculateCompletionRate = calculateCompletionRate;
const scheduler_1 = require("./scheduler");
/**
 * Audit and determine the completion status of a routine for a specific date.
 *
 * @param routine The routine schedule definition.
 * @param logs List of logs matching the routine.
 * @param dateStr Target date (YYYY-MM-DD) in the routine's timezone.
 * @param referenceDate Optional current date reference to distinguish past/future.
 */
function getRoutineStatusForDate(routine, logs, dateStr, referenceDate = new Date()) {
    // Find log matching the target date
    const log = logs.find((l) => l.date === dateStr);
    if (log) {
        return log.status; // 'completed' | 'skipped' | 'missed'
    }
    const targetDate = (0, scheduler_1.parseLocalDateString)(dateStr);
    // If the routine is not scheduled for this date, return 'not-scheduled'
    if (!(0, scheduler_1.isRoutineScheduledForDate)(routine, targetDate)) {
        return 'not-scheduled';
    }
    // Get today's local date string relative to the routine's timezone
    const todayStr = (0, scheduler_1.getLocalDateInTimezone)(routine.schedule.timezone, referenceDate);
    if (dateStr < todayStr) {
        // Scheduled in the past but has no completion log -> logically 'missed'
        return 'missed';
    }
    // Scheduled today or in the future and has no log -> 'pending'
    return 'pending';
}
/**
 * Calculates completion rate (percentage of completed days out of scheduled days)
 * within a given date range.
 *
 * @param logs List of logs matching the routine.
 * @param startDateStr Start date (YYYY-MM-DD).
 * @param endDateStr End date (YYYY-MM-DD).
 */
function calculateCompletionRate(routine, logs, startDateStr, endDateStr) {
    const start = (0, scheduler_1.parseLocalDateString)(startDateStr);
    const end = (0, scheduler_1.parseLocalDateString)(endDateStr);
    let scheduledDaysCount = 0;
    let completedDaysCount = 0;
    const current = new Date(start);
    while (current <= end) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, '0');
        const d = String(current.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;
        if ((0, scheduler_1.isRoutineScheduledForDate)(routine, current)) {
            scheduledDaysCount++;
            const log = logs.find((l) => l.date === dateStr);
            if (log && log.status === 'completed') {
                completedDaysCount++;
            }
        }
        current.setDate(current.getDate() + 1);
    }
    return {
        completed: completedDaysCount,
        scheduled: scheduledDaysCount,
        rate: scheduledDaysCount > 0 ? (completedDaysCount / scheduledDaysCount) * 100 : 0,
    };
}
