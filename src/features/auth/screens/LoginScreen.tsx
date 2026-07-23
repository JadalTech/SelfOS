import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useLogin } from '../hooks/useLogin';
import { InlineLoader } from '@/shared/components';

export default function LoginScreen() {
  const router = useRouter();
  const { form, isLoading, error, onSubmit } = useLogin();
  const { control, formState: { errors } } = form;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6 justify-between">
          <View className="flex-1 justify-center py-12">
            {/* Logo and Greeting */}
            <View className="items-center mb-10">
              <View className="absolute w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
              <Text className="text-zinc-50 text-4xl font-extrabold tracking-tight mb-2">
                Self<Text className="text-indigo-400">OS</Text>
              </Text>
              <Text className="text-zinc-400 text-sm text-center">
                Sign in to manage your growth system.
              </Text>
            </View>

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
                      autoComplete="email"
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
                      autoComplete="password"
                    />
                  )}
                />
                {errors.password?.message ? (
                  <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                    {errors.password.message}
                  </Text>
                ) : null}
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity
                className="self-end py-1"
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                <Text className="text-zinc-500 text-sm font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Actions */}
          <View className="gap-6 mt-auto">
            <TouchableOpacity
              className="bg-indigo-600 active:bg-indigo-700 py-4 rounded-xl items-center shadow-lg shadow-indigo-600/25 disabled:opacity-75"
              onPress={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <InlineLoader label="Signing in..." color="#ffffff" />
              ) : (
                <Text className="text-zinc-50 font-semibold text-base">Sign In</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center gap-1.5">
              <Text className="text-zinc-500 text-sm">{"Don't have an account?"}</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text className="text-indigo-400 font-semibold text-sm">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
