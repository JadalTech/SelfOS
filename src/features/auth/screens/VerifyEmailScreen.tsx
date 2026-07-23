import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { InlineLoader } from '@/shared/components';

export default function VerifyEmailScreen() {
  const {
    email,
    isChecking,
    isResending,
    cooldownSeconds,
    error,
    resendSuccess,
    handleResend,
    handleRefresh,
    handleSignOut,
  } = useVerifyEmail();

  return (
    <SafeAreaView className="flex-1 bg-zinc-950 p-6 justify-between">
      <View className="flex-1 justify-center items-center">
        {/* Glow decoration */}
        <View className="absolute w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

        <Text className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-2">
          Registration Complete
        </Text>
        <Text className="text-zinc-50 text-3xl font-extrabold tracking-tight mb-4 text-center">
          Verify Your Email
        </Text>
        <Text className="text-zinc-400 text-sm text-center max-w-[280px] leading-relaxed mb-6">
          {"We've sent a verification link to your inbox. Please click the link to verify your email."}
        </Text>

        {email ? (
          <View className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 mb-6">
            <Text className="text-zinc-300 font-semibold text-sm">{email}</Text>
          </View>
        ) : null}

        {/* Notifications and Alerts */}
        {error ? (
          <View className="bg-red-500/15 border border-red-500/30 rounded-xl p-4 mb-6 w-full max-w-sm">
            <Text className="text-red-400 text-sm font-medium text-center">{error}</Text>
          </View>
        ) : null}

        {resendSuccess ? (
          <View className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-4 mb-6 w-full max-w-sm">
            <Text className="text-emerald-400 text-sm font-medium text-center">
              Verification link resent successfully!
            </Text>
          </View>
        ) : null}
      </View>

      {/* Button Actions */}
      <View className="w-full max-w-sm mx-auto gap-4">
        {/* Refresh check */}
        <TouchableOpacity
          className="bg-indigo-600 active:bg-indigo-700 py-4 rounded-xl items-center shadow-lg shadow-indigo-600/25"
          onPress={handleRefresh}
          disabled={isChecking}
        >
          {isChecking ? (
            <InlineLoader label="Checking status..." color="#ffffff" />
          ) : (
            <Text className="text-zinc-50 font-semibold text-base">{"I've Verified My Email"}</Text>
          )}
        </TouchableOpacity>

        {/* Resend actions */}
        <TouchableOpacity
          className="bg-zinc-900 border border-zinc-800 active:bg-zinc-800 py-4 rounded-xl items-center"
          onPress={handleResend}
          disabled={isResending || cooldownSeconds > 0}
        >
          {isResending ? (
            <ActivityIndicator size="small" color="#a1a1aa" />
          ) : (
            <Text className="text-zinc-400 font-semibold text-base">
              {cooldownSeconds > 0
                ? `Resend Email in ${cooldownSeconds}s`
                : 'Resend Verification Email'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Cancel / Log out */}
        <TouchableOpacity
          className="py-3 items-center"
          onPress={handleSignOut}
        >
          <Text className="text-zinc-500 font-semibold text-sm">Cancel & Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
