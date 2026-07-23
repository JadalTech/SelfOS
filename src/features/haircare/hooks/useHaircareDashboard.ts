import { useMemo, useCallback } from 'react';
import { useRoutines } from '@/features/routine';
import { useHairProducts } from './useHairProducts';
import { useHairRoutines } from './useHairRoutines';
import { useHairLogs } from './useHairLogs';
import { buildHaircareDashboardVM } from '../mappers/dashboard.mapper';
import type { HaircareDashboardVM } from '../types';

export function useHaircareDashboard() {
  const productsState = useHairProducts();
  const hairRoutinesState = useHairRoutines();
  const hairLogsState = useHairLogs();
  const coreRoutinesState = useRoutines({ type: 'haircare' });

  const products = productsState.products;
  const hairRoutines = hairRoutinesState.hairRoutines;
  const hairLogs = hairLogsState.logs;
  const coreRoutines = useMemo(() => coreRoutinesState.data ?? [], [coreRoutinesState.data]);

  const isLoading =
    productsState.isLoading ||
    hairRoutinesState.isLoading ||
    hairLogsState.isLoading ||
    coreRoutinesState.isLoading;

  const isRefetching =
    productsState.isRefetching ||
    hairRoutinesState.isRefetching ||
    hairLogsState.isRefetching ||
    coreRoutinesState.isRefetching;

  const isError =
    productsState.isError ||
    hairRoutinesState.isError ||
    hairLogsState.isError ||
    coreRoutinesState.isError;

  const error =
    productsState.error ||
    hairRoutinesState.error ||
    hairLogsState.error ||
    coreRoutinesState.error;

  const viewModel: HaircareDashboardVM | null = useMemo(() => {
    if (isLoading) return null;
    return buildHaircareDashboardVM(products, hairRoutines, coreRoutines, hairLogs);
  }, [products, hairRoutines, coreRoutines, hairLogs, isLoading]);

  const refetch = useCallback(async () => {
    await Promise.all([
      productsState.refetch(),
      hairRoutinesState.refetch(),
      hairLogsState.refetch(),
      coreRoutinesState.refetch(),
    ]);
  }, [productsState, hairRoutinesState, hairLogsState, coreRoutinesState]);

  return {
    viewModel,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    logExecution: hairLogsState.logExecution,
    isActionPending: hairLogsState.isMutating,
  };
}
