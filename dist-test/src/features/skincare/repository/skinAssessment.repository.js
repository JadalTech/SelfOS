"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skinAssessmentRepository = exports.SkinAssessmentRepository = void 0;
const types_1 = require("../../../shared/types");
const AppError_1 = require("../../../shared/errors/AppError");
const skincare_service_1 = require("../services/skincare.service");
class SkinAssessmentRepository {
    service;
    constructor(service = skincare_service_1.skincareService) {
        this.service = service;
    }
    async fetchAssessments(userId) {
        try {
            const assessments = await this.service.fetchAssessments(userId);
            return (0, types_1.ok)(assessments);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch skin assessments', { originalError: error }));
        }
    }
    async getLatestAssessment(userId) {
        try {
            const assessments = await this.service.fetchAssessments(userId);
            const latest = assessments.length > 0 ? assessments[0] : null;
            return (0, types_1.ok)(latest);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch latest skin assessment', { originalError: error }));
        }
    }
    async createAssessment(userId, input) {
        try {
            const assessment = await this.service.createAssessment(userId, {
                recordDate: input.recordDate,
                skinType: input.skinType,
                concerns: input.concerns,
                severityMap: input.severityMap,
                overallHealthScore: input.overallHealthScore,
                hydrationLevel: input.hydrationLevel,
                sensitivityLevel: input.sensitivityLevel,
                oilinessLevel: input.oilinessLevel,
                barrierHealthScore: input.barrierHealthScore,
                sleepHours: input.sleepHours,
                stressLevel: input.stressLevel,
                notes: input.notes,
            });
            return (0, types_1.ok)(assessment);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to record skin assessment', { originalError: error }));
        }
    }
    async updateAssessment(userId, assessmentId, updates) {
        try {
            const updated = await this.service.updateAssessment(userId, assessmentId, updates);
            return (0, types_1.ok)(updated);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to update skin assessment', { originalError: error }));
        }
    }
    async deleteAssessment(userId, assessmentId) {
        try {
            await this.service.deleteAssessment(userId, assessmentId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to delete skin assessment', { originalError: error }));
        }
    }
}
exports.SkinAssessmentRepository = SkinAssessmentRepository;
exports.skinAssessmentRepository = new SkinAssessmentRepository();
