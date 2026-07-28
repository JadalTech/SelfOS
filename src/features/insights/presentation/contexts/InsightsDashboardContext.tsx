/**
 * Synchronized Contexts for Insights Engine Dashboard
 * SelfOS v1.5.0 — Batch 12B
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { insightsService } from '../../services/InsightsService';
import type { PipelineOutput } from '../../pipeline/InsightPipeline';
import type { InsightCategory, InsightPriority, SourceModule } from '../../types/insights.types';

// =========================================================================
// Filter State Type
// =========================================================================

export interface InsightsFilterState {
  readonly module: SourceModule | 'all';
  readonly category: InsightCategory | 'all';
  readonly priority: InsightPriority | 'all';
  readonly searchQuery: string;
  readonly sortBy: 'newest' | 'oldest' | 'highest-confidence' | 'highest-impact';
}

const DEFAULT_FILTERS: InsightsFilterState = {
  module: 'all',
  category: 'all',
  priority: 'all',
  searchQuery: '',
  sortBy: 'newest',
};

// =========================================================================
// Context Interfaces
// =========================================================================

export interface InsightsDashboardContextType {
  readonly data: PipelineOutput | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly refreshTimestamp: number;
  readonly refresh: (force?: boolean) => Promise<void>;
  readonly filters: InsightsFilterState;
  readonly setFilters: React.Dispatch<React.SetStateAction<InsightsFilterState>>;
  readonly resetFilters: () => void;
}

const InsightsDashboardContext = createContext<InsightsDashboardContextType | null>(null);

export const InsightsDashboardProvider: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const userId = useAuthStore((s) => s.user?.uid);
  const [data, setData] = useState<PipelineOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());
  const [filters, setFilters] = useState<InsightsFilterState>(DEFAULT_FILTERS);

  const refresh = async (force = false) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await insightsService.calculatePipeline(userId, force);
      if (res.success) {
        setData(res.data);
        setRefreshTimestamp(Date.now());
      } else {
        setError(res.error.message || 'Failed to fetch insights pipeline.');
      }
    } catch (err: any) {
      setError(err.message || 'Unknown network error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      refresh();
    }
  }, [userId]);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <InsightsDashboardContext.Provider
      value={{
        data,
        loading,
        error,
        refreshTimestamp,
        refresh,
        filters,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </InsightsDashboardContext.Provider>
  );
};

export const useInsightsDashboardContext = () => {
  const ctx = useContext(InsightsDashboardContext);
  if (!ctx) {
    throw new Error('useInsightsDashboardContext must be used within an InsightsDashboardProvider');
  }
  return ctx;
};
