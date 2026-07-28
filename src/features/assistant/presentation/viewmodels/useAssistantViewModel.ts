/**
 * Assistant ViewModel
 * SelfOS v2.0.0 — Batch 13B
 */

import { useState } from 'react';
import { useConversation } from '../../hooks/useConversation';
import { streamingController } from '../controllers/StreamingController';

export function useAssistantViewModel() {
  const { turns, loading, sendMessage: sendEngineMessage } = useConversation();
  const [streamText, setStreamText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Simulate streaming effect
    setIsStreaming(true);
    streamingController.startStream(
      (chunk) => setStreamText(chunk),
      () => {
        setIsStreaming(false);
        setStreamText('');
        sendEngineMessage(text);
      }
    );
  };

  return {
    turns,
    loading,
    isStreaming,
    streamText,
    sendMessage,
  };
}
export default useAssistantViewModel;
