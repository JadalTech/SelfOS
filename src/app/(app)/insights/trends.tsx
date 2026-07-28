import React from 'react';
import { InsightsDashboardProvider } from '../../../features/insights/presentation/contexts/InsightsDashboardContext';
import { TrendsScreen } from '../../../features/insights/presentation/screens/InsightsScreens';

export default function InsightsTrendsRoute() {
  return (
    <InsightsDashboardProvider>
      <TrendsScreen />
    </InsightsDashboardProvider>
  );
}
