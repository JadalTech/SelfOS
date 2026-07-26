/**
 * Workout AI Specific Types and Context Definitions
 */

import type { AIMessage, AIModuleSummary } from '../../../../shared/types/ai.types';

export type WorkoutChatMessage = AIMessage;

export interface WorkoutAIContext extends AIModuleSummary {
  readonly feature: 'workout';
  readonly activePlanName?: string;
  readonly targetDaysPerWeek?: number;
  readonly workoutStreak: number;
  readonly weeklyFrequency: number;
  readonly totalVolumeTrend: { readonly date: string; readonly volume: number }[];
  readonly muscleWorkloads: { readonly muscleGroup: string; readonly percentage: number }[];
  readonly personalRecordsCount: number;
  readonly recentPersonalRecords: {
    readonly exerciseName: string;
    readonly valueLabel: string;
    readonly typeLabel: string;
  }[];
  readonly preferredEquipment: string[];
  readonly userGoal?: string;
}
