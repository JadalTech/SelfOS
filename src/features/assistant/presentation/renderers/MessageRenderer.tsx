/**
 * Message Renderer Pipeline Component
 * SelfOS v2.0.0 — Batch 13B
 */

import React from 'react';
import type { ConversationTurn } from '../../domain/assistant.types';
import { UserMessage, AssistantMessage } from '../components/Components';

export const MessageRenderer: React.FC<{ readonly turn: ConversationTurn }> = ({ turn }) => {
  const { message } = turn;

  if (message.sender === 'user') {
    return <UserMessage text={message.text} timestamp={message.timestamp} />;
  }

  return (
    <AssistantMessage
      text={message.text}
      timestamp={message.timestamp}
      suggestedFollowUps={message.suggestedFollowUps}
    />
  );
};
export default MessageRenderer;
