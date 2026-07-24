"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToRoutineStepVM = mapToRoutineStepVM;
exports.mapToSkincareRoutineVM = mapToSkincareRoutineVM;
exports.mapToSkincareRoutineVMs = mapToSkincareRoutineVMs;
const skincare_constants_1 = require("../constants/skincare.constants");
function mapToRoutineStepVM(step, products) {
    const product = products.find((p) => p.id === step.productId);
    const productName = product ? product.name : 'Unknown Product';
    const productBrand = product ? product.brand : 'Unknown Brand';
    const categoryOption = product ? skincare_constants_1.PRODUCT_CATEGORY_OPTIONS.find((c) => c.value === product.category) : null;
    const productCategoryLabel = categoryOption ? categoryOption.label : 'Product';
    const timeOption = skincare_constants_1.ROUTINE_TIME_OPTIONS.find((t) => t.value === step.timeOfDay);
    const timeOfDayLabel = timeOption ? timeOption.label : step.timeOfDay;
    const waitTimeFormatted = step.waitTimeMinutes && step.waitTimeMinutes > 0
        ? `Wait ${step.waitTimeMinutes} min`
        : undefined;
    return {
        id: step.id,
        productId: step.productId,
        productName,
        productBrand,
        productCategoryLabel,
        stepOrder: step.stepOrder,
        stepOrderLabel: `Step ${step.stepOrder}`,
        timeOfDayLabel,
        waitTimeFormatted,
        instructions: step.instructions,
        isOptional: step.isOptional,
    };
}
function mapToSkincareRoutineVM(routine, products) {
    const timeOption = skincare_constants_1.ROUTINE_TIME_OPTIONS.find((t) => t.value === routine.timeOfDay);
    const timeOfDayLabel = timeOption ? timeOption.label : routine.timeOfDay;
    const timeOfDayIcon = timeOption ? timeOption.icon : 'sunny-outline';
    const sortedSteps = [...(routine.steps || [])].sort((a, b) => a.stepOrder - b.stepOrder);
    const stepVMs = sortedSteps.map((step) => mapToRoutineStepVM(step, products));
    const targetedConcernsFormatted = (routine.targetedConcerns || []).map((c) => {
        const option = skincare_constants_1.SKIN_CONCERN_OPTIONS.find((o) => o.value === c);
        return option ? option.label : c;
    });
    return {
        id: routine.id,
        routineId: routine.routineId,
        timeOfDay: routine.timeOfDay,
        timeOfDayLabel,
        timeOfDayIcon,
        stepsCount: stepVMs.length,
        steps: stepVMs,
        targetedConcernsFormatted,
    };
}
function mapToSkincareRoutineVMs(routines, products) {
    return routines.map((r) => mapToSkincareRoutineVM(r, products));
}
