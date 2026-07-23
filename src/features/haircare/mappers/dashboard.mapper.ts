import type { Routine, RoutineLog } from '../../routine/types';
import type { HairProduct, HairRoutine, HairLog, HaircareDashboardVM } from '../types';
import { mapToHairProductVMs } from './products.mapper';
import { mapToHairRoutineVMs } from './routines.mapper';
import { mapToHairLogVMs } from './logs.mapper';

export function buildHaircareDashboardVM(
  products: HairProduct[],
  hairRoutines: HairRoutine[],
  coreRoutines: Routine[],
  logs: HairLog[],
  coreLogs: RoutineLog[] = [],
  referenceDate = new Date()
): HaircareDashboardVM {
  const productVMs = mapToHairProductVMs(products);
  const routineVMs = mapToHairRoutineVMs(hairRoutines, coreRoutines, products, coreLogs, referenceDate);
  const logVMs = mapToHairLogVMs(logs, hairRoutines, coreRoutines, products);

  const upcomingWashDay = routineVMs.find((r) => r.status === 'pending') || routineVMs[0];
  const favoriteProducts = productVMs.filter((p) => p.isFavorite);
  const activeProductsCount = productVMs.filter((p) => p.isActive).length;

  return {
    upcomingWashDay,
    activeRoutines: routineVMs,
    favoriteProducts,
    recentLogs: logVMs.slice(0, 5),
    activeProductsCount,
    completedWashDaysCount: logs.length,
  };
}
