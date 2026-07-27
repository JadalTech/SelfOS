"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepGoalsScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useSleepGoals_1 = require("../hooks/useSleepGoals");
const DetailLayout_1 = require("../components/layouts/DetailLayout");
const SleepGoalForm_1 = require("../components/SleepGoalForm");
const sleep_mapper_1 = require("../mappers/sleep.mapper");
const SleepGoalsScreen = () => {
    const { goals, saveGoal, toggleGoalActive, isSaving, isToggling, isLoading, refetch } = (0, useSleepGoals_1.useSleepGoals)();
    const goalVMs = (0, react_1.useMemo)(() => {
        return goals.map((g) => (0, sleep_mapper_1.mapToSleepGoalVM)(g));
    }, [goals]);
    const handleSubmit = async (values) => {
        let targetValue = values.targetValue;
        let targetTime;
        if (values.category === 'bedtime' || values.category === 'wake_time') {
            let hr24 = values.targetHour % 12;
            if (values.targetAmPm === 'PM')
                hr24 += 12;
            targetTime = `${hr24.toString().padStart(2, '0')}:${values.targetMinute.toString().padStart(2, '0')}`;
            targetValue = 60; // 60 minutes max deviation as a default goal constraint
        }
        const payload = {
            category: values.category,
            targetValue,
            targetTime,
            isActive: true,
        };
        try {
            await saveGoal(payload);
        }
        catch {
            // Handled by query mutation error
        }
    };
    const handleToggleActive = async (goalId, currentActive) => {
        try {
            await toggleGoalActive({ goalId, isActive: !currentActive });
        }
        catch {
            // Handled by query mutation error
        }
    };
    return ((0, jsx_runtime_1.jsxs)(DetailLayout_1.DetailLayout, { title: "Sleep Goals", isLoading: isLoading || isToggling, onRetry: refetch, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.sectionTitle, children: "Create Sleep Goal" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.formCard, children: (0, jsx_runtime_1.jsx)(SleepGoalForm_1.SleepGoalForm, { onSubmit: handleSubmit, isSubmitting: isSaving }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.sectionTitle, children: "Your Sleep Goals" }), goalVMs.length === 0 ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.emptyCard, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.emptyText, children: "No goals defined yet. Select a category above to create one." }) })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.goalsList, children: goalVMs.map((goal) => {
                            return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.goalItem, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.goalInfo, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.goalCategory, children: goal.categoryLabel }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.goalTarget, children: goal.targetValueLabel })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [
                                            styles.toggleBtn,
                                            goal.isActive ? styles.activeToggle : styles.inactiveToggle,
                                        ], onPress: () => handleToggleActive(goal.id, goal.isActive), accessible: true, accessibilityRole: "button", accessibilityLabel: `${goal.isActive ? 'Deactivate' : 'Activate'} ${goal.categoryLabel} goal`, accessibilityHint: `Toggles this sleep goal ${goal.isActive ? 'off' : 'on'}`, hitSlop: { top: 8, bottom: 8, left: 8, right: 8 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [
                                                styles.toggleBtnText,
                                                goal.isActive ? styles.activeToggleText : styles.inactiveToggleText,
                                            ], children: goal.isActive ? 'Active' : 'Inactive' }) })] }, goal.id));
                        }) }))] })] }));
};
exports.SleepGoalsScreen = SleepGoalsScreen;
const styles = react_native_1.StyleSheet.create({
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#a1a1aa',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    formCard: {
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: '#27272a',
        borderRadius: 16,
        padding: 16,
    },
    emptyCard: {
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: '#27272a',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: '#71717a',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    goalsList: {
        gap: 12,
    },
    goalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: '#27272a',
        padding: 16,
        borderRadius: 16,
    },
    goalInfo: {
        flex: 1,
        gap: 4,
    },
    goalCategory: {
        color: '#fafafa',
        fontSize: 14,
        fontWeight: 'bold',
    },
    goalTarget: {
        color: '#818cf8',
        fontSize: 12,
        fontWeight: '600',
    },
    toggleBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
    },
    activeToggle: {
        backgroundColor: '#312e81',
        borderColor: '#4338ca',
    },
    inactiveToggle: {
        backgroundColor: '#27272a',
        borderColor: '#3f3f46',
    },
    toggleBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
    activeToggleText: {
        color: '#c7d2fe',
    },
    inactiveToggleText: {
        color: '#71717a',
    },
});
