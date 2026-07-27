"use strict";
/**
 * Dashboard Feature Entry Point
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardScreen = exports.ErrorDashboard = exports.EmptyDashboard = exports.LoadingDashboard = exports.ModuleNavGrid = exports.RecentActivityCard = exports.WeeklyProgressCard = exports.StatsGrid = exports.StreakOverviewCard = exports.QuickActionsBar = exports.TodayRoutinesList = exports.TodayProgressCard = exports.DashboardHeader = exports.useDashboard = exports.dashboardKeys = exports.REGISTERED_MODULES = exports.buildDashboardViewModel = exports.mapRecentActivities = exports.mapWeeklyProgress = exports.mapStats = exports.mapTodayRoutines = exports.mapTodayProgress = exports.mapGreeting = void 0;
// Pure Mappers
var dashboardMapper_1 = require("./utils/dashboardMapper");
Object.defineProperty(exports, "mapGreeting", { enumerable: true, get: function () { return dashboardMapper_1.mapGreeting; } });
Object.defineProperty(exports, "mapTodayProgress", { enumerable: true, get: function () { return dashboardMapper_1.mapTodayProgress; } });
Object.defineProperty(exports, "mapTodayRoutines", { enumerable: true, get: function () { return dashboardMapper_1.mapTodayRoutines; } });
Object.defineProperty(exports, "mapStats", { enumerable: true, get: function () { return dashboardMapper_1.mapStats; } });
Object.defineProperty(exports, "mapWeeklyProgress", { enumerable: true, get: function () { return dashboardMapper_1.mapWeeklyProgress; } });
Object.defineProperty(exports, "mapRecentActivities", { enumerable: true, get: function () { return dashboardMapper_1.mapRecentActivities; } });
Object.defineProperty(exports, "buildDashboardViewModel", { enumerable: true, get: function () { return dashboardMapper_1.buildDashboardViewModel; } });
// Registries & Constants
var module_registry_1 = require("./registry/module.registry");
Object.defineProperty(exports, "REGISTERED_MODULES", { enumerable: true, get: function () { return module_registry_1.REGISTERED_MODULES; } });
var queryKeys_1 = require("./constants/queryKeys");
Object.defineProperty(exports, "dashboardKeys", { enumerable: true, get: function () { return queryKeys_1.dashboardKeys; } });
// Aggregation Hook
var useDashboard_1 = require("./hooks/useDashboard");
Object.defineProperty(exports, "useDashboard", { enumerable: true, get: function () { return useDashboard_1.useDashboard; } });
// Components
var components_1 = require("./components");
Object.defineProperty(exports, "DashboardHeader", { enumerable: true, get: function () { return components_1.DashboardHeader; } });
Object.defineProperty(exports, "TodayProgressCard", { enumerable: true, get: function () { return components_1.TodayProgressCard; } });
Object.defineProperty(exports, "TodayRoutinesList", { enumerable: true, get: function () { return components_1.TodayRoutinesList; } });
Object.defineProperty(exports, "QuickActionsBar", { enumerable: true, get: function () { return components_1.QuickActionsBar; } });
Object.defineProperty(exports, "StreakOverviewCard", { enumerable: true, get: function () { return components_1.StreakOverviewCard; } });
Object.defineProperty(exports, "StatsGrid", { enumerable: true, get: function () { return components_1.StatsGrid; } });
Object.defineProperty(exports, "WeeklyProgressCard", { enumerable: true, get: function () { return components_1.WeeklyProgressCard; } });
Object.defineProperty(exports, "RecentActivityCard", { enumerable: true, get: function () { return components_1.RecentActivityCard; } });
Object.defineProperty(exports, "ModuleNavGrid", { enumerable: true, get: function () { return components_1.ModuleNavGrid; } });
Object.defineProperty(exports, "LoadingDashboard", { enumerable: true, get: function () { return components_1.LoadingDashboard; } });
Object.defineProperty(exports, "EmptyDashboard", { enumerable: true, get: function () { return components_1.EmptyDashboard; } });
Object.defineProperty(exports, "ErrorDashboard", { enumerable: true, get: function () { return components_1.ErrorDashboard; } });
// Screens
var screens_1 = require("./screens");
Object.defineProperty(exports, "DashboardScreen", { enumerable: true, get: function () { return screens_1.DashboardScreen; } });
