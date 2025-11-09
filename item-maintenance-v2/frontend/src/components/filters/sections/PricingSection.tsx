/**
 * Pricing Filter Section
 * All pricing fields with min/max range selectors
 */

import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface PricingSectionProps {
  value?: {
    wholesaleCost?: { min?: number; max?: number };
    firstCost?: { min?: number; max?: number };
    retailPrice?: { min?: number; max?: number };
    retailMarkdownPrice?: { min?: number; max?: number };
    outletPrice?: { min?: number; max?: number };
    outletMarkdownPrice?: { min?: number; max?: number };
    prepack?: { min?: number; max?: number };
  };
  onChange?: (value: {
    wholesaleCost?: { min?: number; max?: number };
    firstCost?: { min?: number; max?: number };
    retailPrice?: { min?: number; max?: number };
    retailMarkdownPrice?: { min?: number; max?: number };
    outletPrice?: { min?: number; max?: number };
    outletMarkdownPrice?: { min?: number; max?: number };
    prepack?: { min?: number; max?: number };
  }) => void;
}

function PriceField({ 
  label, 
  fieldName, 
  value, 
  onChange 
}: { 
  label: string; 
  fieldName: keyof NonNullable<PricingSectionProps['value']>;
  value?: { min?: number; max?: number };
  onChange: (field: string, updates: { min?: number; max?: number }) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-700">{label}</Label>
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Min"
          className="rounded-lg flex-1"
          type="number"
          step="0.01"
          value={value?.min || ''}
          onChange={(e) => {
            const numVal = e.target.value ? parseFloat(e.target.value) : undefined;
            onChange(fieldName, { ...value, min: numVal });
          }}
        />
        <span className="text-gray-500 text-sm">to</span>
        <Input
          placeholder="Max"
          className="rounded-lg flex-1"
          type="number"
          step="0.01"
          value={value?.max || ''}
          onChange={(e) => {
            const numVal = e.target.value ? parseFloat(e.target.value) : undefined;
            onChange(fieldName, { ...value, max: numVal });
          }}
        />
      </div>
    </div>
  );
}

export function PricingSection({ value, onChange }: PricingSectionProps) {
  const handleChange = (field: string, updates: { min?: number; max?: number }) => {
    onChange?.({
      ...value,
      [field]: updates.min !== undefined || updates.max !== undefined ? updates : undefined,
    });
  };

  return (
    <AccordionItem value="pricing" className="border rounded-lg mb-2 px-3">
      <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
        Pricing
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <PriceField
          label="Wholesale Cost"
          fieldName="wholesaleCost"
          value={value?.wholesaleCost}
          onChange={handleChange}
        />
        <PriceField
          label="First Cost"
          fieldName="firstCost"
          value={value?.firstCost}
          onChange={handleChange}
        />
        <PriceField
          label="Retail Price"
          fieldName="retailPrice"
          value={value?.retailPrice}
          onChange={handleChange}
        />
        <PriceField
          label="Retail Markdown Price"
          fieldName="retailMarkdownPrice"
          value={value?.retailMarkdownPrice}
          onChange={handleChange}
        />
        <PriceField
          label="Outlet Price"
          fieldName="outletPrice"
          value={value?.outletPrice}
          onChange={handleChange}
        />
        <PriceField
          label="Outlet Markdown Price"
          fieldName="outletMarkdownPrice"
          value={value?.outletMarkdownPrice}
          onChange={handleChange}
        />
        <PriceField
          label="Prepack"
          fieldName="prepack"
          value={value?.prepack}
          onChange={handleChange}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
