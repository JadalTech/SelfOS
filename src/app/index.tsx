import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/shared/stores";
import { FullScreenLoader } from "@/shared/components";

export default function WelcomeScreen() {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized && status === 'authenticated') {
      router.replace('/(app)');
    }
  }, [status, isInitialized, router]);

  if (!isInitialized || status === 'unknown') {
    return <FullScreenLoader message="Initializing SelfOS..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950 justify-between p-6">
      <StatusBar barStyle="light-content" />
      
      {/* Top spacing or small indicator */}
      <View className="items-end">
        <Text className="text-zinc-500 text-xs font-medium tracking-widest uppercase">
          v1.0.0
        </Text>
      </View>

      {/* Hero Section */}
      <View className="flex-1 justify-center items-center px-4">
        {/* Glow decoration */}
        <View className="absolute w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        
        {/* App Title */}
        <Text className="text-zinc-50 text-5xl font-extrabold tracking-tight mb-2">
          Self<Text className="text-indigo-400">OS</Text>
        </Text>
        
        {/* Subtitle */}
        <Text className="text-zinc-400 text-base text-center max-w-[280px] leading-relaxed">
          The intelligent operating system for your personal growth.
        </Text>
      </View>

      {/* Call to Action & Test Section */}
      <View className="gap-4">
        {/* Tailwind Verification Indicator */}
        <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 items-center">
          <Text className="text-zinc-300 text-sm font-semibold mb-1">
            NativeWind Integration Active
          </Text>
          <Text className="text-zinc-500 text-xs text-center">
            Styles rendered using utility-first classes successfully.
          </Text>
        </View>

        {/* Temporary Entry Action */}
        <TouchableOpacity 
          className="bg-indigo-600 active:bg-indigo-700 py-4 rounded-xl items-center shadow-lg shadow-indigo-600/20"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-zinc-50 font-semibold text-base">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
