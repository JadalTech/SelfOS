import { useMemo } from 'react';
import { useRoutines } from '@/features/routine';
import { useHairProducts } from '../../hooks/useHairProducts';
import { useHairRoutines } from '../../hooks/useHairRoutines';
import { useHairLogs } from '../../hooks/useHairLogs';
import { useHairPhotos } from '../../hooks/useHairPhotos';
import { useHairConditions } from '../../hooks/useHairConditions';
import { buildHairAnalyticsVM } from '../utils/hairAnalytics';
import type { HairAnalyticsVM } from '../types/analytics.types';

export function useHairAnalytics() {
  const coreRoutinesState = useRoutines({ type: 'haircare' });
  const coreRoutines = useMemo(() => coreRoutinesState.data ?? [], [coreRoutinesState.data]);

  const { products, isLoading: isLoadingProducts } = useHairProducts();
  const { hairRoutines, isLoading: isLoadingRoutines } = useHairRoutines();
  const { logs, isLoading: isLoadingLogs, isRefetching, refetch } = useHairLogs();
  const { photos, isLoading: isLoadingPhotos } = useHairPhotos();
  const { conditions, isLoading: isLoadingConditions } = useHairConditions();

  const isLoading =
    coreRoutinesState.isLoading ||
    isLoadingProducts ||
    isLoadingRoutines ||
    isLoadingLogs ||
    isLoadingPhotos ||
    isLoadingConditions;

  const isError =
    coreRoutinesState.isError ||
    Boolean(coreRoutinesState.error);

  const viewModel: HairAnalyticsVM = useMemo(() => {
    return buildHairAnalyticsVM(
      products,
      hairRoutines,
      coreRoutines,
      logs,
      photos,
      conditions
    );
  }, [products, hairRoutines, coreRoutines, logs, photos, conditions]);

  return {
    viewModel,
    isLoading,
    isRefetching,
    isError,
    error: coreRoutinesState.error,
    refetch,
  };
}
