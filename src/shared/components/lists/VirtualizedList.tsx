import React from 'react';
import { FlatList, FlatListProps, View } from 'react-native';
import { NoDataCard } from '../feedback/NoDataCard';
import { LoadingState } from '../feedback/LoadingState';

export interface VirtualizedListProps<T> extends Omit<FlatListProps<T>, 'data'> {
  readonly data: T[];
  readonly isLoading?: boolean;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly emptyIcon?: string;
  readonly emptyActionLabel?: string;
  readonly onEmptyAction?: () => void;
  readonly emptyColor?: string;
}

export function VirtualizedList<T>({
  data,
  isLoading = false,
  emptyTitle = 'No Items Found',
  emptyDescription = 'There are no items to show in this view.',
  emptyIcon = '📂',
  emptyActionLabel,
  onEmptyAction,
  emptyColor,
  renderItem,
  keyExtractor,
  ...props
}: VirtualizedListProps<T>) {
  if (isLoading) {
    return <LoadingState message="Loading list..." inline={true} />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={8}
      windowSize={5}
      ListEmptyComponent={
        <View className="py-4">
          <NoDataCard
            title={emptyTitle}
            description={emptyDescription}
            icon={emptyIcon}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
            color={emptyColor}
          />
        </View>
      }
      {...props}
    />
  );
}
