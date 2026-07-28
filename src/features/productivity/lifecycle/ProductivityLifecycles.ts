/**
 * Lifecycle State Machine Rule Validators
 * SelfOS v3.0.0 — Batch 14A
 */

import type { TaskStatus, GoalStatus, ProjectStatus } from '../domain/productivity.types';

export class TaskLifecycle {
  private static readonly ALLOWED_TRANSITIONS: Record<TaskStatus, readonly TaskStatus[]> = {
    created: ['planned', 'in_progress', 'archived'],
    planned: ['in_progress', 'blocked', 'archived'],
    in_progress: ['completed', 'blocked', 'planned'],
    blocked: ['in_progress', 'planned', 'archived'],
    completed: ['archived'],
    archived: [],
  };

  static isValidTransition(current: TaskStatus, next: TaskStatus): boolean {
    return this.ALLOWED_TRANSITIONS[current].includes(next);
  }
}

export class GoalLifecycle {
  private static readonly ALLOWED_TRANSITIONS: Record<GoalStatus, readonly GoalStatus[]> = {
    draft: ['active', 'cancelled'],
    active: ['paused', 'completed', 'cancelled'],
    paused: ['active', 'cancelled'],
    completed: [],
    cancelled: [],
  };

  static isValidTransition(current: GoalStatus, next: GoalStatus): boolean {
    return this.ALLOWED_TRANSITIONS[current].includes(next);
  }
}

export class ProjectLifecycle {
  private static readonly ALLOWED_TRANSITIONS: Record<ProjectStatus, readonly ProjectStatus[]> = {
    draft: ['active', 'archived'],
    active: ['review', 'completed', 'archived'],
    review: ['completed', 'active'],
    completed: ['archived'],
    archived: [],
  };

  static isValidTransition(current: ProjectStatus, next: ProjectStatus): boolean {
    return this.ALLOWED_TRANSITIONS[current].includes(next);
  }
}
