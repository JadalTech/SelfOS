/**
 * Periodic Review Engines (Weekly, Monthly, Quarterly)
 * SelfOS v3.3.0 — Batch 14D
 */

import type { WeeklyReview, MonthlyReview, QuarterlyReview, ReviewMetrics } from '../domain/intelligence.types';

export class WeeklyReviewEngine {
  static generateWeeklyReview(
    startDate: string,
    endDate: string,
    metrics: ReviewMetrics
  ): WeeklyReview {
    return {
      id: `rev_wk_${startDate}`,
      type: 'review',
      title: `Weekly Review (${startDate} - ${endDate})`,
      description: `Completed ${metrics.tasksCompleted} tasks and ${metrics.focusHours} focus hours.`,
      period: 'weekly',
      startDate,
      endDate,
      metrics,
      achievements: ['Maintained consistent workout routine', 'Completed core milestone goals'],
      recommendations: ['Schedule recovery break after heavy focus days'],
      timestamp: new Date(),
    };
  }
}

export class MonthlyReviewEngine {
  static generateMonthlyReview(month: string, metrics: ReviewMetrics): MonthlyReview {
    return {
      id: `rev_m_${month}`,
      type: 'review',
      title: `Monthly Growth Report - ${month}`,
      description: `Total ${metrics.goalsCompleted} goals accomplished this month.`,
      period: 'monthly',
      month,
      metrics,
      growthTrends: ['Goal completion rate up +15%', 'Focus hours increased +10%'],
      timestamp: new Date(),
    };
  }
}

export class QuarterlyReviewEngine {
  static generateQuarterlyReview(quarter: string): QuarterlyReview {
    return {
      id: `rev_q_${quarter}`,
      type: 'review',
      title: `Executive Quarterly Review - ${quarter}`,
      description: `Executive performance summary for ${quarter}`,
      period: 'quarterly',
      quarter,
      executiveReport: 'High goal momentum maintained across career and health tracks.',
      timestamp: new Date(),
    };
  }
}
