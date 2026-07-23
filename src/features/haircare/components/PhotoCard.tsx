import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import type { HairPhotoVM } from '../types';

interface PhotoCardProps {
  readonly photo: HairPhotoVM;
  readonly onPress?: (photo: HairPhotoVM) => void;
  readonly onDelete?: (photo: HairPhotoVM) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = React.memo(function PhotoCard({
  photo,
  onPress,
  onDelete,
}) {
  return (
    <TouchableOpacity
      className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm active:border-amber-500/60"
      onPress={() => onPress?.(photo)}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`Hair photo captured on ${photo.formattedDate}`}
    >
      <View className="relative w-full aspect-square bg-zinc-900">
        <Image
          source={{ uri: photo.photoUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Angle Badge */}
        <View className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
          <Text className="text-amber-400 text-[9px] font-bold">{photo.angleLabel}</Text>
        </View>

        {/* Delete Button */}
        {onDelete ? (
          <TouchableOpacity
            className="absolute top-2 right-2 bg-rose-950/80 p-1.5 rounded-full border border-rose-500/40"
            onPress={() => onDelete(photo)}
            accessibilityRole="button"
            accessibilityLabel="Delete photo"
          >
            <Text className="text-rose-400 text-xs font-bold">✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View className="p-2.5 gap-0.5">
        <Text className="text-zinc-100 text-xs font-bold">{photo.formattedDate}</Text>
        {photo.notes ? (
          <Text className="text-zinc-400 text-[10px]" numberOfLines={1}>
            {photo.notes}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
});
