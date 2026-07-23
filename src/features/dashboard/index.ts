/**
 * Dashboard Feature Entry Point
 */

// Types & View Models
export type {
  DashboardViewModel,
  GreetingVM,
  ProgressVM,
  RoutineItemVM,
  StatsVM,
  WeeklyProgressVM,
  ActivityVM,
  ModuleNavVM,
} from './types';

// Pure Mappers
export {
  mapGreeting,
  mapTodayProgress,
  mapTodayRoutines,
  mapStats,
  mapWeeklyProgress,
  mapRecentActivities,
  buildDashboardViewModel,
} from './utils/dashboardMapper';

// Registries & Constants
export { REGISTERED_MODULES } from './registry/module.registry';
export { dashboardKeys } from './constants/queryKeys';

// Aggregation Hook
export { useDashboard } from './hooks/useDashboard';

// Components
export {
  DashboardHeader,
  TodayProgressCard,
  TodayRoutinesList,
  QuickActionsBar,
  StreakOverviewCard,
  StatsGrid,
  WeeklyProgressCard,
  RecentActivityCard,
  ModuleNavGrid,
  LoadingDashboard,
  EmptyDashboard,
  ErrorDashboard,
} from './components';

// Screens
export { DashboardScreen } from './screens';
