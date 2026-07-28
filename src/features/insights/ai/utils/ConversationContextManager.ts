/**
 * Conversation Context and History Manager
 * SelfOS v1.5.0 — Batch 12C
 */

import type { ConversationMessage } from '../types/ai.types';

export class ConversationContextManager {
  private static readonly MAX_TOKENS_BUDGET = 2000;

  static pruneHistory(
    messages: ConversationMessage[],
    maxCount = 10
  ): ConversationMessage[] {
    // Basic FIFO pruning strategy
    if (messages.length <= maxCount) return messages;
    return messages.slice(messages.length - maxCount);
  }
}
export default ConversationContextManager;
