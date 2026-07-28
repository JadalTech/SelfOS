/**
 * Pure Hydration Domain Engine
 * SelfOS v1.4.0 — Batch 11A Revision
 *
 * All business logic algorithms remain 100% pure TypeScript:
 * - Framework independent
 * - Zero database imports
 * - Zero React dependencies
 *
 * Key formulae:
 *
 * Recommended Water (mL)
 *   base = weightKg × WATER_PER_KG_ML (33)
 *   adjusted = base × activityMultiplier × climateMultiplier
 *
 * Effective Hydration (mL)
 *   effectiveML = Σ (entry.amountML × drinkType.hydrationMultiplier)
 *
 * Hydration Score (0–10, multi-dimensional)
 *   goalAchievement   = min(10, completionPct / 10)            × 0.35
 *   consistency        = min(10, streak / 1.4)                  × 0.25
 *   timing             = 10 × (1 – CV of hourly intake)        × 0.15
 *   drinkDistribution  = min(10, uniqueTypes / 0.3)            × 0.15
 *   hydrationQuality   = min(10, effectiveML / consumedML × 10) × 0.10
 */

import type {
  HydrationEntry,
  HydrationGoal,
  HydrationDaySummary,
  HydrationStatus,
  HydrationScore,
  ActivityLevel,
  ClimateType,
  DrinkType,
  ReminderWindow,
  ReminderScheduleItem,
} from '../types/hydration.types';
import {
  WATER_PER_KG_ML,
  HYDRATION_DEFAULT_TARGET_ML,
  ACTIVITY_LEVEL_OPTIONS,
  CLIMATE_OPTIONS,
  DRINK_TYPE_OPTIONS,
  HYDRATION_SCORE_WEIGHTS,
} from '../constants/hydration.constants';

// ---------------------------------------------------------------------------
// Recommended Water Calculation
// ---------------------------------------------------------------------------

/**
 * Calculates recommended daily water intake in mL based on body weight.
 *
 * Formula: weightKg × 33 mL/kg (EFSA guideline).
 * Returns default (2500 mL) for invalid weight values.
 */
export function calculateRecommendedWater(weightKg: number): number {
  if (weightKg <= 0) return HYDRATION_DEFAULT_TARGET_ML;
  return Math.round(weightKg * WATER_PER_KG_ML);
}

/**
 * Adjusts water recommendation based on climate conditions.
 *
 * Multipliers: cold 0.9, normal 1.0, hot 1.2, very-hot 1.4.
 */
export function adjustForWeather(
  baseML: number,
  climate: ClimateType
): number {
  const option = CLIMATE_OPTIONS.find((c) => c.value === climate);
  const multiplier = option?.multiplier ?? 1.0;
  return Math.round(baseML * multiplier);
}

/**
 * Adjusts water recommendation based on workout activity.
 *
 * Adds ~500 mL per hour of moderate exercise (ACSM guideline).
 */
export function adjustForWorkout(
  baseML: number,
  workoutDurationMinutes: number
): number {
  if (workoutDurationMinutes <= 0) return baseML;
  const additionalML = Math.round((workoutDurationMinutes / 60) * 500);
  return baseML + additionalML;
}

/**
 * Adjusts water recommendation based on activity level.
 *
 * Multipliers: sedentary 1.0, moderate 1.2, high 1.4, very-high 1.6.
 */
export function adjustForActivityLevel(
  baseML: number,
  activityLevel: ActivityLevel
): number {
  const option = ACTIVITY_LEVEL_OPTIONS.find((a) => a.value === activityLevel);
  const multiplier = option?.multiplier ?? 1.0;
  return Math.round(baseML * multiplier);
}

/**
 * Calculates the fully adjusted daily target combining weight, activity,
 * and climate.
 */
export function calculateFullTarget(
  weightKg: number | undefined,
  activityLevel: ActivityLevel,
  climate: ClimateType
): number {
  let base = weightKg && weightKg > 0
    ? calculateRecommendedWater(weightKg)
    : HYDRATION_DEFAULT_TARGET_ML;
  base = adjustForActivityLevel(base, activityLevel);
  base = adjustForWeather(base, climate);
  return base;
}

