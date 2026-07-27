"use strict";
/**
 * Date Utilities
 *
 * Lightweight date helpers with no external dependencies.
 * Covers the most common date operations needed across features.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.formatTime = formatTime;
exports.formatRelative = formatRelative;
exports.isToday = isToday;
exports.isYesterday = isYesterday;
exports.startOfDay = startOfDay;
exports.endOfDay = endOfDay;
exports.getDayOfWeek = getDayOfWeek;
/**
 * Format a date as "Jan 15, 2026"
 */
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
/**
 * Format a date as "3:45 PM"
 */
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
/**
 * Format a date relative to now: "Today", "Yesterday", or "Jan 15"
 */
function formatRelative(date) {
    if (isToday(date))
        return 'Today';
    if (isYesterday(date))
        return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
/**
 * Check if a date is today.
 */
function isToday(date) {
    const now = new Date();
    return (date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear());
}
/**
 * Check if a date is yesterday.
 */
function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear());
}
/**
 * Get the start of a given day (00:00:00.000).
 */
function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}
/**
 * Get the end of a given day (23:59:59.999).
 */
function endOfDay(date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}
/**
 * Get the day of the week as a string (e.g., "Monday").
 */
function getDayOfWeek(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}
