import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { InlineLoader } from '@/shared/components';

interface PromptInputProps {
  readonly onSend: (text: string) => Promise<void>;
  readonly isSending?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = React.memo(
  function PromptInput({ onSend, isSending = false }) {
    const [inputText, setInputText] = useState('');

    const handleSend = async () => {
      if (!inputText.trim() || isSending) return;
      const text = inputText.trim();
      setInputText('');
      await onSend(text);
    };

    return (
      <View className="flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl">
        <TextInput
          className="flex-1 text-zinc-100 px-3 py-2 text-xs font-medium focus:outline-none"
          placeholder="Ask AI Coach a question..."
          placeholderTextColor="#71717a"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => void handleSend()}
        />

        <TouchableOpacity
          className={`px-4 py-2.5 rounded-xl ${
            inputText.trim() && !isSending
              ? 'bg-amber-500 active:bg-amber-600'
              : 'bg-zinc-800 opacity-50'
          }`}
          onPress={() => void handleSend()}
          disabled={!inputText.trim() || isSending}
          accessibilityRole="button"
        >
          {isSending ? (
            <InlineLoader label="..." color="#09090b" />
          ) : (
            <Text className="text-zinc-950 font-extrabold text-xs">Send</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
);
