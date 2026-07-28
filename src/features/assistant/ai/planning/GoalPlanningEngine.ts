/**
 * Goal Planning Engine with Goal Dependency Graph
 * SelfOS v2.0.0 — Batch 13C
 */

export interface GoalNode {
  readonly goalId: string;
  readonly title: string;
  readonly parentId?: string;
  readonly childIds: readonly string[];
  readonly progress: number; // 0-100
}

export class GoalPlanningEngine {
  createGoalHierarchy(parentTitle: string, subGoals: string[]): GoalNode[] {
    const parentId = `goal_p_${Date.now()}`;
    const childrenNodes: GoalNode[] = subGoals.map((title, idx) => ({
      goalId: `goal_c_${Date.now()}_${idx}`,
      title,
      parentId,
      childIds: [],
      progress: 0,
    }));

    const parentNode: GoalNode = {
      goalId: parentId,
      title: parentTitle,
      childIds: childrenNodes.map((c) => c.goalId),
      progress: 0,
    };

    return [parentNode, ...childrenNodes];
  }
}

export const goalPlanningEngine = new GoalPlanningEngine();
export default goalPlanningEngine;
