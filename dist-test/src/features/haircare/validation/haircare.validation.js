"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hairConditionSchema = exports.hairPhotoUploadSchema = exports.hairLogSchema = exports.hairRoutineSchema = exports.hairProductSchema = void 0;
const zod_1 = require("zod");
exports.hairProductSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Product name must be at least 2 characters'),
    brand: zod_1.z.string().trim().min(1, 'Brand name is required'),
    category: zod_1.z.enum([
        'shampoo',
        'conditioner',
        'oil',
        'serum',
        'mask',
        'treatment',
        'custom',
    ]),
    isFavorite: zod_1.z.boolean(),
    isActive: zod_1.z.boolean(),
    notes: zod_1.z.string().trim().optional(),
});
exports.hairRoutineSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(2, 'Routine title must be at least 2 characters'),
    haircareCategory: zod_1.z.enum([
        'wash-day',
        'oiling',
        'scalp-massage',
        'deep-conditioning',
        'custom',
    ]),
    productIds: zod_1.z.array(zod_1.z.string()).min(1, 'Select at least one product for this routine'),
    frequency: zod_1.z.enum(['daily', 'weekly', 'monthly', 'custom']),
    daysOfWeek: zod_1.z.array(zod_1.z.number().min(0).max(6)).optional(),
    reminderTime: zod_1.z.string().optional(),
    instructions: zod_1.z.string().trim().optional(),
});
exports.hairLogSchema = zod_1.z.object({
    hairRoutineId: zod_1.z.string().min(1, 'Select a hair routine'),
    appliedProductIds: zod_1.z.array(zod_1.z.string()).min(1, 'Select at least one applied product'),
    notes: zod_1.z.string().trim().optional(),
});
exports.hairPhotoUploadSchema = zod_1.z.object({
    imageUri: zod_1.z.string().min(1, 'Please select or capture a photo'),
    captureDate: zod_1.z.string().min(1, 'Capture date is required'),
    angle: zod_1.z.enum(['front', 'back', 'crown', 'left', 'right', 'hairline']),
    notes: zod_1.z.string().trim().optional(),
});
exports.hairConditionSchema = zod_1.z.object({
    recordDate: zod_1.z.string().min(1, 'Record date is required'),
    hairType: zod_1.z.enum(['straight', 'wavy', 'curly', 'coily']),
    porosity: zod_1.z.enum(['low', 'medium', 'high', 'unknown']),
    scalpType: zod_1.z.enum(['dry', 'normal', 'oily', 'combination', 'sensitive']),
    hairDensity: zod_1.z.enum(['thin', 'medium', 'thick']),
    sheddingLevel: zod_1.z.number().min(1).max(5),
    dandruffLevel: zod_1.z.number().min(1).max(5),
    itchinessLevel: zod_1.z.number().min(1).max(5),
    oilinessLevel: zod_1.z.number().min(1).max(5),
    drynessLevel: zod_1.z.number().min(1).max(5),
    breakageLevel: zod_1.z.number().min(1).max(5),
    frizzLevel: zod_1.z.number().min(1).max(5),
    shineLevel: zod_1.z.number().min(1).max(5),
    overallHealth: zod_1.z.number().min(1).max(10),
    stressLevel: zod_1.z.number().min(1).max(5).optional(),
    sleepHours: zod_1.z.number().min(0).max(24).optional(),
    waterIntakeLiters: zod_1.z.number().min(0).max(10).optional(),
    notes: zod_1.z.string().trim().optional(),
});
