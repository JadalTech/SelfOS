/**
 * Hydration Module Constants & Configurations
 * SelfOS v1.4.0 — Batch 11A Revision
 *
 * All lookup tables, option arrays, and validation limits for the Hydration module.
 * Constants are frozen at module load time and never mutated.
 */

import type {
  DrinkType,
  DrinkTemperature,
  HydrationSource,
  ActivityLevel,
  ClimateType,
  HydrationStatus,
  DrinkMetadata,
} from '../types/hydration.types';

// ---------------------------------------------------------------------------
// Firestore Collection Paths
// ---------------------------------------------------------------------------

export const HYDRATION_COLLECTIONS = {
  ENTRIES: 'hydration_entries',
  GOALS: 'hydration_goals',
  STATISTICS: 'hydration_statistics',
  GOAL_VERSIONS: 'hydration_goal_versions',
  REMINDERS: 'hydration_reminders',
  /** Optional cached summaries for fast reads */
  CACHED_DAILY: 'hydration_cached_daily',
  CACHED_WEEKLY: 'hydration_cached_weekly',
  CACHED_MONTHLY: 'hydration_cached_monthly',
} as const;

// ---------------------------------------------------------------------------
// Validation Limits
// ---------------------------------------------------------------------------

/** Minimum allowed intake per entry in mL */
export const HYDRATION_MIN_AMOUNT_ML = 10;

/** Maximum allowed intake per entry in mL */
export const HYDRATION_MAX_AMOUNT_ML = 5000;

/** Default daily target in mL */
export const HYDRATION_DEFAULT_TARGET_ML = 2500;

/** Minimum daily target in mL */
export const HYDRATION_MIN_TARGET_ML = 500;

/** Maximum daily target in mL */
export const HYDRATION_MAX_TARGET_ML = 10000;

/** Default reminder interval in minutes */
export const HYDRATION_DEFAULT_REMINDER_INTERVAL = 60;

/** Minimum reminder interval in minutes */
export const HYDRATION_MIN_REMINDER_INTERVAL = 15;

/** Maximum reminder interval in minutes */
export const HYDRATION_MAX_REMINDER_INTERVAL = 240;

/** Minimum minutes between two entries before flagging as unrealistic */
export const HYDRATION_MIN_ENTRY_GAP_MINUTES = 1;

/** Maximum entries per day before flagging as unrealistic */
export const HYDRATION_MAX_ENTRIES_PER_DAY = 50;

/** Default snooze duration in minutes */
export const HYDRATION_DEFAULT_SNOOZE_MINUTES = 10;

/** Maximum allowed snoozes per reminder */
export const HYDRATION_MAX_SNOOZES = 5;

// ---------------------------------------------------------------------------
// Quick-Add Drink Sizes
// ---------------------------------------------------------------------------

export interface DrinkSizeOption {
  readonly label: string;
  readonly amountML: number;
  readonly icon: string;
}

export const DRINK_SIZES: ReadonlyArray<DrinkSizeOption> = [
  { label: 'Sip', amountML: 100, icon: 'water-outline' },
  { label: 'Small Glass', amountML: 200, icon: 'water-outline' },
  { label: 'Glass', amountML: 250, icon: 'water-outline' },
  { label: 'Large Glass', amountML: 350, icon: 'water-outline' },
  { label: 'Bottle', amountML: 500, icon: 'water-outline' },
  { label: 'Large Bottle', amountML: 750, icon: 'water-outline' },
  { label: 'Litre', amountML: 1000, icon: 'water-outline' },
] as const;

// ---------------------------------------------------------------------------
// Drink Type Options (legacy — kept for backward compatibility)
// ---------------------------------------------------------------------------

export const DRINK_TYPE_OPTIONS: ReadonlyArray<{ value: DrinkType; label: string; icon: string; hydrationFactor: number }> = [
  { value: 'water', label: 'Water', icon: 'water-outline', hydrationFactor: 1.0 },
  { value: 'electrolyte', label: 'Electrolyte', icon: 'flash-outline', hydrationFactor: 1.1 },
  { value: 'tea', label: 'Tea', icon: 'cafe-outline', hydrationFactor: 0.9 },
  { value: 'coffee', label: 'Coffee', icon: 'cafe-outline', hydrationFactor: 0.8 },
  { value: 'milk', label: 'Milk', icon: 'nutrition-outline', hydrationFactor: 0.9 },
  { value: 'juice', label: 'Juice', icon: 'leaf-outline', hydrationFactor: 0.85 },
  { value: 'other', label: 'Other', icon: 'help-circle-outline', hydrationFactor: 0.7 },
] as const;

// ---------------------------------------------------------------------------
// Drink Metadata (rich — per 250 mL serving)
// ---------------------------------------------------------------------------

/**
 * Extended drink metadata for AI coach and analytics.
 * Values are approximate per 250 mL serving.
 *
 * Sources for nutritional estimates:
 *   - USDA FoodData Central (generic entries)
 *   - IOM Dietary Reference Intakes for Water
 */
