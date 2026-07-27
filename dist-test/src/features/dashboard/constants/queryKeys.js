"use strict";
/**
 * Dashboard Query Keys Factory
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardKeys = void 0;
exports.dashboardKeys = {
    all: ['dashboard'],
    summary: () => [...exports.dashboardKeys.all, 'summary'],
};
