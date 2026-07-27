"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime12Hour = formatTime12Hour;
exports.formatDateFriendly = formatDateFriendly;
exports.formatDuration = formatDuration;
exports.getQualityLabel = getQualityLabel;
exports.formatDateToTimeString = formatDateToTimeString;
exports.mapToSleepEntryVM = mapToSleepEntryVM;
exports.mapToSleepScheduleVM = mapToSleepScheduleVM;
exports.mapToSleepGoalVM = mapToSleepGoalVM;
exports.mapToSleepRecoveryVM = mapToSleepRecoveryVM;
exports.buildSleepDashboardVM = buildSleepDashboardVM;
/**
 * Formats a 24-hour time string ("HH:MM") into 12-hour AM/PM format.
 */
function formatTime12Hour(timeStr) {
    if (!timeStr)
        return '';
    const parts = timeStr.split(':');
    if (parts.length < 2)
        return timeStr;
    let hour = parseInt(parts[0], 10);
    const minStr = parts[1];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    return `${hour}:${minStr} ${ampm}`;
}
/**
 * Formats a date string (YYYY-MM-DD) into a friendly format (e.g. "Mon, Jul 28").
 */
function formatDateFriendly(dateStr) {
    if (!dateStr)
        return '';
    // Append T12:00:00 to avoid local timezone offset shifting the date
    const date = new Date(`${dateStr}T12:00:00`);
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}
/**
 * Formats duration in minutes into a friendly label (e.g. "8h 15m").
 */
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
}
/**
 * Maps perceived quality rating (1-10) to a text label.
 */
function getQualityLabel(rating) {
    if (rating >= 9)
        return 'Excellent';
    if (rating >= 7)
        return 'Good';
    if (rating >= 5)
        return 'Fair';
    if (rating >= 3)
        return 'Poor';
    return 'Very Poor';
}
/**
 * Maps a Date object into a 12-hour AM/PM time string.
 */
function formatDateToTimeString(date) {
    if (!date)
        return '';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime()))
        return '';
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
}
/**
 * Maps domain SleepEntry to SleepEntryVM.
 */
function mapToSleepEntryVM(entry) {
    const rating = entry.quality?.rating ?? 5;
    return {
        id: entry.id,
        date: entry.date,
        formattedDate: formatDateFriendly(entry.date),
        bedtimeFormatted: formatDateToTimeString(entry.bedtime),
        wakeTimeFormatted: formatDateToTimeString(entry.wakeTime),
        durationMinutes: entry.durationMinutes,
        durationLabel: formatDuration(entry.durationMinutes),
        qualityRating: rating,
        qualityLabel: getQualityLabel(rating),
        recoveryScore: entry.recoveryScore ?? undefined,
        recoveryLabel: entry.recoveryScore ? `${entry.recoveryScore}%` : undefined,
        timezone: entry.timezone,
        sleepSource: entry.sleepSource || 'manual',
        sleepEfficiency: entry.sleepEfficiency ?? undefined,
        sleepEfficiencyLabel: entry.sleepEfficiency ? `${entry.sleepEfficiency}%` : undefined,
        sleepLatency: entry.sleepLatency ?? undefined,
        sleepLatencyLabel: entry.sleepLatency ? `${entry.sleepLatency}m` : undefined,
        awakeDuration: entry.awakeDuration ?? undefined,
        awakeDurationLabel: entry.awakeDuration ? `${entry.awakeDuration}m` : undefined,
        interruptionsCount: entry.interruptionsCount,
        notes: entry.notes,
        tags: entry.tags || [],
    };
}
/**
 * Maps domain SleepSchedule to SleepScheduleVM.
 */
function mapToSleepScheduleVM(schedule) {
    return {
        id: schedule.id,
        targetDurationMinutes: schedule.targetDurationMinutes,
        targetDurationLabel: `${(schedule.targetDurationMinutes / 60).toFixed(1)} hrs`,
        weekdayBedtime: schedule.weekdayBedtime,
        weekdayWakeTime: schedule.weekdayWakeTime,
        weekdayScheduleLabel: `${formatTime12Hour(schedule.weekdayBedtime)} - ${formatTime12Hour(schedule.weekdayWakeTime)}`,
        weekendBedtime: schedule.weekendBedtime,
        weekendWakeTime: schedule.weekendWakeTime,
        weekendScheduleLabel: `${formatTime12Hour(schedule.weekendBedtime)} - ${formatTime12Hour(schedule.weekendWakeTime)}`,
        isActive: schedule.isActive,
        effectiveFrom: schedule.effectiveFrom,
        effectiveUntil: schedule.effectiveUntil,
    };
}
/**
 * Maps domain SleepGoal to SleepGoalVM.
 */
