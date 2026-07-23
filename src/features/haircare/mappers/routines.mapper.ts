import type { Routine, RoutineLog } from '../../routine/types';
import { getRoutineStatusForDate } from '../../routine/engine/completion';
import type { HairRoutine, HairProduct, HairRoutineVM } from '../types';
import { mapToHairProductVMs } from './products.mapper';

const ROUTINE_CATEGORY_LABELS: Record<string, string> = {
  'wash-day': 'Wash Day',
  oiling: 'Hair Oiling',
  'scalp-massage': 'Scalp Massage',
  'deep-conditioning': 'Deep Conditioning',
  custom: 'Special Routine',
};

export function mapToHairRoutineVM(
  hairRoutine: HairRoutine,
  coreRoutines: Routine[],
  allProducts: HairProduct[],
  coreLogs: RoutineLog[] = [],
  referenceDate = new Date()
): HairRoutineVM {
  const core = coreRoutines.find((r) => r.id === hairRoutine.routineId);
  const todayStr = referenceDate.toISOString().split('T')[0];

  const status = core
    ? getRoutineStatusForDate(core, coreLogs, todayStr, referenceDate)
    : 'pending';

  const linkedProducts = allProducts.filter((p) => hairRoutine.productIds.includes(p.id));

  return {
    id: hairRoutine.id,
    routineId: hairRoutine.routineId,
    title: core?.title || 'Haircare Routine',
    categoryLabel: ROUTINE_CATEGORY_LABELS[hairRoutine.haircareCategory] ?? 'Hair Routine',
    scheduleSummary: core?.schedule.frequency || 'Scheduled',
    status,
    currentStreak: core?.currentStreak || 0,
    products: mapToHairProductVMs(linkedProducts),
    instructions: hairRoutine.instructions,
  };
}

export function mapToHairRoutineVMs(
  hairRoutines: HairRoutine[],
  coreRoutines: Routine[],
  allProducts: HairProduct[],
  coreLogs: RoutineLog[] = [],
  referenceDate = new Date()
): HairRoutineVM[] {
  return hairRoutines.map((hr) =>
    mapToHairRoutineVM(hr, coreRoutines, allProducts, coreLogs, referenceDate)
  );
}
