/**
 * Skincare Module Domain Types & Enums
 */

export type ProductCategory =
  | 'cleanser'
  | 'toner'
  | 'essence'
  | 'serum'
  | 'ampoule'
  | 'moisturizer'
  | 'sunscreen'
  | 'exfoliant'
  | 'mask'
  | 'eye-cream'
  | 'spot-treatment'
  | 'face-oil'
  | 'mist';

export type ProductType =
  | 'liquid'
  | 'cream'
  | 'gel'
  | 'foam'
  | 'serum'
  | 'oil'
  | 'balm'
  | 'sheet'
  | 'powder';

export type RoutineTime = 'morning' | 'evening' | 'both' | 'weekly-special';

export type SkinType = 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';

export type SkinConcern =
  | 'acne'
  | 'aging'
  | 'hyperpigmentation'
  | 'dryness'
  | 'redness'
  | 'texture'
  | 'dark-circles'
  | 'dullness'
  | 'enlarged-pores'
  | 'barrier-damage';

export type Severity = 1 | 2 | 3 | 4 | 5; // 1 = Mild, 5 = Severe

export type RoutineStatus = 'active' | 'paused' | 'archived';

export type RoutineFrequency = 'daily' | 'weekly' | 'biweekly' | 'custom';

export type PhotoAngle = 'front' | 'left-profile' | 'right-profile' | 'close-up';

export type ReminderType =
  | 'morning-routine'
  | 'evening-routine'
  | 'sunscreen-reapply'
  | 'weekly-exfoliation'
  | 'assessment-checkin';

export type AssessmentScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Weather = 'sunny' | 'humid' | 'dry' | 'cold' | 'hot' | 'rainy' | 'cloudy';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SkincareProduct {
  id: string;
  userId: string;
  name: string;
  brand: string;
  category: ProductCategory;
  type: ProductType;
  keyIngredients: string[];
  openedDate?: Date;
  shelfLifeMonths?: number;
  expiryDate?: Date;
  isFavorite: boolean;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutineStep {
  id: string;
  productId: string;
  stepOrder: number;
  timeOfDay: RoutineTime;
  waitTimeMinutes?: number;
  instructions?: string;
  isOptional: boolean;
}

export interface SkincareRoutine {
  id: string;
  userId: string;
  routineId: string; // Foreign key pointing to core generic routines collection
  timeOfDay: RoutineTime;
  steps: RoutineStep[];
  targetedConcerns: SkinConcern[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SkincareLog {
  id: string;
  userId: string;
  skincareRoutineId: string;
  routineLogId: string; // Foreign key pointing to core generic routine_logs collection
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  completedStepIds: string[];
  skippedStepIds: string[];
  appliedProductIds: string[];
  weather?: Weather;
  uvIndex?: number;
  skinFeelingRating?: number; // 1-5 rating after routine
  notes?: string;
  createdAt: Date;
}

export interface SkinAssessment {
  id: string;
  userId: string;
  recordDate: string; // YYYY-MM-DD
  skinType: SkinType;
  concerns: SkinConcern[];
  severityMap: Partial<Record<SkinConcern, Severity>>;
  overallHealthScore: number; // 1-10 overall rating
  hydrationLevel: number; // 1-5 scale
  sensitivityLevel: number; // 1-5 scale
  oilinessLevel: number; // 1-5 scale
  barrierHealthScore: number; // 1-5 scale
  sleepHours?: number;
  stressLevel?: number; // 1-5 scale
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  photoUrl: string;
  storagePath: string;
  date: string; // YYYY-MM-DD
  timeOfDay: RoutineTime;
  angle: PhotoAngle;
  lightingCondition?: string;
  notes?: string;
  createdAt: Date;
}

export interface SkinReminder {
  id: string;
  userId: string;
  title: string;
  time: string; // HH:mm format
  reminderType: ReminderType;
  frequency: RoutineFrequency;
  daysOfWeek?: number[]; // 0 = Sunday, 6 = Saturday
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkinGoal {
  id: string;
  userId: string;
  targetConcern: SkinConcern;
  targetScore: number;
  currentScore: number;
  startDate: string;
  targetDate?: string;
  isAchieved: boolean;
  createdAt: Date;
}
