import React from 'react';
import { InsightsDashboardProvider } from '../../../features/insights/presentation/contexts/InsightsDashboardContext';
import { HealthScoreScreen } from '../../../features/insights/presentation/screens/InsightsScreens';

export default function InsightsHealthScoreRoute() {
  return (
    <InsightsDashboardProvider>
      <HealthScoreScreen />
    </InsightsDashboardProvider>
  );
}
