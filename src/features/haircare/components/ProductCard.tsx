import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { HairProductVM } from '../types';

interface ProductCardProps {
  readonly product: HairProductVM;
  readonly onToggleFavorite?: (productId: string) => void;
  readonly onDelete?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  function ProductCard({ product, onToggleFavorite, onDelete }) {
    return (
      <View className="bg-zinc-950/70 border border-zinc-800/80 p-3.5 rounded-2xl gap-2 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              {product.brand}
            </Text>
            <Text className="text-zinc-100 text-sm font-bold" numberOfLines={1}>
              {product.name}
            </Text>
          </View>

          {onToggleFavorite ? (
            <TouchableOpacity
              className="p-1"
              onPress={() => onToggleFavorite(product.id)}
              accessibilityRole="button"
              accessibilityLabel={`Toggle favorite for ${product.name}`}
            >
              <Text className="text-base">{product.isFavorite ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View className="flex-row items-center justify-between pt-1">
          <View className="bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <Text className="text-amber-400 text-[9px] font-bold">
              {product.categoryLabel}
            </Text>
          </View>

          {onDelete ? (
            <TouchableOpacity
              onPress={() => onDelete(product.id)}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${product.name}`}
            >
              <Text className="text-rose-500 text-xs font-semibold">Delete</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {product.notes ? (
          <Text className="text-zinc-400 text-[11px] italic" numberOfLines={2}>
            &quot;{product.notes}&quot;
          </Text>
        ) : null}
      </View>
    );
  }
);
