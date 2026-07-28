import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { hydrationAIRepository } from '../repository/HydrationAIRepository';
import { hydrationAIService } from '../services/HydrationAIService';
import type { HydrationMessage, HydrationAdvice } from '../types/hydrationAI.types';

export function useHydrationCoach(conversationId = 'default') {
  const userId = useAuthStore((s) => s.user?.uid);
  const [messages, setMessages] = useState<HydrationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    hydrationAIRepository.getChatHistory(userId, conversationId).then(setMessages);
  }, [userId, conversationId]);

  const sendMessage = async (text: string) => {
    if (!userId || !text.trim()) return;

    const userMsg: HydrationMessage = {
      id: `msg_user_${Date.now()}`,
      conversationId,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const context = await hydrationAIRepository.compileContext(userId);
      const adviceRes = await hydrationAIService.getCoachingAdvice(userId, context);

      if (!adviceRes.success) throw adviceRes.error;

      const aiMsg: HydrationMessage = {
        id: `msg_ai_${Date.now()}`,
        conversationId,
        sender: 'ai',
        text: adviceRes.data.text,
        timestamp: new Date(),
      };

      await hydrationAIRepository.saveMessage(userId, conversationId, userMsg);
      await hydrationAIRepository.saveMessage(userId, conversationId, aiMsg);

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate response.');
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}
export default useHydrationCoach;
