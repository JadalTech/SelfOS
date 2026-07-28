/**
 * Forecasting Engine
 * SelfOS v3.3.0 — Batch 14D
 */

import type { Forecast } from '../domain/intelligence.types';
import { ForecastConfidenceEngine } from './ForecastConfidenceEngine';

export class ForecastEngine {
  static predictGoalCompletion(activeGoalsCount: number, completionVelocity: number, dataPoints = 8): Forecast {
    const confidence = ForecastConfidenceEngine.computeConfidence(dataPoints);
    const predictedValue = completionVelocity > 0 ? Math.round(activeGoalsCount / completionVelocity) : 30;

    let burnoutRisk: 'low' | 'moderate' | 'high' = 'low';
    if (activeGoalsCount > 10 && completionVelocity < 0.5) {
      burnoutRisk = 'high';
    } else if (activeGoalsCount > 6) {
      burnoutRisk = 'moderate';
    }

    return {
      id: `fc_${Date.now()}`,
      type: 'forecast',
      title: 'Goal Completion Velocity Forecast',
      description: `Estimated completion in ${predictedValue} days.`,
      targetMetric: 'days_to_complete_goals',
      predictedValue,
      confidence,
      burnoutRisk,
      timestamp: new Date(),
    };
  }
}
export default ForecastEngine;
