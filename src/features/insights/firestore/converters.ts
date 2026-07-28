/**
 * Firestore Converters for Insights Engine
 * SelfOS v1.5.0 — Batch 12A
 */

import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore';
import type { HealthScore, Insight, HealthRecommendation, Prediction } from '../types/insights.types';

export const healthScoreConverter = {
  toFirestore(score: WithFieldValue<HealthScore>): DocumentData {
    return {
      userId: score.userId,
      overallScore: score.overallScore,
      nutrition: score.nutrition,
      workout: score.workout,
      sleep: score.sleep,
      hydration: score.hydration,
      trend: score.trend,
      grade: score.grade,
      confidence: score.confidence,
      calculatedAt: score.calculatedAt instanceof Date ? Timestamp.fromDate(score.calculatedAt) : Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): HealthScore {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      overallScore: data.overallScore ?? 0,
      nutrition: data.nutrition,
      workout: data.workout,
      sleep: data.sleep,
      hydration: data.hydration,
      trend: data.trend || 'stable',
      grade: data.grade || 'F',
      confidence: data.confidence ?? 0.5,
      calculatedAt: data.calculatedAt instanceof Timestamp ? data.calculatedAt.toDate() : new Date(),
    };
  },
};

export const insightConverter = {
  toFirestore(insight: WithFieldValue<Insight>): DocumentData {
    return {
      userId: insight.userId,
      title: insight.title,
      description: insight.description,
      category: insight.category,
      severity: insight.severity,
      status: insight.status,
      priority: insight.priority,
      confidenceMetadata: insight.confidenceMetadata,
      sourceModules: insight.sourceModules,
      generatedAt: insight.generatedAt instanceof Date ? Timestamp.fromDate(insight.generatedAt) : Timestamp.now(),
      expiresAt: insight.expiresAt instanceof Date ? Timestamp.fromDate(insight.expiresAt) : Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Insight {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      title: data.title || '',
      description: data.description || '',
      category: data.category || 'Recovery',
      severity: data.severity || 'info',
      status: data.status || 'active',
      priority: data.priority || 'medium',
      confidenceMetadata: data.confidenceMetadata,
      sourceModules: data.sourceModules || [],
      generatedAt: data.generatedAt instanceof Timestamp ? data.generatedAt.toDate() : new Date(),
      expiresAt: data.expiresAt instanceof Timestamp ? data.expiresAt.toDate() : new Date(),
    };
  },
};

export const predictionConverter = {
  toFirestore(pred: WithFieldValue<Prediction>): DocumentData {
    return {
      userId: pred.userId,
      predictionType: pred.predictionType,
      confidence: pred.confidence,
      projectedValue: pred.projectedValue,
      targetDate: pred.targetDate,
      assumptions: pred.assumptions,
      habitMomentum: pred.habitMomentum,
      recoveryScorePrediction: pred.recoveryScorePrediction,
      riskProbability: pred.riskProbability,
      consistencyForecast: pred.consistencyForecast,
      wellnessTrajectory: pred.wellnessTrajectory,
      calculatedAt: pred.calculatedAt instanceof Date ? Timestamp.fromDate(pred.calculatedAt) : Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Prediction {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      predictionType: data.predictionType || '',
      confidence: data.confidence ?? 0.5,
      projectedValue: data.projectedValue ?? 0,
      targetDate: data.targetDate || '',
      assumptions: data.assumptions || [],
      habitMomentum: data.habitMomentum ?? 0.5,
      recoveryScorePrediction: data.recoveryScorePrediction ?? 50,
      riskProbability: data.riskProbability ?? 0.1,
      consistencyForecast: data.consistencyForecast ?? 0.5,
      wellnessTrajectory: data.wellnessTrajectory || 'stable',
      calculatedAt: data.calculatedAt instanceof Timestamp ? data.calculatedAt.toDate() : new Date(),
    };
  },
};
