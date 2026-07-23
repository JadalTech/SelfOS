import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface EmptyConversationProps {
  readonly onSelectSamplePrompt: (prompt: string) => void;
}

const SAMPLE_PROMPTS = [
  'How is my overall hair health improving?',
  'Which hair products do I apply most frequently?',
  'Why is my routine consistency dropping?',
  'What should I focus on improving this month?',
];

export const EmptyConversation: React.FC<EmptyConversationProps> = React.memo(
  function EmptyConversation({ onSelectSamplePrompt }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 items-center gap-3 my-2">
        <View className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 items-center justify-center">
          <Text className="text-2xl">🤖</Text>
        </View>

        <Text className="text-zinc-100 text-base font-bold text-center">
          Ask Your Personal AI Hair Coach
        </Text>
        <Text className="text-zinc-400 text-xs text-center leading-relaxed max-w-xs">
          Select a sample question below or type your own question to receive contextual insights.
        </Text>

        <View className="w-full gap-2 pt-2">
          {SAMPLE_PROMPTS.map((prompt) => (
            <TouchableOpacity
              key={prompt}
              className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl active:border-amber-500/60"
              onPress={() => onSelectSamplePrompt(prompt)}
            >
              <Text className="text-amber-400 text-xs font-semibold">💡 &quot;{prompt}&quot;</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
);
