import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSkinCoach } from '../ai/hooks/useSkinCoach';
import { SkinChatMessage } from '../ai/components/SkinChatMessage';
import { SkinRecommendationCard } from '../ai/components/SkinRecommendationCard';
import { SkinWeeklyReviewCard } from '../ai/components/SkinWeeklyReviewCard';
import { SkeletonLoader } from '../../../shared/components/loaders/SkeletonLoader';
import { EmptyStateCard } from '../../../shared/components/feedback/EmptyStateCard';
import type { ProviderType } from '../ai/providers/providerFactory';

const QUICK_PROMPTS = [
  'How should I layer my morning serums?',
  'What are the signs of a damaged skin barrier?',
  'How often should I reapply sunscreen outdoors?',
  'Can I use Retinol and Niacinamide together?',
];

export function SkinCoachScreen() {
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'review'>('chat');
  const [providerType, setProviderType] = useState<ProviderType>('heuristic');
  const [inputQuery, setInputQuery] = useState('');

  const {
    messages,
    isLoadingMessages,
    askCoach,
    isAsking,
    clearConversation,
    isClearing,
    recommendations,
    isLoadingRecommendations,
    weeklyReview,
    isLoadingWeeklyReview,
  } = useSkinCoach(providerType);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isAsking) return;

    setInputQuery('');
    try {
      await askCoach(query.trim());
    } catch {
      // Handled in hook
    }
  };

  return (
    <View className="flex-1 bg-black p-4 gap-4">
      {/* Header Banner */}
      <View className="bg-zinc-900/90 border border-zinc-800/80 p-4 rounded-2xl flex-row items-center justify-between shadow-md">
        <View>
          <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">AI Assistant</Text>
          <Text className="text-zinc-50 text-lg font-bold">Skincare AI Coach</Text>
        </View>
        <View className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/30 items-center justify-center">
          <Text className="text-lg">✨</Text>
        </View>
      </View>

      {/* Provider Selector & Tab Navigation */}
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-2 gap-2">
        <View className="flex-row items-center justify-between px-2 pt-1 pb-2 border-b border-zinc-800/60">
          <Text className="text-zinc-400 text-xs font-semibold">AI Provider:</Text>
          <View className="flex-row gap-1.5">
            {(['heuristic', 'gemini', 'mock'] as ProviderType[]).map((p) => {
              const isSelected = providerType === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setProviderType(p)}
                  className={`px-2.5 py-1 rounded-lg border ${
                    isSelected
                      ? 'bg-pink-500/20 border-pink-500/50'
                      : 'bg-zinc-950 border-zinc-800'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold uppercase ${
                      isSelected ? 'text-pink-400' : 'text-zinc-500'
                    }`}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Navigation Tabs */}
        <View className="flex-row bg-zinc-950 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => setActiveTab('chat')}
            className={`flex-1 py-2 items-center rounded-lg ${
              activeTab === 'chat' ? 'bg-pink-600' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'chat' ? 'text-white' : 'text-zinc-400'
              }`}
            >
              💬 AI Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('recommendations')}
            className={`flex-1 py-2 items-center rounded-lg ${
              activeTab === 'recommendations' ? 'bg-pink-600' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'recommendations' ? 'text-white' : 'text-zinc-400'
              }`}
            >
              💡 Recommendations ({recommendations.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('review')}
            className={`flex-1 py-2 items-center rounded-lg ${
              activeTab === 'review' ? 'bg-pink-600' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'review' ? 'text-white' : 'text-zinc-400'
              }`}
            >
              📊 Weekly Review
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Tab Content */}
      {activeTab === 'chat' ? (
        <View className="flex-1 justify-between gap-3">
          {/* Chat Messages */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {isLoadingMessages ? (
              <View className="gap-3 py-4">
                <SkeletonLoader height={60} />
                <SkeletonLoader height={60} />
              </View>
            ) : messages.length === 0 ? (
              <View className="gap-4">
                <EmptyStateCard
                  title="Ask Your AI Skin Coach"
                  description="Ask anything about active ingredients, routine ordering, barrier repair, or sunscreen tips."
                  icon="✨"
                />

                {/* Quick Prompts */}
                <View className="gap-2">
                  <Text className="text-zinc-400 text-xs font-semibold">Suggested Questions:</Text>
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSend(prompt)}
                      className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex-row items-center justify-between"
                    >
                      <Text className="text-zinc-300 text-xs font-medium flex-1 pr-2">{prompt}</Text>
                      <Text className="text-pink-400 text-xs font-bold">→</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View>
                <View className="flex-row items-center justify-between pb-2">
                  <Text className="text-zinc-500 text-[10px] uppercase font-bold">
                    Conversation ({messages.length} messages)
                  </Text>
                  <TouchableOpacity
                    onPress={() => clearConversation()}
                    disabled={isClearing}
                    className="p-1"
                  >
                    <Text className="text-zinc-500 text-xs hover:text-rose-400 font-semibold">
                      Clear Chat
                    </Text>
                  </TouchableOpacity>
                </View>
                {messages.map((msg) => (
                  <SkinChatMessage key={msg.id} message={msg} />
                ))}
              </View>
            )}

            {isAsking ? (
              <View className="flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 p-3 rounded-xl my-2">
                <ActivityIndicator color="#ec4899" size="small" />
                <Text className="text-zinc-400 text-xs">AI Coach is thinking...</Text>
              </View>
            ) : null}
          </ScrollView>

          {/* Input Bar */}
          <View className="flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl shadow-lg">
            <TextInput
              className="flex-1 px-3 py-2 text-zinc-100 text-sm max-h-24"
              placeholder="Ask AI Skin Coach..."
              placeholderTextColor="#71717a"
              value={inputQuery}
              onChangeText={setInputQuery}
              onSubmitEditing={() => handleSend()}
              multiline
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSend()}
              disabled={isAsking || !inputQuery.trim()}
              className={`w-10 h-10 rounded-xl items-center justify-center ${
                inputQuery.trim() ? 'bg-pink-600' : 'bg-zinc-800'
              }`}
            >
              <Text className="text-white text-base font-bold">↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : activeTab === 'recommendations' ? (
        <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {isLoadingRecommendations ? (
            <View className="gap-3">
              <SkeletonLoader height={120} />
              <SkeletonLoader height={120} />
            </View>
          ) : recommendations.length === 0 ? (
            <EmptyStateCard
              title="No Recommendations Yet"
              description="Your skin routines and vanity products are optimized! Check back after logging more routines."
              icon="✨"
            />
          ) : (
            recommendations.map((rec) => <SkinRecommendationCard key={rec.id} recommendation={rec} />)
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {isLoadingWeeklyReview ? (
            <SkeletonLoader height={200} />
          ) : weeklyReview ? (
            <SkinWeeklyReviewCard review={weeklyReview} />
          ) : (
            <EmptyStateCard
              title="Weekly Review Unavailable"
              description="Log your daily routines to generate an intelligent weekly analysis."
              icon="📊"
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