function mapToSleepGoalVM(goal, progressPercent = 0) {
    let categoryLabel = 'Sleep Goal';
    let targetValueLabel = `${goal.targetValue}`;
    switch (goal.category) {
        case 'duration':
            categoryLabel = 'Sleep Duration';
            targetValueLabel = `${(goal.targetValue / 60).toFixed(1)} hrs/night`;
            break;
        case 'bedtime':
            categoryLabel = 'Target Bedtime';
            targetValueLabel = formatTime12Hour(goal.targetTime || '');
            break;
        case 'wake_time':
            categoryLabel = 'Target Wake-Up Time';
            targetValueLabel = formatTime12Hour(goal.targetTime || '');
            break;
        case 'consistency':
            categoryLabel = 'Schedule Consistency';
            targetValueLabel = `${goal.targetValue}% Consistency`;
            break;
        case 'recovery':
            categoryLabel = 'Daily Recovery Score';
            targetValueLabel = `Score of ${goal.targetValue}+`;
            break;
    }
    return {
        id: goal.id,
        category: goal.category,
        categoryLabel,
        targetValue: goal.targetValue,
        targetValueLabel,
        targetTime: goal.targetTime,
        isActive: goal.isActive,
    };
}
/**
 * Maps domain SleepRecovery to SleepRecoveryVM.
 */
function mapToSleepRecoveryVM(recovery) {
    let statusLabel = 'Fair';
    let statusColor = '#fbbf24'; // amber-400
    let statusBgColor = 'rgba(245, 158, 11, 0.1)';
    switch (recovery.status) {
        case 'poor':
            statusLabel = 'Poor';
            statusColor = '#f87171'; // red-400
            statusBgColor = 'rgba(239, 68, 68, 0.1)';
            break;
        case 'fair':
            statusLabel = 'Fair';
            statusColor = '#fbbf24'; // amber-400
            statusBgColor = 'rgba(245, 158, 11, 0.1)';
            break;
        case 'good':
            statusLabel = 'Good';
            statusColor = '#34d399'; // emerald-400
            statusBgColor = 'rgba(16, 185, 129, 0.1)';
            break;
        case 'optimal':
            statusLabel = 'Optimal';
            statusColor = '#10b981'; // emerald-500
            statusBgColor = 'rgba(5, 150, 105, 0.1)';
            break;
    }
    return {
        date: recovery.date,
        formattedDate: formatDateFriendly(recovery.date),
        recoveryScore: recovery.recoveryScore,
        status: recovery.status,
        statusLabel,
        statusColor,
        statusBgColor,
        durationScore: recovery.components.durationScore,
        qualityScore: recovery.components.qualityScore,
        consistencyScore: recovery.components.consistencyScore,
        debtPenalty: recovery.components.debtPenalty,
    };
}
/**
 * Helper to construct the SleepDashboardVM.
 */
function buildSleepDashboardVM(latestEntry, activeSchedule, recovery, streakCount, sleepDebtMinutes, weeklyConsistencyPercent, goalProgressPercent) {
    const latestEntryVM = latestEntry ? mapToSleepEntryVM(latestEntry) : null;
    const activeScheduleVM = activeSchedule ? mapToSleepScheduleVM(activeSchedule) : null;
    const recoveryVM = recovery ? mapToSleepRecoveryVM(recovery) : null;
    const debtHours = (sleepDebtMinutes / 60).toFixed(1);
    return {
        latestEntry: latestEntryVM,
        activeSchedule: activeScheduleVM,
        recovery: recoveryVM,
        streakCount,
        streakLabel: `${streakCount} day${streakCount !== 1 ? 's' : ''}`,
        sleepDebtMinutes,
        sleepDebtLabel: `${debtHours} hr${debtHours !== '1.0' ? 's' : ''}`,
        weeklyConsistencyPercent,
        goalProgressPercent,
    };
}
