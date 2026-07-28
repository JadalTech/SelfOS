import React from 'react';
import { InsightsDashboardProvider } from '../../../features/insights/presentation/contexts/InsightsDashboardContext';
import { SettingsScreen } from '../../../features/insights/presentation/screens/InsightsScreens';

export default function InsightsSettingsRoute() {
  return (
    <InsightsDashboardProvider>
      <SettingsScreen />
    </InsightsDashboardProvider>
  );
}
