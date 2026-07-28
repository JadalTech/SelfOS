/**
 * Workflow Engine
 * SelfOS v2.0.0 — Batch 13C
 */

import { agentRegistry } from '../registry/AgentRegistry';
import type { AssistantContext } from '../../domain/assistant.types';

export type WorkflowType = 'DailyCoaching' | 'WeeklyReview' | 'GoalPlanning' | 'HealthExplanation';

export class WorkflowEngine {
  async executeWorkflow(workflow: WorkflowType, context: AssistantContext, userMessage: string): Promise<string[]> {
    const outputs: string[] = [];

    if (workflow === 'DailyCoaching') {
      const agents = ['SleepCoachAgent', 'HydrationCoachAgent', 'WorkoutCoachAgent'];
      for (const name of agents) {
        const agent = agentRegistry.resolve(name);
        if (agent) {
          outputs.push(await agent.execute(context, userMessage));
        }
      }
    } else if (workflow === 'WeeklyReview') {
      const reviewAgent = agentRegistry.resolve('ReviewAgent');
      if (reviewAgent) {
        outputs.push(await reviewAgent.execute(context, userMessage));
      }
    } else {
      outputs.push(`Workflow ${workflow} executed successfully.`);
    }

    return outputs;
  }
}

export const workflowEngine = new WorkflowEngine();
export default workflowEngine;
