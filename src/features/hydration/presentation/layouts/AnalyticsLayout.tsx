import React from 'react';
import { View, ScrollView } from 'react-native';

export interface AnalyticsLayoutProps {
  readonly header?: React.ReactNode;
  readonly children: React.ReactNode;
}

export const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = React.memo(function AnalyticsLayout({
  header,
  children,
}) {
  return (
    <ScrollView
      className="flex-1 bg-black px-4"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {header ? <View className="my-4">{header}</View> : null}
      <View className="gap-5">{children}</View>
    </ScrollView>
  );
});
