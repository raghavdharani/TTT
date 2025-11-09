/**
 * Item Details Filter Section
 */

import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface ItemDetailsSectionProps {
  value?: {
    sku?: string;
    style?: string;
    description?: string;
    posDescription?: string;
    itemNumber?: string;
    keywords?: string;
    size?: string;
    color?: string;
    alias?: string;
    origin?: string;
  };
  onChange?: (value: {
    sku?: string;
    style?: string;
    description?: string;
    posDescription?: string;
    itemNumber?: string;
    keywords?: string;
    size?: string;
    color?: string;
    alias?: string;
    origin?: string;
  }) => void;
}

export function ItemDetailsSection({ value, onChange }: ItemDetailsSectionProps) {
  const handleChange = (field: string, val: string) => {
    onChange?.({
      ...value,
      [field]: val || undefined,
    });
  };

  return (
    <AccordionItem value="item-details" className="border rounded-lg mb-2 px-3">
      <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
        Item Details
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <Label htmlFor="sku" className="text-gray-700">SKU/UPC</Label>
          <Input
            id="sku"
            placeholder="Enter SKU or UPC"
            className="rounded-lg"
            value={value?.sku || ''}
            onChange={(e) => handleChange('sku', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="style" className="text-gray-700">Style</Label>
          <Input
            id="style"
            placeholder="Enter style"
            className="rounded-lg"
            value={value?.style || ''}
            onChange={(e) => handleChange('style', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-700">Description</Label>
          <Input
            id="description"
            placeholder="Enter description"
            className="rounded-lg"
            value={value?.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pos-description" className="text-gray-700">POS Description</Label>
          <Input
            id="pos-description"
            placeholder="Enter POS description"
            className="rounded-lg"
            value={value?.posDescription || ''}
            onChange={(e) => handleChange('posDescription', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-number" className="text-gray-700">Item#</Label>
          <Input
            id="item-number"
            placeholder="Enter item number"
            className="rounded-lg"
            value={value?.itemNumber || ''}
            onChange={(e) => handleChange('itemNumber', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-gray-700">Keywords</Label>
          <Input
            id="keywords"
            placeholder="Enter keywords"
            className="rounded-lg"
            value={value?.keywords || ''}
            onChange={(e) => handleChange('keywords', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size" className="text-gray-700">Size</Label>
          <Select
            value={value?.size || ''}
            onValueChange={(val) => handleChange('size', val)}
          >
            <SelectTrigger id="size" className="rounded-lg">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XS">XS</SelectItem>
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="XL">XL</SelectItem>
              <SelectItem value="XXL">XXL</SelectItem>
              <SelectItem value="One Size">One Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="color" className="text-gray-700">Color</Label>
          <Select
            value={value?.color || ''}
            onValueChange={(val) => handleChange('color', val)}
          >
            <SelectTrigger id="color" className="rounded-lg">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asst-999">Asst-999</SelectItem>
              <SelectItem value="Beige-250">Beige-250</SelectItem>
              <SelectItem value="Black-1">Black-1</SelectItem>
              <SelectItem value="Blue-400">Blue-400</SelectItem>
              <SelectItem value="Brown-300">Brown-300</SelectItem>
              <SelectItem value="Gray">Gray</SelectItem>
              <SelectItem value="Navy">Navy</SelectItem>
              <SelectItem value="Red">Red</SelectItem>
              <SelectItem value="White">White</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="alias" className="text-gray-700">Alias</Label>
          <Input
            id="alias"
            placeholder="Enter alias"
            className="rounded-lg"
            value={value?.alias || ''}
            onChange={(e) => handleChange('alias', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="origin" className="text-gray-700">Origin</Label>
          <Input
            id="origin"
            placeholder="Enter origin"
            className="rounded-lg"
            value={value?.origin || ''}
            onChange={(e) => handleChange('origin', e.target.value)}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

