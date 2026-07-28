import React from 'react';
import { InsightsDashboardProvider } from '../../../features/insights/presentation/contexts/InsightsDashboardContext';
import { InsightsDashboardScreen } from '../../../features/insights/presentation/screens/InsightsScreens';

export default function InsightsDashboardRoute() {
  return (
    <InsightsDashboardProvider>
      <InsightsDashboardScreen />
    </InsightsDashboardProvider>
  );
}
