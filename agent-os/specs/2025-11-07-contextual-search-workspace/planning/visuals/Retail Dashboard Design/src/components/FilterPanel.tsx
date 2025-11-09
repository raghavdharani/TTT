import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from './ui/utils';

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilters: { key: string; label: string }[];
  onApplyFilters: (filters: { key: string; label: string }[]) => void;
}

export function FilterPanel({ open, onOpenChange, activeFilters, onApplyFilters }: FilterPanelProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [department, setDepartment] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [activeCode, setActiveCode] = useState('');

  const handleApplyFilters = () => {
    const filters: { key: string; label: string }[] = [];
    
    if (department) {
      filters.push({ key: 'department', label: `Department: ${department}` });
    }
    if (vendorName) {
      filters.push({ key: 'vendor', label: `Vendor: ${vendorName}` });
    }
    if (activeCode) {
      filters.push({ key: 'status', label: `Status: ${activeCode}` });
    }
    if (dateFrom || dateTo) {
      const dateLabel = dateFrom && dateTo 
        ? `Date: ${dateFrom.toLocaleDateString()} - ${dateTo.toLocaleDateString()}`
        : dateFrom 
        ? `Date: From ${dateFrom.toLocaleDateString()}`
        : `Date: To ${dateTo?.toLocaleDateString()}`;
      filters.push({ key: 'date', label: dateLabel });
    }
    
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setDepartment('');
    setVendorName('');
    setActiveCode('');
    onApplyFilters([]);
  };

  if (!open) return null;

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-gray-900">Filters</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="h-8 w-8 rounded-lg"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['item-details', 'hierarchy']} className="w-full">
            <AccordionItem value="item-details" className="border rounded-lg mb-2 px-3">
              <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
                Item Details
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-gray-700">SKU/UPC</Label>
                  <Input id="sku" placeholder="Enter SKU or UPC" className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">Description</Label>
                  <Input id="description" placeholder="Enter description" className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-gray-700">Size</Label>
                  <Select>
                    <SelectTrigger id="size" className="rounded-lg">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xs">XS</SelectItem>
                      <SelectItem value="s">S</SelectItem>
                      <SelectItem value="m">M</SelectItem>
                      <SelectItem value="l">L</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-gray-700">Color</Label>
                  <Input id="color" placeholder="Enter color" className="rounded-lg" />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hierarchy" className="border rounded-lg mb-2 px-3">
              <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
                Hierarchy
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700">Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department" className="rounded-lg">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="footwear">Footwear</SelectItem>
                      <SelectItem value="apparel">Apparel</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class" className="text-gray-700">Class</Label>
                  <Select>
                    <SelectTrigger id="class" className="rounded-lg">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="athletic">Athletic</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subclass" className="text-gray-700">Subclass</Label>
                  <Select>
                    <SelectTrigger id="subclass" className="rounded-lg">
                      <SelectValue placeholder="Select subclass" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sneakers">Sneakers</SelectItem>
                      <SelectItem value="boots">Boots</SelectItem>
                      <SelectItem value="sandals">Sandals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="vendor" className="border rounded-lg mb-2 px-3">
              <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
                Vendor
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor-name" className="text-gray-700">Vendor Name</Label>
                  <Select value={vendorName} onValueChange={setVendorName}>
                    <SelectTrigger id="vendor-name" className="rounded-lg">
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nike">Nike</SelectItem>
                      <SelectItem value="Adidas">Adidas</SelectItem>
                      <SelectItem value="Puma">Puma</SelectItem>
                      <SelectItem value="Reebok">Reebok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-color" className="text-gray-700">Vendor Color</Label>
                  <Input id="vendor-color" placeholder="Enter vendor color" className="rounded-lg" />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pricing" className="border rounded-lg mb-2 px-3">
              <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
                Pricing
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Wholesale Price</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" className="rounded-lg" type="number" />
                    <Input placeholder="Max" className="rounded-lg" type="number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Retail Price</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" className="rounded-lg" type="number" />
                    <Input placeholder="Max" className="rounded-lg" type="number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Markdown Price</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" className="rounded-lg" type="number" />
                    <Input placeholder="Max" className="rounded-lg" type="number" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="status" className="border rounded-lg mb-2 px-3">
              <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
                Status & Attributes
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="active-code" className="text-gray-700">Active Code</Label>
                  <Select value={activeCode} onValueChange={setActiveCode}>
                    <SelectTrigger id="active-code" className="rounded-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="season" className="text-gray-700">Season</Label>
                  <Select>
                    <SelectTrigger id="season" className="rounded-lg">
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring">Spring 2025</SelectItem>
                      <SelectItem value="summer">Summer 2025</SelectItem>
                      <SelectItem value="fall">Fall 2025</SelectItem>
                      <SelectItem value="winter">Winter 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label-ticket" className="text-gray-700">Label/Ticket</Label>
                  <Select>
                    <SelectTrigger id="label-ticket" className="rounded-lg">
                      <SelectValue placeholder="Select label type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="clearance">Clearance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dates" className="border rounded-lg mb-2 px-3">
              <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
                Dates
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Last Modified Date</Label>
                  <div className="grid gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left rounded-lg",
                            !dateFrom && "text-gray-500"
                          )}
                        >
                          {dateFrom ? dateFrom.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "From date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left rounded-lg",
                            !dateTo && "text-gray-500"
                          )}
                        >
                          {dateTo ? dateTo.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "To date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button 
          className="w-full rounded-lg bg-[#1976D2] hover:bg-[#1565C0]"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          className="w-full rounded-lg"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </aside>
  );
}
