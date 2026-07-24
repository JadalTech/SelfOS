import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import type { SkincareProductVM } from '../types';

export interface ProductCardProps {
  readonly product: SkincareProductVM;
  readonly onToggleFavorite?: () => void;
  readonly onToggleActive?: () => void;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(function ProductCard({
  product,
  onToggleFavorite,
  onToggleActive,
  onEdit,
  onDelete,
}) {
  const handleDeleteConfirm = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${product.brand} ${product.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  let expiryBadgeStyle = 'bg-zinc-800 text-zinc-400';
  if (product.expiryStatus === 'expired') {
    expiryBadgeStyle = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
  } else if (product.expiryStatus === 'expiring-soon') {
    expiryBadgeStyle = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
  } else if (product.expiryStatus === 'good') {
    expiryBadgeStyle = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  }

  return (
    <View
      className={`bg-zinc-900 border ${
        product.isActive ? 'border-zinc-800' : 'border-zinc-800/40 opacity-60'
      } p-4 rounded-2xl gap-2.5 shadow-sm`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              {product.brand}
            </Text>
            <View className="bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
              <Text className="text-pink-400 text-[10px] font-semibold">{product.categoryLabel}</Text>
            </View>
          </View>
          <Text className="text-zinc-50 text-base font-bold mt-0.5">{product.name}</Text>
        </View>

        <View className="flex-row items-center gap-2">
          {onToggleFavorite ? (
            <TouchableOpacity onPress={onToggleFavorite} className="p-1">
              <Text className="text-base">{product.isFavorite ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          ) : null}

          {onToggleActive ? (
            <TouchableOpacity
              onPress={onToggleActive}
              className={`px-2 py-1 rounded-lg border ${
                product.isActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-800 border-zinc-700'
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  product.isActive ? 'text-emerald-400' : 'text-zinc-400'
                }`}
              >
                {product.isActive ? 'Active' : 'Inactive'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Key Active Ingredients */}
      <Text className="text-zinc-400 text-xs">
        <Text className="text-zinc-500 font-semibold">Actives: </Text>
        {product.ingredientsListFormatted}
      </Text>

      {/* Expiry Badge */}
      {product.expiryStatusLabel ? (
        <View className="self-start">
          <View className={`px-2 py-0.5 rounded-md ${expiryBadgeStyle}`}>
            <Text className="text-[10px] font-semibold">{product.expiryStatusLabel}</Text>
          </View>
        </View>
      ) : null}

      {/* Actions */}
      <View className="flex-row items-center justify-end gap-3 pt-2 border-t border-zinc-800/60 mt-1">
        {onEdit ? (
          <TouchableOpacity onPress={onEdit} className="py-1 px-2">
            <Text className="text-zinc-400 text-xs font-semibold">Edit</Text>
          </TouchableOpacity>
        ) : null}
        {onDelete ? (
          <TouchableOpacity onPress={handleDeleteConfirm} className="py-1 px-2">
            <Text className="text-rose-400 text-xs font-semibold">Delete</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});
