"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SleepDetailsRoute;
const jsx_runtime_1 = require("react/jsx-runtime");
const expo_router_1 = require("expo-router");
const screens_1 = require("@/features/sleep/screens");
function SleepDetailsRoute() {
    const { id } = (0, expo_router_1.useLocalSearchParams)();
    return (0, jsx_runtime_1.jsx)(screens_1.SleepDetailsScreen, { entryId: id || '' });
}
