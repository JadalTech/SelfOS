"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToSkinAssessmentVM = mapToSkinAssessmentVM;
exports.mapToSkinAssessmentVMs = mapToSkinAssessmentVMs;
const skincare_constants_1 = require("../constants/skincare.constants");
function mapToSkinAssessmentVM(assessment) {
    const typeOption = skincare_constants_1.SKIN_TYPE_OPTIONS.find((t) => t.value === assessment.skinType);
    const skinTypeLabel = typeOption ? typeOption.label : assessment.skinType;
    let healthScoreBadgeColor = '#10b981'; // emerald
    if (assessment.overallHealthScore < 5) {
        healthScoreBadgeColor = '#ef4444'; // rose
    }
    else if (assessment.overallHealthScore < 7) {
        healthScoreBadgeColor = '#f59e0b'; // amber
    }
    const severityLabels = {
        1: 'Mild',
        2: 'Mild-Moderate',
        3: 'Moderate',
        4: 'Moderate-Severe',
        5: 'Severe',
    };
    const topConcernsFormatted = (assessment.concerns || []).map((concern) => {
        const concernOption = skincare_constants_1.SKIN_CONCERN_OPTIONS.find((c) => c.value === concern);
        const label = concernOption ? concernOption.label : concern;
        const severity = assessment.severityMap[concern] || 3;
        return {
            concern,
            label,
            severity,
            severityLabel: severityLabels[severity],
        };
    });
    const hydrationPercentage = Math.round((assessment.hydrationLevel / 5) * 100);
    const sensitivityLabels = {
        1: 'Resilient / Low',
        2: 'Slightly Sensitive',
        3: 'Moderate Sensitivity',
        4: 'High Sensitivity',
        5: 'Extremely Reactive',
    };
    const oilinessLabels = {
        1: 'Very Dry',
        2: 'Dry-Normal',
        3: 'Balanced',
        4: 'Oily',
        5: 'Very Oily / Sebum Heavy',
    };
    const barrierLabels = {
        1: 'Severely Damaged',
        2: 'Compromised',
        3: 'Normal',
        4: 'Healthy',
        5: 'Strong / Resilient',
    };
    const stressLabels = {
        1: 'Very Low',
        2: 'Low',
        3: 'Moderate',
        4: 'High',
        5: 'Very High',
    };
    return {
        id: assessment.id,
        recordDate: assessment.recordDate,
        recordDateFormatted: assessment.recordDate,
        skinType: assessment.skinType,
        skinTypeLabel,
        overallHealthScore: assessment.overallHealthScore,
        healthScoreBadgeColor,
        topConcernsFormatted,
        hydrationPercentage,
        sensitivityStatusLabel: sensitivityLabels[assessment.sensitivityLevel] || `Level ${assessment.sensitivityLevel}`,
        oilinessStatusLabel: oilinessLabels[assessment.oilinessLevel] || `Level ${assessment.oilinessLevel}`,
        barrierHealthStatusLabel: barrierLabels[assessment.barrierHealthScore] || `Level ${assessment.barrierHealthScore}`,
        sleepHoursFormatted: typeof assessment.sleepHours === 'number' ? `${assessment.sleepHours} hrs` : undefined,
        stressLevelLabel: typeof assessment.stressLevel === 'number' ? stressLabels[assessment.stressLevel] : undefined,
        notes: assessment.notes,
    };
}
function mapToSkinAssessmentVMs(assessments) {
    return assessments.map(mapToSkinAssessmentVM);
}
