/**
 * Productivity Analytics Engine
 * SelfOS v3.0.0 — Batch 14A
 */

import type { Goal, Task, ProductivityAnalytics } from '../domain/productivity.types';

export class ProductivityAnalyticsEngine {
  static computeAnalytics(goals: readonly Goal[], tasks: readonly Task[]): ProductivityAnalytics {
    const totalGoals = goals.length;
    const completedGoals = goals.filter((g) => g.status === 'completed').length;
    const goalRate = totalGoals > 0 ? completedGoals / totalGoals : 1.0;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const taskRate = totalTasks > 0 ? completedTasks / totalTasks : 1.0;

    const productivityScore = Math.round((goalRate * 0.4 + taskRate * 0.6) * 100);
    const focusScore = Math.min(100, Math.round(productivityScore * 1.05));

    let burnoutRisk: 'low' | 'moderate' | 'high' = 'low';
    if (totalTasks > 12 && taskRate < 0.4) {
      burnoutRisk = 'high';
    } else if (totalTasks > 8) {
      burnoutRisk = 'moderate';
    }

    return {
      productivityScore,
      focusScore,
      goalCompletionRate: Math.round(goalRate * 100) / 100,
      taskCompletionRate: Math.round(taskRate * 100) / 100,
      burnoutRisk,
      momentum: productivityScore >= 75 ? 'improving' : 'stable',
    };
  }
}
export default ProductivityAnalyticsEngine;
