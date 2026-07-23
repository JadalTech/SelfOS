import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { hairAIRepository } from '../repository/hairAIRepository';
import type { HairCoachMessage } from '../types/ai.types';

export function useAskHairCoach() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const [messages, setMessages] = useState<HairCoachMessage[]>([
    {
      id: 'welcome_1',
      sender: 'coach',
      text: 'Hello! I am your AI Hair Coach. How can I help you improve your hair growth, routine consistency, or product usage today?',
      timestamp: new Date(),
    },
  ]);

  const askMutation = useMutation({
    mutationFn: async (userText: string) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await hairAIRepository.askCoach(userId, userText, messages);
      if (!res.success) throw res.error;
      return res.data;
    },
  });

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: HairCoachMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);

      try {
        const coachAnswer = await askMutation.mutateAsync(text.trim());
        const coachMsg: HairCoachMessage = {
          id: `coach_${Date.now()}`,
          sender: 'coach',
          text: coachAnswer,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, coachMsg]);
      } catch (err: any) {
        const errorMsg: HairCoachMessage = {
          id: `err_${Date.now()}`,
          sender: 'coach',
          text: `Sorry, I encountered an issue retrieving your hair data: ${err?.message || 'Unknown error'}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    },
    [askMutation]
  );

  return {
    messages,
    sendMessage,
    isAsking: askMutation.isPending,
  };
}
