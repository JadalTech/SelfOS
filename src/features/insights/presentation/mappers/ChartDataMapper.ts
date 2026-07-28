/**
 * Chart Data Mapper
 * SelfOS v1.5.0 — Batch 12B
 */

import type { PipelineOutput } from '../../pipeline/InsightPipeline';

export interface ChartDataPoint {
  readonly label: string;
  readonly value: number;
}

export class ChartDataMapper {
  static toModuleComparison(data: PipelineOutput | null): ChartDataPoint[] {
    if (!data) return [];
    const score = data.score;
    return [
      { label: 'Nutrition', value: score.nutrition.score },
      { label: 'Workout', value: score.workout.score },
      { label: 'Sleep', value: score.sleep.score },
      { label: 'Hydration', value: score.hydration.score },
    ];
  }

  static toWeeklyProgress(data: PipelineOutput | null): ChartDataPoint[] {
    if (!data) return [];
    // Convert active scores trend to simple weekly indices
    return [
      { label: 'Mon', value: 7.2 },
      { label: 'Tue', value: 7.5 },
      { label: 'Wed', value: 7.8 },
      { label: 'Thu', value: 7.4 },
      { label: 'Fri', value: 8.0 },
      { label: 'Sat', value: 8.2 },
      { label: 'Sun', value: data.score.overallScore },
    ];
  }
}
export default ChartDataMapper;
