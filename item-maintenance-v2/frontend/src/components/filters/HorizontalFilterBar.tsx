/**
 * HorizontalFilterBar Component
 * Top horizontal filter bar with collapsible sections
 */

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
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

interface HorizontalFilterBarProps {
  activeFilters: { key: string; label: string }[];
  onApplyFilters: (filters: SearchFilters, activeFilters: { key: string; label: string }[]) => void;
  initialFilters?: SearchFilters;
  vendorMode?: 'primary' | 'secondary';
  onVendorModeChange?: (mode: 'primary' | 'secondary') => void;
  onRemoveFilter?: (key: string) => void;
}

export function HorizontalFilterBar({
  activeFilters,
  onApplyFilters,
  initialFilters,
  vendorMode = 'primary',
  onVendorModeChange,
  onRemoveFilter,
}: HorizontalFilterBarProps) {
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['item-details']);

  // Auto-expand sections that have active filters
  useEffect(() => {
    const sections: string[] = [];
    const hasAnyFilters = activeFilters.length > 0;
    const hasItemDetailsFilters = activeFilters.some(f => f.key.startsWith('item-'));
    const hasHierarchyFilters = activeFilters.some(f =>
      f.key.startsWith('dept-') || f.key.startsWith('class-') || f.key.startsWith('subclass-')
    );
    const hasVendorFilters = activeFilters.some(f => f.key.startsWith('vendor-'));
    const hasPricingFilters = activeFilters.some(f =>
      f.key.startsWith('retail-price') || f.key.startsWith('wholesale-price') || f.key.startsWith('wholesale-cost') || f.key.startsWith('first-cost')
    );
    const hasStatusFilters = activeFilters.some(f =>
      f.key.startsWith('status-') || f.key.startsWith('season-')
    );
    const hasDatesFilters = activeFilters.some(f =>
      f.key.startsWith('last-modified') || f.key.startsWith('creation-date')
    );
    const hasActivityFilters = activeFilters.some(f =>
      f.key.startsWith('activity-') || f.key.startsWith('on-hand') || f.key.startsWith('on-order') ||
      f.key.startsWith('sales-') || f.key.startsWith('returns-') || f.key.startsWith('receiving-') ||
      f.key.startsWith('transfers-') || f.key.startsWith('distributions-')
    );
    const hasSortingFilters = activeFilters.some(f =>
      f.key.startsWith('sort-by') || f.key.startsWith('group-by')
    );

    if (!hasAnyFilters) {
      sections.push('item-details');
    } else {
      if (hasItemDetailsFilters) sections.push('item-details');
      if (hasHierarchyFilters) sections.push('hierarchy');
      if (hasVendorFilters) sections.push('vendor');
      if (hasPricingFilters) sections.push('pricing');
      if (hasStatusFilters) sections.push('status');
      if (hasDatesFilters) sections.push('dates');
      if (hasActivityFilters) sections.push('activity');
      if (hasSortingFilters) sections.push('sorting');
      if (sections.length === 0) sections.push('item-details');
    }

    setExpandedSections(prev => {
      const autoExpanded = new Set(sections);
      const manuallyExpanded = prev.filter(s => !autoExpanded.has(s));
      return [...sections, ...manuallyExpanded];
    });
  }, [activeFilters]);

  // Auto-apply filters when values change (debounced)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentFiltersStr = JSON.stringify(initialFilters);
    if (previousInitialFiltersStr.current === currentFiltersStr) {
      return;
    }
    previousInitialFiltersStr.current = currentFiltersStr;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const filters = convertToSearchFilters();
      const active = generateActiveFilters();
      onApplyFilters(filters, active);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [filterValues, convertToSearchFilters, generateActiveFilters, onApplyFilters, initialFilters]);

  const handleReset = () => {
    resetFilters();
    const filters = convertToSearchFilters();
    const active = generateActiveFilters();
    onApplyFilters(filters, active);
  };

  const handleAccordionChange = (value: string[]) => {
    setExpandedSections(value);
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Collapsed View - Show active filters as chips */}
      {!isExpanded && (
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
            {activeFilters.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer"
                    onClick={() => onRemoveFilter?.(filter.key)}
                  >
                    {filter.label}
                    <span className="ml-1 text-blue-500">×</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">No filters applied</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-900"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Filters
            </Button>
          </div>
        </div>
      )}

      {/* Expanded View - Show all filter sections */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h3>
            <div className="flex items-center gap-2">
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Filters
              </Button>
            </div>
          </div>
          <div className="px-6 py-4 max-h-[600px] overflow-y-auto">
            <Accordion
              type="multiple"
              value={expandedSections}
              onValueChange={handleAccordionChange}
              className="w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              </div>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}

