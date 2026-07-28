/**
 * Goal Progress Engine & Storage Service
 * SelfOS v3.0.0 — Batch 14A
 */

import type { Goal } from '../domain/productivity.types';
import type { IProductivityRepository } from '../domain/IProductivityRepository';
import { ok } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import { GoalLifecycle } from '../lifecycle/ProductivityLifecycles';
import { productivityEventBus } from '../events/ProductivityEventBus';

export class GoalProgressEngine {
  static calculateProgress(goal: Goal): number {
    if (goal.milestones.length === 0) return goal.progressPercentage;
    const completedCount = goal.milestones.filter((m) => m.completed).length;
    return Math.round((completedCount / goal.milestones.length) * 100);
  }
}

export class GoalRepository implements IProductivityRepository<Goal> {
  private readonly items = new Map<string, Goal>();

  async getById(id: string): Promise<Result<Goal | null, AppError>> {
    return ok(this.items.get(id) || null);
  }

  async getAll(userId: string): Promise<Result<readonly Goal[], AppError>> {
    const userGoals = Array.from(this.items.values()).filter((g) => g.userId === userId);
    return ok(userGoals);
  }

  async save(goal: Goal): Promise<Result<Goal, AppError>> {
    this.items.set(goal.id, goal);
    return ok(goal);
  }

  async delete(id: string): Promise<Result<boolean, AppError>> {
    const deleted = this.items.delete(id);
    return ok(deleted);
  }
}

export const goalRepository = new GoalRepository();

export class GoalService {
  async createGoal(userId: string, title: string, category: Goal['category'], targetDate: Date): Promise<Goal> {
    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      userId,
      title,
      category,
      status: 'active',
      targetDate,
      progressPercentage: 0,
      milestones: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await goalRepository.save(newGoal);
    productivityEventBus.emit('GoalCreated', { goalId: newGoal.id, title });
    return newGoal;
  }
}

export const goalService = new GoalService();
