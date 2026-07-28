/**
 * Productivity Dashboard Service Aggregator
 * SelfOS v3.0.0 — Batch 14A
 */

import { goalRepository } from '../goals/GoalService';
import { taskRepository } from '../tasks/TaskService';
import { projectRepository } from '../projects/ProjectService';
import { ProductivityAnalyticsEngine } from '../analytics/ProductivityAnalyticsEngine';
import type { Goal, Task, Project, ProductivityAnalytics } from '../domain/productivity.types';

export interface UnifiedProductivityDashboardModel {
  readonly goals: readonly Goal[];
  readonly tasks: readonly Task[];
  readonly projects: readonly Project[];
  readonly analytics: ProductivityAnalytics;
}

export class ProductivityDashboardService {
  static async getDashboardData(userId: string): Promise<UnifiedProductivityDashboardModel> {
    const [goalsRes, tasksRes, projectsRes] = await Promise.all([
      goalRepository.getAll(userId),
      taskRepository.getAll(userId),
      projectRepository.getAll(userId),
    ]);

    const goals = goalsRes.success ? goalsRes.data : [];
    const tasks = tasksRes.success ? tasksRes.data : [];
    const projects = projectsRes.success ? projectsRes.data : [];

    const analytics = ProductivityAnalyticsEngine.computeAnalytics(goals, tasks);

    return {
      goals,
      tasks,
      projects,
      analytics,
    };
  }
}
export default ProductivityDashboardService;
