import React from 'react';
import { InsightsDashboardProvider } from '../../../features/insights/presentation/contexts/InsightsDashboardContext';
import { HabitScreen } from '../../../features/insights/presentation/screens/InsightsScreens';

export default function InsightsHabitsRoute() {
  return (
    <InsightsDashboardProvider>
      <HabitScreen />
    </InsightsDashboardProvider>
  );
}
