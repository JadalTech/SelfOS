/**
 * Assistant Planner & Confidence-Based Router
 * SelfOS v2.0.0 — Batch 13A
 */

import { IntentClassifier } from './IntentClassifier';
import { agentRegistry } from '../registry/AgentRegistry';
import { toolExecutor } from '../tools/ToolExecutor';
import type { AssistantContext, AssistantResponse } from '../../domain/assistant.types';
import { AppError } from '../../../../shared/errors/AppError';

export class AssistantPlanner {
  async plan(context: AssistantContext, userMessage: string): Promise<AssistantResponse> {
    const classification = IntentClassifier.classify(userMessage);

    // Confidence-Based Routing
    if (classification.confidence >= 0.9) {
      // High Confidence: Dynamic Agent execution
      let agentName = 'HealthCoachAgent';
      if (classification.intentType === 'ask_routine') {
        agentName = 'RoutineCoachAgent';
      }

      const agent = agentRegistry.resolve(agentName);
      if (!agent) {
        throw new AppError('VALIDATION_ERROR', `Agent not registered: ${agentName}`);
      }

      // Execute associated tool
      await toolExecutor.executeTool(context.userId, 'GetHealthScoreTool');

      const text = await agent.execute(context, userMessage);
      return {
        text,
        followUpQuestions: ['How can I optimize rest patterns?'],
        actionItems: [],
        classification,
      };
    } else if (classification.confidence >= 0.7) {
      // Medium Confidence: Generate Clarification Question
      return {
        text: `I classified your intent as ${classification.intentType} with moderate confidence. Did you mean to review your scores?`,
        followUpQuestions: ['Yes, review score details', 'No, ask general question'],
        actionItems: [],
        classification,
      };
    } else {
      // Low Confidence: Route to Fallback Conversation
      return {
        text: 'I am not sure how to assist with that request. Tell me more about your workout or sleep status.',
        followUpQuestions: [],
        actionItems: [],
        classification,
      };
    }
  }
}

export const assistantPlanner = new AssistantPlanner();
export default assistantPlanner;
