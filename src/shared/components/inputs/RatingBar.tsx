import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface RatingBarProps {
  readonly value: number;
  readonly max?: number; // 5 or 10
  readonly label?: string;
  readonly onChange?: (val: number) => void;
  readonly activeColor?: string;
  readonly disabled?: boolean;
}

export const RatingBar: React.FC<RatingBarProps> = React.memo(function RatingBar({
  value,
  max = 5,
  label,
  onChange,
  activeColor = '#ec4899',
  disabled = false,
}) {
  const steps = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <View
      className="gap-1.5"
      accessible={true}
      accessibilityRole="adjustable"
      accessibilityLabel={`${label || 'Rating'}: ${value} out of ${max}`}
    >
      {label ? (
        <View className="flex-row items-center justify-between">
          <Text className="text-zinc-400 text-xs font-medium">{label}</Text>
          <Text className="text-zinc-200 text-xs font-bold">
            {value} / {max}
          </Text>
        </View>
      ) : null}

      <View className="flex-row gap-1.5 items-center">
        {steps.map((num) => {
          const isActive = num <= value;
          const isSelected = num === value;

          if (onChange && !disabled) {
            return (
              <TouchableOpacity
                key={num}
                activeOpacity={0.7}
                onPress={() => onChange(num)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Set rating to ${num}`}
                hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
                className="flex-1 h-9 rounded-lg items-center justify-center border"
                style={{
                  backgroundColor: isActive ? `${activeColor}20` : '#18181b',
                  borderColor: isSelected ? activeColor : isActive ? `${activeColor}50` : '#27272a',
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: isActive ? activeColor : '#71717a' }}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <View
              key={num}
              className="flex-1 h-2 rounded-full overflow-hidden bg-zinc-800"
              style={{
                backgroundColor: isActive ? activeColor : '#27272a',
              }}
            />
          );
        })}
      </View>
    </View>
  );
});
