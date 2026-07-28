/**
 * Screen Components for AI Assistant UI
 * SelfOS v2.0.0 — Batch 13B
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AssistantLayout } from '../layouts/AssistantLayout';
import { MessageRenderer } from '../renderers/MessageRenderer';
import { TypingIndicator, Composer, EmptyState } from '../components/Components';
import { useAssistantViewModel } from '../viewmodels/useAssistantViewModel';

// =========================================================================
// 1. Assistant Home Screen
// =========================================================================

export const AssistantHomeScreen: React.FC = () => {
  const router = useRouter();
  return (
    <AssistantLayout>
      <View style={styles.centerContainer}>
        <Text style={styles.title}>SelfOS AI Assistant</Text>
        <Text style={styles.subtitle}>Your Unified Health Intelligence Coach</Text>

        <Pressable style={styles.primaryBtn} onPress={() => router.push('/assistant/chat')}>
          <Text style={styles.btnText}>Start Conversation</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={() => router.push('/assistant/history')}>
          <Text style={styles.secondaryBtnText}>View Chat History</Text>
        </Pressable>
      </View>
    </AssistantLayout>
  );
};

// =========================================================================
// 2. Active Conversation Screen
// =========================================================================

export const ConversationScreen: React.FC = () => {
  const { turns, loading, isStreaming, streamText, sendMessage } = useAssistantViewModel();

  return (
    <AssistantLayout>
      <View style={styles.chatContainer}>
        {turns.length === 0 ? (
          <EmptyState type="FirstTimeOnboarding" />
        ) : (
          <FlatList
            data={turns}
            keyExtractor={(item) => item.turnId}
            renderItem={({ item }) => <MessageRenderer turn={item} />}
            contentContainerStyle={styles.listContent}
          />
        )}

        {isStreaming && (
          <View style={styles.streamingBox}>
            <Text style={styles.streamText}>{streamText}</Text>
          </View>
        )}

        {loading && <TypingIndicator />}

        <Composer onSend={sendMessage} disabled={loading || isStreaming} />
      </View>
    </AssistantLayout>
  );
};

// =========================================================================
// 3. Conversation History Screen
// =========================================================================

export const ConversationHistoryScreen: React.FC = () => {
  return (
    <AssistantLayout>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Chat History</Text>
        <EmptyState type="NoHistory" />
      </View>
    </AssistantLayout>
  );
};

// =========================================================================
// 4. Assistant Settings Screen
// =========================================================================

export const AssistantSettingsScreen: React.FC = () => {
  return (
    <AssistantLayout>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Assistant Settings</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configuration</Text>
          <Text style={styles.cardSub}>Preferred Provider: Gemini 1.5 Flash</Text>
        </View>
      </View>
    </AssistantLayout>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },
  listContent: {
    paddingVertical: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8E8E9F',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#FF4081',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: '#1E1E2F',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  streamingBox: {
    backgroundColor: '#1E1E2F',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    borderColor: '#3F51B5',
    borderWidth: 1,
  },
  streamText: {
    color: '#8E8E9F',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSub: {
    color: '#8E8E9F',
    fontSize: 13,
  },
});
