"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricGrid = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.MetricGrid = react_1.default.memo(function MetricGrid({ children, columns = 2, }) {
    const containerClass = columns === 3
        ? 'flex-row flex-wrap gap-3'
        : 'flex-row flex-wrap gap-3.5';
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: containerClass, children: children }));
});
