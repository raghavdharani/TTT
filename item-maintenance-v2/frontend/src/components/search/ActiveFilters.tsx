/**
 * Active Filters Component
 * Displays active filters as removable chips
 */

import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ActiveFilter {
  key: string;
  label: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
}

export function ActiveFilters({ filters, onRemove }: ActiveFiltersProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-600 mr-2">Active Filters:</span>
        {filters.map((filter) => (
          <Badge
            key={filter.key}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            {filter.label}
            <button
              onClick={() => onRemove(filter.key)}
              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              aria-label={`Remove ${filter.label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

