import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNutritionCoach } from '../../ai/hooks/useNutritionCoach';
import { NutritionChatMessage } from '../components/NutritionChatMessage';
import { NutritionRecommendationCard } from '../components/NutritionRecommendationCard';
import { NutritionWeeklyReviewCard } from '../components/NutritionWeeklyReviewCard';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { FeatureHeader } from '../layouts/FeatureHeader';

import {
  SkeletonLoader,
  NoDataCard,
} from '../../../../shared/components';
import type { ProviderType } from '../../ai/providers/providerFactory';

const QUICK_PROMPTS = [
  'How do I increase my dietary protein intake?',
  'What are some high fiber meal substitutions?',
  'Explain calories target vs remaining budget.',
  'How does excess sugar affect body energy levels?',
];

export const NutritionCoachScreen: React.FC = React.memo(function NutritionCoachScreen() {
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'review'>('chat');
  const [providerType, setProviderType] = useState<ProviderType>('heuristic');
  const [inputQuery, setInputQuery] = useState('');

  const {
    messages,
    isLoadingMessages,
    askCoach,
    isAsking,
    clearConversation,
    recommendations,
    isLoadingRecommendations,
    weeklyReview,
    isLoadingWeeklyReview,
  } = useNutritionCoach(providerType);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || inputQuery;
    if (!queryText.trim() || isAsking) return;

    setInputQuery('');
    await askCoach(queryText.trim());
  };

  return (
    <DashboardLayout>
      <FeatureHeader
        title="Nutrition AI Coach"
        subtitle="Dietary guidance & reviews"
        showBackButton={true}
        actionLabel="Clear Chat"
        onAction={() => clearConversation()}
      />

      {/* Tabs */}
      <View className="flex-row bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
        {(['chat', 'recommendations', 'review'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-2 items-center rounded-lg ${
              activeTab === tab ? 'bg-pink-600' : 'bg-transparent'
            }`}
          >
            <Text className={`text-xs font-bold uppercase ${activeTab === tab ? 'text-white' : 'text-zinc-400'}`}>
              {tab === 'chat' ? '💬 Chat' : tab === 'recommendations' ? '💡 Recs' : '📊 Weekly'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Provider selection row */}
      <View className="flex-row items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-2xl">
        <Text className="text-zinc-400 text-xs font-semibold">AI Provider Engine:</Text>
        <View className="flex-row gap-1.5">
          {(['heuristic', 'gemini', 'mock'] as ProviderType[]).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setProviderType(p)}
              className={`px-3 py-1.5 rounded-lg border ${
                providerType === p ? 'bg-pink-500/20 border-pink-500/50' : 'bg-zinc-950 border-zinc-800'
              }`}
            >
              <Text className={`text-[10px] font-bold uppercase ${providerType === p ? 'text-pink-400' : 'text-zinc-500'}`}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main Tab content rendering */}
      {activeTab === 'chat' ? (
        <View className="gap-3">
          <ScrollView className="max-h-[360px]" showsVerticalScrollIndicator={false}>
            {isLoadingMessages ? (
              <View className="gap-3 py-2">
                <SkeletonLoader height={50} />
                <SkeletonLoader height={50} />
              </View>
            ) : messages.length === 0 ? (
              <View className="gap-4">
                <NoDataCard
                  title="Ask Your Dietitian Coach"
                  description="Type questions about fiber, carb targets, fat splits, or recipe guidelines."
                  icon="🤖"
                />
                <View className="gap-2 mt-1">
                  <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Suggested Questions:</Text>
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSend(prompt)}
                      className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl flex-row items-center justify-between"
                    >
                      <Text className="text-zinc-300 text-xs font-medium flex-1 pr-2">{prompt}</Text>
                      <Text className="text-pink-400 text-xs font-bold">➔</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              messages.map((msg) => <NutritionChatMessage key={msg.id} message={msg} />)
            )}
            {isAsking ? (
              <View className="flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl mt-2">
                <ActivityIndicator color="#ec4899" size="small" />
                <Text className="text-zinc-400 text-xs font-bold">Coach is formulating response...</Text>
              </View>
            ) : null}
          </ScrollView>

          {/* Chat input footer bar */}
          <View className="flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl shadow-lg mt-2">
            <TextInput
              value={inputQuery}
              onChangeText={setInputQuery}
              onSubmitEditing={() => handleSend()}
              placeholder="Ask AI Nutrition Coach..."
              placeholderTextColor="#71717a"
              className="flex-1 px-3 py-2 text-zinc-100 text-sm max-h-16"
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={isAsking || !inputQuery.trim()}
              className={`w-10 h-10 rounded-xl items-center justify-center ${
                inputQuery.trim() ? 'bg-pink-600' : 'bg-zinc-800'
              }`}
            >
              <Text className="text-white text-base font-extrabold">↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : activeTab === 'recommendations' ? (
        <ScrollView className="max-h-[420px]" showsVerticalScrollIndicator={false}>
          {isLoadingRecommendations ? (
            <View className="gap-3">
              <SkeletonLoader height={100} />
              <SkeletonLoader height={100} />
            </View>
          ) : recommendations.length === 0 ? (
            <NoDataCard title="No Tips Available" description="Your calorie logs are fully balanced today!" />
          ) : (
            recommendations.map((rec) => <NutritionRecommendationCard key={rec.id} recommendation={rec} />)
          )}
        </ScrollView>
      ) : (
        <ScrollView className="max-h-[420px]" showsVerticalScrollIndicator={false}>
          {isLoadingWeeklyReview ? (
            <SkeletonLoader height={180} />
          ) : weeklyReview ? (
            <NutritionWeeklyReviewCard review={weeklyReview} />
          ) : (
            <NoDataCard title="Review Unavailable" description="Please log more food items to generate weekly summaries." />
          )}
        </ScrollView>
      )}
    </DashboardLayout>
  );
});
export default NutritionCoachScreen;
