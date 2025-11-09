/**
 * FilterPanel Component
 * Collapsible sidebar with accordion-based filter sections
 * Based on design from planning/visuals/Retail Dashboard Design
 */

import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ItemDetailsSection } from './sections/ItemDetailsSection';
import { HierarchySection } from './sections/HierarchySection';
import { VendorSection } from './sections/VendorSection';
import { PricingSection } from './sections/PricingSection';
import { StatusAttributesSection } from './sections/StatusAttributesSection';
import { DatesSection } from './sections/DatesSection';
import { ActivitySection } from './sections/ActivitySection';
import { SortingSection } from './sections/SortingSection';
import { useFilterState } from './useFilterState';

import { SearchFilters } from '../../../../shared/types/search';

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilters: { key: string; label: string }[];
  onApplyFilters: (filters: SearchFilters, activeFilters: { key: string; label: string }[]) => void;
  initialFilters?: SearchFilters;
  vendorMode?: 'primary' | 'secondary';
  onVendorModeChange?: (mode: 'primary' | 'secondary') => void;
}

export function FilterPanel({ 
  open, 
  onOpenChange, 
  activeFilters, 
  onApplyFilters,
  initialFilters,
  vendorMode = 'primary',
  onVendorModeChange
}: FilterPanelProps) {
  const {
    filterValues,
    updateFilter,
    resetFilters,
    convertToSearchFilters,
    generateActiveFilters,
  } = useFilterState(initialFilters);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const previousInitialFiltersStr = useRef<string | undefined>();
  // Start with all sections collapsed by default
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Auto-expand sections that have active filters
  // Check filterValues directly (source of truth) instead of relying on props
  useEffect(() => {
    const sections: string[] = [];
    
    // Check filterValues directly to determine which sections have active filters
    const hasItemDetailsFilters = !!(
      filterValues.itemDetails.style ||
      filterValues.itemDetails.sku ||
      filterValues.itemDetails.description ||
      filterValues.itemDetails.posDescription ||
      filterValues.itemDetails.itemNumber ||
      filterValues.itemDetails.keywords ||
      filterValues.itemDetails.size ||
      filterValues.itemDetails.color ||
      filterValues.itemDetails.alias ||
      filterValues.itemDetails.origin
    );
    
    const hasHierarchyFilters = !!(
      (filterValues.hierarchy.departments && filterValues.hierarchy.departments.length > 0) ||
      (filterValues.hierarchy.classes && filterValues.hierarchy.classes.length > 0) ||
      (filterValues.hierarchy.subclasses && filterValues.hierarchy.subclasses.length > 0) ||
      filterValues.hierarchy.subDept ||
      filterValues.hierarchy.attribute1 ||
      filterValues.hierarchy.attribute2 ||
      (filterValues.hierarchy.attribute3 && filterValues.hierarchy.attribute3.length > 0)
    );
    
    const hasVendorFilters = !!(
      (filterValues.vendor.vendorName && filterValues.vendor.vendorName.length > 0) ||
      filterValues.vendor.vendorColor
    );
    
    const hasPricingFilters = !!(
      (filterValues.pricing.wholesaleCost && (filterValues.pricing.wholesaleCost.min !== undefined || filterValues.pricing.wholesaleCost.max !== undefined)) ||
      (filterValues.pricing.firstCost && (filterValues.pricing.firstCost.min !== undefined || filterValues.pricing.firstCost.max !== undefined)) ||
      (filterValues.pricing.retailPrice && (filterValues.pricing.retailPrice.min !== undefined || filterValues.pricing.retailPrice.max !== undefined)) ||
      (filterValues.pricing.retailMarkdownPrice && (filterValues.pricing.retailMarkdownPrice.min !== undefined || filterValues.pricing.retailMarkdownPrice.max !== undefined)) ||
      (filterValues.pricing.outletPrice && (filterValues.pricing.outletPrice.min !== undefined || filterValues.pricing.outletPrice.max !== undefined)) ||
      (filterValues.pricing.outletMarkdownPrice && (filterValues.pricing.outletMarkdownPrice.min !== undefined || filterValues.pricing.outletMarkdownPrice.max !== undefined)) ||
      (filterValues.pricing.prepack && (filterValues.pricing.prepack.min !== undefined || filterValues.pricing.prepack.max !== undefined))
    );
    
    const hasStatusFilters = !!(
      (filterValues.status.activeCode && 
       filterValues.status.activeCode.trim() && 
       filterValues.status.activeCode.toUpperCase() !== 'ALL') ||
      (filterValues.status.status && 
       filterValues.status.status.trim() && 
       filterValues.status.status !== 'All') ||
      (filterValues.status.season && filterValues.status.season.trim()) ||
      (filterValues.status.stat3 && 
       filterValues.status.stat3.trim() && 
       filterValues.status.stat3.toUpperCase() !== 'ALL')
    );
    
    const hasDatesFilters = !!(
      filterValues.dates.lastModified ||
      filterValues.dates.creation
    );
    
    const hasActivityFilters = !!(
      filterValues.activity?.onHand?.enabled ||
      filterValues.activity?.onOrder?.enabled ||
      filterValues.activity?.sales?.enabled ||
      filterValues.activity?.returns?.enabled ||
      filterValues.activity?.receiving?.enabled ||
      filterValues.activity?.transfers?.enabled ||
      filterValues.activity?.distributions?.enabled
    );
    
    const hasSortingFilters = !!(
      filterValues.sorting?.sortBy ||
      filterValues.sorting?.groupBy
    );

    // Debug: Log which sections will be expanded
    console.log('FilterPanel - Section expansion (from filterValues):', {
      hasItemDetailsFilters,
      hasHierarchyFilters,
      hasVendorFilters,
      hasPricingFilters,
      hasStatusFilters,
      hasDatesFilters,
      hasActivityFilters,
      hasSortingFilters,
      statusActiveCode: filterValues.status.activeCode,
      statusStatus: filterValues.status.status
    });

    // Only expand sections that have active filters
    if (hasItemDetailsFilters) sections.push('item-details');
    if (hasHierarchyFilters) sections.push('hierarchy');
    if (hasVendorFilters) sections.push('vendor');
    if (hasPricingFilters) sections.push('pricing');
    if (hasStatusFilters) sections.push('status');
    if (hasDatesFilters) sections.push('dates');
    if (hasActivityFilters) sections.push('activity');
    if (hasSortingFilters) sections.push('sorting');
    
    console.log('FilterPanel - Sections to expand:', sections);
    
    // Update expanded sections, preserving any manually expanded ones that aren't in the auto list
    setExpandedSections(prev => {
      const autoExpanded = new Set(sections);
      // Keep manually expanded sections that don't have filters (user can still manually expand)
      const manuallyExpanded = prev.filter(s => !autoExpanded.has(s));
      const newSections = [...sections, ...manuallyExpanded];
      console.log('FilterPanel - Final expanded sections:', newSections);
      return newSections;
    });
  }, [filterValues]);

  // Handle manual accordion expansion/collapse
  const handleAccordionChange = (newSections: string[]) => {
    setExpandedSections(newSections);
  };

  // Track when initialFilters changes (session load) vs user interaction
  useEffect(() => {
    // Deep comparison by stringifying - only update if filters actually changed
    const currentFiltersStr = JSON.stringify(initialFilters);
    // If initialFilters changed, it means a session was loaded
    // Don't trigger auto-apply in this case - the parent already handled it
    if (previousInitialFiltersStr.current !== currentFiltersStr) {
      previousInitialFiltersStr.current = currentFiltersStr;
      isInitialMount.current = true; // Reset to skip auto-apply after session load
    }
  }, [initialFilters]);

  // Auto-apply filters when they change (with debounce)
  useEffect(() => {
    // Skip on initial mount to avoid applying empty filters
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce filter application by 300ms
    debounceTimer.current = setTimeout(() => {
      const searchFilters = convertToSearchFilters();
      const activeFiltersList = generateActiveFilters();
      // Only apply if there are actual filter values
      const hasFilters = searchFilters && (
        searchFilters.itemDetails ||
        searchFilters.hierarchy ||
        searchFilters.vendor ||
        searchFilters.pricing ||
        searchFilters.status ||
        searchFilters.dates
      );
      if (hasFilters || activeFiltersList.length > 0) {
        onApplyFilters(searchFilters, activeFiltersList);
      } else {
        // Clear filters if all are empty
        onApplyFilters({}, []);
      }
    }, 300);

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues]);

  if (!open) return null;

  const handleReset = () => {
    resetFilters();
    // Immediately apply empty filters
    onApplyFilters({}, []);
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-gray-900 font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-3 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium flex items-center gap-1.5"
            aria-label="Reset all filters"
            title="Reset all filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-lg hover:bg-gray-100"
            aria-label="Close filter panel"
          >
            <X className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion 
            type="multiple" 
            value={expandedSections} 
            onValueChange={handleAccordionChange}
            className="w-full"
          >
            <ItemDetailsSection
              value={filterValues.itemDetails}
              onChange={(val) => updateFilter('itemDetails', val)}
            />
            <HierarchySection
              value={filterValues.hierarchy}
              onChange={(val) => updateFilter('hierarchy', val)}
            />
            <VendorSection
              value={filterValues.vendor}
              onChange={(val) => {
                updateFilter('vendor', val);
                // If vendor mode changed, update the global vendor mode
                if (val.mode && val.mode !== vendorMode && onVendorModeChange) {
                  onVendorModeChange(val.mode);
                }
              }}
              currentVendorMode={vendorMode}
            />
            <PricingSection
              value={filterValues.pricing}
              onChange={(val) => updateFilter('pricing', val)}
            />
            <StatusAttributesSection
              value={filterValues.status}
              onChange={(val) => updateFilter('status', val)}
            />
            <DatesSection
              value={filterValues.dates}
              onChange={(val) => updateFilter('dates', val)}
            />
            <ActivitySection
              value={filterValues.activity}
              onChange={(val) => updateFilter('activity', val)}
            />
            <SortingSection
              value={filterValues.sorting}
              onChange={(val) => updateFilter('sorting', val)}
            />
          </Accordion>
        </div>
      </ScrollArea>

    </aside>
  );
}

