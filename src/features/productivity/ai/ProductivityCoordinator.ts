/**
 * AI Productivity Coordinator
 * SelfOS v3.0.0 — Batch 14A
 */

import { taskService } from '../tasks/TaskService';
import { goalService } from '../goals/GoalService';
import type { Task, Goal } from '../domain/productivity.types';

export class ProductivityCoordinator {
  async handleAITaskRecommendation(userId: string, title: string, category: Task['category']): Promise<Task> {
    return taskService.createTask(userId, title, category, 'high');
  }

  async handleAIGoalRecommendation(userId: string, title: string, category: Goal['category'], daysToTarget = 30): Promise<Goal> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToTarget);
    return goalService.createGoal(userId, title, category, targetDate);
  }
}

export const productivityCoordinator = new ProductivityCoordinator();
export default productivityCoordinator;
