"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepGoalForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const SleepGoalForm = ({ initialValues = null, onSubmit, isSubmitting = false, }) => {
    const getInitialFormValues = () => {
        if (initialValues) {
            const isTimeGoal = initialValues.category === 'bedtime' || initialValues.category === 'wake_time';
            let hour = 10;
            let minute = 0;
            let ampm = 'PM';
            if (isTimeGoal && initialValues.targetTime) {
                const parts = initialValues.targetTime.split(':');
                let parsedHour = parseInt(parts[0], 10);
                minute = parseInt(parts[1], 10);
                ampm = parsedHour >= 12 ? 'PM' : 'AM';
                parsedHour = parsedHour % 12;
                hour = parsedHour ? parsedHour : 12;
            }
            return {
                category: initialValues.category,
                targetValue: initialValues.targetValue,
                targetHour: hour,
                targetMinute: minute,
                targetAmPm: ampm,
            };
        }
        return {
            category: 'duration',
            targetValue: 480, // 8 hours in minutes
            targetHour: 11,
            targetMinute: 0,
            targetAmPm: 'PM',
        };
    };
    const { control, handleSubmit, watch, setValue } = (0, react_hook_form_1.useForm)({
        defaultValues: getInitialFormValues(),
    });
    const selectedCategory = watch('category');
    // Adjust defaults when category changes
    const handleCategoryChange = (cat, onChange) => {
        onChange(cat);
        // Reset defaults based on category
        if (cat === 'duration') {
            setValue('targetValue', 480);
        }
        else if (cat === 'consistency') {
            setValue('targetValue', 85);
        }
        else if (cat === 'recovery') {
            setValue('targetValue', 80);
        }
        else if (cat === 'bedtime') {
            setValue('targetHour', 11);
            setValue('targetMinute', 0);
            setValue('targetAmPm', 'PM');
        }
        else if (cat === 'wake_time') {
            setValue('targetHour', 7);
            setValue('targetMinute', 0);
            setValue('targetAmPm', 'AM');
        }
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.container, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.formGroup, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.label, children: "Goal Category" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "category", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.catGrid, children: [
                                { key: 'duration', label: 'Duration' },
                                { key: 'consistency', label: 'Consistency' },
                                { key: 'recovery', label: 'Recovery' },
                                { key: 'bedtime', label: 'Bedtime' },
                                { key: 'wake_time', label: 'Wake-Up' },
                            ].map((item) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.catBtn, value === item.key && styles.activeCatBtn], onPress: () => handleCategoryChange(item.key, onChange), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [styles.catBtnText, value === item.key && styles.activeCatBtnText], children: item.label }) }, item.key))) })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.divider }), selectedCategory === 'duration' && ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.formGroup, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.label, children: "Target Sleep Duration" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "targetValue", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.valSelectionGrid, children: [360, 420, 450, 480, 510, 540].map((mins) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.valBtn, value === mins && styles.activeValBtn], onPress: () => onChange(mins), children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [styles.valBtnText, value === mins && styles.activeValBtnText], children: [(mins / 60).toFixed(1), " hrs"] }) }, mins))) })) })] })), selectedCategory === 'consistency' && ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.formGroup, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.label, children: "Target Schedule Consistency (%)" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "targetValue", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.valSelectionGrid, children: [70, 75, 80, 85, 90, 95].map((pct) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.valBtn, value === pct && styles.activeValBtn], onPress: () => onChange(pct), children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [styles.valBtnText, value === pct && styles.activeValBtnText], children: [pct, "%"] }) }, pct))) })) })] })), selectedCategory === 'recovery' && ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.formGroup, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.label, children: "Target Daily Recovery Score" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "targetValue", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.valSelectionGrid, children: [65, 70, 75, 80, 85, 90].map((score) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.valBtn, value === score && styles.activeValBtn], onPress: () => onChange(score), children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [styles.valBtnText, value === score && styles.activeValBtnText], children: [score, "+"] }) }, score))) })) })] })), (selectedCategory === 'bedtime' || selectedCategory === 'wake_time') && ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.formGroup, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.label, children: "Target Time" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.timePickerContainer, children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "targetHour", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.pickerCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value > 1 ? value - 1 : 12), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "-" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.pickerVal, children: value.toString().padStart(2, '0') }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value < 12 ? value + 1 : 1), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "+" }) })] })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "targetMinute", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.pickerCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value >= 15 ? value - 15 : 45), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "-" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.pickerVal, children: value.toString().padStart(2, '0') }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.adjustBtn, onPress: () => onChange(value <= 45 ? value + 15 : 0), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.adjustText, children: "+" }) })] })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "targetAmPm", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.toggleCell, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.toggleBtn, value === 'AM' && styles.activeToggle], onPress: () => onChange('AM'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.toggleText, children: "AM" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.toggleBtn, value === 'PM' && styles.activeToggle], onPress: () => onChange('PM'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.toggleText, children: "PM" }) })] })) })] })] })), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.submitTrigger, onPress: handleSubmit(onSubmit), disabled: isSubmitting, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { children: "Save Goal" }) })] }));
};
exports.SleepGoalForm = SleepGoalForm;
const styles = react_native_1.StyleSheet.create({
    container: {
        gap: 16,
    },
    formGroup: {
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#a1a1aa',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    catGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    catBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: '#27272a',
    },
    activeCatBtn: {
        borderColor: '#6366f1',
        backgroundColor: '#312e81',
    },
    catBtnText: {
        color: '#a1a1aa',
        fontSize: 12,
        fontWeight: '600',
    },
    activeCatBtnText: {
        color: '#ffffff',
    },
    divider: {
        height: 1,
        backgroundColor: '#27272a',
        marginVertical: 8,
    },
    valSelectionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    valBtn: {
        flex: 1,
        minWidth: '28%',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: '#27272a',
        alignItems: 'center',
    },
    activeValBtn: {
        borderColor: '#6366f1',
        backgroundColor: '#312e81',
    },
    valBtnText: {
        color: '#a1a1aa',
        fontSize: 13,
        fontWeight: 'bold',
    },
    activeValBtnText: {
        color: '#ffffff',
    },
    timePickerContainer: {
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
    submitTrigger: {
        display: 'none',
    },
});
