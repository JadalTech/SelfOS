import type {
  SkincareProduct,
  SkincareRoutine,
  SkincareLog,
  SkinAssessment,
  ProgressPhoto,
  SkincareDashboardVM,
} from '../types';
import { calculateWeeklyScore, calculateProductExpiry } from '../engine/skincareEngine';
import { mapToSkinAssessmentVM } from './assessment.mapper';

export function buildSkincareDashboardVM(params: {
  products: SkincareProduct[];
  routines: SkincareRoutine[];
  logs: SkincareLog[];
  assessments: SkinAssessment[];
  photos: ProgressPhoto[];
}): SkincareDashboardVM {
  const { products, routines, logs, assessments, photos } = params;

  const totalProductsCount = products.length;
  const activeProducts = products.filter((p) => p.isActive);

  const expiringProductsCount = activeProducts.filter((p) => {
    const expiry = calculateProductExpiry(p.openedDate, p.shelfLifeMonths);
    return expiry.status === 'expiring-soon' || expiry.status === 'expired';
  }).length;

  const activeRoutinesCount = routines.length;

  const latestAssessmentEntity = assessments.length > 0 ? assessments[0] : undefined;
  let latestAssessmentSummary: SkincareDashboardVM['latestAssessment'] = undefined;

  if (latestAssessmentEntity) {
    const assessmentVM = mapToSkinAssessmentVM(latestAssessmentEntity);
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

  const weeklyCompletionRate = calculateWeeklyScore(logs, 14);

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
