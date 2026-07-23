import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface EmptyGalleryProps {
  readonly onUploadPress?: () => void;
}

export const EmptyGallery: React.FC<EmptyGalleryProps> = React.memo(
  function EmptyGallery({ onUploadPress }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 items-center gap-3 my-2">
        <View className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 items-center justify-center">
          <Text className="text-2xl">📸</Text>
        </View>

        <Text className="text-zinc-100 text-base font-bold text-center">
          No Hair Progress Photos
        </Text>
        <Text className="text-zinc-400 text-xs text-center leading-relaxed max-w-xs">
          Document your hair growth timeline by uploading your first crown or hairline progress photo.
        </Text>

        {onUploadPress ? (
          <TouchableOpacity
            className="bg-amber-500 active:bg-amber-600 px-5 py-3 rounded-xl mt-1"
            onPress={onUploadPress}
            accessibilityRole="button"
          >
            <Text className="text-zinc-950 font-extrabold text-xs">+ Upload First Photo</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
);
