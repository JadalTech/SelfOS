"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHaircareDashboardVM = buildHaircareDashboardVM;
const products_mapper_1 = require("./products.mapper");
const routines_mapper_1 = require("./routines.mapper");
const logs_mapper_1 = require("./logs.mapper");
function buildHaircareDashboardVM(products, hairRoutines, coreRoutines, logs, coreLogs = [], referenceDate = new Date()) {
    const productVMs = (0, products_mapper_1.mapToHairProductVMs)(products);
    const routineVMs = (0, routines_mapper_1.mapToHairRoutineVMs)(hairRoutines, coreRoutines, products, coreLogs, referenceDate);
    const logVMs = (0, logs_mapper_1.mapToHairLogVMs)(logs, hairRoutines, coreRoutines, products);
    const upcomingWashDay = routineVMs.find((r) => r.status === 'pending') || routineVMs[0];
    const favoriteProducts = productVMs.filter((p) => p.isFavorite);
    const activeProductsCount = productVMs.filter((p) => p.isActive).length;
    return {
        upcomingWashDay,
        activeRoutines: routineVMs,
        favoriteProducts,
        recentLogs: logVMs.slice(0, 5),
        activeProductsCount,
        completedWashDaysCount: logs.length,
    };
}
