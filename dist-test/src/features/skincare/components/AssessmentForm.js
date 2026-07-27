"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const skincare_validation_1 = require("../validation/skincare.validation");
const skincare_constants_1 = require("../constants/skincare.constants");
const RatingBar_1 = require("../../../shared/components/inputs/RatingBar");
const AssessmentForm = function AssessmentForm({ isSubmitting = false, onSubmit, }) {
    const [selectedConcerns, setSelectedConcerns] = (0, react_1.useState)(['acne']);
    const [severityMap, setSeverityMap] = (0, react_1.useState)({ acne: 3 });
    const { control, handleSubmit, setValue, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(skincare_validation_1.skinAssessmentSchema),
        defaultValues: {
            recordDate: new Date().toISOString().split('T')[0],
            skinType: 'combination',
            concerns: ['acne'],
            overallHealthScore: 7,
            hydrationLevel: 3,
            sensitivityLevel: 2,
            oilinessLevel: 3,
            barrierHealthScore: 4,
            severityMap: { acne: 3 },
            notes: '',
        },
    });
    const toggleConcern = (concern) => {
        let updated;
        if (selectedConcerns.includes(concern)) {
            updated = selectedConcerns.filter((c) => c !== concern);
        }
        else {
            updated = [...selectedConcerns, concern];
        }
        setSelectedConcerns(updated);
        setValue('concerns', updated);
        const updatedSev = { ...severityMap };
        if (!updatedSev[concern]) {
            updatedSev[concern] = 3;
        }
        setSeverityMap(updatedSev);
        setValue('severityMap', updatedSev);
    };
    const setConcernSeverity = (concern, sev) => {
        const updatedSev = { ...severityMap, [concern]: sev };
        setSeverityMap(updatedSev);
        setValue('severityMap', updatedSev);
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { contentContainerStyle: { gap: 20, paddingBottom: 32 }, showsVerticalScrollIndicator: false, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Assessment Date (YYYY-MM-DD) *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "recordDate", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm", onBlur: onBlur, onChangeText: onChange, value: value })) }), errors.recordDate ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs", children: errors.recordDate.message })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Current Skin Type *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "skinType", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: skincare_constants_1.SKIN_TYPE_OPTIONS.map((opt) => {
                                const isSelected = value === opt.value;
                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => onChange(opt.value), className: `px-3 py-2 rounded-xl border ${isSelected
                                        ? 'bg-pink-500/20 border-pink-500/50'
                                        : 'bg-zinc-900 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-pink-400' : 'text-zinc-300'}`, children: opt.label }) }, opt.value));
                            }) })) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Active Skin Concerns *" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: skincare_constants_1.SKIN_CONCERN_OPTIONS.map((opt) => {
                            const isSelected = selectedConcerns.includes(opt.value);
                            return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => toggleConcern(opt.value), className: `px-3 py-1.5 rounded-xl border ${isSelected
                                    ? 'bg-amber-500/20 border-amber-500/50'
                                    : 'bg-zinc-900 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-medium ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                        }) })] }), selectedConcerns.length > 0 ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-xs font-bold", children: "Concern Severity Ratings (1-5)" }), selectedConcerns.map((concern) => {
                        const label = skincare_constants_1.SKIN_CONCERN_OPTIONS.find((o) => o.value === concern)?.label || concern;
                        const currentSev = severityMap[concern] || 3;
                        return ((0, jsx_runtime_1.jsx)(RatingBar_1.RatingBar, { label: label, value: currentSev, max: 5, activeColor: "#f59e0b", onChange: (v) => setConcernSeverity(concern, v) }, concern));
                    })] })) : null, (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "overallHealthScore", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(RatingBar_1.RatingBar, { label: "Overall Skin Health Score (1-10)", value: value || 7, max: 10, activeColor: "#ec4899", onChange: onChange })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "hydrationLevel", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(RatingBar_1.RatingBar, { label: "Hydration Level (1=Very Dry, 5=Plump & Well Hydrated)", value: value || 3, max: 5, activeColor: "#3b82f6", onChange: onChange })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "barrierHealthScore", render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(RatingBar_1.RatingBar, { label: "Skin Barrier Condition (1=Damaged/Stinging, 5=Resilient)", value: value || 4, max: 5, activeColor: "#10b981", onChange: onChange })) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Additional Notes" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "notes", render: ({ field: { onChange, onBlur, value } }) => ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-xs", placeholder: "e.g. Skin felt sensitive after introducing retinol", placeholderTextColor: "#71717a", onBlur: onBlur, onChangeText: onChange, value: value })) })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: handleSubmit(onSubmit), disabled: isSubmitting, className: "bg-pink-600 p-4 rounded-2xl items-center justify-center shadow-lg", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-base font-bold", children: isSubmitting ? 'Saving Assessment...' : 'Submit Skin Assessment' }) })] }));
};
exports.AssessmentForm = AssessmentForm;
