import { useMemo } from 'react';
import { useHairConditions } from './useHairConditions';
import { mapToHairConditionVM } from '../mappers/condition.mapper';
import type { HairConditionVM } from '../types';

export function useLatestHairCondition() {
  const { conditions, isLoading, isError, error, refetch } = useHairConditions();

  const latestConditionVM: HairConditionVM | null = useMemo(() => {
    if (conditions.length === 0) return null;
    const sorted = [...conditions].sort((a, b) => b.recordDate.localeCompare(a.recordDate));
    return mapToHairConditionVM(sorted[0]);
  }, [conditions]);

  return {
    latestCondition: latestConditionVM,
    totalCount: conditions.length,
    isLoading,
    isError,
    error,
    refetch,
  };
}
