/**
 * Hierarchy Filter Section
 * Product classification fields
 */

import { AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Label } from '../../ui/label';
import { MultiSelect } from '../../ui/multi-select';

interface HierarchySectionProps {
  value?: {
    departments?: string[];
    classes?: string[];
    subclasses?: string[];
    subDept?: string[];
    attribute1?: string[];
    attribute2?: string[];
    attribute3?: string[];
  };
  onChange?: (value: {
    departments?: string[];
    classes?: string[];
    subclasses?: string[];
    subDept?: string[];
    attribute1?: string[];
    attribute2?: string[];
    attribute3?: string[];
  }) => void;
}

export function HierarchySection({ value, onChange }: HierarchySectionProps) {
  const handleDepartmentChange = (selected: string[]) => {
    onChange?.({
      ...value,
      departments: selected.length > 0 ? selected : undefined,
    });
  };

  const handleClassChange = (selected: string[]) => {
    onChange?.({
      ...value,
      classes: selected.length > 0 ? selected : undefined,
    });
  };

  const handleSubclassChange = (selected: string[]) => {
    onChange?.({
      ...value,
      subclasses: selected.length > 0 ? selected : undefined,
    });
  };

  const handleArrayChange = (field: 'subDept' | 'attribute1' | 'attribute2', selected: string[]) => {
    onChange?.({
      ...value,
      [field]: selected.length > 0 ? selected : undefined,
    });
  };

  const handleAttribute3Change = (selected: string[]) => {
    onChange?.({
      ...value,
      attribute3: selected.length > 0 ? selected : undefined,
    });
  };

  return (
    <AccordionItem value="hierarchy" className="border rounded-lg mb-2 px-3">
      <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
        Hierarchy
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <Label htmlFor="department" className="text-gray-700">Department</Label>
          <MultiSelect
            id="department"
            options={[
              { value: 'Accessories-02', label: 'Accessories-02' },
              { value: 'Apparel-01', label: 'Apparel-01' },
              { value: 'Beauty & Cosmetics-07', label: 'Beauty & Cosmetics-07' },
              { value: 'Footwear-03', label: 'Footwear-03' },
              { value: 'Home & Living-04', label: 'Home & Living-04' },
              { value: 'Jewelry-05', label: 'Jewelry-05' },
              { value: 'Luggage-06', label: 'Luggage-06' },
            ]}
            value={value?.departments || []}
            onChange={handleDepartmentChange}
            placeholder="Select department(s)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="class" className="text-gray-700">Class</Label>
          <MultiSelect
            id="class"
            options={[
              { value: 'Earrings-400', label: 'Earrings-400' },
              { value: 'Belts-107', label: 'Belts-107' },
              { value: 'Bracelets-109', label: 'Bracelets-109' },
              { value: 'Charms-165', label: 'Charms-165' },
              { value: 'Earrings-110', label: 'Earrings-110' },
              { value: 'Necklaces-111', label: 'Necklaces-111' },
              { value: 'Rings-112', label: 'Rings-112' },
              { value: 'Watches-113', label: 'Watches-113' },
              { value: 'Tops-201', label: 'Tops-201' },
              { value: 'Bottoms-202', label: 'Bottoms-202' },
              { value: 'Outerwear-203', label: 'Outerwear-203' },
            ]}
            value={value?.classes || []}
            onChange={handleClassChange}
            placeholder="Select class(es)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subclass" className="text-gray-700">Sub-Class</Label>
          <MultiSelect
            id="subclass"
            options={[
              { value: 'General-000', label: 'General-000' },
              { value: 'Adjustable Bracelets-914', label: 'Adjustable Bracelets-914' },
              { value: 'Athletic Wear-019', label: 'Athletic Wear-019' },
              { value: 'Bangles-910', label: 'Bangles-910' },
              { value: 'Bangles-909', label: 'Bangles-909' },
              { value: 'Best Seller-202', label: 'Best Seller-202' },
              { value: 'Chain Bracelets-911', label: 'Chain Bracelets-911' },
              { value: 'Cuff Bracelets-912', label: 'Cuff Bracelets-912' },
              { value: 'T-Shirts-301', label: 'T-Shirts-301' },
              { value: 'Jeans-302', label: 'Jeans-302' },
              { value: 'Sweaters-303', label: 'Sweaters-303' },
              { value: 'Blouses-304', label: 'Blouses-304' },
              { value: 'Jackets-305', label: 'Jackets-305' },
              { value: 'Shorts-306', label: 'Shorts-306' },
            ]}
            value={value?.subclasses || []}
            onChange={handleSubclassChange}
            placeholder="Select subclass(es)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sub-dept" className="text-gray-700">Sub Dept</Label>
          <MultiSelect
            id="sub-dept"
            options={[
              { value: 'General-000', label: 'General-000' },
              { value: 'General-001', label: 'General-001' },
              { value: 'General-002', label: 'General-002' },
            ]}
            value={value?.subDept || []}
            onChange={(selected) => handleArrayChange('subDept', selected)}
            placeholder="Select sub department(s)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attribute1" className="text-gray-700">Attribute 1</Label>
          <MultiSelect
            id="attribute1"
            options={[
              { value: 'General-000', label: 'General-000' },
              { value: 'General-001', label: 'General-001' },
              { value: 'General-002', label: 'General-002' },
            ]}
            value={value?.attribute1 || []}
            onChange={(selected) => handleArrayChange('attribute1', selected)}
            placeholder="Select attribute 1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attribute2" className="text-gray-700">Attribute 2</Label>
          <MultiSelect
            id="attribute2"
            options={[
              { value: 'General-000', label: 'General-000' },
              { value: 'General-001', label: 'General-001' },
              { value: 'General-002', label: 'General-002' },
            ]}
            value={value?.attribute2 || []}
            onChange={(selected) => handleArrayChange('attribute2', selected)}
            placeholder="Select attribute 2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attribute3" className="text-gray-700">Attribute 3</Label>
          <MultiSelect
            id="attribute3"
            options={[
              { value: 'On Sale-202', label: 'On Sale-202' },
              { value: 'Best Seller-202', label: 'Best Seller-202' },
              { value: 'Designer-203', label: 'Designer-203' },
              { value: 'Limited Edition-204', label: 'Limited Edition-204' },
              { value: 'Adjustable Bracelets-914', label: 'Adjustable Bracelets-914' },
              { value: 'Bangles-909', label: 'Bangles-909' },
              { value: 'Chain Bracelets-911', label: 'Chain Bracelets-911' },
              { value: 'Cuff Bracelets-912', label: 'Cuff Bracelets-912' },
            ]}
            value={value?.attribute3 || []}
            onChange={handleAttribute3Change}
            placeholder="Select attribute 3"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