export const DRINK_METADATA: ReadonlyArray<DrinkMetadata> = [
  {
    drinkType: 'water',
    label: 'Water',
    icon: 'water-outline',
    hydrationMultiplier: 1.0,
    caffeineMg: 0,
    sugarG: 0,
    electrolytes: false,
    caloriesKcal: 0,
    category: 'water',
  },
  {
    drinkType: 'electrolyte',
    label: 'Electrolyte',
    icon: 'flash-outline',
    hydrationMultiplier: 1.1,
    caffeineMg: 0,
    sugarG: 6,
    electrolytes: true,
    caloriesKcal: 25,
    category: 'water',
  },
  {
    drinkType: 'tea',
    label: 'Tea',
    icon: 'cafe-outline',
    hydrationMultiplier: 0.9,
    caffeineMg: 35,
    sugarG: 0,
    electrolytes: false,
    caloriesKcal: 2,
    category: 'caffeinated',
  },
  {
    drinkType: 'coffee',
    label: 'Coffee',
    icon: 'cafe-outline',
    hydrationMultiplier: 0.8,
    caffeineMg: 95,
    sugarG: 0,
    electrolytes: false,
    caloriesKcal: 5,
    category: 'caffeinated',
  },
  {
    drinkType: 'milk',
    label: 'Milk',
    icon: 'nutrition-outline',
    hydrationMultiplier: 0.9,
    caffeineMg: 0,
    sugarG: 12,
    electrolytes: true,
    caloriesKcal: 120,
    category: 'nutritive',
  },
  {
    drinkType: 'juice',
    label: 'Juice',
    icon: 'leaf-outline',
    hydrationMultiplier: 0.85,
    caffeineMg: 0,
    sugarG: 22,
    electrolytes: false,
    caloriesKcal: 110,
    category: 'nutritive',
  },
  {
    drinkType: 'other',
    label: 'Other',
    icon: 'help-circle-outline',
    hydrationMultiplier: 0.7,
    caffeineMg: 0,
    sugarG: 0,
    electrolytes: false,
    caloriesKcal: 0,
    category: 'other',
  },
] as const;

/**
 * Looks up DrinkMetadata for a given drink type.
 * Returns the 'other' entry if the type is unknown.
 */
export function getDrinkMetadata(drinkType: DrinkType): DrinkMetadata {
  return (
    DRINK_METADATA.find((d) => d.drinkType === drinkType) ??
    DRINK_METADATA[DRINK_METADATA.length - 1]
  );
}

// ---------------------------------------------------------------------------
// Drink Temperature Options
// ---------------------------------------------------------------------------

export const DRINK_TEMPERATURE_OPTIONS: ReadonlyArray<{ value: DrinkTemperature; label: string }> = [
  { value: 'cold', label: 'Cold' },
  { value: 'normal', label: 'Normal' },
  { value: 'warm', label: 'Warm' },
] as const;

// ---------------------------------------------------------------------------
// Hydration Source Options (expanded)
// ---------------------------------------------------------------------------

export const HYDRATION_SOURCE_OPTIONS: ReadonlyArray<{ value: HydrationSource; label: string }> = [
  { value: 'quick-add', label: 'Quick Add' },
  { value: 'manual', label: 'Manual' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'smart-suggestion', label: 'Smart Suggestion' },
  { value: 'widget', label: 'Widget' },
  { value: 'voice', label: 'Voice' },
  { value: 'apple-health', label: 'Apple Health' },
  { value: 'google-fit', label: 'Google Fit' },
  { value: 'imported', label: 'Imported' },
  { value: 'wearable', label: 'Wearable' },
] as const;

// ---------------------------------------------------------------------------
// Activity Level Options
// ---------------------------------------------------------------------------

export const ACTIVITY_LEVEL_OPTIONS: ReadonlyArray<{ value: ActivityLevel; label: string; multiplier: number }> = [
  { value: 'sedentary', label: 'Sedentary', multiplier: 1.0 },
  { value: 'moderate', label: 'Moderate', multiplier: 1.2 },
  { value: 'high', label: 'High', multiplier: 1.4 },
  { value: 'very-high', label: 'Very High', multiplier: 1.6 },
] as const;

// ---------------------------------------------------------------------------
// Climate Options
// ---------------------------------------------------------------------------

export const CLIMATE_OPTIONS: ReadonlyArray<{ value: ClimateType; label: string; multiplier: number }> = [
  { value: 'cold', label: 'Cold', multiplier: 0.9 },
  { value: 'normal', label: 'Normal', multiplier: 1.0 },
  { value: 'hot', label: 'Hot', multiplier: 1.2 },
  { value: 'very-hot', label: 'Very Hot', multiplier: 1.4 },
] as const;

// ---------------------------------------------------------------------------
// Hydration Status Thresholds
// ---------------------------------------------------------------------------

export const HYDRATION_STATUS_THRESHOLDS: ReadonlyArray<{ status: HydrationStatus; minPercent: number; label: string; color: string }> = [
  { status: 'low', minPercent: 0, label: 'Low', color: '#EF4444' },
  { status: 'normal', minPercent: 40, label: 'Normal', color: '#F59E0B' },
  { status: 'good', minPercent: 75, label: 'Good', color: '#3B82F6' },
  { status: 'excellent', minPercent: 100, label: 'Excellent', color: '#10B981' },
] as const;

// ---------------------------------------------------------------------------
// Water Per KG Baseline (mL per kg body weight)
// ---------------------------------------------------------------------------

/**
 * Standard hydration factor: 33 mL of water per kilogram of body weight per day.
 * Source: European Food Safety Authority (EFSA) guidelines.
 */
export const WATER_PER_KG_ML = 33;

// ---------------------------------------------------------------------------
// Hydration Score Weights
// ---------------------------------------------------------------------------

/**
 * Weights used by `calculateDetailedHydrationScore` in the engine.
 * Sum must equal 1.0.
 */
export const HYDRATION_SCORE_WEIGHTS = {
  goalAchievement: 0.35,
  consistency: 0.25,
  timing: 0.15,
  drinkDistribution: 0.15,
  hydrationQuality: 0.10,
} as const;
