/**
 * Sort Controls Component
 * Advanced sorting options for search
 */

import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SortConfig } from '../../../shared/types/search';

interface SortControlsProps {
  sortConfig: SortConfig | undefined;
  onChange: (config: SortConfig) => void;
}

export function SortControls({ sortConfig, onChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <Label htmlFor="sort-field" className="text-sm text-gray-700">Sort by:</Label>
      <Select
        value={sortConfig?.field || 'relevance'}
        onValueChange={(field: SortConfig['field']) => {
          onChange({
            field,
            direction: sortConfig?.direction || 'asc',
          });
        }}
      >
        <SelectTrigger id="sort-field" className="w-40 rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="lastModified">Last Modified</SelectItem>
          <SelectItem value="creationDate">Creation Date</SelectItem>
          <SelectItem value="price">Price</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={sortConfig?.direction || 'asc'}
        onValueChange={(direction: SortConfig['direction']) => {
          onChange({
            field: sortConfig?.field || 'relevance',
            direction,
          });
        }}
      >
        <SelectTrigger className="w-32 rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

