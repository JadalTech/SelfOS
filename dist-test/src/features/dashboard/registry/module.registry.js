"use strict";
/**
 * Health Modules Registry
 *
 * Catalog of active and upcoming SelfOS health modules.
 * Adding a feature module simply requires setting enabled: true and target route.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTERED_MODULES = void 0;
exports.REGISTERED_MODULES = [
    {
        id: 'routines',
        title: 'Routine Engine',
        description: 'Daily habits & scheduling foundation',
        icon: '🎯',
        route: '/(app)/routines',
        enabled: true,
        comingSoon: false,
        badge: 'Active',
    },
    {
        id: 'haircare',
        title: 'Haircare Regimen',
        description: 'Wash schedules & treatment logs',
        icon: '💇‍♂️',
        route: '/(app)/haircare',
        enabled: true,
        comingSoon: false,
        badge: 'Active',
    },
    {
        id: 'skincare',
        title: 'Skincare Routine',
        description: 'AM/PM routines & product tracking',
        icon: '✨',
        route: '/(app)/skincare',
        enabled: true,
        comingSoon: false,
        badge: 'Active',
    },
    {
        id: 'nutrition',
        title: 'Nutrition & Water',
        description: 'Macro intake & hydration targets',
        icon: '🥗',
        route: '/(app)/nutrition',
        enabled: true,
        comingSoon: false,
        badge: 'Active',
    },
    {
        id: 'gym',
        title: 'Workout & Gym',
        description: 'Exercise volume & fitness logs',
        icon: '🏋️‍♂️',
        route: '/(app)/gym',
        enabled: false,
        comingSoon: true,
    },
    {
        id: 'sleep',
        title: 'Sleep & Recovery',
        description: 'Sleep duration & energy scores',
        icon: '😴',
        route: '/(app)/sleep',
        enabled: true,
        comingSoon: false,
        badge: 'Active',
    },
    {
        id: 'analytics',
        title: 'Health Analytics',
        description: 'Cross-module insights & trends',
        icon: '📊',
        route: '/(app)/analytics',
        enabled: false,
        comingSoon: true,
    },
];
