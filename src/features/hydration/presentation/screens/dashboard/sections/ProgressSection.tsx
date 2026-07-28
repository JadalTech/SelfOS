import React from 'react';
import { View } from 'react-native';
import { CompletionRing } from '../../../components/CompletionRing';

export interface ProgressSectionProps {
  readonly consumedML: number;
  readonly goalML: number;
  readonly percentage: number;
  readonly score: number;
  readonly statusColor?: string;
}

export const ProgressSection: React.FC<ProgressSectionProps> = React.memo(function ProgressSection({
  consumedML,
  goalML,
  percentage,
  score,
  statusColor,
}) {
  return (
    <View className="my-2">
      <CompletionRing
        consumedML={consumedML}
        goalML={goalML}
        percentage={percentage}
        score={score}
        statusColor={statusColor}
      />
    </View>
  );
});
