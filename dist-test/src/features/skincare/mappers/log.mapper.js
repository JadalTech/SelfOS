"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToSkincareLogVM = mapToSkincareLogVM;
exports.mapToSkincareLogVMs = mapToSkincareLogVMs;
function mapToSkincareLogVM(log, routines) {
    const routine = routines.find((r) => r.id === log.skincareRoutineId);
    const totalStepsCount = routine ? routine.steps.length : log.completedStepIds.length + log.skippedStepIds.length;
    const skinFeelingMap = {
        1: 'Irritated / Stung',
        2: 'Tight / Dry',
        3: 'Normal / Balanced',
        4: 'Hydrated / Soft',
        5: 'Glowing / Healthy',
    };
    return {
        id: log.id,
        skincareRoutineId: log.skincareRoutineId,
        routineLogId: log.routineLogId,
        dateFormatted: log.date,
        timeFormatted: log.time,
        completedStepsCount: log.completedStepIds.length,
        totalStepsCount,
        appliedProductsCount: log.appliedProductIds.length,
        weatherLabel: log.weather ? log.weather.charAt(0).toUpperCase() + log.weather.slice(1) : undefined,
        skinFeelingLabel: log.skinFeelingRating ? skinFeelingMap[log.skinFeelingRating] || `Rating ${log.skinFeelingRating}/5` : undefined,
        notes: log.notes,
    };
}
function mapToSkincareLogVMs(logs, routines) {
    return logs.map((l) => mapToSkincareLogVM(l, routines));
}
