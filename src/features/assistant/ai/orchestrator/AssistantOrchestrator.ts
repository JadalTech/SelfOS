/**
 * Multi-Agent Assistant Orchestrator
 * SelfOS v2.0.0 — Batch 13C
 */

import { workflowEngine } from './WorkflowEngine';
import type { AssistantContext } from '../../domain/assistant.types';

export class AssistantOrchestrator {
  async orchestrate(context: AssistantContext, userMessage: string): Promise<string> {
    const outputs = await workflowEngine.executeWorkflow('DailyCoaching', context, userMessage);
    return outputs.join('\n');
  }
}

export const assistantOrchestrator = new AssistantOrchestrator();
export default assistantOrchestrator;
