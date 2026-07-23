import React from 'react';
import { View, Text } from 'react-native';
import type { TimelineMonthGroup, HairPhotoVM } from '../types';
import { PhotoGrid } from './PhotoGrid';

interface TimelineCardProps {
  readonly group: TimelineMonthGroup;
  readonly onPhotoPress?: (photo: HairPhotoVM) => void;
  readonly onPhotoDelete?: (photo: HairPhotoVM) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = React.memo(function TimelineCard({
  group,
  onPhotoPress,
  onPhotoDelete,
}) {
  return (
    <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md">
      <View className="flex-row items-center justify-between border-b border-zinc-800/60 pb-2">
        <Text className="text-amber-400 text-sm font-extrabold">{group.monthYearLabel}</Text>
        <Text className="text-zinc-500 text-xs">{group.photos.length} photos</Text>
      </View>

      <PhotoGrid photos={group.photos} onPhotoPress={onPhotoPress} onPhotoDelete={onPhotoDelete} />
    </View>
  );
});
