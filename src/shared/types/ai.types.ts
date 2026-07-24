/**
 * Shared AI Contracts for Unified SelfOS AI Coach
 *
 * Consumed by Nutrition, Workout, Sleep, Hydration, Haircare, Skincare.
 */

export interface AIMessage {
  readonly id: string;
  readonly sender: 'user' | 'ai';
  readonly text: string;
  readonly timestamp: Date;
  readonly providerName?: string;
  readonly latencyMs?: number;
}

export interface AIConversation {
  readonly id: string;
  readonly messages: AIMessage[];
  readonly createdAt: Date;
}

export interface AIRecommendation {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly targetConcern: string;
  readonly recommendedCategory?: string;
  readonly actionableSteps: string[];
  readonly confidenceScore: number; // 0.0 to 1.0
}

export interface AIInsight {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly score?: number;
  readonly trend?: 'improving' | 'declining' | 'stable';
}

export interface AIAction {
  readonly id: string;
  readonly actionType: string;
  readonly targetRoute?: string;
  readonly payload?: Record<string, any>;
}

export interface AIWeeklyReview {
  readonly id: string;
  readonly dateRange: string;
  readonly summary: string;
  readonly highlights: string[];
  readonly areasToImprove: string[];
  readonly scoreChangeLabel: string;
}

export interface AIModuleSummary {
  readonly feature: string;
  readonly activeGoalLabel?: string;
  readonly consistencyPercent?: number;
  readonly currentAveragesLabel?: string;
}
