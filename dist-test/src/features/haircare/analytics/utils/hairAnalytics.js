"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWeeklyAnalytics = calculateWeeklyAnalytics;
exports.calculateMonthlyAnalytics = calculateMonthlyAnalytics;
exports.calculateProductAnalytics = calculateProductAnalytics;
exports.calculateConditionTrends = calculateConditionTrends;
exports.generateInsightCards = generateInsightCards;
exports.buildHairAnalyticsVM = buildHairAnalyticsVM;
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function calculateWeeklyAnalytics(logs, coreRoutines) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter((log) => new Date(log.date).getTime() >= sevenDaysAgo.getTime());
    const dailyCompletionMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    for (const log of recentLogs) {
        const d = new Date(log.date);
        const dayOfWeek = d.getDay();
        dailyCompletionMap[dayOfWeek] = (dailyCompletionMap[dayOfWeek] || 0) + 1;
    }
    let mostActiveDayIdx = 0;
    let maxCount = -1;
    for (let i = 0; i < 7; i++) {
        if (dailyCompletionMap[i] > maxCount) {
            maxCount = dailyCompletionMap[i];
            mostActiveDayIdx = i;
        }
    }
    const activeRoutinesCount = coreRoutines.filter((r) => r.status === 'active').length;
    const expectedWeeklyScheduled = activeRoutinesCount > 0 ? activeRoutinesCount * 2 : 3;
    const completionRate = Math.min(100, Math.round((recentLogs.length / Math.max(1, expectedWeeklyScheduled)) * 100));
    return {
        completedCount: recentLogs.length,
        scheduledCount: expectedWeeklyScheduled,
        completionRate,
        dailyCompletionMap,
        mostActiveDayLabel: maxCount > 0 ? DAY_NAMES[mostActiveDayIdx] : 'None Yet',
    };
}
function calculateMonthlyAnalytics(logs) {
    if (logs.length === 0) {
        return {
            totalWashDays: 0,
            avgWashIntervalDays: 0,
            adherenceRate: 0,
        };
    }
    const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));
    let totalIntervalDays = 0;
    let intervalCount = 0;
    for (let i = 1; i < sortedLogs.length; i++) {
        const prevDate = new Date(sortedLogs[i - 1].date);
        const currDate = new Date(sortedLogs[i].date);
        const diffDays = Math.max(1, Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24)));
        totalIntervalDays += diffDays;
        intervalCount++;
    }
    const avgWashIntervalDays = intervalCount > 0 ? Math.round((totalIntervalDays / intervalCount) * 10) / 10 : 3;
    const totalWashDays = logs.length;
    const adherenceRate = Math.min(100, Math.round((totalWashDays / 8) * 100)); // normalized against 8 monthly wash target
    return {
        totalWashDays,
        avgWashIntervalDays,
        adherenceRate,
    };
}
function calculateProductAnalytics(products, logs) {
    const usageMap = new Map();
    let totalAppliedInstances = 0;
    for (const log of logs) {
        for (const prodId of log.appliedProductIds) {
            usageMap.set(prodId, (usageMap.get(prodId) || 0) + 1);
            totalAppliedInstances++;
        }
    }
    const result = products.map((prod) => {
        const count = usageMap.get(prod.id) || 0;
        const percentage = totalAppliedInstances > 0 ? Math.round((count / totalAppliedInstances) * 100) : 0;
        return {
            productId: prod.id,
            productName: prod.name,
            brand: prod.brand,
            category: prod.category,
            usageCount: count,
            percentage,
        };
    });
    result.sort((a, b) => b.usageCount - a.usageCount);
    return result;
}
function calculateConditionTrends(conditions) {
    if (conditions.length === 0) {
        return {
            avgOverallHealth: 8,
            avgShedding: 2,
            avgDandruff: 1,
            avgItchiness: 1,
            avgOiliness: 2,
            trendDirection: 'stable',
        };
    }
    const sumHealth = conditions.reduce((acc, c) => acc + c.overallHealth, 0);
    const sumShedding = conditions.reduce((acc, c) => acc + c.sheddingLevel, 0);
    const sumDandruff = conditions.reduce((acc, c) => acc + c.dandruffLevel, 0);
    const sumItchiness = conditions.reduce((acc, c) => acc + c.itchinessLevel, 0);
    const sumOiliness = conditions.reduce((acc, c) => acc + c.oilinessLevel, 0);
    const n = conditions.length;
    const avgOverallHealth = Math.round((sumHealth / n) * 10) / 10;
    const avgShedding = Math.round((sumShedding / n) * 10) / 10;
    const avgDandruff = Math.round((sumDandruff / n) * 10) / 10;
    const avgItchiness = Math.round((sumItchiness / n) * 10) / 10;
    const avgOiliness = Math.round((sumOiliness / n) * 10) / 10;
    let trendDirection = 'stable';
    if (conditions.length >= 2) {
        const sorted = [...conditions].sort((a, b) => b.recordDate.localeCompare(a.recordDate));
        const latestHealth = sorted[0].overallHealth;
        const previousHealth = sorted[1].overallHealth;
        if (latestHealth > previousHealth)
            trendDirection = 'improving';
        else if (latestHealth < previousHealth)
            trendDirection = 'declining';
    }
    return {
        avgOverallHealth,
        avgShedding,
        avgDandruff,
        avgItchiness,
        avgOiliness,
        trendDirection,
    };
}
function generateInsightCards(weekly, monthly, productUsage, conditionTrend, photos, coreRoutines) {
    const cards = [];
    // Streak & Adherence Card
    const maxStreak = Math.max(...coreRoutines.map((r) => r.currentStreak), 0);
    cards.push({
        id: 'insight_streak',
        title: 'Habit Consistency',
        value: `${maxStreak} Days`,
        subtitle: 'Current longest streak across haircare routines',
        icon: '🔥',
        type: 'streak',
    });
    // Wash Frequency Card
    cards.push({
        id: 'insight_frequency',
        title: 'Average Wash Frequency',
        value: `Every ${monthly.avgWashIntervalDays || 3} Days`,
        subtitle: `Total ${monthly.totalWashDays} wash day logs recorded`,
        icon: '🚿',
        type: 'completion',
    });
    // Top Product Card
    const topProduct = productUsage[0];
    cards.push({
        id: 'insight_product',
        title: 'Most Utilized Product',
        value: topProduct ? `${topProduct.productName}` : 'None Recorded',
        subtitle: topProduct ? `Applied ${topProduct.usageCount} times (${topProduct.percentage}% of regimen)` : 'Add products to track usage ranking',
        icon: '🧴',
        type: 'product',
    });
    // Scalp Health Trend Card
    cards.push({
        id: 'insight_condition',
        title: 'Scalp Health Trend',
        value: `${conditionTrend.avgOverallHealth}/10 Avg`,
        subtitle: `Status is ${conditionTrend.trendDirection.toUpperCase()} over recent assessments`,
        icon: '🌱',
        type: 'condition',
    });
    // Progress Gallery Card
    cards.push({
        id: 'insight_photos',
        title: 'Progress Gallery',
        value: `${photos.length} Photos`,
        subtitle: 'Documented hair growth capture milestones',
        icon: '📸',
        type: 'timeline',
    });
    return cards;
}
function buildHairAnalyticsVM(products, hairRoutines, coreRoutines, logs, photos, conditions) {
    const weekly = calculateWeeklyAnalytics(logs, coreRoutines);
    const monthly = calculateMonthlyAnalytics(logs);
    const productUsage = calculateProductAnalytics(products, logs);
    const conditionTrend = calculateConditionTrends(conditions);
    const insights = generateInsightCards(weekly, monthly, productUsage, conditionTrend, photos, coreRoutines);
    const currentStreak = Math.max(...coreRoutines.map((r) => r.currentStreak), 0);
    const longestStreak = Math.max(...coreRoutines.map((r) => r.longestStreak), 0);
    return {
        weekly,
        monthly,
        productUsage,
        conditionTrend,
        insights,
        totalPhotosCount: photos.length,
        currentStreak,
        longestStreak,
    };
}
