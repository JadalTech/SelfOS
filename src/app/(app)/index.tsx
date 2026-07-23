import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/shared/stores';
import { authRepository } from '@/features/auth/repository/auth.repository';
import { InlineLoader } from '@/shared/components';

export default function DashboardPlaceholder() {
  const user = useAuthStore((state) => state.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authRepository.signOut();
    setIsLoggingOut(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950 p-6 justify-between">
      <View className="flex-1 justify-center items-center">
        {/* Glow decoration */}
        <View className="absolute w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

        <Text className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-2">
          SelfOS Portal
        </Text>
        <Text className="text-zinc-50 text-3xl font-extrabold tracking-tight mb-6">
          Authenticated Screen
        </Text>

        <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm gap-4">
          <View className="border-b border-zinc-800 pb-3">
            <Text className="text-zinc-500 text-xs">Display Name</Text>
            <Text className="text-zinc-50 text-base font-semibold">
              {user?.displayName || 'Anonymous User'}
            </Text>
          </View>

          <View>
            <Text className="text-zinc-500 text-xs">Email Address</Text>
            <Text className="text-zinc-50 text-base font-medium">
              {user?.email || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View className="w-full max-w-sm mx-auto">
        <TouchableOpacity
          className="bg-zinc-900 border border-zinc-800 active:bg-zinc-800 py-4 rounded-xl items-center"
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <InlineLoader label="Signing out..." color="#ef4444" />
          ) : (
            <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
