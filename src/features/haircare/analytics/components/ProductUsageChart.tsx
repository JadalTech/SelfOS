import React from 'react';
import { View, Text } from 'react-native';
import type { ProductUsageVM } from '../types/analytics.types';

interface ProductUsageChartProps {
  readonly productUsage: ProductUsageVM[];
}

export const ProductUsageChart: React.FC<ProductUsageChartProps> = React.memo(
  function ProductUsageChart({ productUsage }) {
    if (productUsage.length === 0) {
      return (
        <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2 shadow-md">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Product Usage Distribution
          </Text>
          <Text className="text-zinc-500 text-xs py-2 text-center">
            No products logged in wash day executions yet.
          </Text>
        </View>
      );
    }

    const topProducts = productUsage.slice(0, 5);

    return (
      <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Product Usage Ranking
          </Text>
          <Text className="text-zinc-500 text-xs">{topProducts.length} items ranked</Text>
        </View>

        <View className="gap-2.5 pt-1">
          {topProducts.map((item, idx) => (
            <View key={item.productId} className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-zinc-100 text-xs font-bold" numberOfLines={1}>
                  #{idx + 1} {item.productName} <Text className="text-zinc-500 font-normal">({item.brand})</Text>
                </Text>
                <Text className="text-amber-400 text-xs font-black">{item.usageCount} uses ({item.percentage}%)</Text>
              </View>
              <View className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                <View
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.max(5, item.percentage)}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
);
