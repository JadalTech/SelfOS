"use strict";
/**
 * Master Cloud Functions v2 Barrel Export File
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
exports.hourlyStatsRefreshScheduled = exports.dailyMaintenanceScheduled = exports.onTaskCreated = exports.onRoutineUpdated = exports.onRoutineCreated = exports.onUserDeleted = exports.onUserCreated = exports.getSystemStatusCallable = exports.exportUserDataCallable = exports.pingCallable = void 0;
// Shared Infrastructure Exports
__exportStar(require("./shared"), exports);
// HTTPS Callable Endpoints
var health_callable_1 = require("./https/health.callable");
Object.defineProperty(exports, "pingCallable", { enumerable: true, get: function () { return health_callable_1.pingCallable; } });
var user_callable_1 = require("./https/user.callable");
Object.defineProperty(exports, "exportUserDataCallable", { enumerable: true, get: function () { return user_callable_1.exportUserDataCallable; } });
var admin_callable_1 = require("./https/admin.callable");
Object.defineProperty(exports, "getSystemStatusCallable", { enumerable: true, get: function () { return admin_callable_1.getSystemStatusCallable; } });
// Firestore v2 Triggers
var user_triggers_1 = require("./triggers/firestore/user.triggers");
Object.defineProperty(exports, "onUserCreated", { enumerable: true, get: function () { return user_triggers_1.onUserCreated; } });
Object.defineProperty(exports, "onUserDeleted", { enumerable: true, get: function () { return user_triggers_1.onUserDeleted; } });
var routine_triggers_1 = require("./triggers/firestore/routine.triggers");
Object.defineProperty(exports, "onRoutineCreated", { enumerable: true, get: function () { return routine_triggers_1.onRoutineCreated; } });
Object.defineProperty(exports, "onRoutineUpdated", { enumerable: true, get: function () { return routine_triggers_1.onRoutineUpdated; } });
var task_triggers_1 = require("./triggers/firestore/task.triggers");
Object.defineProperty(exports, "onTaskCreated", { enumerable: true, get: function () { return task_triggers_1.onTaskCreated; } });
// Scheduled Cron Functions
var maintenance_scheduled_1 = require("./scheduled/maintenance.scheduled");
Object.defineProperty(exports, "dailyMaintenanceScheduled", { enumerable: true, get: function () { return maintenance_scheduled_1.dailyMaintenanceScheduled; } });
var stats_scheduled_1 = require("./scheduled/stats.scheduled");
Object.defineProperty(exports, "hourlyStatsRefreshScheduled", { enumerable: true, get: function () { return stats_scheduled_1.hourlyStatsRefreshScheduled; } });
//# sourceMappingURL=index.js.map