/**
 * Unified AI Insights Coach Types
 * SelfOS v1.5.0 — Batch 12C
 */

import type { SourceModule, InsightCategory, InsightSeverity, InsightPriority } from '../../types/insights.types';

// =========================================================================
// Metadata Blocks
// =========================================================================

export interface ExplainabilityMetadata {
  readonly reasoning: string;
  readonly supportingInsights: readonly string[];
  readonly referencedMetrics: Record<string, number | string>;
  readonly sourceModules: readonly SourceModule[];
  readonly confidence: number; // Derived from domain metrics
  readonly generatedFrom: string; // ID of the triggering domain data
}

export interface VersioningMetadata {
  readonly promptVersion: string;
  readonly templateVersion: string;
  readonly providerVersion: string;
  readonly generatedAt: Date;
}

// =========================================================================
// AI Response Payloads
// =========================================================================

export interface HealthSummary {
  readonly overallHealthScore: number;
  readonly wins: readonly string[];
  readonly areasForImprovement: readonly string[];
  readonly priorityRecommendation: string;
  readonly motivation: string;
  readonly explainability: ExplainabilityMetadata;
  readonly versioning: VersioningMetadata;
}

export interface WeeklyReview {
  readonly overallScore: number;
  readonly moduleHighlights: Record<SourceModule, string>;
  readonly improvements: readonly string[];
  readonly regressions: readonly string[];
  readonly correlationsSummary: string;
  readonly habitChanges: readonly string[];
  readonly nextWeekFocus: string;
  readonly explainability: ExplainabilityMetadata;
  readonly versioning: VersioningMetadata;
}

// =========================================================================
// Conversational Messages
// =========================================================================

export interface ConversationMessage {
  readonly id: string;
  readonly sender: 'user' | 'ai';
  readonly text: string;
  readonly suggestedFollowUps?: readonly string[];
  readonly timestamp: Date;
  readonly explainability?: ExplainabilityMetadata;
}
