/**
 * Item Details Filter Section
 */

import { AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { MultiSelect } from '../../ui/multi-select';

interface ItemDetailsSectionProps {
  value?: {
    sku?: string;
    style?: string;
    description?: string;
    posDescription?: string;
    itemNumber?: string;
    keywords?: string;
    size?: string;
    color?: string[];
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
    color?: string[];
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
          <MultiSelect
            id="color"
            options={[
              { value: 'Asst-999', label: 'Asst-999' },
              { value: 'Beige-250', label: 'Beige-250' },
              { value: 'Black-1', label: 'Black-1' },
              { value: 'Blue-400', label: 'Blue-400' },
              { value: 'Brown-300', label: 'Brown-300' },
              { value: 'Gray', label: 'Gray' },
              { value: 'Navy', label: 'Navy' },
              { value: 'Red', label: 'Red' },
              { value: 'White', label: 'White' },
            ]}
            value={value?.color || []}
            onChange={(selected) => onChange?.({ ...value, color: selected.length > 0 ? selected : undefined })}
            placeholder="Select color(s)"
          />
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

