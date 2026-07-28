/**
 * Generic Shared Productivity Repository Interface
 * SelfOS v3.0.0 — Batch 14A
 */

import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';

export interface IProductivityRepository<T> {
  getById(id: string): Promise<Result<T | null, AppError>>;
  getAll(userId: string): Promise<Result<readonly T[], AppError>>;
  save(item: T): Promise<Result<T, AppError>>;
  delete(id: string): Promise<Result<boolean, AppError>>;
}
export default IProductivityRepository;
