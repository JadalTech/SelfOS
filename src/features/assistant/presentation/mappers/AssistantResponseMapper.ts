/**
 * Presentation Mapper for AI Assistant Response
 * SelfOS v2.0.0 — Batch 13B
 */

import type { AssistantResponse } from '../../domain/assistant.types';

export class AssistantResponseMapper {
  static toVM(response: AssistantResponse) {
    return {
      text: response.text,
      suggestedFollowUps: response.followUpQuestions,
      actionItemsCountLabel: `${response.actionItems.length} Actions`,
      confidenceLabel: `${Math.round(response.classification.confidence * 100)}% Confidence`,
    };
  }
}
export default AssistantResponseMapper;
