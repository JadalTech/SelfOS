/**
 * Skincare Module ViewModels & Presentation Interfaces
 */

import type {
  ProductCategory,
  ProductType,
  RoutineTime,
  SkinType,
  SkinConcern,
  Severity,
  PhotoAngle,
} from './skincare.types';

export interface SkincareProductVM {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  categoryLabel: string;
  type: ProductType;
  typeLabel: string;
  keyIngredients: string[];
  ingredientsListFormatted: string;
  openedDateFormatted?: string;
  expiryDateFormatted?: string;
  expiryStatus: 'good' | 'expiring-soon' | 'expired' | 'unknown';
  expiryStatusLabel?: string;
  isFavorite: boolean;
  isActive: boolean;
  notes?: string;
}

export interface RoutineStepVM {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  productCategoryLabel: string;
  stepOrder: number;
  stepOrderLabel: string;
  timeOfDayLabel: string;
  waitTimeFormatted?: string;
  instructions?: string;
  isOptional: boolean;
}

export interface SkincareRoutineVM {
  id: string;
  routineId: string;
  timeOfDay: RoutineTime;
  timeOfDayLabel: string;
  timeOfDayIcon: string;
  stepsCount: number;
  steps: RoutineStepVM[];
  targetedConcernsFormatted: string[];
}

export interface SkincareLogVM {
  id: string;
  skincareRoutineId: string;
  routineLogId: string;
  dateFormatted: string;
  timeFormatted: string;
  completedStepsCount: number;
  totalStepsCount: number;
  appliedProductsCount: number;
  weatherLabel?: string;
  skinFeelingLabel?: string;
  notes?: string;
}

export interface SkinAssessmentVM {
  id: string;
  recordDate: string;
  recordDateFormatted: string;
  skinType: SkinType;
  skinTypeLabel: string;
  overallHealthScore: number; // 1-10
  healthScoreBadgeColor: string;
  topConcernsFormatted: { concern: SkinConcern; label: string; severity: Severity; severityLabel: string }[];
  hydrationPercentage: number;
  sensitivityStatusLabel: string;
  oilinessStatusLabel: string;
  barrierHealthStatusLabel: string;
  sleepHoursFormatted?: string;
  stressLevelLabel?: string;
  notes?: string;
}

export interface ProgressPhotoVM {
  id: string;
  photoUrl: string;
  date: string;
  dateFormatted: string;
  timeOfDayLabel: string;
  angle: PhotoAngle;
  angleLabel: string;
  lightingCondition?: string;
  notes?: string;
}

export interface SkinReminderVM {
  id: string;
  title: string;
  timeFormatted: string;
  reminderTypeLabel: string;
  frequencyLabel: string;
  daysOfWeekFormatted?: string;
  isEnabled: boolean;
}

export interface TimelineMonthGroup {
  monthYear: string;
  photos: ProgressPhotoVM[];
}

export interface SkincareDashboardVM {
  hasProducts: boolean;
  totalProductsCount: number;
  expiringProductsCount: number;
  activeRoutinesCount: number;
  latestAssessment?: {
    recordDateFormatted: string;
    overallHealthScore: number;
    skinTypeLabel: string;
    primaryConcernLabel?: string;
  };
  todayLogStatus: {
    morningCompleted: boolean;
    eveningCompleted: boolean;
  };
  weeklyCompletionRate: number; // 0-100 percentage
  recentPhotoUrl?: string;
  hasActiveAlerts: boolean;
}

export interface SkinInsightVM {
  id: string;
  type: 'improvement' | 'warning' | 'tip' | 'correlation';
  title: string;
  description: string;
  category: string;
  dateFormatted: string;
}

export interface SkincareAnalyticsVM {
  weeklyCompletionRate: number;
  monthlyCompletionRate: number;
  currentConsistencyScore: number;
  skinHealthScoreTrend: 'improving' | 'stable' | 'declining';
  averageSkinHealthScore: number;
  topUsedProducts: { productId: string; productName: string; usageCount: number }[];
  concernProgress: { concern: SkinConcern; label: string; initialSeverity: Severity; currentSeverity: Severity; change: number }[];
  insights: SkinInsightVM[];
}
