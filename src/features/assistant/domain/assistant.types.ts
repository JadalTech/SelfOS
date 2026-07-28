/**
 * AI Assistant Core Domain Types
 * SelfOS v2.0.0 — Batch 13A
 */

// =========================================================================
// Models & Conversational Records
// =========================================================================

export interface ConversationMessage {
  readonly id: string;
  readonly sender: 'user' | 'assistant';
  readonly text: string;
  readonly timestamp: Date;
  readonly suggestedFollowUps?: readonly string[];
}

export interface ConversationTurn {
  readonly turnId: string;
  readonly message: ConversationMessage;
  readonly metadata?: Record<string, string | number>;
}

export interface Conversation {
  readonly id: string;
  readonly userId: string;
  readonly turns: readonly ConversationTurn[];
  readonly summary?: string;
  readonly active: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AssistantSession {
  readonly sessionId: string;
  readonly userId: string;
  readonly activeConversationId: string | null;
  readonly lastActiveAt: Date;
  readonly isExpired: boolean;
}

// =========================================================================
// Configuration & Telemetry
// =========================================================================

export interface AssistantConfiguration {
  readonly preferredProvider: 'gemini' | 'openai' | 'claude' | 'mock';
  readonly fallbackProvider: 'gemini' | 'openai' | 'claude' | 'mock';
  readonly temperature: number;
  readonly maxTokens: number;
  readonly memoryLimit: number;
  readonly conversationLimit: number;
  readonly telemetryEnabled: boolean;
  readonly debugMode: boolean;
}

export interface TelemetryMetrics {
  readonly intentDistribution: Record<string, number>;
  readonly agentSelectionFrequency: Record<string, number>;
  readonly providerUsage: Record<string, number>;
  readonly providerFailures: number;
  readonly averageLatencyMs: number;
  readonly safetyValidationFailures: number;
  readonly fallbackCount: number;
}

// =========================================================================
// Intent, Context & Planning Interfaces
// =========================================================================

export type AssistantIntentType =
  | 'ask_health_score'
  | 'ask_recommendation'
  | 'ask_prediction'
  | 'ask_sleep'
  | 'ask_workout'
  | 'ask_nutrition'
  | 'ask_hydration'
  | 'ask_routine'
  | 'ask_goal'
  | 'ask_progress'
  | 'ask_habit'
  | 'ask_summary'
  | 'ask_explanation'
  | 'ask_correlation'
  | 'explain_score'
  | 'compare_progress'
  | 'build_plan'
  | 'modify_goal'
  | 'daily_checkin'
  | 'weekly_review'
  | 'monthly_review'
  | 'celebrate_achievement'
  | 'clarify_previous'
  | 'general_chat'
  | 'unknown';

export interface AssistantIntent {
  readonly intentType: AssistantIntentType;
  readonly confidence: number; // 0.0 to 1.0
}

export interface AssistantContext {
  readonly userId: string;
  readonly healthScore: number;
  readonly activeStreak: number;
  readonly recentErrors?: readonly string[];
}

export interface ActionItem {
  readonly id: string;
  readonly description: string;
  readonly priority: 'low' | 'medium' | 'high';
}

export interface AssistantResponse {
  readonly text: string;
  readonly followUpQuestions: readonly string[];
  readonly actionItems: readonly ActionItem[];
  readonly classification: AssistantIntent;
}
