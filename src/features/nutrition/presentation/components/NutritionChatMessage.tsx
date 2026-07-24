import React from 'react';
import { View, Text } from 'react-native';
import type { NutritionChatMessage as MessageType } from '../../ai/types/nutritionAI.types';

export interface NutritionChatMessageProps {
  readonly message: MessageType;
}

export const NutritionChatMessage: React.FC<NutritionChatMessageProps> = React.memo(function NutritionChatMessage({
  message,
}) {
  const isUser = message.sender === 'user';

  return (
    <View
      className={`flex-row my-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${isUser ? 'You' : 'AI Coach'}: ${message.text}`}
    >
      <View
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-pink-600 rounded-tr-sm'
            : 'bg-zinc-900 border border-zinc-800 rounded-tl-sm'
        }`}
      >
        <Text className={`text-sm leading-relaxed ${isUser ? 'text-white font-medium' : 'text-zinc-100'}`}>
          {message.text}
        </Text>
        <View className="flex-row items-center justify-between mt-1.5 gap-2">
          {!isUser && message.providerName ? (
            <Text className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest">
              🤖 {message.providerName}
            </Text>
          ) : <View />}
          <Text className={`text-[8px] ${isUser ? 'text-pink-300' : 'text-zinc-500'} font-semibold`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    </View>
  );
});
