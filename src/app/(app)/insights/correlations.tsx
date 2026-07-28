import React from 'react';
import { InsightsDashboardProvider } from '../../../features/insights/presentation/contexts/InsightsDashboardContext';
import { CorrelationsScreen } from '../../../features/insights/presentation/screens/InsightsScreens';

export default function InsightsCorrelationsRoute() {
  return (
    <InsightsDashboardProvider>
      <CorrelationsScreen />
    </InsightsDashboardProvider>
  );
}
