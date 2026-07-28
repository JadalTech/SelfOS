/**
 * Conversation Summarizer
 * SelfOS v2.0.0 — Batch 13A
 */

import type { ConversationTurn } from '../../domain/assistant.types';

export class ConversationSummarizer {
  static summarize(turns: ConversationTurn[]): string {
    if (turns.length === 0) return 'Empty conversation';
    const topics = turns.map((t) => t.message.text.substring(0, 30)).join(', ');
    return `User talked about: ${topics}.`;
  }
}
export default ConversationSummarizer;
