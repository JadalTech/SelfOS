"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skincareRepository = exports.SkincareRepository = void 0;
const types_1 = require("../../../shared/types");
const AppError_1 = require("../../../shared/errors/AppError");
const routine_1 = require("../../routine");
const skincare_service_1 = require("../services/skincare.service");
class SkincareRepository {
    service;
    constructor(service = skincare_service_1.skincareService) {
        this.service = service;
    }
    // --- Products ---
    async fetchProducts(userId) {
        try {
            const products = await this.service.fetchProducts(userId);
            return (0, types_1.ok)(products);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch skincare products', { originalError: error }));
        }
    }
    async getProductById(userId, productId) {
        try {
            const product = await this.service.getProductById(userId, productId);
            return (0, types_1.ok)(product);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch skincare product details', { originalError: error }));
        }
    }
    async createProduct(userId, input) {
        try {
            const product = await this.service.createProduct(userId, {
                name: input.name,
                brand: input.brand,
                category: input.category,
                type: input.type,
                keyIngredients: input.keyIngredients || [],
                openedDate: input.openedDate,
                shelfLifeMonths: input.shelfLifeMonths,
                isFavorite: input.isFavorite ?? false,
                isActive: input.isActive ?? true,
                notes: input.notes,
            });
            return (0, types_1.ok)(product);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to create skincare product', { originalError: error }));
        }
    }
    async updateProduct(userId, productId, updates) {
        try {
            const updated = await this.service.updateProduct(userId, productId, updates);
            return (0, types_1.ok)(updated);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to update skincare product', { originalError: error }));
        }
    }
    async deleteProduct(userId, productId) {
        try {
            await this.service.deleteProduct(userId, productId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to delete skincare product', { originalError: error }));
        }
    }
    // --- Skincare Routines ---
    async fetchRoutines(userId) {
        try {
            const routines = await this.service.fetchRoutines(userId);
            return (0, types_1.ok)(routines);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch skincare routines', { originalError: error }));
        }
    }
    async createSkincareRoutine(userId, input) {
        try {
            // 1. First, create core Generic Routine via routineRepository
            const coreRoutineResult = await routine_1.routineRepository.createRoutine(userId, {
                title: input.title,
                type: 'skincare',
                schedule: {
                    frequency: input.frequency || 'daily',
                    interval: 1,
                    daysOfWeek: input.daysOfWeek,
                    startDate: new Date().toISOString().split('T')[0],
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
                },
                reminders: input.reminderTime
                    ? [
                        {
                            id: `rem_${Date.now()}`,
                            time: input.reminderTime,
                            days: input.daysOfWeek || [0, 1, 2, 3, 4, 5, 6],
                            isEnabled: true,
                        },
                    ]
                    : [],
            });
            if (!coreRoutineResult.success) {
                return (0, types_1.err)(coreRoutineResult.error);
            }
            // 2. Create specialized SkincareRoutine entity
            const skincareRoutine = await this.service.createRoutine(userId, {
                routineId: coreRoutineResult.data.id,
                timeOfDay: input.timeOfDay,
                steps: input.steps,
                targetedConcerns: input.targetedConcerns || [],
            });
            return (0, types_1.ok)(skincareRoutine);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to create skincare routine', { originalError: error }));
        }
    }
    async updateSkincareRoutine(userId, skincareRoutineId, updates) {
        try {
            const updated = await this.service.updateRoutine(userId, skincareRoutineId, updates);
            return (0, types_1.ok)(updated);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to update skincare routine', { originalError: error }));
        }
    }
    async deleteSkincareRoutine(userId, skincareRoutineId, coreRoutineId) {
        try {
            await this.service.deleteRoutine(userId, skincareRoutineId);
            if (coreRoutineId) {
                await routine_1.routineRepository.archiveRoutine(userId, coreRoutineId);
            }
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to delete skincare routine', { originalError: error }));
        }
    }
    // --- Execution Audit Logs ---
    async fetchLogs(userId, limitDays) {
        try {
            const logs = await this.service.fetchLogs(userId, limitDays);
            return (0, types_1.ok)(logs);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch skincare logs', { originalError: error }));
        }
    }
    async logRoutineExecution(userId, input) {
        try {
            // 1. Complete core generic routine log first
            const coreLogResult = await routine_1.routineRepository.completeRoutine(userId, input.coreRoutineId, input.dateStr);
            const routineLogId = coreLogResult.success ? coreLogResult.data.log.id : `log_${Date.now()}`;
            // 2. Create specialized SkincareLog entry
            const log = await this.service.createLog(userId, {
                skincareRoutineId: input.skincareRoutineId,
                routineLogId,
                date: input.dateStr,
                time: input.timeStr || new Date().toTimeString().split(' ')[0],
                completedStepIds: input.completedStepIds,
                skippedStepIds: input.skippedStepIds || [],
                appliedProductIds: input.appliedProductIds,
                weather: input.weather,
                uvIndex: input.uvIndex,
                skinFeelingRating: input.skinFeelingRating,
                notes: input.notes,
            });
            return (0, types_1.ok)(log);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to log skincare execution', { originalError: error }));
        }
    }
}
exports.SkincareRepository = SkincareRepository;
exports.skincareRepository = new SkincareRepository();
