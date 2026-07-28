import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface QuickAddSectionProps {
  readonly onQuickAdd: (amount: number) => void;
  readonly onCustomAdd?: () => void;
}

export const QuickAddSection: React.FC<QuickAddSectionProps> = React.memo(function QuickAddSection({
  onQuickAdd,
  onCustomAdd,
}) {
  const sizes = [150, 250, 500, 750];

  return (
    <View className="my-2 bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Quick Add Intake</Text>
      <View className="flex-row flex-wrap gap-2.5 justify-between">
        {sizes.map((amount) => (
          <TouchableOpacity
            key={amount}
            activeOpacity={0.8}
            onPress={() => onQuickAdd(amount)}
            className="flex-1 min-w-[70px] bg-zinc-900 border border-zinc-800 py-3 rounded-2xl items-center"
            accessibilityRole="button"
            accessibilityLabel={`Add ${amount} milliliters`}
          >
            <Text className="text-zinc-100 font-bold text-xs">+{amount}</Text>
            <Text className="text-zinc-500 text-[9px] mt-0.5">mL</Text>
          </TouchableOpacity>
        ))}
        {onCustomAdd ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onCustomAdd}
            className="flex-1 min-w-[70px] bg-blue-950/20 border border-blue-900/40 py-3 rounded-2xl items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Add custom amount"
          >
            <Text className="text-blue-400 font-bold text-xs">Custom</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});
