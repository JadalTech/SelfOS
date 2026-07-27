"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepAnalyticsRepository = exports.sleepGoalRepository = exports.sleepScheduleRepository = exports.sleepRepository = exports.SleepAnalyticsRepository = exports.SleepGoalRepository = exports.SleepScheduleRepository = exports.SleepRepository = void 0;
const types_1 = require("../../../shared/types");
const AppError_1 = require("../../../shared/errors/AppError");
const sleep_service_1 = require("../services/sleep.service");
const SleepEngine = __importStar(require("../engine/sleepEngine"));
class SleepRepository {
    service;
    constructor(service = sleep_service_1.sleepService) {
        this.service = service;
    }
    async fetchEntries(userId, limitCount = 100) {
        try {
            const entries = await this.service.fetchEntries(userId, limitCount);
            return (0, types_1.ok)(entries);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch sleep entries', { originalError: error }));
        }
    }
    async getEntryByDate(userId, dateStr) {
        try {
            const entry = await this.service.getEntryByDate(userId, dateStr);
            return (0, types_1.ok)(entry);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', `Failed to fetch sleep entry for date ${dateStr}`, { originalError: error }));
        }
    }
    async saveEntry(userId, entry) {
        try {
            const saved = await this.service.saveEntry(userId, entry);
            return (0, types_1.ok)(saved);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to save sleep entry', { originalError: error }));
        }
    }
    async deleteEntry(userId, entryId) {
        try {
            await this.service.deleteEntry(userId, entryId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to delete sleep entry', { originalError: error }));
        }
    }
}
exports.SleepRepository = SleepRepository;
class SleepScheduleRepository {
    service;
    constructor(service = sleep_service_1.sleepService) {
        this.service = service;
    }
    async fetchSchedules(userId) {
        try {
            const schedules = await this.service.fetchSchedules(userId);
            return (0, types_1.ok)(schedules);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch sleep schedules', { originalError: error }));
        }
    }
    async saveSchedule(userId, schedule) {
        try {
            const saved = await this.service.saveSchedule(userId, schedule);
            return (0, types_1.ok)(saved);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to save sleep schedule', { originalError: error }));
        }
    }
    async toggleScheduleActive(userId, scheduleId, isActive) {
        try {
            await this.service.toggleScheduleActive(userId, scheduleId, isActive);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to toggle sleep schedule state', { originalError: error }));
        }
    }
}
exports.SleepScheduleRepository = SleepScheduleRepository;
class SleepGoalRepository {
    service;
    constructor(service = sleep_service_1.sleepService) {
        this.service = service;
    }
    async fetchGoals(userId) {
        try {
            const goals = await this.service.fetchGoals(userId);
            return (0, types_1.ok)(goals);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch sleep goals', { originalError: error }));
        }
    }
    async saveGoal(userId, goal) {
        try {
            const saved = await this.service.saveGoal(userId, goal);
            return (0, types_1.ok)(saved);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to save sleep goal', { originalError: error }));
        }
    }
    async toggleGoalActive(userId, goalId, isActive) {
        try {
            await this.service.toggleGoalActive(userId, goalId, isActive);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to toggle sleep goal state', { originalError: error }));
        }
    }
}
exports.SleepGoalRepository = SleepGoalRepository;
class SleepAnalyticsRepository {
    service;
    constructor(service = sleep_service_1.sleepService) {
        this.service = service;
    }
    async fetchTrends(userId, limitCount = 10) {
        try {
            const trends = await this.service.fetchTrends(userId, limitCount);
            return (0, types_1.ok)(trends);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch sleep trends', { originalError: error }));
        }
    }
    async saveTrend(userId, trend) {
        try {
            await this.service.saveTrend(userId, trend);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to save sleep trend record', { originalError: error }));
        }
    }
    async fetchAnalyticsRecords(userId, limitDays = 30) {
        try {
            // Dynamically generate analytics contracts from raw sleep entries
            const entries = await this.service.fetchEntries(userId, limitDays);
            const schedules = await this.service.fetchSchedules(userId);
            const activeSchedule = schedules.find((s) => s.isActive);
            if (entries.length === 0) {
                return (0, types_1.ok)([]);
            }
            const records = [];
            // 1. Average Sleep Duration
            const totalDuration = entries.reduce((sum, e) => sum + e.durationMinutes, 0);
            const avgDuration = Math.round(totalDuration / entries.length);
            records.push({
                feature: 'sleep',
                metric: 'average_duration',
                value: avgDuration,
                score: Math.min(10, avgDuration / 60), // hourly score representation
                trend: 'stable',
                timestamp: new Date(),
            });
            // 2. Average Quality Score
            const totalQuality = entries.reduce((sum, e) => sum + e.quality.rating, 0);
            const avgQuality = Math.round((totalQuality / entries.length) * 10) / 10;
            records.push({
                feature: 'sleep',
                metric: 'average_quality',
                value: avgQuality,
                score: avgQuality, // 1-10 scale maps perfectly
                trend: 'stable',
                timestamp: new Date(),
            });
            // 3. Consistency Score
            if (activeSchedule) {
                const consistency = SleepEngine.calculateScheduleConsistency(entries, activeSchedule);
                records.push({
                    feature: 'sleep',
                    metric: 'consistency_score',
                    value: consistency,
                    score: consistency / 10, // scale to 1-10
                    trend: 'stable',
                    timestamp: new Date(),
                });
            }
            // 4. Average Recovery Score
            const entriesWithRecovery = entries.filter((e) => e.recoveryScore !== undefined);
            if (entriesWithRecovery.length > 0) {
                const totalRecovery = entriesWithRecovery.reduce((sum, e) => sum + (e.recoveryScore || 0), 0);
                const avgRecovery = Math.round(totalRecovery / entriesWithRecovery.length);
                records.push({
                    feature: 'sleep',
                    metric: 'average_recovery',
                    value: avgRecovery,
                    score: avgRecovery / 10,
                    trend: 'stable',
                    timestamp: new Date(),
                });
            }
            return (0, types_1.ok)(records);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to aggregate sleep analytics records', { originalError: error }));
        }
    }
}
exports.SleepAnalyticsRepository = SleepAnalyticsRepository;
exports.sleepRepository = new SleepRepository();
exports.sleepScheduleRepository = new SleepScheduleRepository();
exports.sleepGoalRepository = new SleepGoalRepository();
exports.sleepAnalyticsRepository = new SleepAnalyticsRepository();
