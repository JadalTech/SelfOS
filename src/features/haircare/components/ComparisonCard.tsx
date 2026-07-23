import React from 'react';
import { View, Text, Image } from 'react-native';
import type { HairPhotoVM } from '../types';

interface ComparisonCardProps {
  readonly beforePhoto: HairPhotoVM;
  readonly afterPhoto: HairPhotoVM;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = React.memo(function ComparisonCard({
  beforePhoto,
  afterPhoto,
}) {
  return (
    <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-3 shadow-md">
      <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider text-center">
        Side-by-Side Growth Comparison
      </Text>

      <View className="flex-row gap-3">
        {/* BEFORE PHOTO */}
        <View className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          <View className="bg-amber-500/20 py-1 items-center">
            <Text className="text-amber-400 text-[10px] font-extrabold uppercase">
              BEFORE ({beforePhoto.formattedDate})
            </Text>
          </View>
          <View className="w-full aspect-square bg-zinc-900">
            <Image
              source={{ uri: beforePhoto.photoUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="p-2">
            <Text className="text-zinc-300 text-[11px] font-semibold">{beforePhoto.angleLabel}</Text>
            {beforePhoto.notes ? (
              <Text className="text-zinc-500 text-[10px]" numberOfLines={2}>
                {beforePhoto.notes}
              </Text>
            ) : null}
          </View>
        </View>

        {/* AFTER PHOTO */}
        <View className="flex-1 bg-zinc-950 border border-emerald-500/40 rounded-xl overflow-hidden">
          <View className="bg-emerald-500/20 py-1 items-center">
            <Text className="text-emerald-400 text-[10px] font-extrabold uppercase">
              AFTER ({afterPhoto.formattedDate})
            </Text>
          </View>
          <View className="w-full aspect-square bg-zinc-900">
            <Image
              source={{ uri: afterPhoto.photoUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="p-2">
            <Text className="text-zinc-300 text-[11px] font-semibold">{afterPhoto.angleLabel}</Text>
            {afterPhoto.notes ? (
              <Text className="text-zinc-500 text-[10px]" numberOfLines={2}>
                {afterPhoto.notes}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
});
