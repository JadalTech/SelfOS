"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSkincareDashboardVM = buildSkincareDashboardVM;
const skincareEngine_1 = require("../engine/skincareEngine");
const assessment_mapper_1 = require("./assessment.mapper");
function buildSkincareDashboardVM(params) {
    const { products, routines, logs, assessments, photos } = params;
    const totalProductsCount = products.length;
    const activeProducts = products.filter((p) => p.isActive);
    const expiringProductsCount = activeProducts.filter((p) => {
        const expiry = (0, skincareEngine_1.calculateProductExpiry)(p.openedDate, p.shelfLifeMonths);
        return expiry.status === 'expiring-soon' || expiry.status === 'expired';
    }).length;
    const activeRoutinesCount = routines.length;
    const latestAssessmentEntity = assessments.length > 0 ? assessments[0] : undefined;
    let latestAssessmentSummary = undefined;
    if (latestAssessmentEntity) {
        const assessmentVM = (0, assessment_mapper_1.mapToSkinAssessmentVM)(latestAssessmentEntity);
        const primaryConcernLabel = assessmentVM.topConcernsFormatted.length > 0
            ? assessmentVM.topConcernsFormatted[0].label
            : undefined;
        latestAssessmentSummary = {
            recordDateFormatted: assessmentVM.recordDateFormatted,
            overallHealthScore: assessmentVM.overallHealthScore,
            skinTypeLabel: assessmentVM.skinTypeLabel,
            primaryConcernLabel,
        };
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter((l) => l.date === todayStr);
    const morningRoutineIds = routines.filter((r) => r.timeOfDay === 'morning' || r.timeOfDay === 'both').map((r) => r.id);
    const eveningRoutineIds = routines.filter((r) => r.timeOfDay === 'evening' || r.timeOfDay === 'both').map((r) => r.id);
    const morningCompleted = todayLogs.some((l) => morningRoutineIds.includes(l.skincareRoutineId));
    const eveningCompleted = todayLogs.some((l) => eveningRoutineIds.includes(l.skincareRoutineId));
    const weeklyCompletionRate = (0, skincareEngine_1.calculateWeeklyScore)(logs, 14);
    const recentPhotoUrl = photos.length > 0 ? photos[0].photoUrl : undefined;
    const hasActiveAlerts = expiringProductsCount > 0;
    return {
        hasProducts: totalProductsCount > 0,
        totalProductsCount,
        expiringProductsCount,
        activeRoutinesCount,
        latestAssessment: latestAssessmentSummary,
        todayLogStatus: {
            morningCompleted,
            eveningCompleted,
        },
        weeklyCompletionRate,
        recentPhotoUrl,
        hasActiveAlerts,
    };
}
