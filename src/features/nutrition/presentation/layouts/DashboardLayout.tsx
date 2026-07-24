import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface DashboardLayoutProps {
  readonly children: React.ReactNode;
  readonly onRefresh?: () => void;
  readonly isRefreshing?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = React.memo(function DashboardLayout({
  children,
  onRefresh,
  isRefreshing = false,
}) {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={['top', 'left', 'right']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#ec4899"
              colors={['#ec4899']}
            />
          ) : undefined
        }
      >
        <View className="px-4.5 gap-5 pt-3">
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});
