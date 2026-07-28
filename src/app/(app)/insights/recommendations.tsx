import React from 'react';
import { InsightsDashboardProvider } from '../../../features/insights/presentation/contexts/InsightsDashboardContext';
import { RecommendationsScreen } from '../../../features/insights/presentation/screens/InsightsScreens';

export default function InsightsRecommendationsRoute() {
  return (
    <InsightsDashboardProvider>
      <RecommendationsScreen />
    </InsightsDashboardProvider>
  );
}
