import React from 'react';
import { View, Text, Image } from 'react-native';

export interface PhotoComparisonViewProps {
  readonly baselinePhotoUrl?: string;
  readonly baselineDateFormatted?: string;
  readonly currentPhotoUrl?: string;
  readonly currentDateFormatted?: string;
  readonly angleLabel?: string;
}

export const PhotoComparisonView: React.FC<PhotoComparisonViewProps> = React.memo(function PhotoComparisonView({
  baselinePhotoUrl,
  baselineDateFormatted = 'Baseline',
  currentPhotoUrl,
  currentDateFormatted = 'Current',
  angleLabel,
}) {
  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl gap-3"
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={`Progress photo comparison before (${baselineDateFormatted}) versus after (${currentDateFormatted})`}
    >
      {angleLabel ? (
        <View className="self-start bg-zinc-800 px-2.5 py-1 rounded-lg">
          <Text className="text-zinc-300 text-xs font-semibold">{angleLabel}</Text>
        </View>
      ) : null}

      <View className="flex-row gap-3">
        {/* Baseline Photo */}
        <View className="flex-1 bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800/80">
          <View className="h-48 relative">
            {baselinePhotoUrl ? (
              <Image source={{ uri: baselinePhotoUrl }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="w-full h-full items-center justify-center p-2">
                <Text className="text-zinc-600 text-xs text-center">No baseline photo</Text>
              </View>
            )}
            <View className="absolute bottom-2 left-2 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800">
              <Text className="text-zinc-300 text-[10px] font-bold">BEFORE</Text>
            </View>
          </View>
          <View className="p-2 bg-zinc-900 border-t border-zinc-800">
            <Text className="text-zinc-400 text-xs font-medium text-center">{baselineDateFormatted}</Text>
          </View>
        </View>

        {/* Current Photo */}
        <View className="flex-1 bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800/80">
          <View className="h-48 relative">
            {currentPhotoUrl ? (
              <Image source={{ uri: currentPhotoUrl }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="w-full h-full items-center justify-center p-2">
                <Text className="text-zinc-600 text-xs text-center">No current photo</Text>
              </View>
            )}
            <View className="absolute bottom-2 left-2 bg-pink-500/20 px-2 py-0.5 rounded border border-pink-500/40">
              <Text className="text-pink-400 text-[10px] font-bold">AFTER</Text>
            </View>
          </View>
          <View className="p-2 bg-zinc-900 border-t border-zinc-800">
            <Text className="text-zinc-400 text-xs font-medium text-center">{currentDateFormatted}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});
