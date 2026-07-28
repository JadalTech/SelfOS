/**
 * Hydration Module Domain Types & Enums
 * SelfOS v1.4.0 — Batch 11A Revision
 *
 * This file defines all domain models for the Hydration feature.
 * Every interface uses `readonly` to enforce immutability at the type level.
 * Union types are used instead of TypeScript enums for tree-shaking friendliness.
 */

// ---------------------------------------------------------------------------
// Enums (Union Types)
// ---------------------------------------------------------------------------

export type DrinkType =
  | 'water'
  | 'electrolyte'
  | 'tea'
  | 'coffee'
  | 'milk'
  | 'juice'
  | 'other';

export type DrinkTemperature = 'cold' | 'normal' | 'warm';

/**
 * Source of a hydration entry.
 *
 * Original sources (v1.4.0):
 *   quick-add, manual, reminder, smart-suggestion
 *
 * Expanded sources (v1.4.0 Revision):
 *   widget, voice, apple-health, google-fit, imported, wearable
 */
export type HydrationSource =
  | 'quick-add'
  | 'manual'
  | 'reminder'
  | 'smart-suggestion'
  | 'widget'
  | 'voice'
  | 'apple-health'
  | 'google-fit'
  | 'imported'
  | 'wearable';

export type ActivityLevel = 'sedentary' | 'moderate' | 'high' | 'very-high';

export type ClimateType = 'cold' | 'normal' | 'hot' | 'very-hot';

export type HydrationStatus = 'low' | 'normal' | 'good' | 'excellent';

/** Reminder delivery mechanism. */
export type ReminderType = 'push' | 'in-app' | 'both';

/** Whether reminders use fixed times or a repeating interval. */
export type ScheduleType = 'fixed' | 'interval';

/** ISO weekday flags (1 = Monday … 7 = Sunday). */
export type WeekdayFlag = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Lifecycle status of a HydrationReminder configuration. */
export type ReminderStatus = 'active' | 'paused' | 'disabled';

/** Type of cached analytics summary period. */
export type CachedSummaryPeriod = 'daily' | 'weekly' | 'monthly';

/** Reason a goal was changed (for versioning). */
export type GoalChangeReason =
  | 'manual'
  | 'weight-update'
  | 'activity-change'
  | 'climate-change'
  | 'ai-recommendation'
  | 'import'
  | 'other';

// ---------------------------------------------------------------------------
// Drink Metadata
// ---------------------------------------------------------------------------

/**
 * Nutritional and hydration metadata for a drink type.
 * Used by the AI coach and analytics engine to assess drink quality.
 *
 * All values are per 250 mL serving.
 *
 * - hydrationMultiplier: effective hydration relative to pure water (1.0)
 * - caffeineMg:          milligrams of caffeine (0 for non-caffeinated)
 * - sugarG:              grams of sugar
 * - electrolytes:        whether the drink provides meaningful electrolytes
 * - caloriesKcal:        estimated kilocalories
 * - category:            broad drink classification
 */
export interface DrinkMetadata {
  readonly drinkType: DrinkType;
  readonly label: string;
  readonly icon: string;
  readonly hydrationMultiplier: number;
  readonly caffeineMg: number;
  readonly sugarG: number;
  readonly electrolytes: boolean;
  readonly caloriesKcal: number;
  readonly category: 'water' | 'caffeinated' | 'nutritive' | 'other';
}

// ---------------------------------------------------------------------------
// Core Domain Models
// ---------------------------------------------------------------------------

