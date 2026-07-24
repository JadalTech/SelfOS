/**
 * Pure Skincare Analytics Engine
 *
 * Implements pure calculations for:
 * - Trend calculations
 * - Average health scores
 * - Routine completion rates
 * - Skin concern correlations
 * - Weekly & monthly analytics breakdowns
 * - Insight card generator
 */

import type {
  SkinAssessment,
  SkincareLog,
  SkincareRoutine,
  SkincareProduct,
  SkincareAnalyticsVM,
  SkinInsightVM,
  SkinConcern,
  Severity,
} from '../../types';
import {
  calculateSkinHealthScore,
  calculateWeeklyScore,
  calculateMonthlyScore,
  calculateConsistencyScore,
  calculateTrend,
  calculateProductUsage,
} from '../../engine/skincareEngine';

export function calculateAverageHealthScore(assessments: SkinAssessment[]): number {
  if (assessments.length === 0) return 0;
  const total = assessments.reduce((acc, curr) => acc + calculateSkinHealthScore(curr), 0);
  return Math.round((total / assessments.length) * 10) / 10;
}

export function calculateConcernCorrelations(
  assessments: SkinAssessment[],
  _logs: SkincareLog[]
): { concern: SkinConcern; label: string; initialSeverity: Severity; currentSeverity: Severity; change: number }[] {
  if (assessments.length === 0) return [];

  const chronological = [...assessments].sort((a, b) => a.recordDate.localeCompare(b.recordDate));
  const oldest = chronological[0];
  const latest = chronological[chronological.length - 1];

  const allConcerns = Array.from(new Set([...oldest.concerns, ...latest.concerns]));

  const labelMap: Record<SkinConcern, string> = {
    acne: 'Acne & Breakouts',
    aging: 'Fine Lines & Aging',
    hyperpigmentation: 'Hyperpigmentation',
    dryness: 'Dryness & Dehydration',
    redness: 'Redness & Rosacea',
    texture: 'Uneven Texture',
    'dark-circles': 'Dark Circles',
    dullness: 'Dullness & Glow',
    'enlarged-pores': 'Enlarged Pores',
    'barrier-damage': 'Skin Barrier Health',
  };

  return allConcerns.map((concern) => {
    const initialSeverity = oldest.severityMap[concern] || 3;
    const currentSeverity = latest.severityMap[concern] || 3;
    const change = initialSeverity - currentSeverity; // Positive means improvement

    return {
      concern,
      label: labelMap[concern] || concern,
      initialSeverity,
      currentSeverity,
      change,
    };
  });
}

export function generateSkinInsights(
  assessments: SkinAssessment[],
  logs: SkincareLog[],
  products: SkincareProduct[]
): SkinInsightVM[] {
  const insights: SkinInsightVM[] = [];

  if (assessments.length >= 2) {
    const sorted = [...assessments].sort((a, b) => a.recordDate.localeCompare(b.recordDate));
    const first = sorted[0];
    const latest = sorted[sorted.length - 1];

    if (latest.overallHealthScore > first.overallHealthScore) {
      insights.push({
        id: `ins_imp_${Date.now()}`,
        type: 'improvement',
        title: 'Skin Health Improving',
        description: `Your overall skin health score increased from ${first.overallHealthScore}/10 to ${latest.overallHealthScore}/10!`,
        category: 'Health Score',
        dateFormatted: latest.recordDate,
      });
    } else if (latest.barrierHealthScore < 3) {
      insights.push({
        id: `ins_warn_${Date.now()}`,
        type: 'warning',
        title: 'Compromised Skin Barrier',
        description: 'Your recent barrier health score is lower than recommended. Consider focusing on hydrating and repairing formulas.',
        category: 'Barrier Repair',
        dateFormatted: latest.recordDate,
      });
    }
  }

  const usageStats = calculateProductUsage(logs, products);
  const topUsed = usageStats.filter((u) => u.usageCount > 5);

  if (topUsed.length > 0) {
    insights.push({
      id: `ins_tip_${Date.now()}`,
      type: 'tip',
      title: 'Consistent Product Usage',
      description: `You are consistently using ${topUsed[0].productName} (${topUsed[0].usageCount} applications).`,
      category: 'Product Consistency',
      dateFormatted: new Date().toISOString().split('T')[0],
    });
  }

  return insights;
}

export function buildSkincareAnalyticsVM(params: {
  assessments: SkinAssessment[];
  logs: SkincareLog[];
  routines: SkincareRoutine[];
  products: SkincareProduct[];
}): SkincareAnalyticsVM {
  const { assessments, logs, products } = params;

  const weeklyCompletionRate = calculateWeeklyScore(logs, 14);
  const monthlyCompletionRate = calculateMonthlyScore(logs, 60);
  const currentConsistencyScore = calculateConsistencyScore(logs, 30);

  const scoresSeries = assessments
    .sort((a, b) => a.recordDate.localeCompare(b.recordDate))
    .map((a) => calculateSkinHealthScore(a));

  const skinHealthScoreTrend = calculateTrend(scoresSeries);
  const averageSkinHealthScore = calculateAverageHealthScore(assessments);

  const usage = calculateProductUsage(logs, products);
  const topUsedProducts = usage
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5)
    .map((u) => ({
      productId: u.productId,
      productName: u.productName,
      usageCount: u.usageCount,
    }));

  const concernProgress = calculateConcernCorrelations(assessments, logs);
  const insights = generateSkinInsights(assessments, logs, products);

  return {
    weeklyCompletionRate,
    monthlyCompletionRate,
    currentConsistencyScore,
    skinHealthScoreTrend,
    averageSkinHealthScore,
    topUsedProducts,
    concernProgress,
    insights,
  };
}
