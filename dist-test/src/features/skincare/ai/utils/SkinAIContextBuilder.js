"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinAIContextBuilder = void 0;
class SkinAIContextBuilder {
    static buildContext(params) {
        const { assessments, routines, logs, products } = params;
        const latestAssessment = assessments.length > 0 ? assessments[0] : undefined;
        const skinType = latestAssessment ? latestAssessment.skinType : 'normal';
        const mainConcerns = latestAssessment ? latestAssessment.concerns : [];
        const activeProducts = products.filter((p) => p.isActive);
        return {
            userProfile: {
                skinType,
                mainConcerns,
            },
            latestAssessment,
            activeRoutines: routines,
            recentLogsCount: logs.length,
            activeProducts,
        };
    }
}
exports.SkinAIContextBuilder = SkinAIContextBuilder;
