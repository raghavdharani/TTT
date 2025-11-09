/**
 * Sorting & Grouping Filter Section
 */

import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface SortingSectionProps {
  value?: {
    sortBy?: string;
    groupBy?: string;
  };
  onChange?: (value: {
    sortBy?: string;
    groupBy?: string;
  }) => void;
}

const sortOptions = [
  { value: 'UPC', label: 'UPC' },
  { value: 'Style', label: 'Style' },
  { value: 'Description', label: 'Description' },
  { value: 'Vendor', label: 'Vendor' },
  { value: 'Retail Price', label: 'Retail Price' },
  { value: 'Wholesale Price', label: 'Wholesale Price' },
  { value: 'Status', label: 'Status' },
  { value: 'Last Modified', label: 'Last Modified' },
];

const groupOptions = [
  { value: 'UPC', label: 'UPC' },
  { value: 'Style', label: 'Style' },
  { value: 'Vendor', label: 'Vendor' },
  { value: 'Department', label: 'Department' },
  { value: 'Class', label: 'Class' },
  { value: 'Status', label: 'Status' },
];

export function SortingSection({ value, onChange }: SortingSectionProps) {
  const handleChange = (field: string, val: string) => {
    onChange?.({
      ...value,
      [field]: val || undefined,
    });
  };

  return (
    <AccordionItem value="sorting" className="border rounded-lg mb-2 px-3">
      <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
        Sorting & Grouping
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <Label htmlFor="sort-by" className="text-gray-700">Sort By</Label>
          <Select
            value={value?.sortBy || 'UPC'}
            onValueChange={(val) => handleChange('sortBy', val)}
          >
            <SelectTrigger id="sort-by" className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="group-by" className="text-gray-700">Group By</Label>
          <Select
            value={value?.groupBy || 'UPC'}
            onValueChange={(val) => handleChange('groupBy', val)}
          >
            <SelectTrigger id="group-by" className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groupOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

