"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routineFormSchema = exports.routineScheduleSchema = exports.routineReminderSchema = void 0;
const zod_1 = require("zod");
const routineTypeSchema = zod_1.z.enum([
    'haircare',
    'skincare',
    'water',
    'nutrition',
    'gym',
    'sleep',
    'medication',
    'custom',
]);
const routineFrequencySchema = zod_1.z.enum(['daily', 'weekly', 'monthly', 'custom']);
const routineStatusSchema = zod_1.z.enum(['draft', 'active', 'paused', 'archived']);
/** Validates date format (YYYY-MM-DD) */
const dateStringSchema = zod_1.z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');
/** Validates 24-hour time format (HH:mm) */
const timeStringSchema = zod_1.z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in 24h format (HH:mm)');
exports.routineReminderSchema = zod_1.z.object({
    id: zod_1.z.string(),
    time: timeStringSchema,
    enabled: zod_1.z.boolean(),
});
exports.routineScheduleSchema = zod_1.z
    .object({
    frequency: routineFrequencySchema,
    interval: zod_1.z.number().int().min(1, 'Interval must be at least 1'),
    daysOfWeek: zod_1.z.array(zod_1.z.number().int().min(0).max(6)).optional(),
    daysOfMonth: zod_1.z.array(zod_1.z.number().int().min(1).max(31)).optional(),
    startDate: dateStringSchema,
    endDate: dateStringSchema.optional().nullable(),
    timezone: zod_1.z.string().min(1, 'Timezone is required'),
})
    .refine((data) => {
    if (data.frequency === 'weekly') {
        return data.daysOfWeek && data.daysOfWeek.length > 0;
    }
    return true;
}, {
    message: 'At least one weekday must be selected for weekly schedules',
    path: ['daysOfWeek'],
})
    .refine((data) => {
    if (data.frequency === 'monthly') {
        return data.daysOfMonth && data.daysOfMonth.length > 0;
    }
    return true;
}, {
    message: 'At least one calendar day must be selected for monthly schedules',
    path: ['daysOfMonth'],
})
    .refine((data) => {
    if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
    }
    return true;
}, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
});
exports.routineFormSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(2, 'Title must be at least 2 characters')
        .max(100, 'Title is too long'),
    description: zod_1.z.string().trim().max(500, 'Description is too long').optional(),
    type: routineTypeSchema,
    status: routineStatusSchema,
    schedule: exports.routineScheduleSchema,
    reminders: zod_1.z.array(exports.routineReminderSchema),
});
