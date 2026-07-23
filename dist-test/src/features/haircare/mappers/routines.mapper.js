"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToHairRoutineVM = mapToHairRoutineVM;
exports.mapToHairRoutineVMs = mapToHairRoutineVMs;
const completion_1 = require("../../routine/engine/completion");
const products_mapper_1 = require("./products.mapper");
const ROUTINE_CATEGORY_LABELS = {
    'wash-day': 'Wash Day',
    oiling: 'Hair Oiling',
    'scalp-massage': 'Scalp Massage',
    'deep-conditioning': 'Deep Conditioning',
    custom: 'Special Routine',
};
function mapToHairRoutineVM(hairRoutine, coreRoutines, allProducts, coreLogs = [], referenceDate = new Date()) {
    const core = coreRoutines.find((r) => r.id === hairRoutine.routineId);
    const todayStr = referenceDate.toISOString().split('T')[0];
    const status = core
        ? (0, completion_1.getRoutineStatusForDate)(core, coreLogs, todayStr, referenceDate)
        : 'pending';
    const linkedProducts = allProducts.filter((p) => hairRoutine.productIds.includes(p.id));
    return {
        id: hairRoutine.id,
        routineId: hairRoutine.routineId,
        title: core?.title || 'Haircare Routine',
        categoryLabel: ROUTINE_CATEGORY_LABELS[hairRoutine.haircareCategory] ?? 'Hair Routine',
        scheduleSummary: core?.schedule.frequency || 'Scheduled',
        status,
        currentStreak: core?.currentStreak || 0,
        products: (0, products_mapper_1.mapToHairProductVMs)(linkedProducts),
        instructions: hairRoutine.instructions,
    };
}
function mapToHairRoutineVMs(hairRoutines, coreRoutines, allProducts, coreLogs = [], referenceDate = new Date()) {
    return hairRoutines.map((hr) => mapToHairRoutineVM(hr, coreRoutines, allProducts, coreLogs, referenceDate));
}
