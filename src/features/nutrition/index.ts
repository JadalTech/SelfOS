/**
 * Nutrition Module Public API Barrel Export
 */

export * from './types';
export * from './constants/nutrition.constants';
export * from './validation/nutrition.validation';
export * from './engine/nutritionEngine';
export * from './analytics/utils/nutritionAnalytics';
export * from './repository/contracts';
export * from './repository/nutrition.repository';
export * from './mappers/nutrition.mapper';
export * from './hooks/queryKeys';
export * from './hooks/useNutrition';

// Presentation Layer
export * from './presentation/screens';
export * from './presentation/forms';
export * from './presentation/layouts';

// AI Layer
export * from './ai/types';
export * from './ai/providers';
export * from './ai/repository/nutritionAIRepository';
export * from './ai/hooks/useNutritionCoach';
