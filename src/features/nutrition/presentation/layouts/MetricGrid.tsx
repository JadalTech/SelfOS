import React from 'react';
import { View } from 'react-native';

export interface MetricGridProps {
  readonly children: React.ReactNode;
  readonly columns?: number;
}

export const MetricGrid: React.FC<MetricGridProps> = React.memo(function MetricGrid({
  children,
  columns = 2,
}) {
  const containerClass = columns === 3
    ? 'flex-row flex-wrap gap-3'
    : 'flex-row flex-wrap gap-3.5';

  return (
    <View className={containerClass}>
      {children}
    </View>
  );
});
