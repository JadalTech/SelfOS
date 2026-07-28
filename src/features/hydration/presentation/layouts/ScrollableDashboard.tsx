import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';

export interface ScrollableDashboardProps {
  readonly onRefresh?: () => void;
  readonly refreshing?: boolean;
  readonly children: React.ReactNode;
}

export const ScrollableDashboard: React.FC<ScrollableDashboardProps> = React.memo(function ScrollableDashboard({
  onRefresh,
  refreshing = false,
  children,
}) {
  return (
    <ScrollView
      className="flex-1 bg-black px-4"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
});
