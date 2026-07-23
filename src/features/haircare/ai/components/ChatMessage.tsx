import React from 'react';
import { View, Text } from 'react-native';
import type { HairCoachMessage } from '../types/ai.types';

interface ChatMessageProps {
  readonly message: HairCoachMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  function ChatMessage({ message }) {
    const isUser = message.sender === 'user';

    return (
      <View className={`flex-row my-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <View
          className={`max-w-[82%] p-3 rounded-2xl gap-1 shadow-sm ${
            isUser
              ? 'bg-amber-500 rounded-tr-xs'
              : 'bg-zinc-900 border border-zinc-800 rounded-tl-xs'
          }`}
        >
          <View className="flex-row items-center justify-between gap-2">
            <Text
              className={`text-[10px] font-extrabold uppercase ${
                isUser ? 'text-zinc-950' : 'text-amber-400'
              }`}
            >
              {isUser ? 'You' : '🤖 AI Hair Coach'}
            </Text>
          </View>

          <Text
            className={`text-xs font-medium leading-relaxed ${
              isUser ? 'text-zinc-950' : 'text-zinc-100'
            }`}
          >
            {message.text}
          </Text>
        </View>
      </View>
    );
  }
);
