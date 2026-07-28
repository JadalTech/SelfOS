import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export interface FeatureLayoutProps {
  readonly title: string;
  readonly showBackButton?: boolean;
  readonly rightAction?: React.ReactNode;
  readonly children: React.ReactNode;
}

export const FeatureLayout: React.FC<FeatureLayoutProps> = React.memo(function FeatureLayout({
  title,
  showBackButton = true,
  rightAction,
  children,
}) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-800/80">
        <View className="flex-row items-center gap-3">
          {showBackButton ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className="p-2 -ml-2 rounded-xl bg-zinc-900 border border-zinc-800/60 w-10 h-10 items-center justify-center"
              accessibilityLabel="Back"
              accessibilityRole="button"
              accessibilityHint="Navigates to the previous screen"
            >
              <Text className="text-zinc-100 text-lg font-bold">←</Text>
            </TouchableOpacity>
          ) : null}
          <Text className="text-zinc-100 text-xl font-bold font-sans tracking-tight">{title}</Text>
        </View>
        {rightAction ? <View>{rightAction}</View> : null}
      </View>
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
});
