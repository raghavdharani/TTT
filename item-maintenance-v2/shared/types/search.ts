/**
 * Shared types for search functionality
 * Used by both frontend and backend
 */

export interface SearchFilters {
  itemDetails?: {
    style?: string;
    sku?: string;
    description?: string;
    size?: string;
    color?: string[]; // Multi-select
  };
  hierarchy?: {
    departments?: string[];
    classes?: string[];
    subclasses?: string[];
    subDept?: string[]; // Multi-select
    attribute1?: string[]; // Multi-select
    attribute2?: string[]; // Multi-select
    attribute3?: string[];
  };
  activity?: {
    status?: string[];
    lastModifiedDate?: {
      from?: Date;
      to?: Date;
    };
    creationDate?: {
      from?: Date;
      to?: Date;
    };
  };
  vendor?: {
    vendorName?: string[];
    vendorColor?: string;
    mode?: 'primary' | 'secondary';
  };
  pricing?: {
    wholesalePrice?: {
      min?: number;
      max?: number;
    };
    retailPrice?: {
      min?: number;
      max?: number;
    };
    markdownPrice?: {
      min?: number;
      max?: number;
    };
  };
  status?: {
    activeCode?: string[];
    season?: string[];
    labelTicket?: string[];
  };
  dates?: {
    lastModified?: {
      from?: Date;
      to?: Date;
    };
    creation?: {
      from?: Date;
      to?: Date;
    };
  };
}

export interface SortConfig {
  field: 'relevance' | 'lastModified' | 'creationDate' | 'price';
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page?: number;
  limit?: number;
}

export interface SearchRequest {
  quickSearch?: string;
  filters?: SearchFilters;
  vendorMode?: 'primary' | 'secondary';
  sort?: SortConfig;
  pagination?: PaginationConfig;
}

export interface SearchResponse {
  count: number;
  data: any[]; // Article records
  executionTime: number; // milliseconds
  hasMore: boolean;
  page?: number;
  limit?: number;
}

export interface RecordCountResponse {
  count: number;
  executionTime: number;
}

