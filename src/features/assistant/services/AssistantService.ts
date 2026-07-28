/**
 * Assistant Service Coordinator
 * SelfOS v2.0.0 — Batch 13A
 */

import { assistantPlanner } from '../ai/coordinator/AssistantPlanner';
import { AssistantSafetyValidator } from '../ai/safety/AssistantSafetyValidator';
import { toolExecutor } from '../ai/tools/ToolExecutor';
import { insightsRepository } from '../../insights/repository/InsightsRepository';
import type { AssistantContext, AssistantResponse } from '../domain/assistant.types';

export class AssistantService {
  constructor() {
    // Inject the real InsightsRepository into the ToolExecutor
    toolExecutor.setRepository(insightsRepository);
  }

  async processQuery(context: AssistantContext, userMessage: string): Promise<AssistantResponse> {
    const planned = await assistantPlanner.plan(context, userMessage);
    const validated = AssistantSafetyValidator.validate(planned);
    return validated;
  }
}

export const assistantService = new AssistantService();
export default assistantService;
