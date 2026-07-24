"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skincareKeys = void 0;
exports.skincareKeys = {
    all: ['skincare'],
    products: () => [...exports.skincareKeys.all, 'products'],
    productById: (id) => [...exports.skincareKeys.products(), id],
    routines: () => [...exports.skincareKeys.all, 'routines'],
    routineById: (id) => [...exports.skincareKeys.routines(), id],
    logs: () => [...exports.skincareKeys.all, 'logs'],
    assessments: () => [...exports.skincareKeys.all, 'assessments'],
    latestAssessment: () => [...exports.skincareKeys.assessments(), 'latest'],
    photos: () => [...exports.skincareKeys.all, 'photos'],
    reminders: () => [...exports.skincareKeys.all, 'reminders'],
    dashboard: () => [...exports.skincareKeys.all, 'dashboard'],
    analytics: () => [...exports.skincareKeys.all, 'analytics'],
    ai: () => [...exports.skincareKeys.all, 'ai'],
};
