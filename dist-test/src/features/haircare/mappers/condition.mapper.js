"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToHairConditionVM = mapToHairConditionVM;
exports.mapToHairConditionVMs = mapToHairConditionVMs;
exports.filterConditionVMs = filterConditionVMs;
const HAIR_TYPE_LABELS = {
    straight: 'Type 1 (Straight)',
    wavy: 'Type 2 (Wavy)',
    curly: 'Type 3 (Curly)',
    coily: 'Type 4 (Coily)',
};
const POROSITY_LABELS = {
    low: 'Low Porosity',
    medium: 'Medium Porosity',
    high: 'High Porosity',
    unknown: 'Unknown Porosity',
};
const SCALP_TYPE_LABELS = {
    dry: 'Dry Scalp',
    normal: 'Normal Scalp',
    oily: 'Oily Scalp',
    combination: 'Combination Scalp',
    sensitive: 'Sensitive Scalp',
};
const DENSITY_LABELS = {
    thin: 'Thin Density',
    medium: 'Medium Density',
    thick: 'Thick Density',
};
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
function mapToHairConditionVM(condition) {
    const parts = condition.recordDate.split('-');
    let formattedDate = condition.recordDate;
    if (parts.length === 3) {
        const year = parts[0];
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (monthIdx >= 0 && monthIdx < 12) {
            formattedDate = `${MONTH_NAMES[monthIdx].substring(0, 3)} ${day}, ${year}`;
        }
    }
    let healthBadgeColor = 'text-amber-400 bg-amber-500/20 border-amber-500/40';
    let healthBadgeLabel = 'Fair / Moderate';
    if (condition.overallHealth >= 8) {
        healthBadgeColor = 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
        healthBadgeLabel = 'Optimal / Healthy';
    }
    else if (condition.overallHealth <= 4) {
        healthBadgeColor = 'text-rose-400 bg-rose-500/20 border-rose-500/40';
        healthBadgeLabel = 'Needs Attention';
    }
    return {
        id: condition.id,
        recordDate: condition.recordDate,
        formattedDate,
        hairTypeLabel: HAIR_TYPE_LABELS[condition.hairType] || 'Wavy',
        porosityLabel: POROSITY_LABELS[condition.porosity] || 'Medium Porosity',
        scalpTypeLabel: SCALP_TYPE_LABELS[condition.scalpType] || 'Normal Scalp',
        hairDensityLabel: DENSITY_LABELS[condition.hairDensity] || 'Medium Density',
        sheddingLevel: condition.sheddingLevel,
        dandruffLevel: condition.dandruffLevel,
        itchinessLevel: condition.itchinessLevel,
        oilinessLevel: condition.oilinessLevel,
        drynessLevel: condition.drynessLevel,
        breakageLevel: condition.breakageLevel,
        frizzLevel: condition.frizzLevel,
        shineLevel: condition.shineLevel,
        overallHealth: condition.overallHealth,
        healthBadgeColor,
        healthBadgeLabel,
        stressLevel: condition.stressLevel,
        sleepHours: condition.sleepHours,
        waterIntakeLiters: condition.waterIntakeLiters,
        notes: condition.notes,
    };
}
function mapToHairConditionVMs(conditions) {
    return conditions.map(mapToHairConditionVM);
}
function filterConditionVMs(vms, params) {
    const { searchKeyword, scalpType, minHealthScore, dateSort = 'newest' } = params;
    let filtered = [...vms];
    if (searchKeyword && searchKeyword.trim().length > 0) {
        const q = searchKeyword.trim().toLowerCase();
        filtered = filtered.filter((vm) => vm.formattedDate.toLowerCase().includes(q) ||
            vm.notes?.toLowerCase().includes(q) ||
            vm.scalpTypeLabel.toLowerCase().includes(q) ||
            vm.hairTypeLabel.toLowerCase().includes(q));
    }
    if (scalpType && scalpType !== 'all') {
        filtered = filtered.filter((vm) => vm.scalpTypeLabel.toLowerCase().includes(scalpType.toLowerCase()));
    }
    if (minHealthScore && minHealthScore > 0) {
        filtered = filtered.filter((vm) => vm.overallHealth >= minHealthScore);
    }
    filtered.sort((a, b) => {
        if (dateSort === 'newest') {
            return b.recordDate.localeCompare(a.recordDate);
        }
        return a.recordDate.localeCompare(b.recordDate);
    });
    return filtered;
}
