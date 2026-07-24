import type { SkincareRoutine, RoutineStep, SkincareProduct, SkincareRoutineVM, RoutineStepVM } from '../types';
import { ROUTINE_TIME_OPTIONS, SKIN_CONCERN_OPTIONS, PRODUCT_CATEGORY_OPTIONS } from '../constants/skincare.constants';

export function mapToRoutineStepVM(step: RoutineStep, products: SkincareProduct[]): RoutineStepVM {
  const product = products.find((p) => p.id === step.productId);
  const productName = product ? product.name : 'Unknown Product';
  const productBrand = product ? product.brand : 'Unknown Brand';
  const categoryOption = product ? PRODUCT_CATEGORY_OPTIONS.find((c) => c.value === product.category) : null;
  const productCategoryLabel = categoryOption ? categoryOption.label : 'Product';

  const timeOption = ROUTINE_TIME_OPTIONS.find((t) => t.value === step.timeOfDay);
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

export function mapToSkincareRoutineVM(routine: SkincareRoutine, products: SkincareProduct[]): SkincareRoutineVM {
  const timeOption = ROUTINE_TIME_OPTIONS.find((t) => t.value === routine.timeOfDay);
  const timeOfDayLabel = timeOption ? timeOption.label : routine.timeOfDay;
  const timeOfDayIcon = timeOption ? timeOption.icon : 'sunny-outline';

  const sortedSteps = [...(routine.steps || [])].sort((a, b) => a.stepOrder - b.stepOrder);
  const stepVMs = sortedSteps.map((step) => mapToRoutineStepVM(step, products));

  const targetedConcernsFormatted = (routine.targetedConcerns || []).map((c) => {
    const option = SKIN_CONCERN_OPTIONS.find((o) => o.value === c);
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

export function mapToSkincareRoutineVMs(routines: SkincareRoutine[], products: SkincareProduct[]): SkincareRoutineVM[] {
  return routines.map((r) => mapToSkincareRoutineVM(r, products));
}
