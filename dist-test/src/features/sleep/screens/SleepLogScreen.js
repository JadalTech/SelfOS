"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepLogScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const expo_router_1 = require("expo-router");
const useSleepEntries_1 = require("../hooks/useSleepEntries");
const FormLayout_1 = require("../components/layouts/FormLayout");
const SleepEntryForm_1 = require("../components/SleepEntryForm");
const sleep_mapper_1 = require("../mappers/sleep.mapper");
const SleepEngine = __importStar(require("../engine/sleepEngine"));
const SleepLogScreen = () => {
    const router = (0, expo_router_1.useRouter)();
    const { id } = (0, expo_router_1.useLocalSearchParams)();
    const { entries, saveEntry, isSaving } = (0, useSleepEntries_1.useSleepEntries)();
    // Find existing entry if editing
    const existingEntry = (0, react_1.useMemo)(() => {
        if (!id)
            return null;
        const entry = entries.find((e) => e.id === id);
        return entry ? (0, sleep_mapper_1.mapToSleepEntryVM)(entry) : null;
    }, [entries, id]);
    const handleSubmit = async (values) => {
        // 1. Resolve actual Bedtime & Wake-up times as Dates
        const { bedtime, wakeTime } = getBedtimeAndWakeTimeFromSelections(values.date, values.bedtimeHour, values.bedtimeMinute, values.bedtimeAmPm, values.wakeHour, values.wakeMinute, values.wakeAmPm);
        // 2. Calculate sleep duration
        const durationMinutes = SleepEngine.calculateSleepDuration(bedtime, wakeTime);
        // 3. Construct input payload
        const payload = {
            id: id || undefined,
            date: values.date,
            bedtime,
            wakeTime,
            durationMinutes,
            quality: {
                rating: values.qualityRating,
                efficiencyPercentage: values.sleepEfficiency ?? null,
                deepSleepMinutes: null, // requires wearable data
                remSleepMinutes: null,
                lightSleepMinutes: null,
                awakeMinutes: values.awakeDuration ?? null,
            },
            sleepSource: values.sleepSource,
            sleepEfficiency: values.sleepEfficiency ?? null,
            sleepLatency: values.sleepLatency ?? null,
            awakeDuration: values.awakeDuration ?? null,
            notes: values.notes || null,
            tags: values.tags || [],
        };
        try {
            await saveEntry(payload);
            router.back();
        }
        catch {
            // Handled by query mutation error state
        }
    };
    return ((0, jsx_runtime_1.jsx)(FormLayout_1.FormLayout, { title: id ? 'Edit Sleep Entry' : 'Log Night Sleep', isSubmitting: isSaving, onSubmit: () => { }, children: (0, jsx_runtime_1.jsx)(SleepEntryForm_1.SleepEntryForm, { initialValues: existingEntry, onSubmit: handleSubmit, isSubmitting: isSaving }) }));
};
exports.SleepLogScreen = SleepLogScreen;
/**
 * Calculates correct calendar dates for bedtime and wake-up times.
 * Bedtime shifts to the previous day if actual bedtime (24h) is after wake-up time.
 */
function getBedtimeAndWakeTimeFromSelections(entryDate, bedtimeHour, bedtimeMinute, bedtimeAmPm, wakeHour, wakeMinute, wakeAmPm) {
    const [year, month, day] = entryDate.split('-').map(Number);
    let wakeHour24 = wakeHour % 12;
    if (wakeAmPm === 'PM')
        wakeHour24 += 12;
    const wakeTime = new Date(year, month - 1, day, wakeHour24, wakeMinute, 0, 0);
    let bedtimeHour24 = bedtimeHour % 12;
    if (bedtimeAmPm === 'PM')
        bedtimeHour24 += 12;
    let bedtimeDate = new Date(year, month - 1, day);
    // Shift bedtime to previous day if it starts after the wake-up time
    if (bedtimeHour24 > wakeHour24 || (bedtimeHour24 === wakeHour24 && bedtimeMinute > wakeMinute)) {
        bedtimeDate.setDate(bedtimeDate.getDate() - 1);
    }
    const bedtime = new Date(bedtimeDate.getFullYear(), bedtimeDate.getMonth(), bedtimeDate.getDate(), bedtimeHour24, bedtimeMinute, 0, 0);
    return { bedtime, wakeTime };
}
