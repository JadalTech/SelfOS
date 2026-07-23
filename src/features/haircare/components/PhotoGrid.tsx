import React from 'react';
import { View } from 'react-native';
import type { HairPhotoVM } from '../types';
import { PhotoCard } from './PhotoCard';

interface PhotoGridProps {
  readonly photos: HairPhotoVM[];
  readonly onPhotoPress?: (photo: HairPhotoVM) => void;
  readonly onPhotoDelete?: (photo: HairPhotoVM) => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = React.memo(function PhotoGrid({
  photos,
  onPhotoPress,
  onPhotoDelete,
}) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {photos.map((photo) => (
        <View key={photo.id} className="w-[48%]">
          <PhotoCard photo={photo} onPress={onPhotoPress} onDelete={onPhotoDelete} />
        </View>
      ))}
    </View>
  );
});
