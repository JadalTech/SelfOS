"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepGoalSchema = exports.sleepScheduleSchema = exports.sleepEntrySchema = exports.sleepQualitySchema = void 0;
const zod_1 = require("zod");
// Time string regex format (HH:MM)
const timeStringSchema = zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Must be in HH:MM format');
// Date string regex format (YYYY-MM-DD)
const dateStringSchema = zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format');
exports.sleepQualitySchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1, 'Rating must be at least 1').max(10, 'Rating cannot exceed 10'),
    efficiencyPercentage: zod_1.z.number().min(0).max(100).optional(),
    deepSleepMinutes: zod_1.z.number().nonnegative().optional(),
    remSleepMinutes: zod_1.z.number().nonnegative().optional(),
    lightSleepMinutes: zod_1.z.number().nonnegative().optional(),
    awakeMinutes: zod_1.z.number().nonnegative().optional(),
});
exports.sleepEntrySchema = zod_1.z.object({
    date: dateStringSchema,
    bedtime: zod_1.z.date({ message: 'Bedtime is required' }),
    wakeTime: zod_1.z.date({ message: 'Wake-up time is required' }),
    quality: exports.sleepQualitySchema,
    notes: zod_1.z.string().trim().optional(),
    timezone: zod_1.z.string().trim().optional(),
    sleepSource: zod_1.z.enum(['manual', 'wearable', 'imported']).default('manual'),
    sleepEfficiency: zod_1.z.number().min(0).max(100).optional(),
    sleepLatency: zod_1.z.number().nonnegative().optional(),
    awakeDuration: zod_1.z.number().nonnegative().optional(),
    interruptionsCount: zod_1.z.number().int().nonnegative().optional(),
    tags: zod_1.z.array(zod_1.z.string().trim()).optional(),
}).refine((data) => data.wakeTime > data.bedtime, {
    message: 'Wake-up time must be after bedtime',
    path: ['wakeTime'],
});
exports.sleepScheduleSchema = zod_1.z.object({
    targetBedtime: timeStringSchema,
    targetWakeTime: timeStringSchema,
    targetDurationMinutes: zod_1.z.number().int().positive('Target duration must be positive'),
    weekdayBedtime: timeStringSchema,
    weekdayWakeTime: timeStringSchema,
    weekendBedtime: timeStringSchema,
    weekendWakeTime: timeStringSchema,
    isActive: zod_1.z.boolean().default(true),
    effectiveFrom: dateStringSchema,
    effectiveUntil: dateStringSchema.optional(),
});
exports.sleepGoalSchema = zod_1.z.object({
    category: zod_1.z.enum(['duration', 'bedtime', 'wake_time', 'consistency', 'recovery']),
    targetValue: zod_1.z.number().nonnegative('Target value must be non-negative'),
    targetTime: timeStringSchema.optional(),
    isActive: zod_1.z.boolean().default(true),
}).refine((data) => {
    if ((data.category === 'bedtime' || data.category === 'wake_time') && !data.targetTime) {
        return false;
    }
    return true;
}, {
    message: 'Target time is required for bedtime and wake-up time goals',
    path: ['targetTime'],
});
