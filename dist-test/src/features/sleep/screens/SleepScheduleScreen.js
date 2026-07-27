"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepScheduleScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const expo_router_1 = require("expo-router");
const useSleepSchedule_1 = require("../hooks/useSleepSchedule");
const FormLayout_1 = require("../components/layouts/FormLayout");
const SleepScheduleForm_1 = require("../components/SleepScheduleForm");
const sleep_mapper_1 = require("../mappers/sleep.mapper");
const SleepScheduleScreen = () => {
    const router = (0, expo_router_1.useRouter)();
    const { activeSchedule, saveSchedule, isSaving, isLoading } = (0, useSleepSchedule_1.useSleepSchedule)();
    const initialValues = (0, react_1.useMemo)(() => {
        return activeSchedule ? (0, sleep_mapper_1.mapToSleepScheduleVM)(activeSchedule) : null;
    }, [activeSchedule]);
    const handleSubmit = async (values) => {
        const construct24HourTime = (hour, minute, ampm) => {
            let hour24 = hour % 12;
            if (ampm === 'PM')
                hour24 += 12;
            return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        };
        const payload = {
            id: activeSchedule?.id || undefined,
            weekdayBedtime: construct24HourTime(values.weekdayBedHour, values.weekdayBedMin, values.weekdayBedAmPm),
            weekdayWakeTime: construct24HourTime(values.weekdayWakeHour, values.weekdayWakeMin, values.weekdayWakeAmPm),
            weekendBedtime: construct24HourTime(values.weekendBedHour, values.weekendBedMin, values.weekendBedAmPm),
            weekendWakeTime: construct24HourTime(values.weekendWakeHour, values.weekendWakeMin, values.weekendWakeAmPm),
            targetDurationMinutes: values.targetDurationMinutes,
            isActive: true,
            effectiveFrom: activeSchedule?.effectiveFrom || new Date().toISOString().split('T')[0],
        };
        try {
            await saveSchedule(payload);
            router.back();
        }
        catch {
            // Handled by query mutation error state
        }
    };
    return ((0, jsx_runtime_1.jsx)(FormLayout_1.FormLayout, { title: "Sleep Schedule", isSubmitting: isSaving || isLoading, onSubmit: () => { }, children: (0, jsx_runtime_1.jsx)(SleepScheduleForm_1.SleepScheduleForm, { initialValues: initialValues, onSubmit: handleSubmit, isSubmitting: isSaving }) }));
};
exports.SleepScheduleScreen = SleepScheduleScreen;
