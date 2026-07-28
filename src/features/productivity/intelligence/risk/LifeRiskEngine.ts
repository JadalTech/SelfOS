/**
 * Life Risk Engine
 * SelfOS v3.3.0 — Batch 14D
 */

export interface LifeRiskAlert {
  readonly riskType: 'sleep_deprivation' | 'burnout' | 'over_scheduling';
  readonly severity: 'low' | 'medium' | 'high';
  readonly recommendation: string;
}

export class LifeRiskEngine {
  static evaluateRisks(sleepQuality?: number, activeTasksCount = 0): LifeRiskAlert[] {
    const alerts: LifeRiskAlert[] = [];

    if (sleepQuality !== undefined && sleepQuality < 50) {
      alerts.push({
        riskType: 'sleep_deprivation',
        severity: 'high',
        recommendation: 'Reduce deep work load today and advance bedtime by 45 mins.',
      });
    }

    if (activeTasksCount > 15) {
      alerts.push({
        riskType: 'over_scheduling',
        severity: 'medium',
        recommendation: 'Delegate or defer non-urgent tasks to prevent burnout.',
      });
    }

    return alerts;
  }
}
export default LifeRiskEngine;
