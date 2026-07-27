// Types & Domain Models
export type {
  SleepSource,
  SleepGoalCategory,
  SleepQuality,
  SleepEntry,
  SleepSchedule,
  SleepGoal,
  SleepDebt,
  SleepRecovery,
  SleepTrendPoint,
  SleepTrend,
  WeeklySleepSummary,
  MonthlySleepSummary,
} from './types';

// Firestore Converters
export {
  sleepEntryConverter,
  sleepScheduleConverter,
  sleepGoalConverter,
  sleepTrendConverter,
} from './firestore/converters';

// Repository Layer
export type {
  ISleepRepository,
  ISleepScheduleRepository,
  ISleepGoalRepository,
  ISleepAnalyticsRepository,
} from './repository/contracts';
export {
  sleepRepository,
  sleepScheduleRepository,
  sleepGoalRepository,
  sleepAnalyticsRepository,
  SleepRepository,
  SleepScheduleRepository,
  SleepGoalRepository,
  SleepAnalyticsRepository,
} from './repository/sleep.repository';

// Services
export { sleepService, SleepService } from './services/sleep.service';
export { sleepRecoveryService, SleepRecoveryService } from './services/sleepRecovery.service';
export { sleepAnalyticsService, SleepAnalyticsService } from './services/sleepAnalytics.service';
export { sleepValidationService, SleepValidationService } from './services/sleepValidation.service';

// Pure Engine
export * as SleepEngine from './engine/sleepEngine';

// Validation Schemas & Types
export {
  sleepEntrySchema,
  sleepScheduleSchema,
  sleepGoalSchema,
} from './validation/sleep.validation';

// Hooks
export {
  sleepKeys,
  useSleepEntries,
  useSleepToday,
  useSleepSchedule,
  useSleepAnalytics,
  useSleepGoals,
  useSleepRecovery,
} from './hooks';

// Mappers
export * from './mappers';

// UI Components & Layouts
export * from './components';

// Screen Container Components
export * from './screens';

// AI Coach & Recommendations
export * from './ai';


