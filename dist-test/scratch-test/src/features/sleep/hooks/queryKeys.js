"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepKeys = void 0;
exports.sleepKeys = {
    all: ['sleep'],
    entries: () => [...exports.sleepKeys.all, 'entries'],
    today: () => [...exports.sleepKeys.all, 'today'],
    schedule: () => [...exports.sleepKeys.all, 'schedule'],
    goals: () => [...exports.sleepKeys.all, 'goals'],
    analytics: () => [...exports.sleepKeys.all, 'analytics'],
    recovery: () => [...exports.sleepKeys.all, 'recovery'],
};
