import React from 'react';
import { InsightsDashboardProvider } from '../../../features/insights/presentation/contexts/InsightsDashboardContext';
import { PredictionsScreen } from '../../../features/insights/presentation/screens/InsightsScreens';

export default function InsightsPredictionsRoute() {
  return (
    <InsightsDashboardProvider>
      <PredictionsScreen />
    </InsightsDashboardProvider>
  );
}
