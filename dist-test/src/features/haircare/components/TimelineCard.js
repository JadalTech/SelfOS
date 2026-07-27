"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const PhotoGrid_1 = require("./PhotoGrid");
exports.TimelineCard = react_1.default.memo(function TimelineCard({ group, onPhotoPress, onPhotoDelete, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between border-b border-zinc-800/60 pb-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-sm font-extrabold", children: group.monthYearLabel }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-xs", children: [group.photos.length, " photos"] })] }), (0, jsx_runtime_1.jsx)(PhotoGrid_1.PhotoGrid, { photos: group.photos, onPhotoPress: onPhotoPress, onPhotoDelete: onPhotoDelete })] }));
});
