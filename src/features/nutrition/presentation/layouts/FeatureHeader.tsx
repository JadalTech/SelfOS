import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export interface FeatureHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly showBackButton?: boolean;
  readonly actionIcon?: string;
  readonly onAction?: () => void;
  readonly actionLabel?: string;
}

export const FeatureHeader: React.FC<FeatureHeaderProps> = React.memo(function FeatureHeader({
  title,
  subtitle,
  showBackButton = true,
  actionIcon,
  onAction,
  actionLabel,
}) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between pb-3.5 border-b border-zinc-800/80 mb-2">
      <View className="flex-row items-center gap-3 flex-1">
        {showBackButton ? (
          <TouchableOpacity
            onPress={() => router.back()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-center"
          >
            <Text className="text-zinc-300 text-sm font-bold">←</Text>
          </TouchableOpacity>
        ) : null}

        <View className="flex-1 pr-1">
          <Text className="text-zinc-50 text-xl font-extrabold tracking-tight leading-tight">{title}</Text>
          {subtitle ? (
            <Text className="text-zinc-400 text-xs font-medium mt-0.5">{subtitle}</Text>
          ) : null}
        </View>
      </View>

      {onAction && (actionIcon || actionLabel) ? (
        <TouchableOpacity
          onPress={onAction}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={actionLabel || 'Action'}
          hitSlop={{ top: 10, bottom: 10, left: 12, right: 12 }}
          className="h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-center flex-row gap-1.5"
        >
          {actionIcon ? <Text className="text-sm">{actionIcon}</Text> : null}
          {actionLabel ? (
            <Text className="text-zinc-200 text-xs font-bold">{actionLabel}</Text>
          ) : null}
        </TouchableOpacity>
      ) : null}
    </View>
  );
});
