"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkeletonLoader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.SkeletonLoader = react_1.default.memo(function SkeletonLoader({ width = '100%', height = 20, borderRadius = 8, className = '', }) {
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: `bg-zinc-800/60 animate-pulse ${className}`, style: {
            width,
            height,
            borderRadius,
        } }));
});
