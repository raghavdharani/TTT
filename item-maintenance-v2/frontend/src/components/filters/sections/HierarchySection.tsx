/**
 * Hierarchy Filter Section
 * Product classification fields
 */

import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface HierarchySectionProps {
  value?: {
    departments?: string[];
    classes?: string[];
    subclasses?: string[];
    subDept?: string;
    attribute1?: string;
    attribute2?: string;
    attribute3?: string[];
  };
  onChange?: (value: {
    departments?: string[];
    classes?: string[];
    subclasses?: string[];
    subDept?: string;
    attribute1?: string;
    attribute2?: string;
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

  const handleChange = (field: string, val: string) => {
    onChange?.({
      ...value,
      [field]: val || undefined,
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
          <Select
            value={value?.departments?.[0] || ''}
            onValueChange={(val) => handleDepartmentChange(val ? [val] : [])}
          >
            <SelectTrigger id="department" className="rounded-lg">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Accessories-02">Accessories-02</SelectItem>
              <SelectItem value="Apparel-01">Apparel-01</SelectItem>
              <SelectItem value="Beauty & Cosmetics-07">Beauty & Cosmetics-07</SelectItem>
              <SelectItem value="Footwear-03">Footwear-03</SelectItem>
              <SelectItem value="Home & Living-04">Home & Living-04</SelectItem>
              <SelectItem value="Jewelry-05">Jewelry-05</SelectItem>
              <SelectItem value="Luggage-06">Luggage-06</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="class" className="text-gray-700">Class</Label>
          <Select
            value={value?.classes?.[0] || ''}
            onValueChange={(val) => handleClassChange(val ? [val] : [])}
          >
            <SelectTrigger id="class" className="rounded-lg">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Belts-107">Belts-107</SelectItem>
              <SelectItem value="Bracelets-109">Bracelets-109</SelectItem>
              <SelectItem value="Charms-165">Charms-165</SelectItem>
              <SelectItem value="Earrings-110">Earrings-110</SelectItem>
              <SelectItem value="Necklaces-111">Necklaces-111</SelectItem>
              <SelectItem value="Rings-112">Rings-112</SelectItem>
              <SelectItem value="Watches-113">Watches-113</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subclass" className="text-gray-700">Sub-Class</Label>
          <Select
            value={value?.subclasses?.[0] || ''}
            onValueChange={(val) => handleSubclassChange(val ? [val] : [])}
          >
            <SelectTrigger id="subclass" className="rounded-lg">
              <SelectValue placeholder="Select subclass" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Adjustable Bracelets-914">Adjustable Bracelets-914</SelectItem>
              <SelectItem value="Athletic Wear-019">Athletic Wear-019</SelectItem>
              <SelectItem value="Bangles-910">Bangles-910</SelectItem>
              <SelectItem value="Bangles-909">Bangles-909</SelectItem>
              <SelectItem value="Best Seller-202">Best Seller-202</SelectItem>
              <SelectItem value="Chain Bracelets-911">Chain Bracelets-911</SelectItem>
              <SelectItem value="Cuff Bracelets-912">Cuff Bracelets-912</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sub-dept" className="text-gray-700">Sub Dept</Label>
          <Input
            id="sub-dept"
            placeholder="Enter sub department (e.g., General-000)"
            className="rounded-lg"
            value={value?.subDept || ''}
            onChange={(e) => handleChange('subDept', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attribute1" className="text-gray-700">Attribute 1</Label>
          <Input
            id="attribute1"
            placeholder="Enter attribute 1 (e.g., General-000)"
            className="rounded-lg"
            value={value?.attribute1 || ''}
            onChange={(e) => handleChange('attribute1', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attribute2" className="text-gray-700">Attribute 2</Label>
          <Input
            id="attribute2"
            placeholder="Enter attribute 2 (e.g., General-000)"
            className="rounded-lg"
            value={value?.attribute2 || ''}
            onChange={(e) => handleChange('attribute2', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attribute3" className="text-gray-700">Attribute 3</Label>
          <Select
            value={value?.attribute3?.[0] || ''}
            onValueChange={(val) => handleAttribute3Change(val ? [val] : [])}
          >
            <SelectTrigger id="attribute3" className="rounded-lg">
              <SelectValue placeholder="Select attribute 3" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Adjustable Bracelets-914">Adjustable Bracelets-914</SelectItem>
              <SelectItem value="Bangles-909">Bangles-909</SelectItem>
              <SelectItem value="Best Seller-202">Best Seller-202</SelectItem>
              <SelectItem value="Chain Bracelets-911">Chain Bracelets-911</SelectItem>
              <SelectItem value="Cuff Bracelets-912">Cuff Bracelets-912</SelectItem>
              <SelectItem value="Designer-203">Designer-203</SelectItem>
              <SelectItem value="Limited Edition-204">Limited Edition-204</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
