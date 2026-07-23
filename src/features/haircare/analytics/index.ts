/**
 * Haircare Analytics Feature Submodule Export
 */

export * from './types/analytics.types';
export { buildHairAnalyticsVM, calculateWeeklyAnalytics, calculateMonthlyAnalytics, calculateProductAnalytics, calculateConditionTrends } from './utils/hairAnalytics';
export { useHairAnalytics } from './hooks/useHairAnalytics';
export { InsightCard } from './components/InsightCard';
export { CompletionBarChart } from './components/CompletionBarChart';
export { ConditionTrendChart } from './components/ConditionTrendChart';
export { ProductUsageChart } from './components/ProductUsageChart';
export { AnalyticsSummaryWidget } from './components/AnalyticsSummaryWidget';
export { HairAnalyticsDashboardScreen } from './screens/HairAnalyticsDashboardScreen';
