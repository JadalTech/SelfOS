import React from 'react';
import { View, Text } from 'react-native';
import type { WeeklyProgressVM } from '../types';

interface WeeklyProgressCardProps {
  readonly weekly: WeeklyProgressVM;
}

export const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = React.memo(
  function WeeklyProgressCard({ weekly }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            7-Day Activity Matrix
          </Text>
          <Text className="text-emerald-400 text-xs font-bold">
            {weekly.activeWeeklyDaysCount} / 7 days active
          </Text>
        </View>

        <View className="flex-row justify-between gap-1.5 pt-1">
          {weekly.days.map((day) => {
            let circleBg = 'bg-zinc-800 border-zinc-700';
            let circleText = 'text-zinc-500';

            if (day.isCompleted) {
              circleBg = 'bg-emerald-500 border-emerald-400';
              circleText = 'text-zinc-950 font-bold';
            } else if (day.isScheduled) {
              circleBg = 'bg-zinc-800 border-amber-500/60';
              circleText = 'text-amber-400';
            }

            return (
              <View key={day.dateStr} className="items-center gap-1.5 flex-1">
                <View
                  className={`w-9 h-9 rounded-xl items-center justify-center border ${circleBg} ${
                    day.isToday ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  <Text className={`text-xs ${circleText}`}>
                    {day.isCompleted ? '✓' : day.isScheduled ? '•' : ''}
                  </Text>
                </View>
                <Text
                  className={`text-[10px] ${
                    day.isToday ? 'text-emerald-400 font-bold' : 'text-zinc-400'
                  }`}
                >
                  {day.dayName}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
);
