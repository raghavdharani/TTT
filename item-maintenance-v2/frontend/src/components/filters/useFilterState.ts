/**
 * Custom Hook for Filter State Management
 * Manages filter values across all filter sections
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { SearchFilters } from '../../../../shared/types/search';

export interface FilterValues {
  itemDetails: {
    sku?: string;
    style?: string;
    description?: string;
    posDescription?: string;
    itemNumber?: string;
    keywords?: string;
    size?: string;
    color?: string[]; // Multi-select
    alias?: string;
    origin?: string;
  };
  hierarchy: {
    departments?: string[];
    classes?: string[];
    subclasses?: string[];
    subDept?: string[]; // Multi-select
    attribute1?: string[]; // Multi-select
    attribute2?: string[]; // Multi-select
    attribute3?: string[];
  };
  vendor: {
    vendorName?: string[];
    vendorColor?: string;
    mode?: 'primary' | 'secondary';
  };
  pricing: {
    wholesaleCost?: { min?: number; max?: number };
    firstCost?: { min?: number; max?: number };
    retailPrice?: { min?: number; max?: number };
    retailMarkdownPrice?: { min?: number; max?: number };
    outletPrice?: { min?: number; max?: number };
    outletMarkdownPrice?: { min?: number; max?: number };
    prepack?: { min?: number; max?: number };
  };
  status: {
    activeCode?: string;
    status?: string;
    season?: string;
    stat3?: string;
  };
    dates: {
    lastModified?: { from?: Date; to?: Date };
    creation?: { from?: Date; to?: Date };
  };
  activity: {
    onHand?: { enabled: boolean; value?: string };
    onOrder?: { enabled: boolean; value?: string };
    sales?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    returns?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    receiving?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    transfers?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
    distributions?: { enabled: boolean; value?: string; startDate?: Date; endDate?: Date };
  };
  sorting: {
    sortBy?: string;
    groupBy?: string;
  };
}

export function useFilterState(initialFilters?: SearchFilters) {
  // Helper to convert SearchFilters to FilterValues, handling date string conversion
  const convertFiltersToValues = useCallback((filters?: SearchFilters): FilterValues => {
    if (!filters) {
      return {
        itemDetails: {},
        hierarchy: {},
        vendor: {},
        pricing: {},
        status: {},
        dates: {},
        activity: {},
        sorting: {},
      };
    }

    // Convert date strings to Date objects if needed
    const convertDateRange = (range?: { from?: Date | string; to?: Date | string }) => {
      if (!range) return undefined;
      return {
        from: range.from 
          ? (range.from instanceof Date ? range.from : new Date(range.from))
          : undefined,
        to: range.to 
          ? (range.to instanceof Date ? range.to : new Date(range.to))
          : undefined,
      };
    };

    // Convert status filters - handle array to string conversion (type mismatch)
    const convertStatus = (status?: any) => {
      if (!status) return {};
      return {
        activeCode: Array.isArray(status.activeCode) 
          ? (status.activeCode.length > 0 ? status.activeCode[0] : undefined)
          : status.activeCode,
        status: Array.isArray(status.status) 
          ? (status.status.length > 0 ? status.status[0] : undefined)
          : status.status,
        season: Array.isArray(status.season) 
          ? (status.season.length > 0 ? status.season[0] : undefined)
          : status.season,
        stat3: Array.isArray(status.stat3) 
          ? (status.stat3.length > 0 ? status.stat3[0] : undefined)
          : status.stat3,
      };
    };

    return {
      itemDetails: filters.itemDetails ? {
        ...filters.itemDetails,
        // Ensure color is an array
        color: filters.itemDetails.color 
          ? (Array.isArray(filters.itemDetails.color) ? filters.itemDetails.color : [filters.itemDetails.color])
          : undefined,
      } : {},
      hierarchy: filters.hierarchy ? {
        ...filters.hierarchy,
        // Ensure subDept, attribute1, attribute2 are arrays
        subDept: filters.hierarchy.subDept 
          ? (Array.isArray(filters.hierarchy.subDept) ? filters.hierarchy.subDept : [filters.hierarchy.subDept])
          : undefined,
        attribute1: filters.hierarchy.attribute1 
          ? (Array.isArray(filters.hierarchy.attribute1) ? filters.hierarchy.attribute1 : [filters.hierarchy.attribute1])
          : undefined,
        attribute2: filters.hierarchy.attribute2 
          ? (Array.isArray(filters.hierarchy.attribute2) ? filters.hierarchy.attribute2 : [filters.hierarchy.attribute2])
          : undefined,
      } : {},
      vendor: filters.vendor || {},
      pricing: filters.pricing || {},
      status: convertStatus(filters.status),
      dates: {
        lastModified: convertDateRange(filters.dates?.lastModified),
        creation: convertDateRange(filters.dates?.creation),
      },
      activity: {},
      sorting: {},
    };
  }, []);

  const [filterValues, setFilterValues] = useState<FilterValues>(() => 
    convertFiltersToValues(initialFilters)
  );

  // Update filter values when initialFilters changes (e.g., when loading a saved session)
  // Use a ref to track previous initialFilters to avoid unnecessary updates
  const prevInitialFiltersRef = useRef<string | undefined>();
  
  useEffect(() => {
    // Deep comparison by stringifying - only update if filters actually changed
    const currentFiltersStr = JSON.stringify(initialFilters);
    if (prevInitialFiltersRef.current !== currentFiltersStr) {
      prevInitialFiltersRef.current = currentFiltersStr;
      const newValues = convertFiltersToValues(initialFilters);
      setFilterValues(newValues);
    }
  }, [initialFilters, convertFiltersToValues]);

  const updateFilter = useCallback(<K extends keyof FilterValues>(
    section: K,
    updates: Partial<FilterValues[K]>
  ) => {
    setFilterValues(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterValues({
      itemDetails: {},
      hierarchy: {},
      vendor: {},
      pricing: {},
      status: {},
      dates: {},
      activity: {},
      sorting: {},
    });
  }, []);

  const convertToSearchFilters = useCallback((): SearchFilters => {
    // Check if itemDetails has any values
    const hasItemDetails = !!(
      filterValues.itemDetails.style || 
      filterValues.itemDetails.sku || 
      filterValues.itemDetails.description || 
      filterValues.itemDetails.posDescription ||
      filterValues.itemDetails.itemNumber ||
      filterValues.itemDetails.keywords ||
      filterValues.itemDetails.size || 
      filterValues.itemDetails.color?.length ||
      filterValues.itemDetails.alias ||
      filterValues.itemDetails.origin
    );

    // Check if hierarchy has any values
    const hasHierarchy = !!(
      filterValues.hierarchy.departments?.length || 
      filterValues.hierarchy.classes?.length || 
      filterValues.hierarchy.subclasses?.length ||
      filterValues.hierarchy.subDept?.length ||
      filterValues.hierarchy.attribute1?.length ||
      filterValues.hierarchy.attribute2?.length ||
      filterValues.hierarchy.attribute3?.length
    );

    // Check if pricing has any values
    const hasPricing = !!(
      filterValues.pricing.wholesaleCost?.min !== undefined ||
      filterValues.pricing.wholesaleCost?.max !== undefined ||
      filterValues.pricing.firstCost?.min !== undefined ||
      filterValues.pricing.firstCost?.max !== undefined ||
      filterValues.pricing.retailPrice?.min !== undefined ||
      filterValues.pricing.retailPrice?.max !== undefined ||
      filterValues.pricing.retailMarkdownPrice?.min !== undefined ||
      filterValues.pricing.retailMarkdownPrice?.max !== undefined ||
      filterValues.pricing.outletPrice?.min !== undefined ||
      filterValues.pricing.outletPrice?.max !== undefined ||
      filterValues.pricing.outletMarkdownPrice?.min !== undefined ||
      filterValues.pricing.outletMarkdownPrice?.max !== undefined ||
      filterValues.pricing.prepack?.min !== undefined ||
      filterValues.pricing.prepack?.max !== undefined
    );

    // Check if status has any values (exclude "ALL", "All", and empty strings)
    const hasStatus = !!(
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

    return {
      itemDetails: hasItemDetails ? {
        style: filterValues.itemDetails.style,
        sku: filterValues.itemDetails.sku,
        description: filterValues.itemDetails.description,
        size: filterValues.itemDetails.size,
        color: filterValues.itemDetails.color?.length ? filterValues.itemDetails.color : undefined,
      } : undefined,
      hierarchy: hasHierarchy ? {
        departments: filterValues.hierarchy.departments,
        classes: filterValues.hierarchy.classes,
        subclasses: filterValues.hierarchy.subclasses,
        subDept: filterValues.hierarchy.subDept?.length ? filterValues.hierarchy.subDept : undefined,
        attribute1: filterValues.hierarchy.attribute1?.length ? filterValues.hierarchy.attribute1 : undefined,
        attribute2: filterValues.hierarchy.attribute2?.length ? filterValues.hierarchy.attribute2 : undefined,
        attribute3: filterValues.hierarchy.attribute3,
      } : undefined,
      vendor: filterValues.vendor.vendorName?.length || 
              filterValues.vendor.vendorColor ||
              filterValues.vendor.mode
        ? filterValues.vendor
        : undefined,
      pricing: hasPricing ? filterValues.pricing : undefined,
      status: hasStatus ? (() => {
        const statusObj: any = {};
        if (filterValues.status.activeCode && 
            filterValues.status.activeCode.trim() && 
            filterValues.status.activeCode.toUpperCase() !== 'ALL') {
          statusObj.activeCode = filterValues.status.activeCode;
        }
        if (filterValues.status.status && 
            filterValues.status.status.trim() && 
            filterValues.status.status !== 'All') {
          statusObj.status = filterValues.status.status;
        }
        if (filterValues.status.season && filterValues.status.season.trim()) {
          statusObj.season = filterValues.status.season;
        }
        if (filterValues.status.stat3 && 
            filterValues.status.stat3.trim() && 
            filterValues.status.stat3.toUpperCase() !== 'ALL') {
          statusObj.stat3 = filterValues.status.stat3;
        }
        return Object.keys(statusObj).length > 0 ? statusObj : undefined;
      })() : undefined,
      dates: filterValues.dates.lastModified || filterValues.dates.creation
        ? filterValues.dates
        : undefined,
      // Note: activity and sorting are not part of SearchFilters type yet
      // They may need to be added to the shared types or handled separately
    };
  }, [filterValues]);

  const generateActiveFilters = useCallback((): { key: string; label: string }[] => {
    const active: { key: string; label: string }[] = [];

    // Item Details filters
    if (filterValues.itemDetails.style) {
      active.push({ key: 'item-style', label: `Style: ${filterValues.itemDetails.style}` });
    }
    if (filterValues.itemDetails.sku) {
      active.push({ key: 'item-sku', label: `SKU: ${filterValues.itemDetails.sku}` });
    }
    if (filterValues.itemDetails.description) {
      active.push({ key: 'item-description', label: `Description: ${filterValues.itemDetails.description}` });
    }
    if (filterValues.itemDetails.posDescription) {
      active.push({ key: 'item-pos-description', label: `POS Description: ${filterValues.itemDetails.posDescription}` });
    }
    if (filterValues.itemDetails.itemNumber) {
      active.push({ key: 'item-number', label: `Item#: ${filterValues.itemDetails.itemNumber}` });
    }
    if (filterValues.itemDetails.keywords) {
      active.push({ key: 'item-keywords', label: `Keywords: ${filterValues.itemDetails.keywords}` });
    }
    if (filterValues.itemDetails.size) {
      active.push({ key: 'item-size', label: `Size: ${filterValues.itemDetails.size}` });
    }
    if (filterValues.itemDetails.color?.length) {
      filterValues.itemDetails.color.forEach(color => {
        active.push({ key: `item-color-${color}`, label: `Color: ${color}` });
      });
    }
    if (filterValues.itemDetails.alias) {
      active.push({ key: 'item-alias', label: `Alias: ${filterValues.itemDetails.alias}` });
    }
    if (filterValues.itemDetails.origin) {
      active.push({ key: 'item-origin', label: `Origin: ${filterValues.itemDetails.origin}` });
    }

    // Hierarchy filters
    if (filterValues.hierarchy.departments?.length) {
      filterValues.hierarchy.departments.forEach(dept => {
        active.push({ key: `dept-${dept}`, label: `Department: ${dept}` });
      });
    }
    if (filterValues.hierarchy.classes?.length) {
      filterValues.hierarchy.classes.forEach(cls => {
        active.push({ key: `class-${cls}`, label: `Class: ${cls}` });
      });
    }
    if (filterValues.hierarchy.subclasses?.length) {
      filterValues.hierarchy.subclasses.forEach(subcls => {
        active.push({ key: `subclass-${subcls}`, label: `Subclass: ${subcls}` });
      });
    }
    if (filterValues.hierarchy.subDept?.length) {
      filterValues.hierarchy.subDept.forEach(subDept => {
        active.push({ key: `hierarchy-sub-dept-${subDept}`, label: `Sub Dept: ${subDept}` });
      });
    }
    if (filterValues.hierarchy.attribute1?.length) {
      filterValues.hierarchy.attribute1.forEach(attr => {
        active.push({ key: `hierarchy-attribute1-${attr}`, label: `Attribute 1: ${attr}` });
      });
    }
    if (filterValues.hierarchy.attribute2?.length) {
      filterValues.hierarchy.attribute2.forEach(attr => {
        active.push({ key: `hierarchy-attribute2-${attr}`, label: `Attribute 2: ${attr}` });
      });
    }
    if (filterValues.hierarchy.attribute3?.length) {
      filterValues.hierarchy.attribute3.forEach(attr => {
        active.push({ key: `hierarchy-attribute3-${attr}`, label: `Attribute 3: ${attr}` });
      });
    }

    // Vendor filters
    if (filterValues.vendor.vendorName?.length) {
      filterValues.vendor.vendorName.forEach(vendor => {
        active.push({ key: `vendor-${vendor}`, label: `Vendor: ${vendor}` });
      });
    }
    if (filterValues.vendor.vendorColor) {
      active.push({ key: 'vendor-color', label: `Vendor Color: ${filterValues.vendor.vendorColor}` });
    }

    // Pricing filters
    if (filterValues.pricing.wholesaleCost?.min !== undefined || filterValues.pricing.wholesaleCost?.max !== undefined) {
      const min = filterValues.pricing.wholesaleCost.min ?? '';
      const max = filterValues.pricing.wholesaleCost.max ?? '';
      active.push({ key: 'wholesale-cost', label: `Wholesale Cost: $${min} - $${max}` });
    }
    if (filterValues.pricing.firstCost?.min !== undefined || filterValues.pricing.firstCost?.max !== undefined) {
      const min = filterValues.pricing.firstCost.min ?? '';
      const max = filterValues.pricing.firstCost.max ?? '';
      active.push({ key: 'first-cost', label: `First Cost: $${min} - $${max}` });
    }
    if (filterValues.pricing.retailPrice?.min !== undefined || filterValues.pricing.retailPrice?.max !== undefined) {
      const min = filterValues.pricing.retailPrice.min ?? '';
      const max = filterValues.pricing.retailPrice.max ?? '';
      active.push({ key: 'retail-price', label: `Retail Price: $${min} - $${max}` });
    }
    if (filterValues.pricing.retailMarkdownPrice?.min !== undefined || filterValues.pricing.retailMarkdownPrice?.max !== undefined) {
      const min = filterValues.pricing.retailMarkdownPrice.min ?? '';
      const max = filterValues.pricing.retailMarkdownPrice.max ?? '';
      active.push({ key: 'retail-markdown', label: `Retail Markdown: $${min} - $${max}` });
    }
    if (filterValues.pricing.outletPrice?.min !== undefined || filterValues.pricing.outletPrice?.max !== undefined) {
      const min = filterValues.pricing.outletPrice.min ?? '';
      const max = filterValues.pricing.outletPrice.max ?? '';
      active.push({ key: 'outlet-price', label: `Outlet Price: $${min} - $${max}` });
    }
    if (filterValues.pricing.outletMarkdownPrice?.min !== undefined || filterValues.pricing.outletMarkdownPrice?.max !== undefined) {
      const min = filterValues.pricing.outletMarkdownPrice.min ?? '';
      const max = filterValues.pricing.outletMarkdownPrice.max ?? '';
      active.push({ key: 'outlet-markdown', label: `Outlet Markdown: $${min} - $${max}` });
    }
    if (filterValues.pricing.prepack?.min !== undefined || filterValues.pricing.prepack?.max !== undefined) {
      const min = filterValues.pricing.prepack.min ?? '';
      const max = filterValues.pricing.prepack.max ?? '';
      active.push({ key: 'prepack', label: `Prepack: ${min} - ${max}` });
    }

    // Status filters
    if (filterValues.status.activeCode && 
        filterValues.status.activeCode.trim() && 
        filterValues.status.activeCode.toUpperCase() !== 'ALL') {
      active.push({ key: 'status-active-code', label: `Active Code: ${filterValues.status.activeCode}` });
    }
    if (filterValues.status.status && 
        filterValues.status.status.trim() && 
        filterValues.status.status !== 'All') {
      active.push({ key: 'status-status', label: `Status: ${filterValues.status.status}` });
    }
    if (filterValues.status.season && filterValues.status.season.trim()) {
      active.push({ key: 'status-season', label: `Season: ${filterValues.status.season}` });
    }
    if (filterValues.status.stat3 && 
        filterValues.status.stat3.trim() && 
        filterValues.status.stat3.toUpperCase() !== 'ALL') {
      active.push({ key: 'status-stat3', label: `Stat 3: ${filterValues.status.stat3}` });
    }

    // Date filters
    if (filterValues.dates.lastModified?.from || filterValues.dates.lastModified?.to) {
      active.push({ key: 'last-modified', label: 'Last Modified Date' });
    }
    if (filterValues.dates.creation?.from || filterValues.dates.creation?.to) {
      active.push({ key: 'creation-date', label: 'Creation Date' });
    }

    return active;
  }, [filterValues]);

  return {
    filterValues,
    updateFilter,
    resetFilters,
    convertToSearchFilters,
    generateActiveFilters,
  };
}

