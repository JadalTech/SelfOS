/**
 * Unified AI Query & Conversation Hooks
 * SelfOS v1.5.0 — Batch 12C
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { insightsRepository } from '../../repository/InsightsRepository';
import { aiInsightsService } from '../services/AIInsightsService';
import { AIContextBuilder } from '../builders/AIContextBuilder';
import type { ConversationMessage } from '../types/ai.types';

export function useHealthSummary() {
  const userId = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: ['insights', 'ai', 'summary', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      // 1. Fetch domain pipeline data
      const pipelineRes = await insightsRepository.calculatePipeline(userId);
      if (!pipelineRes.success) throw pipelineRes.error;

      // 2. Build token optimized context string
      const ctxStr = AIContextBuilder.buildContext(pipelineRes.data);

      // 3. Fire request to AI Service
      const aiRes = await aiInsightsService.getDailySummary(userId, ctxStr);
      if (!aiRes.success) throw aiRes.error;

      return aiRes.data;
    },
    enabled: !!userId,
    staleTime: 6 * 60 * 60 * 1000, // 6 Hour cache TTL
  });
}

export function useConversation() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ConversationMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Mock conversation delay response complying with stateless flow
      setTimeout(() => {
        const aiMsg: ConversationMessage = {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: 'Thanks for asking. Keeping consistent sleep routines is core to accelerating workout recoveries.',
          timestamp: new Date(),
          suggestedFollowUps: ['How can I lower my training fatigue?', 'Show my hydration correlation score'],
        };
        setMessages((prev) => [...prev, aiMsg]);
        setLoading(false);
      }, 1000);
    } catch {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}
