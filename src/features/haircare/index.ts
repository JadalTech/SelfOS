/**
 * Haircare Feature Module Entry Point
 */

// Types & View Models
export type {
  HairProduct,
  ProductCategory,
  HairRoutine,
  HairRoutineCategory,
  HairLog,
  HairProductVM,
  HairRoutineVM,
  HairLogVM,
  HaircareDashboardVM,
  HairPhoto,
  PhotoAngle,
  HairPhotoVM,
  TimelineMonthGroup,
  HairCondition,
  HairType,
  HairPorosity,
  ScalpType,
  HairDensity,
  HairConditionVM,
  ConditionFilterParams,
} from './types';

// Repository & Services
export { haircareRepository, HaircareRepository } from './repository/haircare.repository';
export { hairPhotoRepository, HairPhotoRepository } from './repository/hairPhoto.repository';
export { hairConditionRepository, HairConditionRepository } from './repository/hairCondition.repository';
export { haircareService, HaircareService } from './services/haircare.service';
export { hairStorageService, HairStorageService } from './services/hairStorage.service';

// Modular Mappers
export {
  mapToHairProductVM,
  mapToHairProductVMs,
  mapToHairRoutineVM,
  mapToHairRoutineVMs,
  mapToHairLogVM,
  mapToHairLogVMs,
  mapToHairPhotoVM,
  mapToHairPhotoVMs,
  groupPhotosByMonth,
  mapToHairConditionVM,
  mapToHairConditionVMs,
  filterConditionVMs,
  buildHaircareDashboardVM,
} from './mappers';

// Validation Schemas
export {
  hairProductSchema,
  hairRoutineSchema,
  hairLogSchema,
  hairPhotoUploadSchema,
  hairConditionSchema,
} from './validation/haircare.validation';
export type {
  HairProductFormValues,
  HairRoutineFormValues,
  HairLogFormValues,
  HairPhotoUploadFormValues,
  HairConditionFormValues,
} from './validation/haircare.validation';

// Constants & Query Keys
export { haircareKeys } from './hooks/queryKeys';

// React Query Hooks
export {
  useHairProducts,
  useHairRoutines,
  useHairLogs,
  useHaircareDashboard,
  useHairPhotos,
  useUploadHairPhoto,
  useDeleteHairPhoto,
  useHairTimeline,
  useHairConditions,
  useLatestHairCondition,
  useCreateHairCondition,
  useUpdateHairCondition,
  useDeleteHairCondition,
} from './hooks';

// Components
export {
  HaircareHeader,
  ProductCard,
  ProductForm,
  HairRoutineCard,
  HairRoutineForm,
  HairLogCard,
  HairLogForm,
  HaircareWidget,
  LoadingHaircare,
  EmptyHaircare,
  ErrorHaircare,
  PhotoCard,
  PhotoGrid,
  TimelineCard,
  ComparisonCard,
  UploadPhotoButton,
  DeletePhotoDialog,
  EmptyGallery,
  ConditionBadge,
  ConditionCard,
  ConditionSummaryCard,
  ConditionForm,
  EmptyConditionState,
} from './components';

// Screens
export {
  HaircareDashboardScreen,
  HairProductsScreen,
  HairRoutinesScreen,
  HairLogsScreen,
  HairTimelineScreen,
  ComparePhotosScreen,
  HairConditionHistoryScreen,
  HairConditionFormScreen,
  HairAnalyticsDashboardScreen,
  HairCoachScreen,
} from './screens';
