"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skinReminderRepository = exports.SkinReminderRepository = void 0;
const types_1 = require("../../../shared/types");
const AppError_1 = require("../../../shared/errors/AppError");
const skincare_service_1 = require("../services/skincare.service");
class SkinReminderRepository {
    service;
    constructor(service = skincare_service_1.skincareService) {
        this.service = service;
    }
    async fetchReminders(userId) {
        try {
            const reminders = await this.service.fetchReminders(userId);
            return (0, types_1.ok)(reminders);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch skin reminders', { originalError: error }));
        }
    }
    async createReminder(userId, input) {
        try {
            const reminder = await this.service.createReminder(userId, {
                title: input.title,
                time: input.time,
                reminderType: input.reminderType,
                frequency: input.frequency,
                daysOfWeek: input.daysOfWeek || [],
                isEnabled: input.isEnabled ?? true,
            });
            return (0, types_1.ok)(reminder);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to create skin reminder', { originalError: error }));
        }
    }
    async updateReminder(userId, reminderId, updates) {
        try {
            const updated = await this.service.updateReminder(userId, reminderId, updates);
            return (0, types_1.ok)(updated);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to update skin reminder', { originalError: error }));
        }
    }
    async deleteReminder(userId, reminderId) {
        try {
            await this.service.deleteReminder(userId, reminderId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to delete skin reminder', { originalError: error }));
        }
    }
}
exports.SkinReminderRepository = SkinReminderRepository;
exports.skinReminderRepository = new SkinReminderRepository();
