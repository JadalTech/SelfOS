"use strict";
/**
 * Pure Skincare Analytics Engine
 *
 * Implements pure calculations for:
 * - Trend calculations
 * - Average health scores
 * - Routine completion rates
 * - Skin concern correlations
 * - Weekly & monthly analytics breakdowns
 * - Insight card generator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAverageHealthScore = calculateAverageHealthScore;
exports.calculateConcernCorrelations = calculateConcernCorrelations;
exports.generateSkinInsights = generateSkinInsights;
exports.buildSkincareAnalyticsVM = buildSkincareAnalyticsVM;
const skincareEngine_1 = require("../../engine/skincareEngine");
function calculateAverageHealthScore(assessments) {
    if (assessments.length === 0)
        return 0;
    const total = assessments.reduce((acc, curr) => acc + (0, skincareEngine_1.calculateSkinHealthScore)(curr), 0);
    return Math.round((total / assessments.length) * 10) / 10;
}
function calculateConcernCorrelations(assessments, _logs) {
    if (assessments.length === 0)
        return [];
    const chronological = [...assessments].sort((a, b) => a.recordDate.localeCompare(b.recordDate));
    const oldest = chronological[0];
    const latest = chronological[chronological.length - 1];
    const allConcerns = Array.from(new Set([...oldest.concerns, ...latest.concerns]));
    const labelMap = {
        acne: 'Acne & Breakouts',
        aging: 'Fine Lines & Aging',
        hyperpigmentation: 'Hyperpigmentation',
        dryness: 'Dryness & Dehydration',
        redness: 'Redness & Rosacea',
        texture: 'Uneven Texture',
        'dark-circles': 'Dark Circles',
        dullness: 'Dullness & Glow',
        'enlarged-pores': 'Enlarged Pores',
        'barrier-damage': 'Skin Barrier Health',
    };
    return allConcerns.map((concern) => {
        const initialSeverity = oldest.severityMap[concern] || 3;
        const currentSeverity = latest.severityMap[concern] || 3;
        const change = initialSeverity - currentSeverity; // Positive means improvement
        return {
            concern,
            label: labelMap[concern] || concern,
            initialSeverity,
            currentSeverity,
            change,
        };
    });
}
function generateSkinInsights(assessments, logs, products) {
    const insights = [];
    if (assessments.length >= 2) {
        const sorted = [...assessments].sort((a, b) => a.recordDate.localeCompare(b.recordDate));
        const first = sorted[0];
        const latest = sorted[sorted.length - 1];
        if (latest.overallHealthScore > first.overallHealthScore) {
            insights.push({
                id: `ins_imp_${Date.now()}`,
                type: 'improvement',
                title: 'Skin Health Improving',
                description: `Your overall skin health score increased from ${first.overallHealthScore}/10 to ${latest.overallHealthScore}/10!`,
                category: 'Health Score',
                dateFormatted: latest.recordDate,
            });
        }
        else if (latest.barrierHealthScore < 3) {
            insights.push({
                id: `ins_warn_${Date.now()}`,
                type: 'warning',
                title: 'Compromised Skin Barrier',
                description: 'Your recent barrier health score is lower than recommended. Consider focusing on hydrating and repairing formulas.',
                category: 'Barrier Repair',
                dateFormatted: latest.recordDate,
            });
        }
    }
    const usageStats = (0, skincareEngine_1.calculateProductUsage)(logs, products);
    const topUsed = usageStats.filter((u) => u.usageCount > 5);
    if (topUsed.length > 0) {
        insights.push({
            id: `ins_tip_${Date.now()}`,
            type: 'tip',
            title: 'Consistent Product Usage',
            description: `You are consistently using ${topUsed[0].productName} (${topUsed[0].usageCount} applications).`,
            category: 'Product Consistency',
            dateFormatted: new Date().toISOString().split('T')[0],
        });
    }
    return insights;
}
function buildSkincareAnalyticsVM(params) {
    const { assessments, logs, products } = params;
    const weeklyCompletionRate = (0, skincareEngine_1.calculateWeeklyScore)(logs, 14);
    const monthlyCompletionRate = (0, skincareEngine_1.calculateMonthlyScore)(logs, 60);
    const currentConsistencyScore = (0, skincareEngine_1.calculateConsistencyScore)(logs, 30);
    const scoresSeries = assessments
        .sort((a, b) => a.recordDate.localeCompare(b.recordDate))
        .map((a) => (0, skincareEngine_1.calculateSkinHealthScore)(a));
    const skinHealthScoreTrend = (0, skincareEngine_1.calculateTrend)(scoresSeries);
    const averageSkinHealthScore = calculateAverageHealthScore(assessments);
    const usage = (0, skincareEngine_1.calculateProductUsage)(logs, products);
    const topUsedProducts = usage
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5)
        .map((u) => ({
        productId: u.productId,
        productName: u.productName,
        usageCount: u.usageCount,
    }));
    const concernProgress = calculateConcernCorrelations(assessments, logs);
    const insights = generateSkinInsights(assessments, logs, products);
    return {
        weeklyCompletionRate,
        monthlyCompletionRate,
        currentConsistencyScore,
        skinHealthScoreTrend,
        averageSkinHealthScore,
        topUsedProducts,
        concernProgress,
        insights,
    };
}
