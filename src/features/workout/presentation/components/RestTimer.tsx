import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface RestTimerProps {
  readonly seconds: number;
  readonly initialSeconds: number;
  readonly isActive: boolean;
  readonly onPlayPause: () => void;
  readonly onAddSeconds: (secs: number) => void;
  readonly onClose: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = React.memo(function RestTimer({
  seconds,
  initialSeconds,
  isActive,
  onPlayPause,
  onAddSeconds,
  onClose,
}) {
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPct = initialSeconds > 0 ? (seconds / initialSeconds) * 100 : 0;

  return (
    <View
      className="bg-zinc-900 border border-violet-500/30 p-4 rounded-2xl shadow-xl gap-3 max-w-[340px] w-full self-center border-t-4 border-t-violet-500"
      accessible={true}
      accessibilityLabel={`Rest timer: ${formatTime(seconds)} remaining. Timer is ${
        isActive ? 'active' : 'paused'
      }.`}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-base">⏳</Text>
          <Text className="text-zinc-50 text-sm font-bold">Rest Timer</Text>
        </View>

        <TouchableOpacity
          onPress={onClose}
          className="w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Dismiss timer"
        >
          <Text className="text-zinc-400 text-xs font-bold">×</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Value & Progress */}
      <View className="items-center py-2 gap-2">
        <Text className="text-zinc-50 text-3xl font-black tracking-widest tabular-nums">
          {formatTime(seconds)}
        </Text>

        {/* Progress Bar */}
        <View className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
          <View
            style={{ width: `${progressPct}%` }}
            className="h-full bg-violet-500"
          />
        </View>
      </View>

      {/* Controls Row */}
      <View className="flex-row items-center justify-between gap-2">
        <TouchableOpacity
          onPress={() => onAddSeconds(-15)}
          disabled={seconds <= 15}
          className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl flex-1 items-center"
          accessibilityRole="button"
          accessibilityLabel="Subtract 15 seconds"
        >
          <Text className="text-zinc-400 text-xs font-bold">-15s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPlayPause}
          className={`px-5 py-2 rounded-xl flex-1 items-center ${
            isActive
              ? 'bg-zinc-950 border border-zinc-800'
              : 'bg-violet-600 shadow-sm shadow-violet-600/10'
          }`}
          accessibilityRole="button"
          accessibilityLabel={isActive ? 'Pause timer' : 'Start timer'}
        >
          <Text className={`${isActive ? 'text-zinc-300' : 'text-zinc-50'} text-xs font-extrabold`}>
            {isActive ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onAddSeconds(15)}
          className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl flex-1 items-center"
          accessibilityRole="button"
          accessibilityLabel="Add 15 seconds"
        >
          <Text className="text-zinc-400 text-xs font-bold">+15s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
