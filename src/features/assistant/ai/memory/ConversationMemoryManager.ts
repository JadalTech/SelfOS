/**
 * Conversation Memory Manager
 * SelfOS v2.0.0 — Batch 13A
 */

import type { ConversationTurn } from '../../domain/assistant.types';

export class ConversationMemoryManager {
  private history: ConversationTurn[] = [];

  addTurn(turn: ConversationTurn): void {
    this.history.push(turn);
  }

  getRecentTurns(limit = 10): ConversationTurn[] {
    return this.history.slice(-limit);
  }

  clearMemory(): void {
    this.history = [];
  }
}

export const conversationMemoryManager = new ConversationMemoryManager();
export default conversationMemoryManager;
