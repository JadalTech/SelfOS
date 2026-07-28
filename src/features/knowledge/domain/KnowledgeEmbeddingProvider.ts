/**
 * Decoupled Knowledge Embedding Provider Interface
 * SelfOS v3.2.0 — Batch 14C
 */

import type { SearchResult } from './knowledge.types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';

export interface IKnowledgeEmbeddingProvider {
  readonly providerName: string;
  generateEmbedding(text: string): Promise<Result<number[], AppError>>;
  vectorSearch(queryVector: number[], topK: number): Promise<Result<readonly SearchResult[], AppError>>;
}
export default IKnowledgeEmbeddingProvider;