export interface HydrationEntry {
  readonly id: string;
  readonly userId: string;
  readonly date: string; // YYYY-MM-DD
  readonly time: string; // HH:mm
  readonly timestamp: Date;
  readonly amountML: number;
  readonly drinkType: DrinkType;
  readonly temperature: DrinkTemperature;
  readonly source: HydrationSource;
  readonly notes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface HydrationGoal {
  readonly id: string;
  readonly userId: string;
  readonly dailyTargetML: number;
  readonly customTargetEnabled: boolean;
  readonly weightKg?: number;
  readonly activityLevel: ActivityLevel;
  readonly climate: ClimateType;
  readonly wakeTime: string; // HH:mm
  readonly sleepTime: string; // HH:mm
  readonly reminderEnabled: boolean;
  readonly reminderIntervalMinutes: number;
  readonly smartAdjustments: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Goal Versioning
// ---------------------------------------------------------------------------

/**
 * Records a historical snapshot whenever the daily target changes.
 * Enables analytics to reconstruct what the goal was on any given date.
 */
export interface HydrationGoalVersion {
  readonly versionId: string;
  readonly userId: string;
  readonly previousTargetML: number;
  readonly newTargetML: number;
  readonly reason: GoalChangeReason;
  readonly effectiveDate: string; // YYYY-MM-DD
  readonly createdAt: Date;
}

// ---------------------------------------------------------------------------
// Hydration Reminder
// ---------------------------------------------------------------------------

/**
 * Dedicated domain model for reminder configuration.
 *
 * Supports two scheduling modes:
 *   - 'fixed':    user sets explicit times via `reminderTimes`
 *   - 'interval': system generates times between startTime–endTime
 *
 * Fields like lastTriggered / nextTrigger are updated by the
 * notification system (not implemented in Batch 11A).
 */
export interface HydrationReminder {
  readonly id: string;
  readonly userId: string;
  readonly enabled: boolean;
  readonly reminderType: ReminderType;
  readonly scheduleType: ScheduleType;
  readonly reminderTimes: ReadonlyArray<string>; // HH:mm[]
  readonly intervalMinutes: number;
  readonly startTime: string; // HH:mm
  readonly endTime: string; // HH:mm
  readonly weekdays: ReadonlyArray<WeekdayFlag>;
  readonly smartReminderEnabled: boolean;
  readonly snoozeMinutes: number;
  readonly maxSnoozes: number;
  readonly lastTriggered: Date | null;
  readonly nextTrigger: Date | null;
  readonly skippedCount: number;
  readonly completedCount: number;
  readonly status: ReminderStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Rich Hydration Score
// ---------------------------------------------------------------------------

/**
 * Multi-dimensional hydration score model.
 *
 * Each sub-score is 0–10.  The `overall` field is a weighted aggregate.
 *
 * Scoring weights (used by calculateDetailedHydrationScore):
 *   goalAchievement   35%   — daily target completion
 *   consistency        25%   — streak & day-to-day variance
 *   timing             15%   — how evenly intake is spread across waking hours
 *   drinkDistribution  15%   — variety of drink types
 *   hydrationQuality   10%   — effective hydration (adjusted for caffeine etc.)
 */
export interface HydrationScore {
  readonly overall: number;
  readonly timing: number;
  readonly consistency: number;
  readonly goalAchievement: number;
  readonly drinkDistribution: number;
  readonly hydrationQuality: number;
}

// ---------------------------------------------------------------------------
// Summary & Statistics Models
// ---------------------------------------------------------------------------

export interface HydrationDaySummary {
  readonly date: string; // YYYY-MM-DD
  readonly consumedML: number;
  readonly goalML: number;
  readonly completionPercent: number;
  readonly remainingML: number;
  readonly drinksCount: number;
  readonly largestDrink: number;
  readonly averageDrink: number;
  readonly streak: number;
  readonly status: HydrationStatus;
}

export interface HydrationStatistics {
  readonly weeklyAverage: number;
  readonly monthlyAverage: number;
  readonly yearlyAverage: number;
  readonly bestDay: { readonly date: string; readonly amountML: number } | null;
  readonly worstDay: { readonly date: string; readonly amountML: number } | null;
  readonly longestStreak: number;
  readonly completionRate: number; // 0–100
  readonly averageDrinkSize: number;
  readonly peakHour: number; // 0–23
  readonly drinkTypeBreakdown: Readonly<Record<DrinkType, number>>;
}

export interface HydrationTrend {
  readonly daily: ReadonlyArray<{ readonly date: string; readonly amountML: number }>;
  readonly weekly: ReadonlyArray<{ readonly weekStart: string; readonly averageML: number }>;
  readonly monthly: ReadonlyArray<{ readonly month: string; readonly averageML: number }>;
}

// ---------------------------------------------------------------------------
// Cached Summary (Firestore scalability)
// ---------------------------------------------------------------------------

/**
 * Pre-computed summary stored in Firestore for fast reads.
 * Written on a schedule or after batch processing — never on critical path.
 */
export interface CachedHydrationSummary {
  readonly id: string;
  readonly userId: string;
  readonly period: CachedSummaryPeriod;
  readonly periodKey: string; // e.g. "2026-07-28" | "2026-W31" | "2026-07"
  readonly totalML: number;
  readonly goalML: number;
  readonly completionPercent: number;
  readonly drinksCount: number;
  readonly averageDrinkSize: number;
  readonly computedAt: Date;
}

// ---------------------------------------------------------------------------
// Reminder Models (legacy — kept for backward compatibility)
// ---------------------------------------------------------------------------

export interface ReminderWindow {
  readonly start: string; // HH:mm
  readonly end: string; // HH:mm
  readonly intervalMinutes: number;
}

export interface ReminderScheduleItem {
  readonly time: string; // HH:mm
  readonly label: string;
}

// ---------------------------------------------------------------------------
// Validation Result
// ---------------------------------------------------------------------------

/**
 * Structured validation result used by advanced validation functions.
 * Provides field-level errors and a human-readable summary.
 */
export interface HydrationValidationResult {
  readonly valid: boolean;
  readonly errors: ReadonlyArray<{
    readonly field: string;
    readonly code: string;
    readonly message: string;
  }>;
}
