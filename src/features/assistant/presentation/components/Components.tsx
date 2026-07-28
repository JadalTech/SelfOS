/**
 * Reusable Presentation Components for AI Assistant UI
 * SelfOS v2.0.0 — Batch 13B
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';

// =========================================================================
// 1. User Message Bubble
// =========================================================================

export const UserMessage: React.FC<{
  readonly text: string;
  readonly timestamp: Date;
}> = ({ text }) => {
  return (
    <View style={styles.userBubble} accessibilityLabel={`You: ${text}`}>
      <Text style={styles.userText}>{text}</Text>
    </View>
  );
};

// =========================================================================
// 2. Assistant Message Bubble with Suggestion Chips
// =========================================================================

export const AssistantMessage: React.FC<{
  readonly text: string;
  readonly timestamp: Date;
  readonly suggestedFollowUps?: readonly string[];
  readonly onSuggestionPress?: (suggestion: string) => void;
}> = ({ text, suggestedFollowUps, onSuggestionPress }) => {
  return (
    <View style={styles.assistantContainer}>
      <View style={styles.assistantBubble} accessibilityLabel={`Assistant: ${text}`}>
        <Text style={styles.assistantText}>{text}</Text>
      </View>
      {suggestedFollowUps && suggestedFollowUps.length > 0 && (
        <View style={styles.chipRow}>
          {suggestedFollowUps.map((chip, idx) => (
            <Pressable
              key={idx}
              style={styles.chip}
              onPress={() => onSuggestionPress?.(chip)}
              accessibilityRole="button"
              accessibilityLabel={`Suggestion: ${chip}`}
            >
              <Text style={styles.chipText}>{chip}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

// =========================================================================
// 3. Typing Indicator
// =========================================================================

export const TypingIndicator: React.FC = () => {
  return (
    <View style={styles.typingContainer} accessibilityLabel="Assistant is typing">
      <ActivityIndicator size="small" color="#FF4081" />
      <Text style={styles.typingText}>Assistant is thinking...</Text>
    </View>
  );
};

// =========================================================================
// 4. Chat Composer Input
// =========================================================================

export const Composer: React.FC<{
  readonly onSend: (text: string) => void;
  readonly disabled?: boolean;
}> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={styles.composerRow}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Ask SelfOS Assistant..."
        placeholderTextColor="#8E8E9F"
        editable={!disabled}
        accessibilityLabel="Chat input field"
      />
      <Pressable
        style={[styles.sendButton, (!text.trim() || disabled) && styles.sendDisabled]}
        onPress={handleSend}
        disabled={!text.trim() || disabled}
        accessibilityRole="button"
        accessibilityLabel="Send message"
      >
        <Text style={styles.sendText}>Send</Text>
      </Pressable>
    </View>
  );
};

// =========================================================================
// 5. Multi-Variant Empty State Component
// =========================================================================

export type AssistantEmptyStateVariant =
  | 'NoData'
  | 'NoHistory'
  | 'Offline'
  | 'ProviderUnavailable'
  | 'Loading'
  | 'Streaming'
  | 'Error'
  | 'Retry'
  | 'FirstTimeOnboarding';

export const EmptyState: React.FC<{
  readonly type?: AssistantEmptyStateVariant;
  readonly message?: string;
}> = ({ type = 'FirstTimeOnboarding', message }) => {
  const defaultMessages: Record<AssistantEmptyStateVariant, string> = {
    NoData: 'No conversation turns recorded yet.',
    NoHistory: 'Conversation history is clear.',
    Offline: 'You are offline. Cached AI memory is active.',
    ProviderUnavailable: 'AI provider is temporarily unreachable.',
    Loading: 'Initializing AI Assistant context...',
    Streaming: 'Receiving AI stream...',
    Error: 'An unexpected error occurred.',
    Retry: 'Connection interrupted. Please tap retry.',
    FirstTimeOnboarding: 'Welcome to SelfOS Assistant! Ask anything about your health, workouts, or sleep routines.',
  };

  return (
    <View style={styles.emptyContainer} accessibilityLabel={message || defaultMessages[type]}>
      <Text style={styles.emptyText}>{message || defaultMessages[type]}</Text>
    </View>
  );
};

// =========================================================================
// 6. Loading State
// =========================================================================

export const LoadingState: React.FC = () => {
  return (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color="#FF4081" />
      <Text style={styles.emptyText}>Loading Conversation...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3F51B5',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    marginVertical: 4,
    maxWidth: '85%',
  },
  assistantBubble: {
    backgroundColor: '#1E1E2F',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  assistantText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    backgroundColor: '#2A2A40',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    color: '#FF4081',
    fontSize: 12,
    fontWeight: '600',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  typingText: {
    color: '#8E8E9F',
    fontSize: 13,
    marginLeft: 8,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#2A2A40',
  },
  input: {
    flex: 1,
    backgroundColor: '#1E1E2F',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  sendButton: {
    backgroundColor: '#FF4081',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  sendDisabled: {
    backgroundColor: '#4A4A60',
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#8E8E9F',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
