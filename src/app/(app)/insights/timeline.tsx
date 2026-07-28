import React from 'react';
import { InsightsDashboardProvider } from '../../../features/insights/presentation/contexts/InsightsDashboardContext';
import { TimelineScreen } from '../../../features/insights/presentation/screens/InsightsScreens';

export default function InsightsTimelineRoute() {
  return (
    <InsightsDashboardProvider>
      <TimelineScreen />
    </InsightsDashboardProvider>
  );
}
