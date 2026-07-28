/**
 * Presentation ViewModels for Intelligence Feature
 * SelfOS v3.3.0 — Batch 14D
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../../shared/stores/auth.store';
import { ExecutiveDashboardService } from '../services/ExecutiveDashboardService';
import type { ExecutiveSummary } from '../../domain/intelligence.types';

export function useExecutiveDashboardViewModel() {
  const userId = useAuthStore((s) => s.user?.uid);
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);

  useEffect(() => {
    if (!userId) return;
    ExecutiveDashboardService.getExecutiveDashboard(userId).then(setSummary);
  }, [userId]);

  return { summary };
}
