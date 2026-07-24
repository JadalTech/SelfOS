import React from 'react';
import { View, Text } from 'react-native';

export interface SectionCardProps {
  readonly title?: string;
  readonly children: React.ReactNode;
  readonly description?: string;
}

export const SectionCard: React.FC<SectionCardProps> = React.memo(function SectionCard({
  title,
  children,
  description,
}) {
  return (
    <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm gap-2">
      {title ? (
        <View className="mb-1">
          <Text className="text-zinc-50 text-sm font-bold tracking-tight">{title}</Text>
          {description ? (
            <Text className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{description}</Text>
          ) : null}
        </View>
      ) : null}
      <View className="w-full">{children}</View>
    </View>
  );
});
