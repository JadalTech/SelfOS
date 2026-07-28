/**
 * Conversation Service
 * SelfOS v2.0.0 — Batch 13A
 */

import { conversationMemoryManager } from '../ai/memory/ConversationMemoryManager';
import { conversationSessionManager } from '../ai/memory/ConversationSessionManager';
import type { ConversationTurn } from '../domain/assistant.types';

export class ConversationService {
  async addMessageTurn(userId: string, sender: 'user' | 'assistant', text: string): Promise<ConversationTurn> {
    const session = conversationSessionManager.getActiveSession() || conversationSessionManager.createSession(userId);

    const turn: ConversationTurn = {
      turnId: `turn_${Date.now()}`,
      message: {
        id: `msg_${Date.now()}`,
        sender,
        text,
        timestamp: new Date(),
      },
    };

    conversationMemoryManager.addTurn(turn);
    session.lastActiveAt = new Date();
    return turn;
  }
}

export const conversationService = new ConversationService();
export default conversationService;
