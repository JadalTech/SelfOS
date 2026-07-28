/**
 * Life Management Platform Core Domain Types
 * SelfOS v3.0.0 — Batch 14A
 */

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'created' | 'planned' | 'in_progress' | 'blocked' | 'completed' | 'archived';

export type GoalStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export type ProjectStatus = 'draft' | 'active' | 'review' | 'completed' | 'archived';

export type Category = 'health' | 'career' | 'learning' | 'financial' | 'personal' | 'lifestyle';

export interface Tag {
  readonly id: string;
  readonly name: string;
  readonly color: string;
}

export interface SubTask {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
}

export interface Task {
  readonly id: string;
  readonly userId: string;
  readonly projectId?: string;
  readonly goalId?: string;
  readonly title: string;
  readonly description?: string;
  readonly priority: Priority;
  readonly status: TaskStatus;
  readonly category: Category;
  readonly tags: readonly Tag[];
  readonly subtasks: readonly SubTask[];
  readonly estimatedMinutes: number;
  readonly dueDate?: Date;
  readonly dependsOnTaskId?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Milestone {
  readonly id: string;
  readonly title: string;
  readonly dueDate: Date;
  readonly completed: boolean;
}

export interface Goal {
  readonly id: string;
  readonly userId: string;
  readonly parentGoalId?: string;
  readonly title: string;
  readonly description?: string;
  readonly category: Category;
  readonly status: GoalStatus;
  readonly targetDate: Date;
  readonly progressPercentage: number;
  readonly milestones: readonly Milestone[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Project {
  readonly id: string;
  readonly userId: string;
  readonly goalId?: string;
  readonly title: string;
  readonly description?: string;
  readonly status: ProjectStatus;
  readonly category: Category;
  readonly milestones: readonly Milestone[];
  readonly progressPercentage: number;
  readonly startDate: Date;
  readonly targetEndDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface PlannedTimeSlot {
  readonly slotId: string;
  readonly timeLabel: string; // e.g. '09:00 - 10:30'
  readonly taskId?: string;
  readonly activityTitle: string;
  readonly type: 'deep_work' | 'routine' | 'recovery' | 'exercise' | 'break';
}

export interface DailyPlan {
  readonly id: string;
  readonly userId: string;
  readonly date: string; // YYYY-MM-DD
  readonly focusGoalId?: string;
  readonly slots: readonly PlannedTimeSlot[];
  readonly healthAdjustedCapacity: number; // 0.0 to 1.0 multiplier based on sleep/workout recovery
  readonly createdAt: Date;
}

export interface ProductivityAnalytics {
  readonly productivityScore: number; // 0-100
  readonly focusScore: number;        // 0-100
  readonly goalCompletionRate: number; // 0-1.0
  readonly taskCompletionRate: number; // 0-1.0
  readonly burnoutRisk: 'low' | 'moderate' | 'high';
  readonly momentum: 'improving' | 'stable' | 'declining';
}
