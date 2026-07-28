import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';

export interface AnimatedCounterProps {
  readonly value: number;
  readonly suffix?: string;
  readonly styleString?: string;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export const AnimatedCounter: React.FC<AnimatedCounterProps> = React.memo(function AnimatedCounter({
  value,
  suffix = '',
  styleString = 'text-zinc-100 font-extrabold text-3xl font-sans tracking-tight',
}) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 1000 });
  }, [value]);

  const formattedText = useDerivedValue(() => {
    return `${Math.round(animatedValue.value)}${suffix}`;
  });

  return (
    <AnimatedText
      className={styleString}
      // Reanimated v3/v4 text display compatibility
      style={{}}
    >
      {value}
      {suffix}
    </AnimatedText>
  );
});
