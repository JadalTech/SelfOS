import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { InlineLoader } from '@/shared/components';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { form, isLoading, isSent, error, onSubmit, resetForm } = useForgotPassword();
  const { control, formState: { errors } } = form;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6 justify-between">
          <View className="flex-1 justify-center py-12">
            {/* Header */}
            <View className="items-center mb-10">
              <View className="absolute w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
              <Text className="text-zinc-50 text-4xl font-extrabold tracking-tight mb-2">
                Reset Password
              </Text>
              <Text className="text-zinc-400 text-sm text-center">
                {"We'll send you instructions to reset your password."}
              </Text>
            </View>

            {/* Success state */}
            {isSent ? (
              <View className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-5 mb-8">
                <Text className="text-emerald-400 text-base font-semibold mb-1">
                  Reset Link Sent!
                </Text>
                <Text className="text-zinc-400 text-sm leading-relaxed mb-4">
                  Check your inbox for instructions to reset your password.
                </Text>
                <TouchableOpacity
                  className="bg-emerald-600/20 border border-emerald-500/30 active:bg-emerald-600/30 py-2.5 rounded-lg items-center"
                  onPress={resetForm}
                >
                  <Text className="text-emerald-400 font-semibold text-sm">Send Again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Error Message */}
                {error ? (
                  <View className="bg-red-500/15 border border-red-500/30 rounded-xl p-4 mb-6">
                    <Text className="text-red-400 text-sm font-medium">{error}</Text>
                  </View>
                ) : null}

                {/* Form Fields */}
                <View className="gap-5">
                  <View>
                    <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
                      Email Address
                    </Text>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className="bg-zinc-900 border border-zinc-800 text-zinc-50 py-4 px-4 rounded-xl text-base focus:border-indigo-500"
                          placeholder="name@domain.com"
                          placeholderTextColor="#71717a"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          autoCapitalize="none"
                          keyboardType="email-address"
                        />
                      )}
                    />
                    {errors.email?.message ? (
                      <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                        {errors.email.message}
                      </Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    className="bg-indigo-600 active:bg-indigo-700 py-4 rounded-xl items-center shadow-lg shadow-indigo-600/25 disabled:opacity-75"
                    onPress={onSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <InlineLoader label="Sending recovery email..." color="#ffffff" />
                    ) : (
                      <Text className="text-zinc-50 font-semibold text-base">Send Reset Link</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Back to sign in */}
          <View className="mt-auto items-center">
            <TouchableOpacity
              className="py-3 px-6"
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text className="text-zinc-500 font-semibold text-sm">Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
