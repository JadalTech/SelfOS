/**
 * React Query Hooks for AI Assistant
 * SelfOS v2.0.0 — Batch 13A
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { conversationService } from '../services/ConversationService';
import { assistantService } from '../services/AssistantService';
import { conversationMemoryManager } from '../ai/memory/ConversationMemoryManager';
import type { ConversationTurn } from '../domain/assistant.types';

export function useConversation() {
  const userId = useAuthStore((s) => s.user?.uid);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!userId || !text.trim()) return;

    setLoading(true);

    try {
      const userTurn = await conversationService.addMessageTurn(userId, 'user', text);
      setTurns((prev) => [...prev, userTurn]);

      // Mock context setup
      const context = {
        userId,
        healthScore: 8.0,
        activeStreak: 5,
      };

      const response = await assistantService.processQuery(context, text);

      const aiTurn = await conversationService.addMessageTurn(userId, 'assistant', response.text);
      setTurns((prev) => [...prev, aiTurn]);
    } finally {
      setLoading(false);
    }
  };

  return {
    turns,
    loading,
    sendMessage,
  };
}

export default useConversation;
