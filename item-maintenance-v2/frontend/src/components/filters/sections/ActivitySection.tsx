/**
 * Activity Filter Section
 * On Hand, On Order, Sales, Returns, Receiving, Transfers, Distributions
 */

import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
// Format date helper (avoiding date-fns dependency)
const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

interface ActivitySectionProps {
  value?: {
    onHand?: { enabled: boolean; value?: string };
    onOrder?: { enabled: boolean; value?: string };
    sales?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    returns?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    receiving?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    transfers?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    distributions?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
  };
  onChange?: (value: {
    onHand?: { enabled: boolean; value?: string };
    onOrder?: { enabled: boolean; value?: string };
    sales?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    returns?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    receiving?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    transfers?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    distributions?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
  }) => void;
}

const activityOptions = [
  { value: 'Any', label: 'Any' },
  { value: 'No', label: 'No' },
];

function SimpleActivityField({
  label,
  fieldName,
  value,
  onChange,
}: {
  label: string;
  fieldName: 'onHand' | 'onOrder';
  value?: { enabled: boolean; value?: string };
  onChange: (field: string, updates: { enabled: boolean; value?: string }) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${fieldName}-checkbox`}
          checked={value?.enabled || false}
          onCheckedChange={(checked) => onChange(fieldName, { ...value, enabled: checked === true })}
        />
        <Label htmlFor={`${fieldName}-checkbox`} className="text-gray-700 cursor-pointer">{label}</Label>
      </div>
      {value?.enabled && (
        <div className="pl-6">
          <Select
            value={value?.value || 'Any'}
            onValueChange={(val) => onChange(fieldName, { ...value, value: val })}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {activityOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

function DateRangeActivityField({
  label,
  fieldName,
  value,
  onChange,
}: {
  label: string;
  fieldName: 'sales' | 'returns' | 'receiving' | 'transfers' | 'distributions';
  value?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
  onChange: (field: string, updates: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date }) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${fieldName}-checkbox`}
          checked={value?.enabled || false}
          onCheckedChange={(checked) => onChange(fieldName, { ...value, enabled: checked === true })}
        />
        <Label htmlFor={`${fieldName}-checkbox`} className="text-gray-700 cursor-pointer">{label}</Label>
      </div>
      {value?.enabled && (
        <div className="space-y-3 pl-6">
          <Select
            value={value?.value || 'Any'}
            onValueChange={(val) => onChange(fieldName, { ...value, value: val })}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {activityOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <Label className="text-sm text-gray-600 font-medium">START DATE</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  placeholder="Select start date"
                  className="rounded-lg"
                  value={value?.startDate ? formatDate(value.startDate) : ''}
                  readOnly
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value?.startDate}
                  onSelect={(date) => onChange(fieldName, { ...value, startDate: date })}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-600 font-medium">END DATE</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  placeholder="Select end date"
                  className="rounded-lg"
                  value={value?.endDate ? formatDate(value.endDate) : ''}
                  readOnly
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value?.endDate}
                  onSelect={(date) => onChange(fieldName, { ...value, endDate: date })}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}

export function ActivitySection({ value, onChange }: ActivitySectionProps) {
  const handleChange = (field: string, updates: any) => {
    onChange?.({
      ...value,
      [field]: updates,
    });
  };

  return (
    <AccordionItem value="activity" className="border rounded-lg mb-2 px-3">
      <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
        Activity
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <SimpleActivityField
          label="On Hand"
          fieldName="onHand"
          value={value?.onHand}
          onChange={handleChange}
        />
        <SimpleActivityField
          label="On Order"
          fieldName="onOrder"
          value={value?.onOrder}
          onChange={handleChange}
        />
        <DateRangeActivityField
          label="Sales"
          fieldName="sales"
          value={value?.sales}
          onChange={handleChange}
        />
        <DateRangeActivityField
          label="Returns"
          fieldName="returns"
          value={value?.returns}
          onChange={handleChange}
        />
        <DateRangeActivityField
          label="Receiving"
          fieldName="receiving"
          value={value?.receiving}
          onChange={handleChange}
        />
        <DateRangeActivityField
          label="Transfers"
          fieldName="transfers"
          value={value?.transfers}
          onChange={handleChange}
        />
        <DateRangeActivityField
          label="Distributions"
          fieldName="distributions"
          value={value?.distributions}
          onChange={handleChange}
        />
      </AccordionContent>
    </AccordionItem>
  );
}

