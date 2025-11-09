/**
 * Status & Attributes Filter Section
 */

import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface StatusAttributesSectionProps {
  value?: {
    activeCode?: string;
    status?: string;
    season?: string;
    stat3?: string;
  };
  onChange?: (value: {
    activeCode?: string;
    status?: string;
    season?: string;
    stat3?: string;
  }) => void;
}

export function StatusAttributesSection({ value, onChange }: StatusAttributesSectionProps) {
  const handleChange = (field: string, val: string) => {
    onChange?.({
      ...value,
      [field]: val || undefined,
    });
  };

  return (
    <AccordionItem value="status" className="border rounded-lg mb-2 px-3">
      <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
        Status & Attributes
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <Label htmlFor="active-code" className="text-gray-700">Active Code</Label>
          <Select
            value={value?.activeCode || ''}
            onValueChange={(val) => handleChange('activeCode', val)}
          >
            <SelectTrigger id="active-code" className="rounded-lg">
              <SelectValue placeholder="Select active code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ALL</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status" className="text-gray-700">Status</Label>
          <Select
            value={value?.status || ''}
            onValueChange={(val) => handleChange('status', val)}
          >
            <SelectTrigger id="status" className="rounded-lg">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="season" className="text-gray-700">Season</Label>
          <Input
            id="season"
            placeholder="Enter season"
            className="rounded-lg"
            value={value?.season || ''}
            onChange={(e) => handleChange('season', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stat3" className="text-gray-700">Stat 3</Label>
          <Select
            value={value?.stat3 || ''}
            onValueChange={(val) => handleChange('stat3', val)}
          >
            <SelectTrigger id="stat3" className="rounded-lg">
              <SelectValue placeholder="Select Stat 3" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ALL</SelectItem>
              <SelectItem value="Option1">Option 1</SelectItem>
              <SelectItem value="Option2">Option 2</SelectItem>
              <SelectItem value="Option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
