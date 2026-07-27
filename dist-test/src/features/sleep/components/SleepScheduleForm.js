"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepScheduleForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const SleepScheduleForm = ({ initialValues = null, onSubmit, isSubmitting = false, }) => {
    const getInitialFormValues = () => {
        const parseTime = (timeStr, defaultHour, defaultAmPm) => {
            if (!timeStr)
                return { hour: defaultHour, minute: 0, ampm: defaultAmPm };
            const parts = timeStr.split(':');
            let hour = parseInt(parts[0], 10);
            const minute = parseInt(parts[1], 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12;
            hour = hour ? hour : 12;
            return { hour, minute, ampm };
        };
        if (initialValues) {
            const weekdayBed = parseTime(initialValues.weekdayBedtime, 10, 'PM');
            const weekdayWake = parseTime(initialValues.weekdayWakeTime, 6, 'AM');
            const weekendBed = parseTime(initialValues.weekendBedtime, 11, 'PM');
            const weekendWake = parseTime(initialValues.weekendWakeTime, 8, 'AM');
            return {
                weekdayBedHour: weekdayBed.hour,
                weekdayBedMin: weekdayBed.minute,
                weekdayBedAmPm: weekdayBed.ampm,
                weekdayWakeHour: weekdayWake.hour,
                weekdayWakeMin: weekdayWake.minute,
                weekdayWakeAmPm: weekdayWake.ampm,
                weekendBedHour: weekendBed.hour,
                weekendBedMin: weekendBed.minute,
                weekendBedAmPm: weekendBed.ampm,
                weekendWakeHour: weekendWake.hour,
                weekendWakeMin: weekendWake.minute,
                weekendWakeAmPm: weekendWake.ampm,
                targetDurationMinutes: initialValues.targetDurationMinutes,
            };
        }
        return {
            weekdayBedHour: 10,
            weekdayBedMin: 30,
            weekdayBedAmPm: 'PM',
            weekdayWakeHour: 6,
            weekdayWakeMin: 30,
            weekdayWakeAmPm: 'AM',
            weekendBedHour: 11,
            weekendBedMin: 30,
            weekendBedAmPm: 'PM',
            weekendWakeHour: 8,
            weekendWakeMin: 30,
            weekendWakeAmPm: 'AM',
            targetDurationMinutes: 480, // 8 hours
        };
    };
    const { control, handleSubmit, watch } = (0, react_hook_form_1.useForm)({
        defaultValues: getInitialFormValues(),
    });
    const durationMinutes = watch('targetDurationMinutes');
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.container, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.formGroup, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.headerRow, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.label, children: "Target Sleep Duration" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: styles.durationVal, children: [(durationMinutes / 60).toFixed(1), " hrs"] })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "targetDurationMinutes", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.adjusterRow, children: [360, 420, 450, 480, 510, 540].map((mins) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.durationBtn, value === mins && styles.activeDurationBtn], onPress: () => onChange(mins), children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [styles.durationBtnText, value === mins && styles.activeDurationBtnText], children: [(mins / 60).toFixed(1), "h"] }) }, mins))) })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.divider }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.sectionHeader, children: "Weekday Targets" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.formGroup, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.subLabel, children: "Target Bedtime" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.timePickerRow, children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekdayBedHour", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.pickerCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value > 1 ? value - 1 : 12), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "-" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.pickerVal, children: value.toString().padStart(2, '0') }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value < 12 ? value + 1 : 1), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "+" }) })] })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekdayBedMin", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.pickerCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value >= 15 ? value - 15 : 45), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "-" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.pickerVal, children: value.toString().padStart(2, '0') }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value <= 45 ? value + 15 : 0), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "+" }) })] })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekdayBedAmPm", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.toggleCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.toggleBtn, value === 'AM' && styles.activeToggle], onPress: () => onChange('AM'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.toggleText, children: "AM" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.toggleBtn, value === 'PM' && styles.activeToggle], onPress: () => onChange('PM'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.toggleText, children: "PM" }) })] })) })] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.formGroup, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.subLabel, children: "Target Wake-up Time" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.timePickerRow, children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekdayWakeHour", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.pickerCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value > 1 ? value - 1 : 12), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "-" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.pickerVal, children: value.toString().padStart(2, '0') }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value < 12 ? value + 1 : 1), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "+" }) })] })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekdayWakeMin", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.pickerCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value >= 15 ? value - 15 : 45), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "-" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.pickerVal, children: value.toString().padStart(2, '0') }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value <= 45 ? value + 15 : 0), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "+" }) })] })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekdayWakeAmPm", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.toggleCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.toggleBtn, value === 'AM' && styles.activeToggle], onPress: () => onChange('AM'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.toggleText, children: "AM" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.toggleBtn, value === 'PM' && styles.activeToggle], onPress: () => onChange('PM'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.toggleText, children: "PM" }) })] })) })] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.divider }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.sectionHeader, children: "Weekend Targets" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.formGroup, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.subLabel, children: "Target Bedtime" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.timePickerRow, children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekendBedHour", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.pickerCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value > 1 ? value - 1 : 12), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "-" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.pickerVal, children: value.toString().padStart(2, '0') }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value < 12 ? value + 1 : 1), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "+" }) })] })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekendBedMin", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.pickerCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value >= 15 ? value - 15 : 45), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "-" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.pickerVal, children: value.toString().padStart(2, '0') }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value <= 45 ? value + 15 : 0), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "+" }) })] })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekendBedAmPm", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.toggleCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.toggleBtn, value === 'AM' && styles.activeToggle], onPress: () => onChange('AM'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.toggleText, children: "AM" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.toggleBtn, value === 'PM' && styles.activeToggle], onPress: () => onChange('PM'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.toggleText, children: "PM" }) })] })) })] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.formGroup, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.subLabel, children: "Target Wake-up Time" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.timePickerRow, children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekendWakeHour", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.pickerCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value > 1 ? value - 1 : 12), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "-" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.pickerVal, children: value.toString().padStart(2, '0') }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value < 12 ? value + 1 : 1), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "+" }) })] })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekendWakeMin", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.pickerCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value >= 15 ? value - 15 : 45), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "-" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.pickerVal, children: value.toString().padStart(2, '0') }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value <= 45 ? value + 15 : 0), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "+" }) })] })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "weekendWakeAmPm", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.toggleCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.toggleBtn, value === 'AM' && styles.activeToggle], onPress: () => onChange('AM'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.toggleText, children: "AM" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.toggleBtn, value === 'PM' && styles.activeToggle], onPress: () => onChange('PM'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.toggleText, children: "PM" }) })] })) })] })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.submitTrigger, onPress: handleSubmit(onSubmit), disabled: isSubmitting, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { children: "Save Schedule" }) })] }));
};
exports.SleepScheduleForm = SleepScheduleForm;
const styles = react_native_1.StyleSheet.create({
    container: {
        gap: 16,
    },
    formGroup: {
        gap: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#a1a1aa',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    subLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#a1a1aa',
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6366f1',
        marginTop: 8,
    },
    durationVal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6366f1',
    },
    adjusterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: '#27272a',
        borderRadius: 12,
        padding: 4,
    },
    durationBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    activeDurationBtn: {
        backgroundColor: '#6366f1',
    },
    durationBtnText: {
        color: '#a1a1aa',
        fontSize: 12,
        fontWeight: '700',
    },
    activeDurationBtnText: {
        color: '#ffffff',
    },
    timePickerRow: {
        flexDirection: 'row',
        gap: 10,
    },
    pickerCell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: '#27272a',
        borderRadius: 12,
        paddingHorizontal: 8,
        height: 48,
        justifyContent: 'space-between',
    },
    adjustBtn: {
        width: 24,
        height: 24,
        borderRadius: 4,
        backgroundColor: '#27272a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    adjustText: {
        color: '#fafafa',
        fontSize: 14,
        fontWeight: 'bold',
    },
    pickerVal: {
        color: '#fafafa',
        fontSize: 14,
        fontWeight: 'bold',
    },
    toggleCell: {
        flexDirection: 'row',
        backgroundColor: '#18181b',
        borderRadius: 12,
        padding: 3,
        height: 48,
        borderWidth: 1,
        borderColor: '#27272a',
        alignItems: 'center',
    },
    toggleBtn: {
        paddingHorizontal: 10,
        height: '100%',
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeToggle: {
        backgroundColor: '#6366f1',
    },
    toggleText: {
        color: '#fafafa',
        fontSize: 11,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#27272a',
        marginVertical: 8,
    },
    submitTrigger: {
        display: 'none',
    },
});
