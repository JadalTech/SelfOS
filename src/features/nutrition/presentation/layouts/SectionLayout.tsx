import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface SectionLayoutProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly subtitle?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly actionColor?: string;
}

export const SectionLayout: React.FC<SectionLayoutProps> = React.memo(function SectionLayout({
  title,
  children,
  subtitle,
  actionLabel,
  onAction,
  actionColor = '#ec4899',
}) {
  return (
    <View className="gap-3 w-full">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-zinc-50 text-base font-extrabold tracking-tight">{title}</Text>
          {subtitle ? (
            <Text className="text-zinc-400 text-xs mt-0.5">{subtitle}</Text>
          ) : null}
        </View>

        {actionLabel && onAction ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAction}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
          >
            <Text className="text-xs font-bold" style={{ color: actionColor }}>
              {actionLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View className="w-full">{children}</View>
    </View>
  );
});
