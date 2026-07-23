import type { Routine } from '../../routine/types';
import type { HairLog, HairRoutine, HairProduct, HairLogVM } from '../types';

export function mapToHairLogVM(
  log: HairLog,
  hairRoutines: HairRoutine[],
  coreRoutines: Routine[],
  allProducts: HairProduct[]
): HairLogVM {
  const hairRoutine = hairRoutines.find((hr) => hr.id === log.hairRoutineId);
  const coreRoutine = hairRoutine
    ? coreRoutines.find((r) => r.id === hairRoutine.routineId)
    : undefined;

  const appliedProducts = allProducts
    .filter((p) => log.appliedProductIds.includes(p.id))
    .map((p) => `${p.brand} ${p.name}`);

  return {
    id: log.id,
    hairRoutineId: log.hairRoutineId,
    routineTitle: coreRoutine?.title || 'Wash Day',
    date: log.date,
    time: log.time,
    appliedProducts: appliedProducts.length > 0 ? appliedProducts : ['Standard Wash'],
    notes: log.notes,
  };
}

export function mapToHairLogVMs(
  logs: HairLog[],
  hairRoutines: HairRoutine[],
  coreRoutines: Routine[],
  allProducts: HairProduct[]
): HairLogVM[] {
  return logs.map((log) => mapToHairLogVM(log, hairRoutines, coreRoutines, allProducts));
}
