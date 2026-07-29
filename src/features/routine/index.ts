/**
 * Routine Engine Feature Module Entry Point
 */

// Types & Models
export type {
  Routine,
  RoutineSchedule,
  RoutineReminder,
  RoutineLog,
  RoutineType,
  RoutineFrequency,
  RoutineStatus,
  LogStatus,
} from './types';

// Pure Engine Layer - Scheduling
export {
  isRoutineScheduledForDate,
  isScheduledTodayInTimezone,
  getLocalDateInTimezone,
  getDaysDiff,
  getWeeksDiff,
  getMonthsDiff,
  parseLocalDateString,
} from './engine/scheduler';

// Pure Engine Layer - Streaks
export {
  calculateCompletionStreak,
  rebuildStreakFromLogs,
  isConsecutiveCompletion,
} from './engine/streak';

// Pure Engine Layer - Completion
export {
  getRoutineStatusForDate,
  calculateCompletionRate,
} from './engine/completion';
export type { CalculatedDayStatus } from './engine/completion';

// Form Validation
export {
  routineFormSchema,
  routineScheduleSchema,
  routineReminderSchema,
} from './validation/routine.validation';
export type { RoutineFormValues } from './validation/routine.validation';

// Repository & Services
export { routineRepository, RoutineRepository } from './repository/routine.repository';
export type { IRoutineRepository, CreateRoutinePayload, UpdateRoutinePayload } from './domain/repositories/routine.repository.interface';
export { routineService, RoutineService } from './services/routine.service';

// Constants & Query Keys
export { routineKeys } from './constants/queryKeys';

// React Query Hooks
export {
  useRoutines,
  useRoutine,
  useCreateRoutine,
  useUpdateRoutine,
  useArchiveRoutine,
  useRestoreRoutine,
  useCompleteRoutine,
  useSkipRoutine,
  useUndoCompletion,
} from './hooks';

// Components
export {
  RoutineStatusBadge,
  RoutineCard,
  LoadingRoutineCard,
  EmptyRoutineState,
  ArchiveRoutineDialog,
  FrequencySelector,
  ScheduleSelector,
  ReminderPicker,
  RoutineForm,
} from './components';

// Screens
export {
  RoutineListScreen,
  RoutineDetailsScreen,
  CreateRoutineScreen,
  EditRoutineScreen,
} from './screens';
