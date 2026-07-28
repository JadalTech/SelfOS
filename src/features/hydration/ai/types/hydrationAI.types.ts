/**
 * Hydration AI Coach Types
 * SelfOS v1.4.0 — Batch 11C Revision
 */

import type {
  AIMessage,
  AIConversation,
  AIRecommendation,
  AIInsight,
} from '../../../../shared/types/ai.types';
import type { DrinkType } from '../../types/hydration.types';

// =========================================================================
// Base AI Request / Response Metadata
// =========================================================================

export interface AIResponseMetadata {
  readonly provider: 'gemini' | 'fallback' | 'mock';
  readonly confidence: number; // 0.0 to 1.0
  readonly reasoningSource: string;
  readonly generatedAt: Date;
  readonly responseVersion: string;
  readonly processingTimeMs: number;
  readonly cacheHit: boolean;
  readonly requestId: string;
}

export interface HydrationAIResponse<T> {
  readonly data: T;
  readonly metadata: AIResponseMetadata;
}

// =========================================================================
// Hydration-Specific Data Structures
// =========================================================================

export interface HydrationAdvice {
  readonly text: string;
  readonly severity: 'info' | 'warning' | 'critical';
  readonly suggestedML: number;
}

export interface HydrationRecommendation extends AIRecommendation {
  readonly category: 'intake' | 'timing' | 'beverage-type' | 'reminder' | 'safety';
  readonly priority: 'low' | 'medium' | 'high';
  readonly targetDrinkType?: DrinkType;
}

export interface HydrationInsight extends AIInsight {
  readonly category: 'consistency' | 'momentum' | 'distribution' | 'timing';
  readonly severity: 'neutral' | 'caution' | 'danger';
}

export interface HydrationPrediction {
  readonly expectedFinalIntakeML: number;
  readonly goalCompletionProbability: number; // 0.0 to 1.0
  readonly expectedNextDrinkTime: string | null; // HH:mm
  readonly riskScore: number; // 0 to 10
}

export interface HydrationSummary {
  readonly summaryText: string;
  readonly consumedML: number;
  readonly goalML: number;
  readonly completionPercent: number;
  readonly drinkCount: number;
  readonly dominantDrinkType: DrinkType;
}

// =========================================================================
// Conversation Messages (Streaming Support Ready)
// =========================================================================

export interface HydrationMessage extends AIMessage {
  readonly conversationId: string;
  readonly tokensEstimate?: number;
}

export interface HydrationConversation extends AIConversation {
  readonly messages: HydrationMessage[];
  readonly conversationType: 'general-coaching' | 'goal-review' | 'reminder-optimization';
  readonly provider: 'gemini' | 'fallback' | 'mock';
  readonly summary?: string;
  readonly tokenEstimate?: number;
  readonly status: 'active' | 'archived' | 'deleted';
  readonly updatedAt: Date;
}

// =========================================================================
// AI Context Model (Token Optimized)
// =========================================================================

export interface HydrationAIContext {
  // Today's snapshot
  readonly date: string;
  readonly consumedML: number;
  readonly goalML: number;
  readonly remainingML: number;
  readonly hydrationScore: number;
  readonly currentStreak: number;
  
  // Intake stats
  readonly averageDrinkSize: number;
  readonly peakHour: number;
  readonly drinkTypeBreakdown: Record<DrinkType, number>;
  
  // Parameters
  readonly activityLevel: string;
  readonly climate: string;

  // History & logs (optional / context dependent)
  readonly recentHistory?: {
    readonly date: string;
    readonly consumedML: number;
    readonly goalML: number;
  }[];
  readonly recentWarnings?: string[];
}
