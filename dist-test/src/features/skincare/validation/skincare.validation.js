"use strict";
/**
 * Skincare Validation Schemas (Zod)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.skinReminderSchema = exports.progressPhotoUploadSchema = exports.skinAssessmentSchema = exports.skincareLogSchema = exports.skincareRoutineSchema = exports.routineStepSchema = exports.skincareProductSchema = void 0;
const zod_1 = require("zod");
exports.skincareProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Product name is required').max(100, 'Product name must be less than 100 characters'),
    brand: zod_1.z.string().min(1, 'Brand name is required').max(100, 'Brand name must be less than 100 characters'),
    category: zod_1.z.enum([
        'cleanser',
        'toner',
        'essence',
        'serum',
        'ampoule',
        'moisturizer',
        'sunscreen',
        'exfoliant',
        'mask',
        'eye-cream',
        'spot-treatment',
        'face-oil',
        'mist',
    ]),
    type: zod_1.z.enum([
        'liquid',
        'cream',
        'gel',
        'foam',
        'serum',
        'oil',
        'balm',
        'sheet',
        'powder',
    ]),
    keyIngredients: zod_1.z.array(zod_1.z.string()),
    openedDate: zod_1.z.string().optional(),
    shelfLifeMonths: zod_1.z.number().min(1).max(60).optional(),
    isFavorite: zod_1.z.boolean(),
    notes: zod_1.z.string().max(500, 'Notes must be under 500 characters').optional(),
});
exports.routineStepSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Product selection is required'),
    stepOrder: zod_1.z.number().min(1),
    timeOfDay: zod_1.z.enum(['morning', 'evening', 'both', 'weekly-special']),
    waitTimeMinutes: zod_1.z.number().min(0).max(60).optional(),
    instructions: zod_1.z.string().max(200).optional(),
    isOptional: zod_1.z.boolean().optional(),
});
exports.skincareRoutineSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Routine title is required').max(100),
    timeOfDay: zod_1.z.enum(['morning', 'evening', 'both', 'weekly-special']),
    steps: zod_1.z.array(exports.routineStepSchema).min(1, 'At least one step is required'),
    targetedConcerns: zod_1.z.array(zod_1.z.enum([
        'acne',
        'aging',
        'hyperpigmentation',
        'dryness',
        'redness',
        'texture',
        'dark-circles',
        'dullness',
        'enlarged-pores',
        'barrier-damage',
    ])),
    frequency: zod_1.z.enum(['daily', 'weekly', 'biweekly', 'custom']),
});
exports.skincareLogSchema = zod_1.z.object({
    skincareRoutineId: zod_1.z.string().min(1, 'Routine selection is required'),
    coreRoutineId: zod_1.z.string().min(1, 'Core routine ID is required'),
    dateStr: zod_1.z.string().min(1, 'Date is required'),
    timeStr: zod_1.z.string().min(1, 'Time is required'),
    completedStepIds: zod_1.z.array(zod_1.z.string()),
    skippedStepIds: zod_1.z.array(zod_1.z.string()),
    appliedProductIds: zod_1.z.array(zod_1.z.string()),
    weather: zod_1.z.enum(['sunny', 'humid', 'dry', 'cold', 'hot', 'rainy', 'cloudy']).optional(),
    uvIndex: zod_1.z.number().min(0).max(15).optional(),
    skinFeeling: zod_1.z.number().min(1).max(5).optional(),
    notes: zod_1.z.string().max(500).optional(),
});
exports.skinAssessmentSchema = zod_1.z.object({
    recordDate: zod_1.z.string().min(1, 'Record date is required'),
    skinType: zod_1.z.enum(['dry', 'oily', 'combination', 'normal', 'sensitive']),
    concerns: zod_1.z.array(zod_1.z.enum([
        'acne',
        'aging',
        'hyperpigmentation',
        'dryness',
        'redness',
        'texture',
        'dark-circles',
        'dullness',
        'enlarged-pores',
        'barrier-damage',
    ])),
    severityMap: zod_1.z.record(zod_1.z.string(), zod_1.z.number().min(1).max(5)),
    overallHealthScore: zod_1.z.number().min(1).max(10),
    hydrationLevel: zod_1.z.number().min(1).max(5),
    sensitivityLevel: zod_1.z.number().min(1).max(5),
    oilinessLevel: zod_1.z.number().min(1).max(5),
    barrierHealthScore: zod_1.z.number().min(1).max(5),
    sleepHours: zod_1.z.number().min(0).max(24).optional(),
    stressLevel: zod_1.z.number().min(1).max(5).optional(),
    notes: zod_1.z.string().max(500).optional(),
});
exports.progressPhotoUploadSchema = zod_1.z.object({
    photoUri: zod_1.z.string().min(1, 'Photo URI is required'),
    date: zod_1.z.string().min(1, 'Date is required'),
    timeOfDay: zod_1.z.enum(['morning', 'evening', 'both', 'weekly-special']),
    angle: zod_1.z.enum(['front', 'left-profile', 'right-profile', 'close-up']),
    lightingCondition: zod_1.z.string().max(100).optional(),
    notes: zod_1.z.string().max(500).optional(),
});
exports.skinReminderSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(100),
    time: zod_1.z.string().min(1, 'Time is required'),
    reminderType: zod_1.z.enum([
        'morning-routine',
        'evening-routine',
        'sunscreen-reapply',
        'weekly-exfoliation',
        'assessment-checkin',
    ]),
    frequency: zod_1.z.enum(['daily', 'weekly', 'biweekly', 'custom']),
    daysOfWeek: zod_1.z.array(zod_1.z.number().min(0).max(6)).optional(),
    isEnabled: zod_1.z.boolean(),
});
