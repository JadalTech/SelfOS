/**
 * Conversation Session Manager
 * SelfOS v2.0.0 — Batch 13A
 */

import type { AssistantSession } from '../../domain/assistant.types';

export class ConversationSessionManager {
  private activeSession: AssistantSession | null = null;

  createSession(userId: string): AssistantSession {
    const session: AssistantSession = {
      sessionId: `sess_${Date.now()}`,
      userId,
      activeConversationId: `conv_${Date.now()}`,
      lastActiveAt: new Date(),
      isExpired: false,
    };
    this.activeSession = session;
    return session;
  }

  getActiveSession(): AssistantSession | null {
    if (this.activeSession && Date.now() - this.activeSession.lastActiveAt.getTime() > 30 * 60 * 1000) {
      // Session expired after 30 minutes of inactivity
      this.activeSession = {
        ...this.activeSession,
        isExpired: true,
      };
    }
    return this.activeSession;
  }

  restoreSession(session: AssistantSession): void {
    this.activeSession = {
      ...session,
      lastActiveAt: new Date(),
      isExpired: false,
    };
  }
}

export const conversationSessionManager = new ConversationSessionManager();
export default conversationSessionManager;
