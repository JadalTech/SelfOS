import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export interface FilterOption {
  readonly value: string;
  readonly label: string;
}

export interface FilterBarProps {
  readonly options: FilterOption[];
  readonly selectedValue: string;
  readonly onSelect: (value: string) => void;
  readonly activeColor?: string;
}

export const FilterBar: React.FC<FilterBarProps> = React.memo(function FilterBar({
  options,
  selectedValue,
  onSelect,
  activeColor = '#ec4899',
}) {
  return (
    <View className="w-full">
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4, gap: 8, paddingVertical: 6 }}
      >
        {options.map((option) => {
          const isSelected = option.value === selectedValue;
          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.8}
              onPress={() => onSelect(option.value)}
              accessible={true}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Filter: ${option.label}`}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              className="px-3.5 py-2 rounded-xl border items-center justify-center"
              style={{
                backgroundColor: isSelected ? `${activeColor}20` : '#18181b',
                borderColor: isSelected ? activeColor : '#27272a',
              }}
            >
              <Text
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: isSelected ? activeColor : '#a1a1aa' }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});
