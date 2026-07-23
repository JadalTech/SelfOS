"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hairConditionRepository = exports.HairConditionRepository = void 0;
const types_1 = require("@/shared/types");
const errors_1 = require("@/shared/errors");
const haircare_service_1 = require("../services/haircare.service");
class HairConditionRepository {
    service;
    constructor(service = haircare_service_1.haircareService) {
        this.service = service;
    }
    async fetchConditions(userId, limitCount = 100) {
        try {
            const conditions = await this.service.fetchHairConditions(userId, limitCount);
            return (0, types_1.ok)(conditions);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to fetch hair condition records', { originalError: error }));
        }
    }
    async createCondition(userId, input) {
        try {
            const condition = await this.service.createHairCondition(userId, input);
            return (0, types_1.ok)(condition);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to create hair condition record', { originalError: error }));
        }
    }
    async updateCondition(userId, id, updates) {
        try {
            const updated = await this.service.updateHairCondition(userId, id, updates);
            return (0, types_1.ok)(updated);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to update hair condition record', { originalError: error }));
        }
    }
    async deleteCondition(userId, id) {
        try {
            await this.service.deleteHairCondition(userId, id);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to delete hair condition record', { originalError: error }));
        }
    }
}
exports.HairConditionRepository = HairConditionRepository;
exports.hairConditionRepository = new HairConditionRepository();
