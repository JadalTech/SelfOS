/**
 * Presentation Mappers for Insights Engine
 * SelfOS v1.5.0 — Batch 12B
 */

import type {
  HealthScore,
  Insight,
  Correlation,
  Trend,
  HabitPattern,
  HealthRecommendation,
  Prediction,
} from '../../types/insights.types';

export class HealthScoreMapper {
  static toVM(score: HealthScore) {
    return {
      overallScoreLabel: `${score.overallScore}/10`,
      gradeLabel: `Grade ${score.grade}`,
      trendLabel: score.trend === 'improving' ? 'Improving Pace' : score.trend === 'declining' ? 'Declining' : 'Stable Target',
      confidenceLabel: `${Math.round(score.confidence * 100)}% Confidence`,
      nutritionLabel: `${score.nutrition.score}/10`,
      workoutLabel: `${score.workout.score}/10`,
      sleepLabel: `${score.sleep.score}/10`,
      hydrationLabel: `${score.hydration.score}/10`,
    };
  }
}

export class InsightMapper {
  static toVM(insight: Insight) {
    return {
      id: insight.id,
      title: insight.title,
      description: insight.description,
      categoryLabel: insight.category,
      severityColor: insight.severity === 'critical' ? '#FF4D4D' : insight.severity === 'warning' ? '#FFA500' : '#4CAF50',
      priorityLabel: `${insight.priority.toUpperCase()} priority`,
      dateLabel: new Date(insight.generatedAt).toLocaleDateString(),
    };
  }
}

export class CorrelationMapper {
  static toVM(corr: Correlation) {
    return {
      title: `${corr.moduleA.toUpperCase()} ↔ ${corr.moduleB.toUpperCase()}`,
      strengthPercent: `${Math.round(corr.strength * 100)}%`,
      confidenceLabel: `${Math.round(corr.confidence * 100)}% confidence`,
      explanation: corr.explanation,
    };
  }
}

export class TrendMapper {
  static toVM(trend: Trend) {
    return {
      metricName: trend.metric.replace('-', ' ').toUpperCase(),
      directionLabel: trend.direction.toUpperCase(),
      changeLabel: `${trend.percentageChange > 0 ? '+' : ''}${trend.percentageChange}%`,
      baselineLabel: `vs ${trend.comparisonBaseline} baseline`,
    };
  }
}

export class HabitMapper {
  static toVM(habit: HabitPattern) {
    return {
      name: habit.habitName,
      consistencyLabel: `${Math.round(habit.consistency * 100)}% Consistency`,
      scoreLabel: `${habit.score}/10`,
      pattern: habit.detectedPattern,
      recommendation: habit.recommendation,
    };
  }
}

export class RecommendationMapper {
  static toVM(rec: HealthRecommendation) {
    return {
      description: rec.description,
      impact: `Impact: ${rec.expectedImpact}`,
      priority: rec.priority.toUpperCase(),
      category: rec.category,
      sourceLabel: `Source: ${rec.source.toUpperCase()}`,
    };
  }
}

export class PredictionMapper {
  static toVM(pred: Prediction) {
    return {
      type: pred.predictionType.replace('-', ' ').toUpperCase(),
      confidenceLabel: `${Math.round(pred.confidence * 100)}%`,
      projectedValueLabel: `${pred.projectedValue} score`,
      dateLabel: `Target: ${pred.targetDate}`,
      trajectoryLabel: `Wellness Trajectory: ${pred.wellnessTrajectory.toUpperCase()}`,
    };
  }
}
