import React from 'react';
import { View, Text } from 'react-native';
import type { SkinChatMessage as SkinChatMessageProps } from '../types/ai.types';

export const SkinChatMessage: React.FC<{ readonly message: SkinChatMessageProps }> = function SkinChatMessage({
  message,
}) {
  const isUser = message.sender === 'user';
  const timeStr = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <View className={`my-1.5 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser ? (
        <View className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 items-center justify-center mr-2 mt-1">
          <Text className="text-pink-400 text-xs font-bold">✨</Text>
        </View>
      ) : null}

      <View
        className={`max-w-[82%] p-3.5 rounded-2xl ${
          isUser
            ? 'bg-pink-600 rounded-tr-xs text-white'
            : 'bg-zinc-900 border border-zinc-800 rounded-tl-xs text-zinc-100'
        }`}
      >
        <Text className={`text-xs font-semibold mb-1 ${isUser ? 'text-pink-200' : 'text-pink-400'}`}>
          {isUser ? 'You' : 'Skin AI Coach'}
        </Text>
        <Text className={`text-sm leading-5 ${isUser ? 'text-white font-medium' : 'text-zinc-200'}`}>
          {message.text}
        </Text>
        {timeStr ? (
          <Text className={`text-[10px] mt-1.5 text-right ${isUser ? 'text-pink-200/70' : 'text-zinc-500'}`}>
            {timeStr}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
