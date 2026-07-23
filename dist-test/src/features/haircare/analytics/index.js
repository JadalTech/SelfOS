"use strict";
/**
 * Haircare Analytics Feature Submodule Export
 */
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairAnalyticsDashboardScreen = exports.AnalyticsSummaryWidget = exports.ProductUsageChart = exports.ConditionTrendChart = exports.CompletionBarChart = exports.InsightCard = exports.useHairAnalytics = exports.calculateConditionTrends = exports.calculateProductAnalytics = exports.calculateMonthlyAnalytics = exports.calculateWeeklyAnalytics = exports.buildHairAnalyticsVM = void 0;
__exportStar(require("./types/analytics.types"), exports);
var hairAnalytics_1 = require("./utils/hairAnalytics");
Object.defineProperty(exports, "buildHairAnalyticsVM", { enumerable: true, get: function () { return hairAnalytics_1.buildHairAnalyticsVM; } });
Object.defineProperty(exports, "calculateWeeklyAnalytics", { enumerable: true, get: function () { return hairAnalytics_1.calculateWeeklyAnalytics; } });
Object.defineProperty(exports, "calculateMonthlyAnalytics", { enumerable: true, get: function () { return hairAnalytics_1.calculateMonthlyAnalytics; } });
Object.defineProperty(exports, "calculateProductAnalytics", { enumerable: true, get: function () { return hairAnalytics_1.calculateProductAnalytics; } });
Object.defineProperty(exports, "calculateConditionTrends", { enumerable: true, get: function () { return hairAnalytics_1.calculateConditionTrends; } });
var useHairAnalytics_1 = require("./hooks/useHairAnalytics");
Object.defineProperty(exports, "useHairAnalytics", { enumerable: true, get: function () { return useHairAnalytics_1.useHairAnalytics; } });
var InsightCard_1 = require("./components/InsightCard");
Object.defineProperty(exports, "InsightCard", { enumerable: true, get: function () { return InsightCard_1.InsightCard; } });
var CompletionBarChart_1 = require("./components/CompletionBarChart");
Object.defineProperty(exports, "CompletionBarChart", { enumerable: true, get: function () { return CompletionBarChart_1.CompletionBarChart; } });
var ConditionTrendChart_1 = require("./components/ConditionTrendChart");
Object.defineProperty(exports, "ConditionTrendChart", { enumerable: true, get: function () { return ConditionTrendChart_1.ConditionTrendChart; } });
var ProductUsageChart_1 = require("./components/ProductUsageChart");
Object.defineProperty(exports, "ProductUsageChart", { enumerable: true, get: function () { return ProductUsageChart_1.ProductUsageChart; } });
var AnalyticsSummaryWidget_1 = require("./components/AnalyticsSummaryWidget");
Object.defineProperty(exports, "AnalyticsSummaryWidget", { enumerable: true, get: function () { return AnalyticsSummaryWidget_1.AnalyticsSummaryWidget; } });
var HairAnalyticsDashboardScreen_1 = require("./screens/HairAnalyticsDashboardScreen");
Object.defineProperty(exports, "HairAnalyticsDashboardScreen", { enumerable: true, get: function () { return HairAnalyticsDashboardScreen_1.HairAnalyticsDashboardScreen; } });
