export interface HairAIContext {
  readonly activeProducts: { name: string; brand: string; category: string }[];
  readonly activeRoutinesCount: number;
  readonly completedWashDaysCount: number;
  readonly avgWashIntervalDays: number;
  readonly weeklyCompletionRate: number;
  readonly photosCount: number;
  readonly latestConditionScore?: number;
  readonly latestConditionScalpType?: string;
  readonly topUsedProduct?: string;
  readonly currentStreak: number;
  readonly longestStreak: number;
}

export type RecommendationCategory = 'routine' | 'product' | 'condition' | 'consistency';
export type RecommendationPriority = 'high' | 'medium' | 'low';

export interface HairRecommendation {
  readonly id: string;
  readonly title: string;
  readonly category: RecommendationCategory;
  readonly priority: RecommendationPriority;
  readonly description: string;
  readonly actionLabel?: string;
  readonly actionRoute?: string;
}

export interface HairCoachMessage {
  readonly id: string;
  readonly sender: 'user' | 'coach';
  readonly text: string;
  readonly timestamp: Date;
  readonly recommendations?: HairRecommendation[];
}

export interface HairReviewSummary {
  readonly title: string;
  readonly periodLabel: string;
  readonly headline: string;
  readonly keyObservations: string[];
  readonly actionableAdvice: string[];
  readonly healthScore: number;
}
