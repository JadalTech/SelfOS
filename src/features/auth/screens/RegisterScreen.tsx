import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useRegister } from '../hooks/useRegister';
import { InlineLoader } from '@/shared/components';

export default function RegisterScreen() {
  const router = useRouter();
  const { form, isLoading, error, onSubmit } = useRegister();
  const { control, formState: { errors } } = form;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6 justify-between">
          <View className="flex-1 justify-center py-6">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="absolute w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
              <Text className="text-zinc-50 text-4xl font-extrabold tracking-tight mb-2">
                Register
              </Text>
              <Text className="text-zinc-400 text-sm text-center">
                Start your customized personal growth track.
              </Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-500/15 border border-red-500/30 rounded-xl p-4 mb-6">
                <Text className="text-red-400 text-sm font-medium">{error}</Text>
              </View>
            ) : null}

            {/* Form Fields */}
            <View className="gap-4">
              <View>
                <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
                  Full Name
                </Text>
                <Controller
                  control={control}
                  name="displayName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-zinc-900 border border-zinc-800 text-zinc-50 py-4 px-4 rounded-xl text-base focus:border-indigo-500"
                      placeholder="John Doe"
                      placeholderTextColor="#71717a"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="words"
                    />
                  )}
                />
                {errors.displayName?.message ? (
                  <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                    {errors.displayName.message}
                  </Text>
                ) : null}
              </View>

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

              <View>
                <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
                  Password
                </Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-zinc-900 border border-zinc-800 text-zinc-50 py-4 px-4 rounded-xl text-base focus:border-indigo-500"
                      placeholder="••••••••"
                      placeholderTextColor="#71717a"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.password?.message ? (
                  <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                    {errors.password.message}
                  </Text>
                ) : null}
              </View>

              <View>
                <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
                  Confirm Password
                </Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-zinc-900 border border-zinc-800 text-zinc-50 py-4 px-4 rounded-xl text-base focus:border-indigo-500"
                      placeholder="••••••••"
                      placeholderTextColor="#71717a"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.confirmPassword?.message ? (
                  <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                    {errors.confirmPassword.message}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="gap-6 mt-6">
            <TouchableOpacity
              className="bg-indigo-600 active:bg-indigo-700 py-4 rounded-xl items-center shadow-lg shadow-indigo-600/25 disabled:opacity-75"
              onPress={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <InlineLoader label="Creating account..." color="#ffffff" />
              ) : (
                <Text className="text-zinc-50 font-semibold text-base">Register</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center gap-1.5">
              <Text className="text-zinc-500 text-sm">Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text className="text-indigo-400 font-semibold text-sm">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
