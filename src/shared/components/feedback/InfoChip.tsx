import React from 'react';
import { View, Text } from 'react-native';

export interface InfoChipProps {
  readonly label: string;
  readonly type?: 'default' | 'success' | 'warning' | 'error' | 'accent';
  readonly icon?: string;
}

export const InfoChip: React.FC<InfoChipProps> = React.memo(function InfoChip({
  label,
  type = 'default',
  icon,
}) {
  const typeStyles = {
    default: { bg: 'bg-zinc-800 border-zinc-700/60', text: 'text-zinc-300' },
    success: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400' },
    warning: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400' },
    error: { bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-400' },
    accent: { bg: 'bg-pink-500/15 border-pink-500/30', text: 'text-pink-400' },
  };

  const style = typeStyles[type];

  return (
    <View
      className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full border ${style.bg}`}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      {icon ? (
        <Text className="text-xs" style={{ color: style.text.replace('text-', '') }}>{icon}</Text>
      ) : null}
      <Text className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}>
        {label}
      </Text>
    </View>
  );
});
