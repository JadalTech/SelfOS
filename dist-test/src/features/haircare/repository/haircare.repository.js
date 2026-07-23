"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haircareRepository = exports.HaircareRepository = void 0;
const types_1 = require("@/shared/types");
const errors_1 = require("@/shared/errors");
const routine_1 = require("@/features/routine");
const haircare_service_1 = require("../services/haircare.service");
class HaircareRepository {
    service;
    constructor(service = haircare_service_1.haircareService) {
        this.service = service;
    }
    // --- Products Repository Methods ---
    async fetchProducts(userId) {
        try {
            const products = await this.service.fetchProducts(userId);
            return (0, types_1.ok)(products);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to fetch hair products', { originalError: error }));
        }
    }
    async createProduct(userId, input) {
        try {
            const product = await this.service.createProduct(userId, {
                name: input.name,
                brand: input.brand,
                category: input.category,
                isFavorite: input.isFavorite ?? false,
                isActive: input.isActive ?? true,
                notes: input.notes,
            });
            return (0, types_1.ok)(product);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to create hair product', { originalError: error }));
        }
    }
    async updateProduct(userId, productId, updates) {
        try {
            const updated = await this.service.updateProduct(userId, productId, updates);
            return (0, types_1.ok)(updated);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to update hair product', { originalError: error }));
        }
    }
    async deleteProduct(userId, productId) {
        try {
            await this.service.deleteProduct(userId, productId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to delete hair product', { originalError: error }));
        }
    }
    // --- Hair Routines Repository Methods ---
    async fetchHairRoutines(userId) {
        try {
            const hairRoutines = await this.service.fetchHairRoutines(userId);
            return (0, types_1.ok)(hairRoutines);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to fetch hair routines', { originalError: error }));
        }
    }
    async createHairRoutine(userId, input) {
        try {
            // 1. Create underlying core generic Routine in Routine Engine
            const coreRoutineRes = await routine_1.routineRepository.createRoutine({
                title: input.title,
                type: 'haircare',
                status: 'active',
                schedule: {
                    frequency: input.frequency,
                    interval: 1,
                    daysOfWeek: input.daysOfWeek,
                    startDate: new Date().toISOString().split('T')[0],
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
                },
                reminders: input.reminderTime
                    ? [{ id: 'rem_hair', time: input.reminderTime, enabled: true }]
                    : [],
            });
            if (!coreRoutineRes.success) {
                const appErr = coreRoutineRes.error instanceof errors_1.AppError
                    ? coreRoutineRes.error
                    : new errors_1.AppError('FIREBASE_ERROR', coreRoutineRes.error.message, { originalError: coreRoutineRes.error });
                return (0, types_1.err)(appErr);
            }
            const coreRoutine = coreRoutineRes.data;
            // 2. Create HairRoutine extension record linking coreRoutine.id
            const hairRoutine = await this.service.createHairRoutine(userId, {
                routineId: coreRoutine.id,
                haircareCategory: input.haircareCategory,
                productIds: input.productIds,
                instructions: input.instructions,
            });
            return (0, types_1.ok)(hairRoutine);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to create hair routine', { originalError: error }));
        }
    }
    async updateHairRoutine(userId, id, updates) {
        try {
            const updated = await this.service.updateHairRoutine(userId, id, updates);
            return (0, types_1.ok)(updated);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to update hair routine', { originalError: error }));
        }
    }
    async deleteHairRoutine(userId, id, coreRoutineId) {
        try {
            if (coreRoutineId) {
                await routine_1.routineRepository.archiveRoutine(coreRoutineId);
            }
            await this.service.deleteHairRoutine(userId, id);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to delete hair routine', { originalError: error }));
        }
    }
    // --- Hair Logs Repository Methods ---
    async fetchHairLogs(userId, limitCount = 50) {
        try {
            const logs = await this.service.fetchHairLogs(userId, limitCount);
            return (0, types_1.ok)(logs);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to fetch hair logs', { originalError: error }));
        }
    }
    async logHaircareExecution(userId, input) {
        try {
            // 1. Complete underlying core routine in Routine Engine to update streaks & core completion logs
            let routineLogId;
            const coreLogRes = await routine_1.routineRepository.completeRoutine(input.coreRoutineId, input.dateStr);
            if (coreLogRes.success) {
                routineLogId = coreLogRes.data.id;
            }
            const timeStr = new Date().toTimeString().split(' ')[0];
            // 2. Create HairLog audit record
            const hairLog = await this.service.logHaircareExecution(userId, {
                hairRoutineId: input.hairRoutineId,
                routineLogId,
                date: input.dateStr,
                time: timeStr,
                appliedProductIds: input.appliedProductIds,
                notes: input.notes,
            });
            return (0, types_1.ok)(hairLog);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to log haircare execution', { originalError: error }));
        }
    }
}
exports.HaircareRepository = HaircareRepository;
exports.haircareRepository = new HaircareRepository();
