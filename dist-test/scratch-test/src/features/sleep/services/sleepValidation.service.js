"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepValidationService = exports.SleepValidationService = void 0;
const zod_1 = require("zod");
const types_1 = require("../../../shared/types");
const AppError_1 = require("../../../shared/errors/AppError");
const sleep_validation_1 = require("../validation/sleep.validation");
class SleepValidationService {
    /**
     * Helper to format raw Zod errors into clean, user-friendly sentences.
     */
    formatZodError(error) {
        return error.issues
            .map((e) => {
            const fieldName = e.path.join('.');
            return fieldName ? `${fieldName}: ${e.message}` : e.message;
        })
            .join(', ');
    }
    /**
     * Validates sleep entry logging form inputs.
     */
    validateEntry(input) {
        try {
            const parsed = sleep_validation_1.sleepEntrySchema.parse(input);
            return (0, types_1.ok)(parsed);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return (0, types_1.err)(AppError_1.AppError.validation(this.formatZodError(error)));
            }
            return (0, types_1.err)(AppError_1.AppError.validation('Invalid sleep entry parameters'));
        }
    }
    /**
     * Validates sleep target schedule configuration.
     */
    validateSchedule(input) {
        try {
            const parsed = sleep_validation_1.sleepScheduleSchema.parse(input);
            return (0, types_1.ok)(parsed);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return (0, types_1.err)(AppError_1.AppError.validation(this.formatZodError(error)));
            }
            return (0, types_1.err)(AppError_1.AppError.validation('Invalid sleep schedule parameters'));
        }
    }
    /**
     * Validates sleep goals.
     */
    validateGoal(input) {
        try {
            const parsed = sleep_validation_1.sleepGoalSchema.parse(input);
            return (0, types_1.ok)(parsed);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return (0, types_1.err)(AppError_1.AppError.validation(this.formatZodError(error)));
            }
            return (0, types_1.err)(AppError_1.AppError.validation('Invalid sleep goal parameters'));
        }
    }
}
exports.SleepValidationService = SleepValidationService;
exports.sleepValidationService = new SleepValidationService();
