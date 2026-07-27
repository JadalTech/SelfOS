"use strict";
/**
 * App-level Constants
 *
 * Metadata, timing defaults, and shared configuration values.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIMING = exports.PAGINATION = exports.APP = void 0;
exports.APP = {
    NAME: 'SelfOS',
    VERSION: '1.0.0',
    SCHEME: 'selfos',
    BUNDLE_ID: 'com.jadaltech.selfos',
};
/** Pagination defaults */
exports.PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
};
/** Timing constants (milliseconds) */
exports.TIMING = {
    /** Debounce delay for search inputs */
    SEARCH_DEBOUNCE: 300,
    /** Animation duration for transitions */
    ANIMATION_DURATION: 250,
    /** Toast auto-dismiss duration */
    TOAST_DURATION: 3000,
};
