"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const components_1 = require("@/shared/components");
const HAIR_TYPE_OPTIONS = [
    { label: 'Straight (1)', value: 'straight' },
    { label: 'Wavy (2)', value: 'wavy' },
    { label: 'Curly (3)', value: 'curly' },
    { label: 'Coily (4)', value: 'coily' },
];
const POROSITY_OPTIONS = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Unknown', value: 'unknown' },
];
const SCALP_TYPE_OPTIONS = [
    { label: 'Dry', value: 'dry' },
    { label: 'Normal', value: 'normal' },
    { label: 'Oily', value: 'oily' },
    { label: 'Combo', value: 'combination' },
    { label: 'Sensitive', value: 'sensitive' },
];
const DENSITY_OPTIONS = [
    { label: 'Thin', value: 'thin' },
    { label: 'Medium', value: 'medium' },
    { label: 'Thick', value: 'thick' },
];
const ConditionForm = function ConditionForm({ initialValues, isSubmitting = false, submitLabel = 'Save Assessment Record', onSubmit, }) {
    const [recordDate, setRecordDate] = (0, react_1.useState)(initialValues?.recordDate || new Date().toISOString().split('T')[0]);
    const [hairType, setHairType] = (0, react_1.useState)(initialValues?.hairType || 'wavy');
    const [porosity, setPorosity] = (0, react_1.useState)(initialValues?.porosity || 'medium');
    const [scalpType, setScalpType] = (0, react_1.useState)(initialValues?.scalpType || 'normal');
    const [hairDensity, setHairDensity] = (0, react_1.useState)(initialValues?.hairDensity || 'medium');
    // Rating levels (1-5)
    const [sheddingLevel, setSheddingLevel] = (0, react_1.useState)(initialValues?.sheddingLevel || 2);
    const [dandruffLevel, setDandruffLevel] = (0, react_1.useState)(initialValues?.dandruffLevel || 1);
    const [itchinessLevel, setItchinessLevel] = (0, react_1.useState)(initialValues?.itchinessLevel || 1);
    const [oilinessLevel, setOilinessLevel] = (0, react_1.useState)(initialValues?.oilinessLevel || 2);
    const [drynessLevel, setDrynessLevel] = (0, react_1.useState)(initialValues?.drynessLevel || 2);
    const [breakageLevel, setBreakageLevel] = (0, react_1.useState)(initialValues?.breakageLevel || 1);
    const [frizzLevel, setFrizzLevel] = (0, react_1.useState)(initialValues?.frizzLevel || 2);
    const [shineLevel, setShineLevel] = (0, react_1.useState)(initialValues?.shineLevel || 3);
    // Overall Health (1-10)
    const [overallHealth, setOverallHealth] = (0, react_1.useState)(initialValues?.overallHealth || 8);
    // Optional Lifestyle Factors
    const [notes, setNotes] = (0, react_1.useState)(initialValues?.notes || '');
    const handleSubmit = async () => {
        await onSubmit({
            recordDate,
            hairType,
            porosity,
            scalpType,
            hairDensity,
            sheddingLevel,
            dandruffLevel,
            itchinessLevel,
            oilinessLevel,
            drynessLevel,
            breakageLevel,
            frizzLevel,
            shineLevel,
            overallHealth,
            notes: notes.trim() || undefined,
        });
    };
    const renderRatingSelector = (label, value, onChange, max = 5) => {
        return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1 my-1", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: label }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-amber-400 text-xs font-bold", children: [value, "/", max] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row gap-1.5", children: Array.from({ length: max }, (_, i) => i + 1).map((val) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `flex-1 py-2 rounded-xl items-center border ${value === val
                            ? 'bg-amber-500/20 border-amber-500'
                            : 'bg-zinc-950 border-zinc-800'}`, onPress: () => onChange(val), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold ${value === val ? 'text-amber-400' : 'text-zinc-400'}`, children: val }) }, val))) })] }));
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "gap-4 max-h-[550px]", showsVerticalScrollIndicator: false, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Assessment Date (YYYY-MM-DD)" }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500", value: recordDate, onChangeText: setRecordDate })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Hair Type" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: HAIR_TYPE_OPTIONS.map((opt) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-3 py-2 rounded-xl border ${hairType === opt.value
                                ? 'bg-amber-500/20 border-amber-500'
                                : 'bg-zinc-950 border-zinc-800'}`, onPress: () => setHairType(opt.value), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold ${hairType === opt.value ? 'text-amber-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value))) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Hair Porosity" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: POROSITY_OPTIONS.map((opt) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-3 py-2 rounded-xl border ${porosity === opt.value
                                ? 'bg-amber-500/20 border-amber-500'
                                : 'bg-zinc-950 border-zinc-800'}`, onPress: () => setPorosity(opt.value), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold ${porosity === opt.value ? 'text-amber-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value))) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Scalp Type" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: SCALP_TYPE_OPTIONS.map((opt) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-3 py-2 rounded-xl border ${scalpType === opt.value
                                ? 'bg-amber-500/20 border-amber-500'
                                : 'bg-zinc-950 border-zinc-800'}`, onPress: () => setScalpType(opt.value), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold ${scalpType === opt.value ? 'text-amber-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value))) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Hair Density" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-2", children: DENSITY_OPTIONS.map((opt) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-3 py-2 rounded-xl border ${hairDensity === opt.value
                                ? 'bg-amber-500/20 border-amber-500'
                                : 'bg-zinc-950 border-zinc-800'}`, onPress: () => setHairDensity(opt.value), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold ${hairDensity === opt.value ? 'text-amber-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value))) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2 bg-zinc-950/60 border border-zinc-800/80 p-3 rounded-2xl", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1", children: "Symptom Ratings (1 = Very Low / Minimal, 5 = Severe)" }), renderRatingSelector('Hair Shedding', sheddingLevel, setSheddingLevel), renderRatingSelector('Dandruff / Flakes', dandruffLevel, setDandruffLevel), renderRatingSelector('Scalp Itchiness', itchinessLevel, setItchinessLevel), renderRatingSelector('Scalp Oiliness', oilinessLevel, setOilinessLevel), renderRatingSelector('Hair Dryness', drynessLevel, setDrynessLevel), renderRatingSelector('Hair Breakage', breakageLevel, setBreakageLevel), renderRatingSelector('Frizz Level', frizzLevel, setFrizzLevel), renderRatingSelector('Hair Shine & Luster', shineLevel, setShineLevel)] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-1", children: renderRatingSelector('Overall Hair & Scalp Health Score', overallHealth, setOverallHealth, 10) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold", children: "Notes & Observations" }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500", placeholder: "e.g. Scalp felt dry after switching shampoos", placeholderTextColor: "#71717a", multiline: true, numberOfLines: 3, value: notes, onChangeText: setNotes })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-amber-500 active:bg-amber-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-amber-500/20 my-2", onPress: () => void handleSubmit(), disabled: isSubmitting, children: isSubmitting ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "Saving assessment...", color: "#09090b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-xs", children: submitLabel })) })] }));
};
exports.ConditionForm = ConditionForm;
