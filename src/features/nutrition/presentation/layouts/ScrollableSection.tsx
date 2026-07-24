import React from 'react';
import { ScrollView } from 'react-native';

export interface ScrollableSectionProps {
  readonly children: React.ReactNode;
}

export const ScrollableSection: React.FC<ScrollableSectionProps> = React.memo(function ScrollableSection({
  children,
}) {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12, paddingVertical: 2 }}
    >
      {children}
    </ScrollView>
  );
});
