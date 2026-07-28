import React from 'react';
import { InsightsDashboardProvider } from '../../../features/insights/presentation/contexts/InsightsDashboardContext';
import { ReportsScreen } from '../../../features/insights/presentation/screens/InsightsScreens';

export default function InsightsReportsRoute() {
  return (
    <InsightsDashboardProvider>
      <ReportsScreen />
    </InsightsDashboardProvider>
  );
}
