/**
 * Vendor Filter Section
 */

import { AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { MultiSelect } from '../../ui/multi-select';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';

interface VendorSectionProps {
  value?: {
    vendorName?: string[];
    vendorColor?: string;
    mode?: 'primary' | 'secondary';
  };
  onChange?: (value: { vendorName?: string[]; vendorColor?: string; mode?: 'primary' | 'secondary' }) => void;
  currentVendorMode?: 'primary' | 'secondary';
}

export function VendorSection({ value, onChange, currentVendorMode = 'primary' }: VendorSectionProps) {
  const handleVendorNameChange = (selected: string[]) => {
    onChange?.({
      ...value,
      vendorName: selected.length > 0 ? selected : undefined,
    });
  };

  const handleVendorColorChange = (color: string) => {
    onChange?.({
      ...value,
      vendorColor: color || undefined,
    });
  };

  const handleModeChange = (mode: 'primary' | 'secondary') => {
    onChange?.({
      ...value,
      mode,
    });
  };

  return (
    <AccordionItem value="vendor" className="border rounded-lg mb-2 px-3">
      <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
        Vendor
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <Label htmlFor="vendor-name" className="text-gray-700">Vendor Name</Label>
          <MultiSelect
            id="vendor-name"
            options={[
              { value: 'Oscar de la Renta', label: 'Oscar de la Renta' },
              { value: 'Vendor A', label: 'Vendor A' },
              { value: 'Vendor B', label: 'Vendor B' },
              { value: 'Vendor C', label: 'Vendor C' },
              { value: 'Vendor D', label: 'Vendor D' },
              { value: 'Vendor E', label: 'Vendor E' },
              { value: 'Vendor F', label: 'Vendor F' },
              { value: 'Vendor G', label: 'Vendor G' },
              { value: 'Vendor H', label: 'Vendor H' },
              { value: 'Vendor I', label: 'Vendor I' },
            ]}
            value={value?.vendorName || []}
            onChange={handleVendorNameChange}
            placeholder="Select vendor(s)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendor-color" className="text-gray-700">Vendor Color</Label>
          <Input
            id="vendor-color"
            placeholder="Enter vendor color"
            className="rounded-lg"
            value={value?.vendorColor || ''}
            onChange={(e) => handleVendorColorChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Vendor Mode</Label>
          <RadioGroup
            value={currentVendorMode || 'primary'}
            onValueChange={(val) => handleModeChange(val as 'primary' | 'secondary')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="primary" id="primary" />
              <Label htmlFor="primary">Primary</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="secondary" id="secondary" />
              <Label htmlFor="secondary">Secondary</Label>
            </div>
          </RadioGroup>
          {currentVendorMode === 'secondary' && (
            <p className="text-xs text-amber-600 mt-2">
              Secondary mode: Only price fields and status are editable
            </p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
