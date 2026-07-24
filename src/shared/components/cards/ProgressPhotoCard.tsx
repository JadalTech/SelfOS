import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export interface ProgressPhotoCardProps {
  readonly photoUrl: string;
  readonly dateFormatted: string;
  readonly angleLabel?: string;
  readonly timeOfDayLabel?: string;
  readonly onPress?: () => void;
  readonly onDelete?: () => void;
}

export const ProgressPhotoCard: React.FC<ProgressPhotoCardProps> = React.memo(function ProgressPhotoCard({
  photoUrl,
  dateFormatted,
  angleLabel,
  timeOfDayLabel,
  onPress,
  onDelete,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Progress photo taken on ${dateFormatted}${angleLabel ? `, ${angleLabel}` : ''}`}
      accessibilityHint="Tap to view full screen comparison"
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm"
    >
      <View className="relative w-full h-44 bg-zinc-950">
        <Image
          source={{ uri: photoUrl }}
          className="w-full h-full"
          resizeMode="cover"
          accessible={true}
          accessibilityLabel={`Skin photo from ${dateFormatted}`}
        />
        {angleLabel ? (
          <View className="absolute top-2 left-2 bg-zinc-950/80 px-2 py-0.5 rounded-md border border-zinc-800">
            <Text className="text-zinc-200 text-[10px] font-semibold">{angleLabel}</Text>
          </View>
        ) : null}
        {onDelete ? (
          <TouchableOpacity
            onPress={onDelete}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Delete progress photo"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="absolute top-2 right-2 bg-rose-500/20 border border-rose-500/40 w-7 h-7 rounded-full items-center justify-center"
          >
            <Text className="text-rose-400 text-xs font-bold">✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View className="p-2.5 flex-row items-center justify-between bg-zinc-900">
        <Text className="text-zinc-300 text-xs font-medium">{dateFormatted}</Text>
        {timeOfDayLabel ? (
          <Text className="text-zinc-500 text-[10px] font-medium">{timeOfDayLabel}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
});
