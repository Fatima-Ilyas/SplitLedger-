/**
 * Shared TypeScript types and domain interfaces for SplitLedger.
 * Feature-specific types will be added here in upcoming phases.
 */

export interface BaseEntity {
  id: string;
  createdAt?: string;
}

export * from './split';
