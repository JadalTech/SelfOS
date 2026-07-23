"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haircareKeys = void 0;
exports.haircareKeys = {
    all: ['haircare'],
    products: () => [...exports.haircareKeys.all, 'products'],
    routines: () => [...exports.haircareKeys.all, 'routines'],
    logs: () => [...exports.haircareKeys.all, 'logs'],
    photos: () => [...exports.haircareKeys.all, 'photos'],
    conditions: () => [...exports.haircareKeys.all, 'conditions'],
    ai: () => [...exports.haircareKeys.all, 'ai'],
};
