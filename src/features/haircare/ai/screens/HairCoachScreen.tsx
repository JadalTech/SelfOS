import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAskHairCoach } from '../hooks/useAskHairCoach';
import { useHairRecommendations } from '../hooks/useHairRecommendations';
import { useWeeklyHairReview } from '../hooks/useWeeklyHairReview';
import { ChatMessage } from '../components/ChatMessage';
import { RecommendationCard } from '../components/RecommendationCard';
import { PromptInput } from '../components/PromptInput';
import { EmptyConversation } from '../components/EmptyConversation';
import { LoadingHaircare, ErrorHaircare } from '../../components';

export const HairCoachScreen: React.FC = function HairCoachScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'review'>('chat');

  const { messages, sendMessage, isAsking } = useAskHairCoach();
  const { recommendations, isLoading: isLoadingRecs } = useHairRecommendations();
  const { review, isLoading: isLoadingReview } = useWeeklyHairReview();

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 p-4 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
              <Text className="text-amber-400 text-xs font-semibold mb-1">← Back to Haircare</Text>
            </TouchableOpacity>
            <Text className="text-zinc-50 text-2xl font-extrabold">AI Hair Coach Hub</Text>
          </View>

          <View className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            <Text className="text-amber-400 text-xs font-bold">🤖 Assistant</Text>
          </View>
        </View>

        {/* Tab Switcher Bar */}
        <View className="flex-row bg-zinc-900 border border-zinc-800 p-1 rounded-2xl">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-xl items-center ${
              activeTab === 'chat' ? 'bg-amber-500' : ''
            }`}
            onPress={() => setActiveTab('chat')}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'chat' ? 'text-zinc-950' : 'text-zinc-400'
              }`}
            >
              Ask AI Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2 rounded-xl items-center ${
              activeTab === 'recommendations' ? 'bg-amber-500' : ''
            }`}
            onPress={() => setActiveTab('recommendations')}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'recommendations' ? 'text-zinc-950' : 'text-zinc-400'
              }`}
            >
              Recommendations ({recommendations.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2 rounded-xl items-center ${
              activeTab === 'review' ? 'bg-amber-500' : ''
            }`}
            onPress={() => setActiveTab('review')}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'review' ? 'text-zinc-950' : 'text-zinc-400'
              }`}
            >
              Weekly Review
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: AI Chat */}
        {activeTab === 'chat' ? (
          <View className="flex-1 justify-between gap-3">
            <ScrollView className="flex-1" contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
              {messages.length <= 1 ? (
                <EmptyConversation onSelectSamplePrompt={(p) => void sendMessage(p)} />
              ) : null}

              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </ScrollView>

            <PromptInput onSend={sendMessage} isSending={isAsking} />
          </View>
        ) : null}

        {/* Tab 2: Recommendations Stream */}
        {activeTab === 'recommendations' ? (
          <ScrollView className="flex-1" contentContainerStyle={{ gap: 12 }}>
            {isLoadingRecs ? (
              <LoadingHaircare />
            ) : recommendations.length === 0 ? (
              <Text className="text-zinc-500 text-xs py-4 text-center">
                No active recommendations. Great job executing your routines!
              </Text>
            ) : (
              recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))
            )}
          </ScrollView>
        ) : null}

        {/* Tab 3: Weekly Review Summary */}
        {activeTab === 'review' ? (
          <ScrollView className="flex-1" contentContainerStyle={{ gap: 12 }}>
            {isLoadingReview ? (
              <LoadingHaircare />
            ) : !review ? (
              <ErrorHaircare errorMessage="Unable to generate weekly review." />
            ) : (
              <View className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl gap-4 shadow-md">
                <View className="border-b border-zinc-800 pb-3">
                  <Text className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                    {review.periodLabel}
                  </Text>
                  <Text className="text-zinc-100 text-lg font-extrabold mt-1">{review.title}</Text>
                  <Text className="text-zinc-300 text-xs font-semibold mt-1 leading-relaxed">
                    {review.headline}
                  </Text>
                </View>

                {/* Key Observations */}
                <View className="gap-2">
                  <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    Key Observations
                  </Text>
                  {review.keyObservations.map((obs, idx) => (
                    <Text key={idx} className="text-zinc-300 text-xs leading-relaxed">
                      • {obs}
                    </Text>
                  ))}
                </View>

                {/* Actionable Advice */}
                <View className="gap-2 border-t border-zinc-800 pt-3">
                  <Text className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                    Actionable Advice for Next Week
                  </Text>
                  {review.actionableAdvice.map((advice, idx) => (
                    <Text key={idx} className="text-zinc-300 text-xs leading-relaxed">
                      ✓ {advice}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        ) : null}
      </View>
    </SafeAreaView>
  );
};
