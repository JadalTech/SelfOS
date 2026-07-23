"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToHairLogVM = mapToHairLogVM;
exports.mapToHairLogVMs = mapToHairLogVMs;
function mapToHairLogVM(log, hairRoutines, coreRoutines, allProducts) {
    const hairRoutine = hairRoutines.find((hr) => hr.id === log.hairRoutineId);
    const coreRoutine = hairRoutine
        ? coreRoutines.find((r) => r.id === hairRoutine.routineId)
        : undefined;
    const appliedProducts = allProducts
        .filter((p) => log.appliedProductIds.includes(p.id))
        .map((p) => `${p.brand} ${p.name}`);
    return {
        id: log.id,
        hairRoutineId: log.hairRoutineId,
        routineTitle: coreRoutine?.title || 'Wash Day',
        date: log.date,
        time: log.time,
        appliedProducts: appliedProducts.length > 0 ? appliedProducts : ['Standard Wash'],
        notes: log.notes,
    };
}
function mapToHairLogVMs(logs, hairRoutines, coreRoutines, allProducts) {
    return logs.map((log) => mapToHairLogVM(log, hairRoutines, coreRoutines, allProducts));
}
