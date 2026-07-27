"use strict";
/**
 * Nutrition Query Keys Factory for React Query
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nutritionKeys = void 0;
exports.nutritionKeys = {
    all: ['nutrition'],
    foods: () => [...exports.nutritionKeys.all, 'foods'],
    foodSearch: (searchTerm) => [...exports.nutritionKeys.foods(), { searchTerm }],
    logs: () => [...exports.nutritionKeys.all, 'logs'],
    logByDate: (date) => [...exports.nutritionKeys.logs(), { date }],
    goals: () => [...exports.nutritionKeys.all, 'goals'],
    templates: () => [...exports.nutritionKeys.all, 'templates'],
    analytics: () => [...exports.nutritionKeys.all, 'analytics'],
};
