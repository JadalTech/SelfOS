/**
 * Pure Skincare Domain Engine
 *
 * All business logic algorithms remain 100% pure TypeScript:
 * - Framework independent
 * - Zero database imports
 * - Zero React dependencies
 */

import type {
  SkinAssessment,
  SkincareLog,
  SkincareProduct,
  SkinReminder,
  SkinConcern,
} from '../types';

/**
 * Calculates a composite Skin Health Score (1-10 scale) based on self-assessment ratings.
 */
export function calculateSkinHealthScore(assessment: Partial<SkinAssessment>): number {
  const hydration = assessment.hydrationLevel ?? 3; // 1-5 scale (higher is better)
  const barrier = assessment.barrierHealthScore ?? 3; // 1-5 scale (higher is better)
  const sensitivity = assessment.sensitivityLevel ?? 3; // 1-5 scale (lower is better)
  const oiliness = assessment.oilinessLevel ?? 3; // 1-5 scale (3 is balanced)

  const hydrationScore = (hydration / 5) * 10;
  const barrierScore = (barrier / 5) * 10;
  const sensitivityScore = ((6 - sensitivity) / 5) * 10;

  const oilinessBalance = 5 - Math.abs(oiliness - 3);
  const oilinessScore = (oilinessBalance / 5) * 10;

  const rawScore =
    hydrationScore * 0.25 +
    barrierScore * 0.35 +
    sensitivityScore * 0.20 +
    oilinessScore * 0.20;

  const overall = assessment.overallHealthScore;
  if (typeof overall === 'number' && overall >= 1 && overall <= 10) {
    return Math.round((rawScore * 0.6 + overall * 0.4) * 10) / 10;
  }

  return Math.round(rawScore * 10) / 10;
}

/**
 * Calculates product expiry status and days remaining based on opened date and shelf life.
 */
export function calculateProductExpiry(
  openedDate?: Date,
  shelfLifeMonths?: number
): { expiryDate: Date | null; isExpired: boolean; daysRemaining: number | null; status: 'good' | 'expiring-soon' | 'expired' | 'unknown' } {
  if (!openedDate || !shelfLifeMonths || shelfLifeMonths <= 0) {
    return { expiryDate: null, isExpired: false, daysRemaining: null, status: 'unknown' };
  }

  const expiry = new Date(openedDate);
  expiry.setMonth(expiry.getMonth() + shelfLifeMonths);

  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return { expiryDate: expiry, isExpired: true, daysRemaining: 0, status: 'expired' };
  }

  if (daysRemaining <= 30) {
    return { expiryDate: expiry, isExpired: false, daysRemaining, status: 'expiring-soon' };
  }

  return { expiryDate: expiry, isExpired: false, daysRemaining, status: 'good' };
}

/**
 * Calculates weekly completion score percentage (0-100) for skincare routines.
 */
export function calculateWeeklyScore(logs: SkincareLog[], expectedTargetLogsPerWeek = 14): number {
  if (expectedTargetLogsPerWeek <= 0) return 0;
  const count = logs.length;
  return Math.min(100, Math.round((count / expectedTargetLogsPerWeek) * 100));
}

/**
 * Calculates monthly completion score percentage (0-100).
 */
export function calculateMonthlyScore(logs: SkincareLog[], expectedTargetLogsPerMonth = 60): number {
  if (expectedTargetLogsPerMonth <= 0) return 0;
  const count = logs.length;
  return Math.min(100, Math.round((count / expectedTargetLogsPerMonth) * 100));
}

/**
 * Calculates consistency score (0-100) over a total timeframe in days.
 */
export function calculateConsistencyScore(logs: SkincareLog[], totalDays: number): number {
  if (totalDays <= 0) return 0;
  const uniqueDates = new Set(logs.map((l) => l.date)).size;
  const ratio = Math.min(1.0, uniqueDates / totalDays);
  return Math.round(ratio * 100);
}

/**
 * Calculates improvement metrics comparing a past assessment to a current assessment.
 */
export function calculateImprovement(
  pastAssessment: SkinAssessment,
  currentAssessment: SkinAssessment
): {
  overallChange: number;
  hydrationChange: number;
  barrierChange: number;
  concernChanges: Record<SkinConcern, { initial: number; current: number; change: number }>;
} {
  const overallChange = Math.round((currentAssessment.overallHealthScore - pastAssessment.overallHealthScore) * 10) / 10;
  const hydrationChange = currentAssessment.hydrationLevel - pastAssessment.hydrationLevel;
  const barrierChange = currentAssessment.barrierHealthScore - pastAssessment.barrierHealthScore;

  const concernChanges: Record<string, { initial: number; current: number; change: number }> = {};

  const allConcerns = Array.from(new Set([...pastAssessment.concerns, ...currentAssessment.concerns]));

  allConcerns.forEach((concern) => {
    const initial = pastAssessment.severityMap[concern] ?? 3;
    const current = currentAssessment.severityMap[concern] ?? 3;
    const change = initial - current;
    concernChanges[concern] = { initial, current, change };
  });

  return {
    overallChange,
    hydrationChange,
    barrierChange,
    concernChanges: concernChanges as Record<SkinConcern, { initial: number; current: number; change: number }>,
  };
}

/**
 * Calculates trend direction ('improving' | 'stable' | 'declining') from a chronological series of scores.
 */
export function calculateTrend(scores: number[]): 'improving' | 'stable' | 'declining' {
  if (scores.length < 2) return 'stable';

  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));

  const avg1 = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avg2 = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  const delta = avg2 - avg1;

  if (delta >= 0.5) return 'improving';
  if (delta <= -0.5) return 'declining';
  return 'stable';
}

/**
 * Calculates product usage statistics (total application counts, last applied date).
 */
export function calculateProductUsage(
  logs: SkincareLog[],
  products: SkincareProduct[]
): { productId: string; productName: string; usageCount: number; lastUsedDate?: string }[] {
  const usageMap: Record<string, { count: number; lastDate?: string }> = {};

  products.forEach((p) => {
    usageMap[p.id] = { count: 0 };
  });

  logs.forEach((log) => {
    log.appliedProductIds.forEach((pid) => {
      if (!usageMap[pid]) {
        usageMap[pid] = { count: 0 };
      }
      usageMap[pid].count += 1;
      if (!usageMap[pid].lastDate || log.date > usageMap[pid].lastDate!) {
        usageMap[pid].lastDate = log.date;
      }
    });
  });

  return products.map((product) => ({
    productId: product.id,
    productName: product.name,
    usageCount: usageMap[product.id]?.count ?? 0,
    lastUsedDate: usageMap[product.id]?.lastDate,
  }));
}

/**
 * Calculates next trigger date for a skincare reminder.
 */
export function calculateReminderNextTrigger(reminder: SkinReminder, fromDate: Date = new Date()): Date | null {
  if (!reminder.isEnabled) return null;

  const [hours, minutes] = reminder.time.split(':').map(Number);
  const target = new Date(fromDate);
  target.setHours(hours, minutes, 0, 0);

  if (target <= fromDate) {
    target.setDate(target.getDate() + 1);
  }

  if (reminder.frequency === 'daily') {
    return target;
  }

  if (reminder.frequency === 'weekly' && reminder.daysOfWeek && reminder.daysOfWeek.length > 0) {
    while (!reminder.daysOfWeek.includes(target.getDay())) {
      target.setDate(target.getDate() + 1);
    }
    return target;
  }

  return target;
}
