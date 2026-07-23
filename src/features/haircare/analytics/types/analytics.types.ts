export interface WeeklyAnalyticsVM {
  readonly completedCount: number;
  readonly scheduledCount: number;
  readonly completionRate: number; // 0 - 100
  readonly dailyCompletionMap: Record<number, number>; // Day of week (0-6) => completions count
  readonly mostActiveDayLabel: string;
}

export interface MonthlyAnalyticsVM {
  readonly totalWashDays: number;
  readonly avgWashIntervalDays: number; // e.g. 3.5 days between washes
  readonly adherenceRate: number; // 0 - 100
}

export interface ProductUsageVM {
  readonly productId: string;
  readonly productName: string;
  readonly brand: string;
  readonly category: string;
  readonly usageCount: number;
  readonly percentage: number; // 0 - 100
}

export interface ConditionTrendVM {
  readonly avgOverallHealth: number; // 1-10
  readonly avgShedding: number; // 1-5
  readonly avgDandruff: number; // 1-5
  readonly avgItchiness: number; // 1-5
  readonly avgOiliness: number; // 1-5
  readonly trendDirection: 'improving' | 'stable' | 'declining';
}

export interface InsightCardVM {
  readonly id: string;
  readonly title: string;
  readonly value: string;
  readonly subtitle: string;
  readonly icon: string;
  readonly type: 'streak' | 'completion' | 'product' | 'condition' | 'timeline';
}

export interface HairAnalyticsVM {
  readonly weekly: WeeklyAnalyticsVM;
  readonly monthly: MonthlyAnalyticsVM;
  readonly productUsage: ProductUsageVM[];
  readonly conditionTrend: ConditionTrendVM;
  readonly insights: InsightCardVM[];
  readonly totalPhotosCount: number;
  readonly currentStreak: number;
  readonly longestStreak: number;
}
