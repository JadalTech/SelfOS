/**
 * InlineLoader
 *
 * Compact loading indicator for use inside cards, sections, or lists.
 * Configurable size and optional label.
 */

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface InlineLoaderProps {
  /** Spinner size. Default: 'small' */
  size?: 'small' | 'large';
  /** Optional label displayed beside the spinner */
  label?: string;
  /** Spinner color. Default: primary indigo */
  color?: string;
}

export function InlineLoader({
  size = 'small',
  label,
  color = '#6366f1',
}: InlineLoaderProps): React.JSX.Element {
  return (
    <View className="flex-row items-center justify-center py-3 gap-2">
      <ActivityIndicator size={size} color={color} />
      {label ? (
        <Text className="text-muted-foreground text-sm">{label}</Text>
      ) : null}
    </View>
  );
}