// ---------------------------------------------------------------------------
// Reminder Schedule
// ---------------------------------------------------------------------------

/**
 * Generates a list of reminder times based on wake/sleep window and interval.
 * Handles overnight windows (end < start) by wrapping past midnight.
 */
export function calculateReminderSchedule(
  window: ReminderWindow
): ReminderScheduleItem[] {
  const schedule: ReminderScheduleItem[] = [];
  const { start, end, intervalMinutes } = window;

  if (intervalMinutes <= 0) return schedule;

  const startMinutes = parseTimeToMinutes(start);
  const endMinutes = parseTimeToMinutes(end);

  // Handle overnight windows (e.g., wake 07:00, sleep 23:00 — standard)
  // Also handle edge case where end < start (cross midnight, but unusual for hydration)
  const effectiveEnd = endMinutes <= startMinutes
    ? endMinutes + 24 * 60
    : endMinutes;

  let current = startMinutes;
  while (current < effectiveEnd) {
    const normalised = current % (24 * 60);
    const hours = Math.floor(normalised / 60);
    const mins = normalised % 60;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    schedule.push({
      time: timeStr,
      label: `Drink ${Math.round(250)} mL`,
    });
    current += intervalMinutes;
  }

  return schedule;
}

// ---------------------------------------------------------------------------
// Hydration Status & Progress
// ---------------------------------------------------------------------------

/**
 * Determines hydration status based on completion percentage.
 *
 * Thresholds: <40% low, 40-74% normal, 75-99% good, ≥100% excellent.
 */
export function hydrationStatus(completionPercent: number): HydrationStatus {
  if (completionPercent >= 100) return 'excellent';
  if (completionPercent >= 75) return 'good';
  if (completionPercent >= 40) return 'normal';
  return 'low';
}

/**
 * Calculates remaining water needed to reach the goal.
 * Returns 0 if the goal has been exceeded.
 */
export function remainingWater(consumedML: number, goalML: number): number {
  return Math.max(0, goalML - consumedML);
}

/**
 * Calculates completion percentage, capped at 100.
 */
export function completionPercent(consumedML: number, goalML: number): number {
  if (goalML <= 0) return 0;
  return Math.min(100, Math.round((consumedML / goalML) * 100));
}

/**
 * Calculates today's total consumption from entries.
 */
export function calculateTodayTotal(entries: HydrationEntry[]): number {
  return entries.reduce((sum, e) => sum + e.amountML, 0);
}

// ---------------------------------------------------------------------------
// Predictions
// ---------------------------------------------------------------------------

/**
 * Predicts end-of-day total intake based on current consumption pace.
 *
 * Formula: (consumedML / elapsedMinutes) × totalWakeMinutes
 *
 * @param consumedML    Total intake so far today.
 * @param wakeTime      HH:mm when the user wakes up.
 * @param sleepTime     HH:mm when the user goes to sleep.
 * @param currentTime   Reference time (defaults to now).
 * @returns Predicted total in mL.
 */
export function predictEndOfDayCompletion(
  consumedML: number,
  wakeTime: string,
  sleepTime: string,
  currentTime: Date = new Date()
): number {
  const wakeMinutes = parseTimeToMinutes(wakeTime);
  const sleepMinutes = parseTimeToMinutes(sleepTime);
  const totalWakeMinutes = sleepMinutes > wakeMinutes
    ? sleepMinutes - wakeMinutes
    : (24 * 60 - wakeMinutes) + sleepMinutes;

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  let elapsedMinutes: number;
  if (currentMinutes >= wakeMinutes) {
    elapsedMinutes = currentMinutes - wakeMinutes;
  } else {
    // After midnight but before sleep
    elapsedMinutes = (24 * 60 - wakeMinutes) + currentMinutes;
  }

  // Clamp elapsed to total wake minutes
  elapsedMinutes = Math.min(elapsedMinutes, totalWakeMinutes);

  if (elapsedMinutes <= 0) return consumedML;

  const ratePerMinute = consumedML / elapsedMinutes;
  return Math.round(ratePerMinute * totalWakeMinutes);
}

