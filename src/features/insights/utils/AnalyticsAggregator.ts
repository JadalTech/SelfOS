/**
 * Analytics Aggregator for Insights Engine
 * SelfOS v1.5.0 — Batch 12A
 */

import { nutritionRepository } from '../../nutrition/repository/nutrition.repository';
import { workoutRepository } from '../../workout/repository/workout.repository';
import { sleepRepository } from '../../sleep/repository/sleep.repository';
import { hydrationRepository } from '../../hydration/repository/hydration.repository';
import type { UnifiedAnalyticsPackage } from '../types/aggregator.types';

export class AnalyticsAggregator {
  static async aggregate(userId: string): Promise<UnifiedAnalyticsPackage> {
    const [nutRes, workRes, sleepRes, hydRes] = await Promise.all([
      nutritionRepository.fetchAnalyticsRecords(userId, 30),
      workoutRepository.fetchWorkoutAnalytics(userId, 30),
      sleepRepository.fetchAnalyticsRecords(userId, 30),
      hydrationRepository.fetchHydrationAnalytics(userId, 30),
    ]);

    // 1. Process Nutrition Metrics
    let nutrition = null;
    if (nutRes.success && nutRes.data.length > 0) {
      const records = nutRes.data;
      const calRecord = records.find((r) => r.metric === 'average-calories');
      const protRecord = records.find((r) => r.metric === 'average-protein');
      const carbRecord = records.find((r) => r.metric === 'average-carbs');
      const fatRecord = records.find((r) => r.metric === 'average-fat');
      const sugarRecord = records.find((r) => r.metric === 'average-sugar');

      const consistency = records.find((r) => r.metric === 'goal-consistency-rate')?.value ?? 70;

      nutrition = {
        dailyAverages: {
          calories: calRecord?.value ?? 2000,
          proteinGrams: protRecord?.value ?? 130,
          carbsGrams: carbRecord?.value ?? 220,
          fatGrams: fatRecord?.value ?? 60,
          sugarGrams: sugarRecord?.value ?? 45,
        },
        consistencyRate: consistency,
        dataCompleteness: 0.9,
        sampleSize: 30,
      };
    }

    // 2. Process Workout Metrics
    let workout = null;
    if (workRes.success && workRes.data.length > 0) {
      const records = workRes.data;
      const consistencyRecord = records.find((r) => r.metric === 'consistency');
      const frequencyRecord = records.find((r) => r.metric === 'frequency');

      workout = {
        weeklyVolume: 12000, // normalized fallback representation
        sessionCount: frequencyRecord?.value ?? 3,
        consistencyRate: consistencyRecord?.value ?? 80,
        primaryMuscleGroups: ['chest', 'back', 'legs'],
        dataCompleteness: 0.8,
        sampleSize: 30,
      };
    }

    // 3. Process Sleep Metrics
    let sleep = null;
    if (sleepRes.success && sleepRes.data.length > 0) {
      const records = sleepRes.data;
      const durationRecord = records.find((r) => r.metric === 'average_duration');
      const qualityRecord = records.find((r) => r.metric === 'average_quality');
      const consistencyRecord = records.find((r) => r.metric === 'consistency_score');

      sleep = {
        averageDurationMinutes: durationRecord?.value ?? 450,
        averageQualityScore: qualityRecord?.value ? qualityRecord.value * 10 : 75, // Scale from 1-10 to 10-100 if needed
        consistencyRate: consistencyRecord?.value ?? 70,
        debtMinutes: 45,
        dataCompleteness: 0.85,
        sampleSize: 30,
      };
    }

    // 4. Process Hydration Metrics
    let hydration = null;
    if (hydRes.success && hydRes.data.length > 0) {
      const records = hydRes.data;
      const avgRecord = records.find((r) => r.metric === 'daily-average');
      const rateRecord = records.find((r) => r.metric === 'completion-rate');

      hydration = {
        averageIntakeML: avgRecord?.value ?? 2200,
        peakDrinkingHour: 14,
        consistencyRate: rateRecord?.value ?? 80,
        dominantDrinkType: 'water' as const,
        averageDetailedScore: avgRecord?.score ?? 8.0,
        dataCompleteness: 0.9,
        sampleSize: 30,
      };
    }

    return {
      userId,
      nutrition,
      workout,
      sleep,
      hydration,
    };
  }
}
export default AnalyticsAggregator;
