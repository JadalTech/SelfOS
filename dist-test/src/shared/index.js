"use strict";
/**
 * Shared Module — Master Barrel Export
 *
 * Single import point for all shared infrastructure.
 *
 * Usage:
 *   import { logger, config, useAuthStore, colors } from '@/shared';
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.truncate = exports.capitalize = exports.clamp = exports.validateWith = exports.displayNameSchema = exports.passwordSchema = exports.emailSchema = exports.getDayOfWeek = exports.endOfDay = exports.startOfDay = exports.isYesterday = exports.isToday = exports.formatRelative = exports.formatTime = exports.formatDate = exports.logger = exports.getErrorMessage = exports.isNetworkError = exports.normalizeFirebaseError = exports.normalizeError = exports.ErrorBoundary = exports.AppError = exports.createAsyncState = exports.err = exports.ok = exports.STORAGE_KEYS = exports.COLLECTIONS = exports.TIMING = exports.PAGINATION = exports.APP = exports.shadow = exports.shadows = exports.radius = exports.lineHeights = exports.fontWeights = exports.fontSizes = exports.typography = exports.spacing = exports.colors = exports.useSettingsStore = exports.useAppStore = exports.useAuthStore = exports.queryClient = exports.storage = exports.getFirebaseStorage = exports.getFirebaseFirestore = exports.getFirebaseAuth = exports.getFirebaseApp = exports.config = void 0;
exports.Providers = exports.InlineLoader = exports.FullScreenLoader = exports.isWeb = exports.isAndroid = exports.isIOS = exports.isNonNullable = void 0;
// Config
var config_1 = require("./config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_1.config; } });
// Firebase
var firebase_1 = require("./firebase");
Object.defineProperty(exports, "getFirebaseApp", { enumerable: true, get: function () { return firebase_1.getFirebaseApp; } });
Object.defineProperty(exports, "getFirebaseAuth", { enumerable: true, get: function () { return firebase_1.getFirebaseAuth; } });
Object.defineProperty(exports, "getFirebaseFirestore", { enumerable: true, get: function () { return firebase_1.getFirebaseFirestore; } });
Object.defineProperty(exports, "getFirebaseStorage", { enumerable: true, get: function () { return firebase_1.getFirebaseStorage; } });
// Storage
var storage_1 = require("./storage");
Object.defineProperty(exports, "storage", { enumerable: true, get: function () { return storage_1.storage; } });
// React Query
var query_1 = require("./query");
Object.defineProperty(exports, "queryClient", { enumerable: true, get: function () { return query_1.queryClient; } });
// Stores
var stores_1 = require("./stores");
Object.defineProperty(exports, "useAuthStore", { enumerable: true, get: function () { return stores_1.useAuthStore; } });
Object.defineProperty(exports, "useAppStore", { enumerable: true, get: function () { return stores_1.useAppStore; } });
Object.defineProperty(exports, "useSettingsStore", { enumerable: true, get: function () { return stores_1.useSettingsStore; } });
// Theme
var theme_1 = require("./theme");
Object.defineProperty(exports, "colors", { enumerable: true, get: function () { return theme_1.colors; } });
Object.defineProperty(exports, "spacing", { enumerable: true, get: function () { return theme_1.spacing; } });
Object.defineProperty(exports, "typography", { enumerable: true, get: function () { return theme_1.typography; } });
Object.defineProperty(exports, "fontSizes", { enumerable: true, get: function () { return theme_1.fontSizes; } });
Object.defineProperty(exports, "fontWeights", { enumerable: true, get: function () { return theme_1.fontWeights; } });
Object.defineProperty(exports, "lineHeights", { enumerable: true, get: function () { return theme_1.lineHeights; } });
Object.defineProperty(exports, "radius", { enumerable: true, get: function () { return theme_1.radius; } });
Object.defineProperty(exports, "shadows", { enumerable: true, get: function () { return theme_1.shadows; } });
Object.defineProperty(exports, "shadow", { enumerable: true, get: function () { return theme_1.shadow; } });
// Constants
var constants_1 = require("./constants");
Object.defineProperty(exports, "APP", { enumerable: true, get: function () { return constants_1.APP; } });
Object.defineProperty(exports, "PAGINATION", { enumerable: true, get: function () { return constants_1.PAGINATION; } });
Object.defineProperty(exports, "TIMING", { enumerable: true, get: function () { return constants_1.TIMING; } });
Object.defineProperty(exports, "COLLECTIONS", { enumerable: true, get: function () { return constants_1.COLLECTIONS; } });
Object.defineProperty(exports, "STORAGE_KEYS", { enumerable: true, get: function () { return constants_1.STORAGE_KEYS; } });
var types_1 = require("./types");
Object.defineProperty(exports, "ok", { enumerable: true, get: function () { return types_1.ok; } });
Object.defineProperty(exports, "err", { enumerable: true, get: function () { return types_1.err; } });
Object.defineProperty(exports, "createAsyncState", { enumerable: true, get: function () { return types_1.createAsyncState; } });
// Errors
var errors_1 = require("./errors");
Object.defineProperty(exports, "AppError", { enumerable: true, get: function () { return errors_1.AppError; } });
Object.defineProperty(exports, "ErrorBoundary", { enumerable: true, get: function () { return errors_1.ErrorBoundary; } });
Object.defineProperty(exports, "normalizeError", { enumerable: true, get: function () { return errors_1.normalizeError; } });
Object.defineProperty(exports, "normalizeFirebaseError", { enumerable: true, get: function () { return errors_1.normalizeFirebaseError; } });
Object.defineProperty(exports, "isNetworkError", { enumerable: true, get: function () { return errors_1.isNetworkError; } });
Object.defineProperty(exports, "getErrorMessage", { enumerable: true, get: function () { return errors_1.getErrorMessage; } });
// Utils
var utils_1 = require("./utils");
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return utils_1.logger; } });
Object.defineProperty(exports, "formatDate", { enumerable: true, get: function () { return utils_1.formatDate; } });
Object.defineProperty(exports, "formatTime", { enumerable: true, get: function () { return utils_1.formatTime; } });
Object.defineProperty(exports, "formatRelative", { enumerable: true, get: function () { return utils_1.formatRelative; } });
Object.defineProperty(exports, "isToday", { enumerable: true, get: function () { return utils_1.isToday; } });
Object.defineProperty(exports, "isYesterday", { enumerable: true, get: function () { return utils_1.isYesterday; } });
Object.defineProperty(exports, "startOfDay", { enumerable: true, get: function () { return utils_1.startOfDay; } });
Object.defineProperty(exports, "endOfDay", { enumerable: true, get: function () { return utils_1.endOfDay; } });
Object.defineProperty(exports, "getDayOfWeek", { enumerable: true, get: function () { return utils_1.getDayOfWeek; } });
Object.defineProperty(exports, "emailSchema", { enumerable: true, get: function () { return utils_1.emailSchema; } });
Object.defineProperty(exports, "passwordSchema", { enumerable: true, get: function () { return utils_1.passwordSchema; } });
Object.defineProperty(exports, "displayNameSchema", { enumerable: true, get: function () { return utils_1.displayNameSchema; } });
Object.defineProperty(exports, "validateWith", { enumerable: true, get: function () { return utils_1.validateWith; } });
Object.defineProperty(exports, "clamp", { enumerable: true, get: function () { return utils_1.clamp; } });
Object.defineProperty(exports, "capitalize", { enumerable: true, get: function () { return utils_1.capitalize; } });
Object.defineProperty(exports, "truncate", { enumerable: true, get: function () { return utils_1.truncate; } });
Object.defineProperty(exports, "sleep", { enumerable: true, get: function () { return utils_1.sleep; } });
Object.defineProperty(exports, "isNonNullable", { enumerable: true, get: function () { return utils_1.isNonNullable; } });
Object.defineProperty(exports, "isIOS", { enumerable: true, get: function () { return utils_1.isIOS; } });
Object.defineProperty(exports, "isAndroid", { enumerable: true, get: function () { return utils_1.isAndroid; } });
Object.defineProperty(exports, "isWeb", { enumerable: true, get: function () { return utils_1.isWeb; } });
// Components
var components_1 = require("./components");
Object.defineProperty(exports, "FullScreenLoader", { enumerable: true, get: function () { return components_1.FullScreenLoader; } });
Object.defineProperty(exports, "InlineLoader", { enumerable: true, get: function () { return components_1.InlineLoader; } });
// Providers
var providers_1 = require("./providers");
Object.defineProperty(exports, "Providers", { enumerable: true, get: function () { return providers_1.Providers; } });