/**
 * Calculates the next recommended reminder time from a schedule.
 */
export function nextReminder(
  schedule: ReminderScheduleItem[],
  currentTime: Date = new Date()
): ReminderScheduleItem | null {
  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  for (const item of schedule) {
    const itemMinutes = parseTimeToMinutes(item.time);
    if (itemMinutes > nowMinutes) {
      return item;
    }
  }

  // All reminders have passed — return null
  return null;
}

/**
 * Predicts the expected next drink time based on average interval between entries.
 *
 * @returns HH:mm string or null if insufficient data.
 */
export function expectedNextDrink(
  entries: HydrationEntry[],
  currentTime: Date = new Date()
): string | null {
  if (entries.length < 2) return null;

  // Sort by timestamp ascending
  const sorted = [...entries].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Compute average gap in milliseconds
  let totalGap = 0;
  for (let i = 1; i < sorted.length; i++) {
    totalGap += sorted[i].timestamp.getTime() - sorted[i - 1].timestamp.getTime();
  }
  const avgGapMs = totalGap / (sorted.length - 1);

  const lastEntry = sorted[sorted.length - 1];
  const nextMs = lastEntry.timestamp.getTime() + avgGapMs;
  const nextDate = new Date(Math.max(nextMs, currentTime.getTime()));

  const h = String(nextDate.getHours()).padStart(2, '0');
  const m = String(nextDate.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Alias for predictEndOfDayCompletion — predicts the final intake
 * if the current pace continues until sleepTime.
 */
export function expectedFinalIntake(
  consumedML: number,
  wakeTime: string,
  sleepTime: string,
  currentTime: Date = new Date()
): number {
  return predictEndOfDayCompletion(consumedML, wakeTime, sleepTime, currentTime);
}

/**
 * Estimates the time at which the user will reach their goal if they
 * maintain their current drinking pace.
 *
 * @returns Date representing estimated goal completion, or null if
 *          the pace is zero or goal is already met.
 */
export function estimatedGoalCompletionTime(
  consumedML: number,
  goalML: number,
  wakeTime: string,
  currentTime: Date = new Date()
): Date | null {
  if (consumedML >= goalML) return null;

  const wakeMinutes = parseTimeToMinutes(wakeTime);
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  let elapsedMinutes: number;
  if (currentMinutes >= wakeMinutes) {
    elapsedMinutes = currentMinutes - wakeMinutes;
  } else {
    elapsedMinutes = (24 * 60 - wakeMinutes) + currentMinutes;
  }

  if (elapsedMinutes <= 0 || consumedML <= 0) return null;

  const ratePerMinute = consumedML / elapsedMinutes;
  const remainingML = goalML - consumedML;
  const minutesToGoal = remainingML / ratePerMinute;

  return new Date(currentTime.getTime() + minutesToGoal * 60 * 1000);
}

/**
 * Recommends the optimal next drink amount based on remaining goal
 * and remaining waking hours.
 *
 * Distributes the remaining mL evenly over the remaining reminder slots.
 *
 * @returns Recommended amount in mL (clamped to a minimum of 100 mL).
 */
export function recommendedDrinkAmount(
  consumedML: number,
  goalML: number,
  sleepTime: string,
  intervalMinutes: number,
  currentTime: Date = new Date()
): number {
  const remaining = goalML - consumedML;
  if (remaining <= 0) return 0;

  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  let sleepMin = parseTimeToMinutes(sleepTime);
  if (sleepMin <= nowMinutes) sleepMin += 24 * 60;

  const minutesLeft = sleepMin - nowMinutes;
  if (minutesLeft <= 0) return remaining;

  const slotsLeft = Math.max(1, Math.floor(minutesLeft / intervalMinutes));
  const perSlot = Math.round(remaining / slotsLeft);

  return Math.max(100, perSlot);
}

/**
 * Calculates the probability (0–1) that the user will miss their daily goal.
 *
 * Uses the current pace versus the required pace to finish on time.
 * A risk of 0 means the user is on track; 1 means highly unlikely.
 */
export function riskOfMissingGoal(
  consumedML: number,
  goalML: number,
  wakeTime: string,
  sleepTime: string,
  currentTime: Date = new Date()
): number {
  if (consumedML >= goalML) return 0;

  const predicted = predictEndOfDayCompletion(
    consumedML,
    wakeTime,
    sleepTime,
    currentTime
  );

  if (predicted >= goalML) return 0;

  // Scale risk: how far short we'll be as a fraction of the goal
  const shortfall = goalML - predicted;
  const risk = Math.min(1, shortfall / goalML);
  return Math.round(risk * 100) / 100;
}

/**
 * Measures the short-term "momentum" of hydration by comparing
 * the last-hour intake to the average hourly pace needed.
 *
 * Momentum > 1 means the user is drinking faster than needed.
 * Momentum < 1 means they're falling behind.
 * Momentum = 0 when no entries exist.
 *
 * @param entries         Today's entries.
 * @param goalML          Today's goal.
 * @param wakeTime        HH:mm.
 * @param sleepTime       HH:mm.
 * @param currentTime     Reference time.
 */
export function hydrationMomentum(
  entries: HydrationEntry[],
  goalML: number,
  wakeTime: string,
  sleepTime: string,
  currentTime: Date = new Date()
): number {
  if (entries.length === 0 || goalML <= 0) return 0;

  const wakeMin = parseTimeToMinutes(wakeTime);
  const sleepMin = parseTimeToMinutes(sleepTime);
  const totalWakeMin = sleepMin > wakeMin
    ? sleepMin - wakeMin
    : (24 * 60 - wakeMin) + sleepMin;

  const requiredPerMinute = goalML / totalWakeMin;

  // Intake in the last 60 minutes
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
  const recentEntries = entries.filter((e) => e.timestamp >= oneHourAgo && e.timestamp <= currentTime);
  const recentML = recentEntries.reduce((sum, e) => sum + e.amountML, 0);

  const recentRate = recentML / 60; // mL per minute

  if (requiredPerMinute <= 0) return 0;
  return Math.round((recentRate / requiredPerMinute) * 100) / 100;
}

/**
 * Calculates how consistently the user meets their goal over a range of days.
 *
 * Formula: 1 – (standard deviation of daily completion %) / 100.
 * Returns a score in 0–1 where 1 is perfectly consistent.
 *
 * @param dailyCompletions Array of daily completion percentages (0–100+).
 */
export function consistencyScore(
  dailyCompletions: ReadonlyArray<number>
): number {
  if (dailyCompletions.length < 2) return dailyCompletions.length === 1 ? 1 : 0;

  const mean =
    dailyCompletions.reduce((s, v) => s + v, 0) / dailyCompletions.length;
  const variance =
    dailyCompletions.reduce((s, v) => s + (v - mean) ** 2, 0) /
    dailyCompletions.length;
  const stdDev = Math.sqrt(variance);

  // Normalise: low stdDev → high score
  return Math.max(0, Math.min(1, Math.round((1 - stdDev / 100) * 100) / 100));
}

// ---------------------------------------------------------------------------
// Streak Calculation
// ---------------------------------------------------------------------------

/**
 * Calculates the current consecutive day streak where goal was met.
 */
export function calculateStreak(
  dailySummaries: ReadonlyArray<{ date: string; completionPercent: number }>
): number {
  if (dailySummaries.length === 0) return 0;

  // Sort descending by date
  const sorted = [...dailySummaries].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If the most recent day isn't today or yesterday, streak is broken
  if (sorted[0].date !== todayStr && sorted[0].date !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let currentTarget = new Date(sorted[0].date);

  for (const summary of sorted) {
    const expectedStr = currentTarget.toISOString().split('T')[0];
    if (summary.date === expectedStr && summary.completionPercent >= 100) {
      streak++;
      currentTarget.setDate(currentTarget.getDate() - 1);
    } else if (summary.date === expectedStr) {
      // Date matches but goal not met — streak broken
      break;
    } else {
      break;
    }
  }

  return streak;
}

// ---------------------------------------------------------------------------
// Day Summary Builder
// ---------------------------------------------------------------------------

/**
 * Generates a complete day summary from a set of entries and a goal.
 */
export function generateDaySummary(
  date: string,
  entries: HydrationEntry[],
  goalML: number,
  currentStreak: number
): HydrationDaySummary {
  const consumed = calculateTodayTotal(entries);
  const completion = completionPercent(consumed, goalML);
  const remaining = remainingWater(consumed, goalML);
  const amounts = entries.map((e) => e.amountML);

  return {
    date,
    consumedML: consumed,
    goalML,
    completionPercent: completion,
    remainingML: remaining,
    drinksCount: entries.length,
    largestDrink: amounts.length > 0 ? Math.max(...amounts) : 0,
    averageDrink: amounts.length > 0 ? Math.round(consumed / amounts.length) : 0,
    streak: currentStreak,
    status: hydrationStatus(completion),
  };
}

// ---------------------------------------------------------------------------
// Drink Type Aggregation
// ---------------------------------------------------------------------------

/**
 * Aggregates total mL consumed by drink type.
 */
export function aggregateDrinkTypes(
  entries: HydrationEntry[]
): Record<DrinkType, number> {
  const breakdown: Record<DrinkType, number> = {
    water: 0,
    electrolyte: 0,
    tea: 0,
    coffee: 0,
    milk: 0,
    juice: 0,
    other: 0,
  };

  for (const entry of entries) {
    const key = entry.drinkType in breakdown ? entry.drinkType : 'other';
    breakdown[key] += entry.amountML;
  }

  return breakdown;
}

/**
 * Calculates the effective hydration from entries by applying drink type factors.
 *
 * Effective hydration accounts for the diuretic effects of caffeinated drinks
 * and the enhanced absorption from electrolyte drinks.
 */
export function calculateEffectiveHydration(
  entries: HydrationEntry[]
): number {
  let total = 0;
  for (const entry of entries) {
    const option = DRINK_TYPE_OPTIONS.find((o) => o.value === entry.drinkType);
    const factor = option?.hydrationFactor ?? 1.0;
    total += entry.amountML * factor;
  }
  return Math.round(total);
}

// ---------------------------------------------------------------------------
// Peak Hour Calculation
// ---------------------------------------------------------------------------

/**
 * Finds the hour of the day (0–23) with the highest total intake.
 */
export function calculatePeakHour(entries: HydrationEntry[]): number {
  const hourlyTotals = new Array(24).fill(0) as number[];

  for (const entry of entries) {
    const hour = entry.timestamp.getHours();
    hourlyTotals[hour] += entry.amountML;
  }

  let maxHour = 0;
  let maxAmount = 0;
  for (let h = 0; h < 24; h++) {
    if (hourlyTotals[h] > maxAmount) {
      maxAmount = hourlyTotals[h];
      maxHour = h;
    }
  }

  return maxHour;
}

// ---------------------------------------------------------------------------
// Hydration Score — Legacy (0–10, single number)
// ---------------------------------------------------------------------------

/**
 * Calculates a composite hydration score on a 0–10 scale (legacy API).
 *
 * Factors: completion %, consistency (streak), variety.
 */
export function calculateHydrationScore(
  completionPct: number,
  streak: number,
  drinkVariety: number
): number {
  // Completion: 70% weight, max 7 points
  const completionScore = Math.min(7, (completionPct / 100) * 7);
  // Streak: 20% weight, max 2 points (scaled to 14 days)
  const streakScore = Math.min(2, (streak / 14) * 2);
  // Variety: 10% weight, max 1 point (using 3+ types = full score)
  const varietyScore = Math.min(1, (drinkVariety / 3) * 1);

  return Math.round((completionScore + streakScore + varietyScore) * 10) / 10;
}

// ---------------------------------------------------------------------------
// Hydration Score — Rich (HydrationScore model)
// ---------------------------------------------------------------------------

/**
 * Calculates the multi-dimensional HydrationScore from today's entries.
 *
 * Each sub-score is 0–10. The overall score is a weighted aggregate:
 *   goalAchievement   × 0.35
 *   consistency        × 0.25
 *   timing             × 0.15
 *   drinkDistribution  × 0.15
 *   hydrationQuality   × 0.10
 *
 * @param entries         Entries for the scoring window.
 * @param goalML          The daily goal in mL.
 * @param streak          Current streak count.
 * @param wakeTime        HH:mm.
 * @param sleepTime       HH:mm.
 */
export function calculateDetailedHydrationScore(
  entries: HydrationEntry[],
  goalML: number,
  streak: number,
  wakeTime: string,
  sleepTime: string
): HydrationScore {
  const consumed = calculateTodayTotal(entries);
  const effective = calculateEffectiveHydration(entries);

  // 1. Goal Achievement (0–10)
  const goalAchievement = Math.min(10, (consumed / Math.max(1, goalML)) * 10);

  // 2. Consistency (0–10) — based on streak, scaled to 14 days
  const consistencyVal = Math.min(10, (streak / 14) * 10);

  // 3. Timing (0–10) — how evenly spread intake is across waking hours
  const timing = calculateTimingScore(entries, wakeTime, sleepTime);

  // 4. Drink Distribution (0–10) — diversity of drink types
  const uniqueTypes = new Set(entries.map((e) => e.drinkType)).size;
  const drinkDistribution = Math.min(10, (uniqueTypes / 3) * 10);

  // 5. Hydration Quality (0–10) — effective vs raw intake
  const qualityRatio = consumed > 0 ? effective / consumed : 1;
  const hydrationQuality = Math.min(10, qualityRatio * 10);

  // Weighted overall
  const w = HYDRATION_SCORE_WEIGHTS;
  const overall =
    goalAchievement * w.goalAchievement +
    consistencyVal * w.consistency +
    timing * w.timing +
    drinkDistribution * w.drinkDistribution +
    hydrationQuality * w.hydrationQuality;

  return {
    overall: Math.round(overall * 10) / 10,
    timing: Math.round(timing * 10) / 10,
    consistency: Math.round(consistencyVal * 10) / 10,
    goalAchievement: Math.round(goalAchievement * 10) / 10,
    drinkDistribution: Math.round(drinkDistribution * 10) / 10,
    hydrationQuality: Math.round(hydrationQuality * 10) / 10,
  };
}

/**
 * Scores how evenly intake is spread across waking hours (0–10).
 *
 * Uses the coefficient of variation (CV) of hourly totals within the
 * wake window. Lower CV → higher score (more even distribution).
 */
function calculateTimingScore(
  entries: HydrationEntry[],
  wakeTime: string,
  sleepTime: string
): number {
  if (entries.length < 2) return entries.length === 1 ? 5 : 0;

  const wakeHour = Math.floor(parseTimeToMinutes(wakeTime) / 60);
  const sleepHour = Math.floor(parseTimeToMinutes(sleepTime) / 60);

  const hourlyTotals = new Array(24).fill(0) as number[];
  for (const e of entries) {
    hourlyTotals[e.timestamp.getHours()] += e.amountML;
  }

  // Extract only the waking hours
  const wakeHours: number[] = [];
  if (sleepHour > wakeHour) {
    for (let h = wakeHour; h < sleepHour; h++) wakeHours.push(hourlyTotals[h]);
  } else {
    for (let h = wakeHour; h < 24; h++) wakeHours.push(hourlyTotals[h]);
    for (let h = 0; h < sleepHour; h++) wakeHours.push(hourlyTotals[h]);
  }

  if (wakeHours.length === 0) return 0;

  const mean = wakeHours.reduce((s, v) => s + v, 0) / wakeHours.length;
  if (mean === 0) return 0;

  const variance =
    wakeHours.reduce((s, v) => s + (v - mean) ** 2, 0) / wakeHours.length;
  const cv = Math.sqrt(variance) / mean;

  // cv of 0 → perfect timing (10), cv of 2+ → poor timing (0)
  return Math.max(0, Math.min(10, Math.round((1 - cv / 2) * 10 * 10) / 10));
}

// ---------------------------------------------------------------------------
// Utility: Time Parsing
// ---------------------------------------------------------------------------

/**
 * Converts a "HH:mm" string to total minutes since midnight.
 */
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}
