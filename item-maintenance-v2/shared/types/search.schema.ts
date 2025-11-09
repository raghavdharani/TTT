/**
 * Zod schemas for search request/response validation
 * Used for both client and server-side validation
 */

import { z } from 'zod';

export const SearchFiltersSchema = z.object({
  hierarchy: z.object({
    departments: z.array(z.string()).optional(),
    classes: z.array(z.string()).optional(),
    subclasses: z.array(z.string()).optional(),
  }).optional(),
  activity: z.object({
    status: z.array(z.string()).optional(),
    lastModifiedDate: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }).optional(),
    creationDate: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }).optional(),
  }).optional(),
  vendor: z.object({
    vendorName: z.array(z.string()).optional(),
    vendorColor: z.string().optional(),
    mode: z.enum(['primary', 'secondary']).optional(),
  }).optional(),
  pricing: z.object({
    wholesalePrice: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    retailPrice: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    markdownPrice: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
  }).optional(),
  status: z.object({
    activeCode: z.array(z.string()).optional(),
    season: z.array(z.string()).optional(),
    labelTicket: z.array(z.string()).optional(),
  }).optional(),
  dates: z.object({
    lastModified: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }).optional(),
    creation: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }).optional(),
  }).optional(),
});

export const SortConfigSchema = z.object({
  field: z.enum(['relevance', 'lastModified', 'creationDate', 'price']),
  direction: z.enum(['asc', 'desc']),
});

export const PaginationConfigSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(10000).optional(),
});

export const SearchRequestSchema = z.object({
  quickSearch: z.string().optional(),
  filters: SearchFiltersSchema.optional(),
  vendorMode: z.enum(['primary', 'secondary']).optional(),
  sort: SortConfigSchema.optional(),
  pagination: PaginationConfigSchema.optional(),
});

export type SearchRequest = z.infer<typeof SearchRequestSchema>;
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
export type SortConfig = z.infer<typeof SortConfigSchema>;
export type PaginationConfig = z.infer<typeof PaginationConfigSchema>;

