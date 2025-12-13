/**
 * Main App Component
 * Integrates all search workspace components
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderBar } from './components/search/HeaderBar';
import { FilterPanel } from './components/filters/FilterPanel';
import { ActiveFilters } from './components/search/ActiveFilters';
import { RecordCount } from './components/search/RecordCount';
import { ResultsGrid } from './components/search/ResultsGrid';
import { EmptyState } from './components/search/EmptyState';
import { searchApi, sessionsApi } from './services';
import {
  setSearchQuery,
  setFilters,
  setSortConfig,
  setVendorMode,
  setActiveFilters,
  setRecordCount,
  setResults,
  setLoading,
  setError,
} from './store/searchSlice';
import type { RootState } from './store';
import type { SearchRequest, SearchFilters, SearchSession } from '../../../shared/types/search';

export function App() {
  const dispatch = useDispatch();
  const searchState = useSelector((state: RootState) => state.search);
  // Load filter panel state from localStorage, default to true (open)
  const [filterPanelOpen, setFilterPanelOpen] = useState(() => {
    const saved = localStorage.getItem('filterPanelOpen');
    return saved !== null ? saved === 'true' : true;
  });
  
  // Track pending changes in ResultsGrid
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  // Persist filter panel state
  useEffect(() => {
    localStorage.setItem('filterPanelOpen', filterPanelOpen.toString());
  }, [filterPanelOpen]);
  
  // Navigation guard - warn user if they try to leave with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasPendingChanges) {
        e.preventDefault();
        // Modern browsers ignore custom messages, but we can still set returnValue
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasPendingChanges]);

  // Generate mock data for demonstration - matching screenshot data
  const generateMockData = () => {
    return [
      {
        article_id: '1',
        style: 'R19J102',
        upc: '1234000007',
        first_digits: '',
        description: 'Metallic Short Tassel Earrings',
        pos_description: 'Tassel Earrings',
        item_number: 'ITEM-001',
        keywords: 'metallic, tassel, earrings, jewelry',
        size: 'OS',
        color_name: 'Black-1',
        vendor_color: 'White',
        alias: 'Tassel Earrings Black',
        origin: 'USA',
        department: 'Accessories-02',
        class: 'Earrings-400',
        subclass: 'General-000',
        sub_dept: 'General-000',
        attribute1: 'General-000',
        attribute2: 'General-000',
        attribute3: 'On Sale-202',
        last_modified_date: new Date('2025-01-11').toISOString(),
        creation_date: new Date('2024-10-15').toISOString(),
        season: '',
        active_code: 'N',
        status: 'N',
        stat3: '',
        available_on_web: 'N',
        web_back_order_eligible: 'N',
        alt_style_sku_upc: '1234000007',
        prepack: 0,
        item_picture: 'https://i1.adis.ws/i/oscardelarenta/R19J102_1',
        employee_price: 0.00,
        markdown_date: null,
        outlet_markdown_date: null,
        // Primary vendor data
        primary_vendor: 'Oscar de la Renta',
        primary_retail_price: 345.00,
        primary_wholesale_price: 0.00,
        primary_first_cost: 100.00,
        primary_retail_markdown_price: 0.00,
        primary_outlet_price: 345.00,
        primary_outlet_markdown_price: 0.00,
        primary_prepack: 0,
        primary_active_code: 'N',
        // Secondary vendor data
        secondary_vendor: 'Oscar de la Renta',
        secondary_retail_price: 345.00,
        secondary_wholesale_price: 0.00,
        secondary_first_cost: 100.00,
        secondary_retail_markdown_price: 0.00,
        secondary_outlet_price: 345.00,
        secondary_outlet_markdown_price: 0.00,
        secondary_prepack: 0,
        secondary_active_code: 'N',
      },
      {
        article_id: '2',
        style: 'XYZ-456',
        upc: '234567890123',
        first_digits: '',
        description: 'Denim Jeans - Dark Wash',
        pos_description: 'Jeans Dark Wash',
        item_number: 'ITEM-002',
        keywords: 'denim, jeans, dark, wash',
        size: 'L',
        color_name: 'Black-1',
        vendor_color: 'Dark Blue',
        alias: 'Jeans Dark',
        origin: 'Mexico',
        department: 'Apparel-01',
        class: 'Bottoms-202',
        subclass: 'Jeans-302',
        sub_dept: 'General-000',
        attribute1: 'General-000',
        attribute2: 'General-000',
        attribute3: 'Designer-203',
        last_modified_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        creation_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        season: 'All Season',
        active_code: 'Active',
        status: 'Active',
        stat3: 'ALL',
        available_on_web: 'Y',
        web_back_order_eligible: 'N',
        alt_style_sku_upc: '234567890123',
        prepack: 2,
        item_picture: 'https://i1.adis.ws/i/vendorb/XYZ-456_1',
        employee_price: 0.00,
        markdown_date: null,
        outlet_markdown_date: null,
        // Primary vendor data
        primary_vendor: 'Vendor B',
        primary_retail_price: 79.99,
        primary_wholesale_price: 40.00,
        primary_first_cost: 35.00,
        primary_retail_markdown_price: 69.99,
        primary_outlet_price: 59.99,
        primary_outlet_markdown_price: 49.99,
        primary_prepack: 2,
        primary_active_code: 'Active',
        // Secondary vendor data
        secondary_vendor: 'Vendor E',
        secondary_retail_price: 75.99,
        secondary_wholesale_price: 38.00,
        secondary_first_cost: 33.00,
        secondary_retail_markdown_price: 65.99,
        secondary_outlet_price: 55.99,
        secondary_outlet_markdown_price: 45.99,
        secondary_prepack: 2,
        secondary_active_code: 'Active',
      },
      {
        article_id: '3',
        style: 'DEF-789',
        upc: '345678901234',
        description: 'Wool Sweater - Gray',
        pos_description: 'Wool Sweater Gray',
        item_number: 'ITEM-003',
        keywords: 'wool, sweater, gray, winter',
        size: 'L',
        color: 'Gray',
        alias: 'Sweater Gray',
        origin: 'Italy',
        department: 'Apparel-01',
        class: 'Tops-201',
        subclass: 'Sweaters-303',
        sub_dept: 'General-000',
        attribute1: 'General-000',
        attribute2: 'General-000',
        attribute3: 'Limited Edition-204',
        last_modified_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        creation_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        season: 'Winter',
        active_code: 'Active',
        status: 'Active',
        stat3: 'ALL',
        // Primary vendor data
        primary_vendor: 'Vendor A',
        primary_retail_price: 89.99,
        primary_wholesale_price: 45.00,
        primary_first_cost: 40.00,
        primary_retail_markdown_price: 79.99,
        primary_outlet_price: 69.99,
        primary_outlet_markdown_price: 59.99,
        primary_prepack: 1,
        primary_active_code: 'Active',
        vendor_color: 'Gray',
        // Secondary vendor data
        secondary_vendor: 'Vendor F',
        secondary_retail_price: 85.99,
        secondary_wholesale_price: 43.00,
        secondary_first_cost: 38.00,
        secondary_retail_markdown_price: 75.99,
        secondary_outlet_price: 65.99,
        secondary_outlet_markdown_price: 55.99,
        secondary_prepack: 1,
        secondary_active_code: 'Inactive',
      },
      {
        article_id: '4',
        style: 'GHI-012',
        upc: '456789012345',
        description: 'Silk Blouse - White',
        pos_description: 'Silk Blouse White',
        item_number: 'ITEM-004',
        keywords: 'silk, blouse, white, elegant',
        size: 'S',
        color: 'White',
        alias: 'Blouse White',
        origin: 'China',
        department: 'Apparel-01',
        class: 'Tops-201',
        subclass: 'Blouses-304',
        sub_dept: 'General-000',
        attribute1: 'General-000',
        attribute2: 'General-000',
        attribute3: 'Designer-203',
        last_modified_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        creation_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        season: 'Spring',
        active_code: 'Active',
        status: 'Active',
        stat3: 'ALL',
        // Primary vendor data
        primary_vendor: 'Vendor C',
        primary_retail_price: 59.99,
        primary_wholesale_price: 30.00,
        primary_first_cost: 25.00,
        primary_retail_markdown_price: 49.99,
        primary_outlet_price: 39.99,
        primary_outlet_markdown_price: 29.99,
        primary_prepack: 1,
        primary_active_code: 'Active',
        vendor_color: 'White',
        // Secondary vendor data
        secondary_vendor: 'Vendor G',
        secondary_retail_price: 57.99,
        secondary_wholesale_price: 29.00,
        secondary_first_cost: 24.00,
        secondary_retail_markdown_price: 47.99,
        secondary_outlet_price: 37.99,
        secondary_outlet_markdown_price: 27.99,
        secondary_prepack: 1,
        secondary_active_code: 'Active',
      },
      {
        article_id: '5',
        style: 'JKL-345',
        upc: '567890123456',
        description: 'Leather Jacket - Black',
        pos_description: 'Leather Jacket Black',
        item_number: 'ITEM-005',
        keywords: 'leather, jacket, black, premium',
        size: 'XL',
        color: 'Black-1',
        alias: 'Jacket Black',
        origin: 'USA',
        department: 'Apparel-01',
        class: 'Outerwear-203',
        subclass: 'Jackets-305',
        sub_dept: 'General-000',
        attribute1: 'General-000',
        attribute2: 'General-000',
        attribute3: 'Best Seller-202',
        last_modified_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        creation_date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        season: 'Fall',
        active_code: 'Inactive',
        status: 'Inactive',
        stat3: 'ALL',
        // Primary vendor data
        primary_vendor: 'Vendor B',
        primary_retail_price: 199.99,
        primary_wholesale_price: 100.00,
        primary_first_cost: 85.00,
        primary_retail_markdown_price: 179.99,
        primary_outlet_price: 159.99,
        primary_outlet_markdown_price: 139.99,
        primary_prepack: 1,
        primary_active_code: 'Inactive',
        vendor_color: 'Black',
        // Secondary vendor data
        secondary_vendor: 'Vendor H',
        secondary_retail_price: 195.99,
        secondary_wholesale_price: 98.00,
        secondary_first_cost: 83.00,
        secondary_retail_markdown_price: 175.99,
        secondary_outlet_price: 155.99,
        secondary_outlet_markdown_price: 135.99,
        secondary_prepack: 1,
        secondary_active_code: 'Active',
      },
      {
        article_id: '6',
        style: 'MNO-678',
        upc: '678901234567',
        description: 'Cotton Shorts - Khaki',
        pos_description: 'Cotton Shorts Khaki',
        item_number: 'ITEM-006',
        keywords: 'cotton, shorts, khaki, summer',
        size: 'M',
        color: 'Khaki',
        alias: 'Shorts Khaki',
        origin: 'India',
        department: 'Apparel-01',
        class: 'Bottoms-202',
        subclass: 'Shorts-306',
        sub_dept: 'General-000',
        attribute1: 'General-000',
        attribute2: 'General-000',
        attribute3: 'Best Seller-202',
        last_modified_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        creation_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        season: 'Summer',
        active_code: 'Active',
        status: 'Active',
        stat3: 'ALL',
        // Primary vendor data
        primary_vendor: 'Vendor A',
        primary_retail_price: 39.99,
        primary_wholesale_price: 20.00,
        primary_first_cost: 15.00,
        primary_retail_markdown_price: 34.99,
        primary_outlet_price: 29.99,
        primary_outlet_markdown_price: 24.99,
        primary_prepack: 2,
        primary_active_code: 'Active',
        vendor_color: 'Khaki',
        // Secondary vendor data
        secondary_vendor: 'Vendor I',
        secondary_retail_price: 37.99,
        secondary_wholesale_price: 19.00,
        secondary_first_cost: 14.00,
        secondary_retail_markdown_price: 32.99,
        secondary_outlet_price: 27.99,
        secondary_outlet_markdown_price: 22.99,
        secondary_prepack: 2,
        secondary_active_code: 'Active',
      },
      {
        article_id: '7',
        style: 'PQR-901',
        upc: '789012345678',
        description: 'Cashmere Scarf - Red',
        pos_description: 'Cashmere Scarf Red',
        item_number: 'ITEM-007',
        keywords: 'cashmere, scarf, red, luxury',
        size: 'One Size',
        color: 'Red',
        alias: 'Scarf Red',
        origin: 'Scotland',
        department: 'Accessories-02',
        class: 'Scarves-107',
        subclass: 'Cashmere Scarves-307',
        sub_dept: 'General-000',
        attribute1: 'General-000',
        attribute2: 'General-000',
        attribute3: 'Limited Edition-204',
        last_modified_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        creation_date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        season: 'Winter',
        active_code: 'Active',
        status: 'Active',
        stat3: 'ALL',
        // Primary vendor data
        primary_vendor: 'Vendor C',
        primary_retail_price: 49.99,
        primary_wholesale_price: 25.00,
        primary_first_cost: 20.00,
        primary_retail_markdown_price: 44.99,
        primary_outlet_price: 39.99,
        primary_outlet_markdown_price: 34.99,
        primary_prepack: 1,
        primary_active_code: 'Active',
        vendor_color: 'Red',
        // Secondary vendor data
        secondary_vendor: 'Vendor J',
        secondary_retail_price: 47.99,
        secondary_wholesale_price: 24.00,
        secondary_first_cost: 19.00,
        secondary_retail_markdown_price: 42.99,
        secondary_outlet_price: 37.99,
        secondary_outlet_markdown_price: 32.99,
        secondary_prepack: 1,
        secondary_active_code: 'Active',
      },
      {
        article_id: '8',
        style: 'STU-234',
        upc: '890123456789',
        description: 'Linen Pants - Beige',
        pos_description: 'Linen Pants Beige',
        item_number: 'ITEM-008',
        keywords: 'linen, pants, beige, summer',
        size: 'L',
        color: 'Beige-250',
        alias: 'Pants Beige',
        origin: 'Thailand',
        department: 'Apparel-01',
        class: 'Bottoms-202',
        subclass: 'Pants-308',
        sub_dept: 'General-000',
        attribute1: 'General-000',
        attribute2: 'General-000',
        attribute3: 'Designer-203',
        last_modified_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        creation_date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        season: 'Summer',
        active_code: 'Active',
        status: 'Active',
        stat3: 'ALL',
        // Primary vendor data
        primary_vendor: 'Vendor B',
        primary_retail_price: 69.99,
        primary_wholesale_price: 35.00,
        primary_first_cost: 28.00,
        primary_retail_markdown_price: 64.99,
        primary_outlet_price: 54.99,
        primary_outlet_markdown_price: 44.99,
        primary_prepack: 1,
        primary_active_code: 'Active',
        vendor_color: 'Beige',
        // Secondary vendor data
        secondary_vendor: 'Vendor K',
        secondary_retail_price: 67.99,
        secondary_wholesale_price: 34.00,
        secondary_first_cost: 27.00,
        secondary_retail_markdown_price: 62.99,
        secondary_outlet_price: 52.99,
        secondary_outlet_markdown_price: 42.99,
        secondary_prepack: 1,
        secondary_active_code: 'Active',
      },
      {
        article_id: '9',
        style: 'VWX-567',
        upc: '901234567890',
        description: 'Polo Shirt - Navy',
        pos_description: 'Polo Shirt Navy',
        item_number: 'ITEM-009',
        keywords: 'polo, shirt, navy, casual',
        size: 'M',
        color: 'Navy',
        alias: 'Polo Navy',
        origin: 'USA',
        department: 'Apparel-01',
        class: 'Tops-201',
        subclass: 'Polo Shirts-309',
        sub_dept: 'General-000',
        attribute1: 'General-000',
        attribute2: 'General-000',
        attribute3: 'Best Seller-202',
        last_modified_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        creation_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        season: 'Spring',
        active_code: 'Active',
        status: 'Active',
        stat3: 'ALL',
        // Primary vendor data
        primary_vendor: 'Vendor A',
        primary_retail_price: 34.99,
        primary_wholesale_price: 17.50,
        primary_first_cost: 14.00,
        primary_retail_markdown_price: 29.99,
        primary_outlet_price: 24.99,
        primary_outlet_markdown_price: 19.99,
        primary_prepack: 2,
        primary_active_code: 'Active',
        vendor_color: 'Navy',
        // Secondary vendor data
        secondary_vendor: 'Vendor L',
        secondary_retail_price: 32.99,
        secondary_wholesale_price: 16.50,
        secondary_first_cost: 13.00,
        secondary_retail_markdown_price: 27.99,
        secondary_outlet_price: 22.99,
        secondary_outlet_markdown_price: 17.99,
        secondary_prepack: 2,
        secondary_active_code: 'Active',
      },
      {
        article_id: '10',
        style: 'YZA-890',
        upc: '012345678901',
        description: 'Dress Shirt - White',
        pos_description: 'Dress Shirt White',
        item_number: 'ITEM-010',
        keywords: 'dress, shirt, white, formal',
        size: 'L',
        color: 'White',
        alias: 'Shirt White',
        origin: 'USA',
        department: 'Apparel-01',
        class: 'Tops-201',
        subclass: 'Dress Shirts-310',
        sub_dept: 'General-000',
        attribute1: 'General-000',
        attribute2: 'General-000',
        attribute3: 'Designer-203',
        last_modified_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        creation_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        season: 'All Season',
        active_code: 'Active',
        status: 'Active',
        stat3: 'ALL',
        // Primary vendor data
        primary_vendor: 'Vendor C',
        primary_retail_price: 64.99,
        primary_wholesale_price: 32.50,
        primary_first_cost: 26.00,
        primary_retail_markdown_price: 59.99,
        primary_outlet_price: 49.99,
        primary_outlet_markdown_price: 39.99,
        primary_prepack: 1,
        primary_active_code: 'Active',
        vendor_color: 'White',
        // Secondary vendor data
        secondary_vendor: 'Vendor M',
        secondary_retail_price: 62.99,
        secondary_wholesale_price: 31.50,
        secondary_first_cost: 25.00,
        secondary_retail_markdown_price: 57.99,
        secondary_outlet_price: 47.99,
        secondary_outlet_markdown_price: 37.99,
        secondary_prepack: 1,
        secondary_active_code: 'Active',
      },
    ];
  };

  // Check if there are any search criteria
  const hasSearchCriteria = React.useCallback(() => {
    const hasQuery = searchState.searchQuery && searchState.searchQuery.trim().length > 0;
    
    if (!searchState.filters) return hasQuery;
    
    // Check if filters have actual values
    const hasItemDetails = searchState.filters.itemDetails && (
      (searchState.filters.itemDetails.style && searchState.filters.itemDetails.style.trim()) ||
      (searchState.filters.itemDetails.sku && searchState.filters.itemDetails.sku.trim()) ||
      (searchState.filters.itemDetails.description && searchState.filters.itemDetails.description.trim()) ||
      (searchState.filters.itemDetails.posDescription && searchState.filters.itemDetails.posDescription.trim()) ||
      (searchState.filters.itemDetails.itemNumber && searchState.filters.itemDetails.itemNumber.trim()) ||
      (searchState.filters.itemDetails.keywords && searchState.filters.itemDetails.keywords.trim()) ||
      (searchState.filters.itemDetails.size && searchState.filters.itemDetails.size.trim()) ||
      (searchState.filters.itemDetails.color && searchState.filters.itemDetails.color.trim()) ||
      (searchState.filters.itemDetails.alias && searchState.filters.itemDetails.alias.trim()) ||
      (searchState.filters.itemDetails.origin && searchState.filters.itemDetails.origin.trim())
    );
    
    const hasHierarchy = searchState.filters.hierarchy && (
      (searchState.filters.hierarchy.departments && searchState.filters.hierarchy.departments.length > 0) ||
      (searchState.filters.hierarchy.classes && searchState.filters.hierarchy.classes.length > 0) ||
      (searchState.filters.hierarchy.subclasses && searchState.filters.hierarchy.subclasses.length > 0) ||
      (searchState.filters.hierarchy.subDept && searchState.filters.hierarchy.subDept.trim()) ||
      (searchState.filters.hierarchy.attribute1 && searchState.filters.hierarchy.attribute1.trim()) ||
      (searchState.filters.hierarchy.attribute2 && searchState.filters.hierarchy.attribute2.trim()) ||
      (searchState.filters.hierarchy.attribute3 && searchState.filters.hierarchy.attribute3.length > 0)
    );
    
    const hasVendor = searchState.filters.vendor && (
      (searchState.filters.vendor.vendorName && searchState.filters.vendor.vendorName.length > 0) ||
      (searchState.filters.vendor.vendorColor && searchState.filters.vendor.vendorColor.trim())
    );
    
    const hasPricing = searchState.filters.pricing && (
      (searchState.filters.pricing.wholesaleCost && (searchState.filters.pricing.wholesaleCost.min !== undefined || searchState.filters.pricing.wholesaleCost.max !== undefined)) ||
      (searchState.filters.pricing.firstCost && (searchState.filters.pricing.firstCost.min !== undefined || searchState.filters.pricing.firstCost.max !== undefined)) ||
      (searchState.filters.pricing.retailPrice && (searchState.filters.pricing.retailPrice.min !== undefined || searchState.filters.pricing.retailPrice.max !== undefined)) ||
      (searchState.filters.pricing.retailMarkdownPrice && (searchState.filters.pricing.retailMarkdownPrice.min !== undefined || searchState.filters.pricing.retailMarkdownPrice.max !== undefined)) ||
      (searchState.filters.pricing.outletPrice && (searchState.filters.pricing.outletPrice.min !== undefined || searchState.filters.pricing.outletPrice.max !== undefined)) ||
      (searchState.filters.pricing.outletMarkdownPrice && (searchState.filters.pricing.outletMarkdownPrice.min !== undefined || searchState.filters.pricing.outletMarkdownPrice.max !== undefined)) ||
      (searchState.filters.pricing.prepack && (searchState.filters.pricing.prepack.min !== undefined || searchState.filters.pricing.prepack.max !== undefined))
    );
    
    const hasStatus = searchState.filters.status && (
      (searchState.filters.status.activeCode && 
       searchState.filters.status.activeCode.trim() && 
       searchState.filters.status.activeCode.toUpperCase() !== 'ALL') ||
      (searchState.filters.status.status && 
       searchState.filters.status.status.trim() && 
       searchState.filters.status.status !== 'All') ||
      (searchState.filters.status.season && searchState.filters.status.season.trim()) ||
      (searchState.filters.status.stat3 && 
       searchState.filters.status.stat3.trim() && 
       searchState.filters.status.stat3.toUpperCase() !== 'ALL')
    );
    
    const hasDates = searchState.filters.dates && (
      searchState.filters.dates.lastModified ||
      searchState.filters.dates.creation
    );
    
    return hasQuery || hasItemDetails || hasHierarchy || hasVendor || hasPricing || hasStatus || hasDates;
  }, [searchState.searchQuery, searchState.filters]);

  // Perform search when query or filters change
  const performSearch = React.useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Check criteria using current state directly
    const hasQuery = searchState.searchQuery && searchState.searchQuery.trim().length > 0;
    const hasFilters = searchState.filters && (
      (searchState.filters.itemDetails && (
        (searchState.filters.itemDetails.style && searchState.filters.itemDetails.style.trim()) ||
        (searchState.filters.itemDetails.sku && searchState.filters.itemDetails.sku.trim()) ||
        (searchState.filters.itemDetails.description && searchState.filters.itemDetails.description.trim()) ||
        (searchState.filters.itemDetails.posDescription && searchState.filters.itemDetails.posDescription.trim()) ||
        (searchState.filters.itemDetails.itemNumber && searchState.filters.itemDetails.itemNumber.trim()) ||
        (searchState.filters.itemDetails.keywords && searchState.filters.itemDetails.keywords.trim()) ||
        (searchState.filters.itemDetails.size && searchState.filters.itemDetails.size.trim()) ||
        (searchState.filters.itemDetails.color && searchState.filters.itemDetails.color.trim()) ||
        (searchState.filters.itemDetails.alias && searchState.filters.itemDetails.alias.trim()) ||
        (searchState.filters.itemDetails.origin && searchState.filters.itemDetails.origin.trim())
      )) ||
      (searchState.filters.hierarchy && (
        (searchState.filters.hierarchy.departments && searchState.filters.hierarchy.departments.length > 0) ||
        (searchState.filters.hierarchy.classes && searchState.filters.hierarchy.classes.length > 0) ||
        (searchState.filters.hierarchy.subclasses && searchState.filters.hierarchy.subclasses.length > 0) ||
        (searchState.filters.hierarchy.subDept && searchState.filters.hierarchy.subDept.trim()) ||
        (searchState.filters.hierarchy.attribute1 && searchState.filters.hierarchy.attribute1.trim()) ||
        (searchState.filters.hierarchy.attribute2 && searchState.filters.hierarchy.attribute2.trim()) ||
        (searchState.filters.hierarchy.attribute3 && searchState.filters.hierarchy.attribute3.length > 0)
      )) ||
      (searchState.filters.vendor && (
        (searchState.filters.vendor.vendorName && searchState.filters.vendor.vendorName.length > 0) ||
        (searchState.filters.vendor.vendorColor && searchState.filters.vendor.vendorColor.trim())
      )) ||
      (searchState.filters.pricing && (
        (searchState.filters.pricing.wholesaleCost && (searchState.filters.pricing.wholesaleCost.min !== undefined || searchState.filters.pricing.wholesaleCost.max !== undefined)) ||
        (searchState.filters.pricing.firstCost && (searchState.filters.pricing.firstCost.min !== undefined || searchState.filters.pricing.firstCost.max !== undefined)) ||
        (searchState.filters.pricing.retailPrice && (searchState.filters.pricing.retailPrice.min !== undefined || searchState.filters.pricing.retailPrice.max !== undefined)) ||
        (searchState.filters.pricing.retailMarkdownPrice && (searchState.filters.pricing.retailMarkdownPrice.min !== undefined || searchState.filters.pricing.retailMarkdownPrice.max !== undefined)) ||
        (searchState.filters.pricing.outletPrice && (searchState.filters.pricing.outletPrice.min !== undefined || searchState.filters.pricing.outletPrice.max !== undefined)) ||
        (searchState.filters.pricing.outletMarkdownPrice && (searchState.filters.pricing.outletMarkdownPrice.min !== undefined || searchState.filters.pricing.outletMarkdownPrice.max !== undefined)) ||
        (searchState.filters.pricing.prepack && (searchState.filters.pricing.prepack.min !== undefined || searchState.filters.pricing.prepack.max !== undefined))
      )) ||
      (searchState.filters.status && (
        (searchState.filters.status.activeCode && 
         searchState.filters.status.activeCode.trim() && 
         searchState.filters.status.activeCode.toUpperCase() !== 'ALL') ||
        (searchState.filters.status.status && 
         searchState.filters.status.status.trim() && 
         searchState.filters.status.status !== 'All') ||
        (searchState.filters.status.season && searchState.filters.status.season.trim()) ||
        (searchState.filters.status.stat3 && 
         searchState.filters.status.stat3.trim() && 
         searchState.filters.status.stat3.toUpperCase() !== 'ALL')
      )) ||
      (searchState.filters.dates && (
        searchState.filters.dates.lastModified ||
        searchState.filters.dates.creation
      ))
    );
    
    if (!hasQuery && !hasFilters) {
      dispatch(setResults([]));
      dispatch(setRecordCount(null));
      dispatch(setLoading(false));
      return;
    }

    const request: SearchRequest = {
      quickSearch: searchState.searchQuery || undefined,
      filters: searchState.filters || undefined,
      vendorMode: searchState.vendorMode || 'primary',
      sort: searchState.sortConfig || undefined,
      pagination: { page: 1, limit: 1000 },
    };
    
    console.log('performSearch - Request:', JSON.stringify(request, null, 2));

    try {
      // Perform full search (automatically loads results)
      const searchResponse = await searchApi.search(request);
      console.log('Search API response:', searchResponse);
      dispatch(setResults(searchResponse.data || []));
      dispatch(setRecordCount(searchResponse.count || 0));
    } catch (error: any) {
      // If API fails, show mock data for demonstration
      console.warn('API call failed (backend may not be running), using mock data:', error.message);
      console.error('Error details:', error);
      const mockData = generateMockData();
      // Filter mock data based on search query and filters
      let filteredData = mockData;
      
      try {
      // Filter by search query
      if (request.quickSearch && request.quickSearch.trim()) {
        const query = request.quickSearch.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.style?.toLowerCase().includes(query) ||
          item.upc?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          (item as any).primary_vendor?.toLowerCase().includes(query) ||
          (item as any).secondary_vendor?.toLowerCase().includes(query)
        );
      }
      
      // Filter by active filters - ALL filters must match (AND logic)
      if (request.filters) {
        // Item Details filters
        if (request.filters.itemDetails) {
          const itemDetails = request.filters.itemDetails;
          if (itemDetails.style && itemDetails.style.trim()) {
            filteredData = filteredData.filter(item => 
              item.style?.toLowerCase().includes(itemDetails.style!.toLowerCase())
            );
          }
          if (itemDetails.sku && itemDetails.sku.trim()) {
            filteredData = filteredData.filter(item => 
              item.upc?.toLowerCase().includes(itemDetails.sku!.toLowerCase()) ||
              item.style?.toLowerCase().includes(itemDetails.sku!.toLowerCase())
            );
          }
          if (itemDetails.description && itemDetails.description.trim()) {
            filteredData = filteredData.filter(item => 
              item.description?.toLowerCase().includes(itemDetails.description!.toLowerCase())
            );
          }
          if (itemDetails.posDescription && itemDetails.posDescription.trim()) {
            filteredData = filteredData.filter(item => 
              (item as any).pos_description?.toLowerCase().includes(itemDetails.posDescription!.toLowerCase())
            );
          }
          if (itemDetails.itemNumber && itemDetails.itemNumber.trim()) {
            filteredData = filteredData.filter(item => 
              (item as any).item_number?.toLowerCase().includes(itemDetails.itemNumber!.toLowerCase())
            );
          }
          if (itemDetails.keywords && itemDetails.keywords.trim()) {
            filteredData = filteredData.filter(item => 
              (item as any).keywords?.toLowerCase().includes(itemDetails.keywords!.toLowerCase())
            );
          }
          if (itemDetails.size && itemDetails.size.trim()) {
            filteredData = filteredData.filter(item => 
              item.size?.toLowerCase().includes(itemDetails.size!.toLowerCase())
            );
          }
          if (itemDetails.color && itemDetails.color.trim()) {
            filteredData = filteredData.filter(item => 
              item.color?.toLowerCase().includes(itemDetails.color!.toLowerCase())
            );
          }
          if (itemDetails.alias && itemDetails.alias.trim()) {
            filteredData = filteredData.filter(item => 
              (item as any).alias?.toLowerCase().includes(itemDetails.alias!.toLowerCase())
            );
          }
          if (itemDetails.origin && itemDetails.origin.trim()) {
            filteredData = filteredData.filter(item => 
              (item as any).origin?.toLowerCase().includes(itemDetails.origin!.toLowerCase())
            );
          }
        }
        
        // Hierarchy filters
        if (request.filters.hierarchy) {
          if (request.filters.hierarchy.departments?.length) {
            filteredData = filteredData.filter(item => 
              request.filters.hierarchy?.departments?.includes(item.department)
            );
          }
          if (request.filters.hierarchy.classes?.length) {
            filteredData = filteredData.filter(item => 
              request.filters.hierarchy?.classes?.includes(item.class)
            );
          }
          if (request.filters.hierarchy.subclasses?.length) {
            filteredData = filteredData.filter(item => 
              request.filters.hierarchy?.subclasses?.includes(item.subclass)
            );
          }
          if (request.filters.hierarchy.subDept && request.filters.hierarchy.subDept.trim()) {
            filteredData = filteredData.filter(item => 
              (item as any).sub_dept?.toLowerCase().includes(request.filters.hierarchy?.subDept!.toLowerCase())
            );
          }
          if (request.filters.hierarchy.attribute1 && request.filters.hierarchy.attribute1.trim()) {
            filteredData = filteredData.filter(item => 
              (item as any).attribute1?.toLowerCase().includes(request.filters.hierarchy?.attribute1!.toLowerCase())
            );
          }
          if (request.filters.hierarchy.attribute2 && request.filters.hierarchy.attribute2.trim()) {
            filteredData = filteredData.filter(item => 
              (item as any).attribute2?.toLowerCase().includes(request.filters.hierarchy?.attribute2!.toLowerCase())
            );
          }
          if (request.filters.hierarchy.attribute3?.length) {
            filteredData = filteredData.filter(item => 
              request.filters.hierarchy?.attribute3?.includes((item as any).attribute3)
            );
          }
        }
        
        // Vendor filters
        if (request.filters.vendor?.vendorName?.length) {
          filteredData = filteredData.filter(item => 
            request.filters.vendor?.vendorName?.some(v => 
              (item as any).primary_vendor?.toLowerCase().includes(v.toLowerCase()) ||
              (item as any).secondary_vendor?.toLowerCase().includes(v.toLowerCase())
            )
          );
        }
        if (request.filters.vendor?.vendorColor && request.filters.vendor.vendorColor.trim()) {
          filteredData = filteredData.filter(item => 
            (item as any).vendor_color?.toLowerCase().includes(request.filters.vendor?.vendorColor!.toLowerCase())
          );
        }
        
        // Date filters
        if (request.filters.dates?.lastModified) {
          const dateRange = request.filters.dates.lastModified;
          if (dateRange.start || dateRange.end) {
            filteredData = filteredData.filter(item => {
              const itemDate = item.last_modified_date ? new Date(item.last_modified_date) : null;
              if (!itemDate) return false;
              if (dateRange.start && itemDate < new Date(dateRange.start)) return false;
              if (dateRange.end) {
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999); // Include entire end date
                if (itemDate > endDate) return false;
              }
              return true;
            });
          }
        }
        if (request.filters.dates?.creation) {
          const dateRange = request.filters.dates.creation;
          if (dateRange.start || dateRange.end) {
            filteredData = filteredData.filter(item => {
              const itemDate = item.creation_date ? new Date(item.creation_date) : null;
              if (!itemDate) return false;
              if (dateRange.start && itemDate < new Date(dateRange.start)) return false;
              if (dateRange.end) {
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999); // Include entire end date
                if (itemDate > endDate) return false;
              }
              return true;
            });
          }
        }
        
        // Status filters - exclude "ALL", "All", and empty strings
        if (request.filters.status?.activeCode && 
            request.filters.status.activeCode.trim() && 
            request.filters.status.activeCode.toUpperCase() !== 'ALL') {
          filteredData = filteredData.filter(item => {
            const status = request.vendorMode === 'secondary' 
              ? ((item as any).secondary_active_code || '')
              : ((item as any).primary_active_code || (item as any).active_code || '');
            return status === request.filters.status?.activeCode;
          });
        }
        if (request.filters.status?.status && 
            request.filters.status.status.trim() && 
            request.filters.status.status !== 'All') {
          filteredData = filteredData.filter(item => 
            (item as any).status === request.filters.status?.status
          );
        }
        if (request.filters.status?.season && request.filters.status.season.trim()) {
          filteredData = filteredData.filter(item => 
            item.season?.toLowerCase().includes(request.filters.status?.season?.toLowerCase() || '')
          );
        }
        if (request.filters.status?.stat3 && 
            request.filters.status.stat3.trim() && 
            request.filters.status.stat3.toUpperCase() !== 'ALL') {
          filteredData = filteredData.filter(item => 
            (item as any).stat3 === request.filters.status?.stat3
          );
        }
        
        // Pricing filters - updated to use min/max structure
        if (request.filters.pricing?.wholesaleCost && (request.filters.pricing.wholesaleCost.min !== undefined || request.filters.pricing.wholesaleCost.max !== undefined)) {
          const { min, max } = request.filters.pricing.wholesaleCost;
          filteredData = filteredData.filter(item => {
            const price = request.vendorMode === 'secondary' 
              ? ((item as any).secondary_wholesale_price || 0)
              : ((item as any).primary_wholesale_price || (item as any).wholesale_price || 0);
            if (!price) return false;
            if (min !== undefined && price < min) return false;
            if (max !== undefined && price > max) return false;
            return true;
          });
        }
        if (request.filters.pricing?.firstCost && (request.filters.pricing.firstCost.min !== undefined || request.filters.pricing.firstCost.max !== undefined)) {
          const { min, max } = request.filters.pricing.firstCost;
          filteredData = filteredData.filter(item => {
            const price = request.vendorMode === 'secondary' 
              ? ((item as any).secondary_first_cost || 0)
              : ((item as any).primary_first_cost || 0);
            if (!price) return false;
            if (min !== undefined && price < min) return false;
            if (max !== undefined && price > max) return false;
            return true;
          });
        }
        if (request.filters.pricing?.retailPrice && (request.filters.pricing.retailPrice.min !== undefined || request.filters.pricing.retailPrice.max !== undefined)) {
          const { min, max } = request.filters.pricing.retailPrice;
          filteredData = filteredData.filter(item => {
            const price = request.vendorMode === 'secondary' 
              ? ((item as any).secondary_retail_price || 0)
              : ((item as any).primary_retail_price || (item as any).retail_price || 0);
            if (!price) return false;
            if (min !== undefined && price < min) return false;
            if (max !== undefined && price > max) return false;
            return true;
          });
        }
        if (request.filters.pricing?.retailMarkdownPrice && (request.filters.pricing.retailMarkdownPrice.min !== undefined || request.filters.pricing.retailMarkdownPrice.max !== undefined)) {
          const { min, max } = request.filters.pricing.retailMarkdownPrice;
          filteredData = filteredData.filter(item => {
            const price = request.vendorMode === 'secondary' 
              ? ((item as any).secondary_retail_markdown_price || 0)
              : ((item as any).primary_retail_markdown_price || 0);
            if (!price) return false;
            if (min !== undefined && price < min) return false;
            if (max !== undefined && price > max) return false;
            return true;
          });
        }
        if (request.filters.pricing?.outletPrice && (request.filters.pricing.outletPrice.min !== undefined || request.filters.pricing.outletPrice.max !== undefined)) {
          const { min, max } = request.filters.pricing.outletPrice;
          filteredData = filteredData.filter(item => {
            const price = request.vendorMode === 'secondary' 
              ? ((item as any).secondary_outlet_price || 0)
              : ((item as any).primary_outlet_price || 0);
            if (!price) return false;
            if (min !== undefined && price < min) return false;
            if (max !== undefined && price > max) return false;
            return true;
          });
        }
        if (request.filters.pricing?.outletMarkdownPrice && (request.filters.pricing.outletMarkdownPrice.min !== undefined || request.filters.pricing.outletMarkdownPrice.max !== undefined)) {
          const { min, max } = request.filters.pricing.outletMarkdownPrice;
          filteredData = filteredData.filter(item => {
            const price = request.vendorMode === 'secondary' 
              ? ((item as any).secondary_outlet_markdown_price || 0)
              : ((item as any).primary_outlet_markdown_price || 0);
            if (!price) return false;
            if (min !== undefined && price < min) return false;
            if (max !== undefined && price > max) return false;
            return true;
          });
        }
        if (request.filters.pricing?.prepack && (request.filters.pricing.prepack.min !== undefined || request.filters.pricing.prepack.max !== undefined)) {
          const { min, max } = request.filters.pricing.prepack;
          filteredData = filteredData.filter(item => {
            const prepack = request.vendorMode === 'secondary' 
              ? ((item as any).secondary_prepack || 0)
              : ((item as any).primary_prepack || 0);
            if (!prepack) return false;
            if (min !== undefined && prepack < min) return false;
            if (max !== undefined && prepack > max) return false;
            return true;
          });
        }
      }
      
      console.log('=== FILTERING DEBUG ===');
      console.log('Original mock data count:', mockData.length);
      console.log('Request filters:', JSON.stringify(request.filters, null, 2));
      console.log('Request quickSearch:', request.quickSearch);
      console.log('Filtered mock data count:', filteredData.length, 'results');
      if (filteredData.length > 0) {
        console.log('Sample filtered item:', filteredData[0]);
      } else {
        console.log('No results after filtering - but will still show "No results found" message');
      }
      console.log('=== END DEBUG ===');
      dispatch(setResults(filteredData));
      dispatch(setRecordCount(filteredData.length));
      console.log('Dispatched results:', filteredData.length, 'items');
      } catch (filterError: any) {
        console.error('Error during filtering:', filterError);
        // If filtering fails, show all mock data as fallback
        dispatch(setResults(mockData));
        dispatch(setRecordCount(mockData.length));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [searchState.searchQuery, searchState.filters, searchState.vendorMode, searchState.sortConfig, dispatch]);

  // Auto-restore last session on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const lastSession = await sessionsApi.findLast();
        if (lastSession && (lastSession.searchQuery || lastSession.filters)) {
          dispatch(setSearchQuery(lastSession.searchQuery || ''));
          if (lastSession.filters) {
            dispatch(setFilters(lastSession.filters as SearchFilters));
          }
          if (lastSession.sortConfig) {
            dispatch(setSortConfig(lastSession.sortConfig));
          }
          // Trigger search with restored state (will be handled by the useEffect below)
        }
        // If no saved session, show empty state (no initial data)
        // User needs to search or apply filters to see results
      } catch (error) {
        console.warn('Failed to restore last session (this is normal if backend is not running):', error);
        // Show empty state on error - this is expected if backend is not running
      }
    };

    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-trigger search when search criteria changes
  useEffect(() => {
    const criteria = hasSearchCriteria();
    console.log('Search criteria changed:', { 
      query: searchState.searchQuery, 
      hasFilters: !!searchState.filters,
      criteria 
    });
    
    if (criteria) {
      // Use setTimeout to ensure state is updated before calling performSearch
      const timer = setTimeout(() => {
        console.log('Triggering performSearch');
        // Check pending changes before auto-searching
        if (hasPendingChanges) {
          if (!window.confirm(
            'You have unsaved changes. If you continue, all unsaved changes will be lost.\n\n' +
            'Do you want to continue and discard your changes?'
          )) {
            return; // User cancelled, don't perform search
          }
        }
        performSearch();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Clear results if no criteria
      console.log('No criteria, clearing results');
      dispatch(setResults([]));
      dispatch(setRecordCount(null));
      dispatch(setActiveFilters([]));
      dispatch(setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState.searchQuery, searchState.filters]);

  // Handle search query change
  const handleSearchChange = (query: string) => {
    // Only check pending changes if query actually changed (not just typing)
    // We'll check on search execution instead
    dispatch(setSearchQuery(query));
  };

  // Helper function to check for pending changes and warn user
  const checkPendingChanges = (): boolean => {
    if (hasPendingChanges) {
      return window.confirm(
        'You have unsaved changes. If you continue, all unsaved changes will be lost.\n\n' +
        'Do you want to continue and discard your changes?'
      );
    }
    return true;
  };

  // Handle search execution
  const handleSearch = () => {
    if (!checkPendingChanges()) return;
    performSearch();
  };

  // Handle filter application
  const handleApplyFilters = (filters: SearchFilters, activeFilters: { key: string; label: string }[]) => {
    if (!checkPendingChanges()) return;
    dispatch(setFilters(filters));
    dispatch(setActiveFilters(activeFilters));
    // Update vendor mode if it's in the filters
    if (filters.vendor?.mode && filters.vendor.mode !== searchState.vendorMode) {
      dispatch(setVendorMode(filters.vendor.mode));
    }
    performSearch();
  };

  // Handle filter removal
  const handleRemoveFilter = (key: string) => {
    if (!checkPendingChanges()) return;
    // Parse the filter key to determine which filter to remove
    const currentFilters = searchState.filters || {};
    const updatedFilters: SearchFilters = { ...currentFilters };

    // Remove the filter based on the key pattern
    if (key.startsWith('item-')) {
      // Item details filters
      const field = key.replace('item-', '');
      if (!updatedFilters.itemDetails) {
        updatedFilters.itemDetails = {};
      }
      updatedFilters.itemDetails = { ...updatedFilters.itemDetails };
      delete (updatedFilters.itemDetails as any)[field];
      // Remove itemDetails if empty
      if (Object.keys(updatedFilters.itemDetails).length === 0) {
        delete updatedFilters.itemDetails;
      }
    } else if (key.startsWith('dept-')) {
      // Department filter
      const dept = key.replace('dept-', '');
      if (updatedFilters.hierarchy?.departments) {
        updatedFilters.hierarchy = {
          ...updatedFilters.hierarchy,
          departments: updatedFilters.hierarchy.departments.filter(d => d !== dept),
        };
        if (updatedFilters.hierarchy.departments.length === 0) {
          delete updatedFilters.hierarchy.departments;
        }
        if (Object.keys(updatedFilters.hierarchy).length === 0) {
          delete updatedFilters.hierarchy;
        }
      }
    } else if (key.startsWith('class-')) {
      // Class filter
      const cls = key.replace('class-', '');
      if (updatedFilters.hierarchy?.classes) {
        updatedFilters.hierarchy = {
          ...updatedFilters.hierarchy,
          classes: updatedFilters.hierarchy.classes.filter(c => c !== cls),
        };
        if (updatedFilters.hierarchy.classes.length === 0) {
          delete updatedFilters.hierarchy.classes;
        }
        if (Object.keys(updatedFilters.hierarchy).length === 0) {
          delete updatedFilters.hierarchy;
        }
      }
    } else if (key.startsWith('subclass-')) {
      // Subclass filter
      const subcls = key.replace('subclass-', '');
      if (updatedFilters.hierarchy?.subclasses) {
        updatedFilters.hierarchy = {
          ...updatedFilters.hierarchy,
          subclasses: updatedFilters.hierarchy.subclasses.filter(s => s !== subcls),
        };
        if (updatedFilters.hierarchy.subclasses.length === 0) {
          delete updatedFilters.hierarchy.subclasses;
        }
        if (Object.keys(updatedFilters.hierarchy).length === 0) {
          delete updatedFilters.hierarchy;
        }
      }
    } else if (key.startsWith('vendor-')) {
      // Vendor filter
      const vendor = key.replace('vendor-', '');
      if (updatedFilters.vendor?.vendorName) {
        updatedFilters.vendor = {
          ...updatedFilters.vendor,
          vendorName: updatedFilters.vendor.vendorName.filter(v => v !== vendor),
        };
        if (updatedFilters.vendor.vendorName.length === 0) {
          delete updatedFilters.vendor.vendorName;
        }
        if (Object.keys(updatedFilters.vendor).length === 0) {
          delete updatedFilters.vendor;
        }
      }
    } else if (key === 'vendor-color') {
      // Vendor color filter
      if (updatedFilters.vendor) {
        updatedFilters.vendor = { ...updatedFilters.vendor };
        delete updatedFilters.vendor.vendorColor;
        if (Object.keys(updatedFilters.vendor).length === 0) {
          delete updatedFilters.vendor;
        }
      }
    } else if (key === 'retail-price' || key === 'wholesale-price' || key === 'markdown-price') {
      // Pricing filters
      const priceField = key.replace('-price', 'Price') as 'retailPrice' | 'wholesalePrice' | 'markdownPrice';
      if (updatedFilters.pricing) {
        updatedFilters.pricing = { ...updatedFilters.pricing };
        delete (updatedFilters.pricing as any)[priceField];
        if (Object.keys(updatedFilters.pricing).length === 0) {
          delete updatedFilters.pricing;
        }
      }
    } else if (key === 'status-active-code') {
      // Active Code filter
      if (updatedFilters.status) {
        updatedFilters.status = { ...updatedFilters.status };
        delete updatedFilters.status.activeCode;
        if (Object.keys(updatedFilters.status).length === 0) {
          delete updatedFilters.status;
        }
      }
    } else if (key === 'status-status') {
      // Status filter
      if (updatedFilters.status) {
        updatedFilters.status = { ...updatedFilters.status };
        delete updatedFilters.status.status;
        if (Object.keys(updatedFilters.status).length === 0) {
          delete updatedFilters.status;
        }
      }
    } else if (key === 'status-season') {
      // Season filter
      if (updatedFilters.status) {
        updatedFilters.status = { ...updatedFilters.status };
        delete updatedFilters.status.season;
        if (Object.keys(updatedFilters.status).length === 0) {
          delete updatedFilters.status;
        }
      }
    } else if (key === 'status-stat3') {
      // Stat 3 filter
      if (updatedFilters.status) {
        updatedFilters.status = { ...updatedFilters.status };
        delete updatedFilters.status.stat3;
        if (Object.keys(updatedFilters.status).length === 0) {
          delete updatedFilters.status;
        }
      }
    } else if (key === 'last-modified') {
      // Last modified date filter
      if (updatedFilters.dates) {
        updatedFilters.dates = { ...updatedFilters.dates };
        delete updatedFilters.dates.lastModified;
        if (Object.keys(updatedFilters.dates).length === 0) {
          delete updatedFilters.dates;
        }
      }
    } else if (key === 'creation-date') {
      // Creation date filter
      if (updatedFilters.dates) {
        updatedFilters.dates = { ...updatedFilters.dates };
        delete updatedFilters.dates.creation;
        if (Object.keys(updatedFilters.dates).length === 0) {
          delete updatedFilters.dates;
        }
      }
    }

    // Update filters state
    const finalFilters = Object.keys(updatedFilters).length > 0 ? updatedFilters : undefined;
    dispatch(setFilters(finalFilters));
    
    // Regenerate active filters from the updated filters
    const updatedActiveFilters: { key: string; label: string }[] = [];
    
    if (finalFilters?.itemDetails) {
      if (finalFilters.itemDetails.style) {
        updatedActiveFilters.push({ key: 'item-style', label: `Style: ${finalFilters.itemDetails.style}` });
      }
      if (finalFilters.itemDetails.sku) {
        updatedActiveFilters.push({ key: 'item-sku', label: `SKU: ${finalFilters.itemDetails.sku}` });
      }
      if (finalFilters.itemDetails.description) {
        updatedActiveFilters.push({ key: 'item-description', label: `Description: ${finalFilters.itemDetails.description}` });
      }
      if (finalFilters.itemDetails.size) {
        updatedActiveFilters.push({ key: 'item-size', label: `Size: ${finalFilters.itemDetails.size}` });
      }
      if (finalFilters.itemDetails.color) {
        updatedActiveFilters.push({ key: 'item-color', label: `Color: ${finalFilters.itemDetails.color}` });
      }
    }
    
    if (finalFilters?.hierarchy?.departments?.length) {
      finalFilters.hierarchy.departments.forEach(dept => {
        updatedActiveFilters.push({ key: `dept-${dept}`, label: `Department: ${dept}` });
      });
    }
    if (finalFilters?.hierarchy?.classes?.length) {
      finalFilters.hierarchy.classes.forEach(cls => {
        updatedActiveFilters.push({ key: `class-${cls}`, label: `Class: ${cls}` });
      });
    }
    if (finalFilters?.hierarchy?.subclasses?.length) {
      finalFilters.hierarchy.subclasses.forEach(subcls => {
        updatedActiveFilters.push({ key: `subclass-${subcls}`, label: `Subclass: ${subcls}` });
      });
    }
    
    if (finalFilters?.vendor?.vendorName?.length) {
      finalFilters.vendor.vendorName.forEach(vendor => {
        updatedActiveFilters.push({ key: `vendor-${vendor}`, label: `Vendor: ${vendor}` });
      });
    }
    if (finalFilters?.vendor?.vendorColor) {
      updatedActiveFilters.push({ key: 'vendor-color', label: `Vendor Color: ${finalFilters.vendor.vendorColor}` });
    }
    
    if (finalFilters?.pricing?.retailPrice) {
      const min = finalFilters.pricing.retailPrice.min || 0;
      const max = finalFilters.pricing.retailPrice.max || '∞';
      updatedActiveFilters.push({ key: 'retail-price', label: `Retail Price: $${min} - $${max}` });
    }
    if (finalFilters?.pricing?.wholesalePrice) {
      const min = finalFilters.pricing.wholesalePrice.min || 0;
      const max = finalFilters.pricing.wholesalePrice.max || '∞';
      updatedActiveFilters.push({ key: 'wholesale-price', label: `Wholesale Price: $${min} - $${max}` });
    }
    if (finalFilters?.pricing?.markdownPrice) {
      const min = finalFilters.pricing.markdownPrice.min || 0;
      const max = finalFilters.pricing.markdownPrice.max || '∞';
      updatedActiveFilters.push({ key: 'markdown-price', label: `Markdown Price: $${min} - $${max}` });
    }
    
    if (finalFilters?.status?.activeCode && 
        typeof finalFilters.status.activeCode === 'string' &&
        finalFilters.status.activeCode.trim() && 
        finalFilters.status.activeCode.toUpperCase() !== 'ALL') {
      updatedActiveFilters.push({ key: 'status-active-code', label: `Active Code: ${finalFilters.status.activeCode}` });
    }
    if (finalFilters?.status?.status && 
        typeof finalFilters.status.status === 'string' &&
        finalFilters.status.status.trim() && 
        finalFilters.status.status !== 'All') {
      updatedActiveFilters.push({ key: 'status-status', label: `Status: ${finalFilters.status.status}` });
    }
    if (finalFilters?.status?.season && 
        typeof finalFilters.status.season === 'string' &&
        finalFilters.status.season.trim()) {
      updatedActiveFilters.push({ key: 'status-season', label: `Season: ${finalFilters.status.season}` });
    }
    if (finalFilters?.status?.stat3 && 
        typeof finalFilters.status.stat3 === 'string' &&
        finalFilters.status.stat3.trim() && 
        finalFilters.status.stat3.toUpperCase() !== 'ALL') {
      updatedActiveFilters.push({ key: 'status-stat3', label: `Stat 3: ${finalFilters.status.stat3}` });
    }
    
    if (finalFilters?.dates?.lastModified) {
      updatedActiveFilters.push({ key: 'last-modified', label: 'Last Modified Date' });
    }
    if (finalFilters?.dates?.creation) {
      updatedActiveFilters.push({ key: 'creation-date', label: 'Creation Date' });
    }
    
    dispatch(setActiveFilters(updatedActiveFilters));
    
    // The FilterPanel will receive updated filters via initialFilters prop
    // and will update its internal state via useFilterState hook
    // The useEffect will automatically trigger a new search when filters change
  };

  // Handle sort change
  const handleSortChange = (sortConfig: { field: string; direction: 'asc' | 'desc' }) => {
    if (!checkPendingChanges()) return;
    dispatch(setSortConfig(sortConfig));
    performSearch();
  };

  // Handle vendor mode change
  const handleVendorModeChange = (mode: 'primary' | 'secondary') => {
    if (!checkPendingChanges()) return;
    dispatch(setVendorMode(mode));
    // Trigger new search with updated vendor mode
    performSearch();
  };

  // Handle download - export current results to CSV
  const handleDownload = () => {
    if (!searchState.results || searchState.results.length === 0) {
      alert('No results to download. Please perform a search first.');
      return;
    }

    // Define CSV headers based on available columns
    const headers = [
      'Style',
      'UPC',
      'Description',
      'Size',
      'Color',
      'Department',
      'Class',
      'Subclass',
      'Vendor',
      'Retail Price',
      'Wholesale Price',
      'Status',
      'Season',
      'Last Modified',
      'Creation Date',
    ];

    // Convert results to CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...searchState.results.map((item: any) => {
        const row = [
          item.style || '',
          item.upc || '',
          item.description || '',
          item.size || '',
          item.color || '',
          item.department || '',
          item.class || '',
          item.subclass || '',
          item.primary_vendor || '',
          item.retail_price || '',
          item.wholesale_price || '',
          item.active_code || '',
          item.season || '',
          item.last_modified_date || '',
          item.creation_date || '',
        ];
        // Escape commas and quotes in values
        return row.map(val => {
          const str = String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',');
      }),
    ];

    // Create CSV content
    const csvContent = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `item-maintenance-export-${timestamp}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!searchState.results || searchState.results.length === 0) {
      return; // Button should be disabled, but just in case
    }

    // Create a print-friendly HTML document
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the results.');
      return;
    }

    // Get vendor-specific values
    const getVendorValue = (item: any, field: string) => {
      if (searchState.vendorMode === 'secondary') {
        switch (field) {
          case 'vendor': return item.secondary_vendor || item.primary_vendor || '';
          case 'retail_price': return item.secondary_retail_price || item.primary_retail_price || item.retail_price || '';
          case 'wholesale_price': return item.secondary_wholesale_price || item.primary_wholesale_price || item.wholesale_price || '';
          case 'status': return item.secondary_active_code || item.primary_active_code || item.active_code || '';
          default: return item[field] || '';
        }
      } else {
        switch (field) {
          case 'vendor': return item.primary_vendor || '';
          case 'retail_price': return item.primary_retail_price || item.retail_price || '';
          case 'wholesale_price': return item.primary_wholesale_price || item.wholesale_price || '';
          case 'status': return item.primary_active_code || item.active_code || '';
          default: return item[field] || '';
        }
      }
    };

    const formatPrice = (price: number | string | undefined): string => {
      if (!price) return '';
      const num = typeof price === 'string' ? parseFloat(price) : price;
      return isNaN(num) ? '' : `$${num.toFixed(2)}`;
    };

    const formatDate = (date: string | undefined): string => {
      if (!date) return '';
      try {
        return new Date(date).toLocaleDateString();
      } catch {
        return date;
      }
    };

    // Build table rows
    const tableRows = searchState.results.map((item: any) => {
      return `
        <tr>
          <td>${item.style || ''}</td>
          <td>${item.upc || ''}</td>
          <td>${item.description || ''}</td>
          <td>${item.size || ''}</td>
          <td>${item.color || ''}</td>
          <td>${item.department || ''}</td>
          <td>${item.class || ''}</td>
          <td>${item.subclass || ''}</td>
          <td>${getVendorValue(item, 'vendor')}</td>
          <td>${formatPrice(getVendorValue(item, 'retail_price'))}</td>
          <td>${formatPrice(getVendorValue(item, 'wholesale_price'))}</td>
          <td>${getVendorValue(item, 'status')}</td>
          <td>${item.season || ''}</td>
          <td>${formatDate(item.last_modified_date)}</td>
          <td>${formatDate(item.creation_date)}</td>
        </tr>
      `;
    }).join('');

    // Create print document
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Item Maintenance - Search Results</title>
          <style>
            @media print {
              @page {
                margin: 1cm;
                size: landscape;
              }
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 10pt;
              margin: 20px;
            }
            h1 {
              font-size: 18pt;
              margin-bottom: 10px;
              color: #333;
            }
            .print-info {
              margin-bottom: 15px;
              font-size: 9pt;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th {
              background-color: #f5f5f5;
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-weight: bold;
              font-size: 9pt;
            }
            td {
              border: 1px solid #ddd;
              padding: 6px;
              font-size: 9pt;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 20px;
              font-size: 8pt;
              color: #999;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>Item Maintenance - Search Results</h1>
          <div class="print-info">
            <p><strong>Vendor Mode:</strong> ${searchState.vendorMode === 'secondary' ? 'Secondary Vendor' : 'Primary Vendor'}</p>
            <p><strong>Total Records:</strong> ${searchState.results.length}</p>
            <p><strong>Printed:</strong> ${new Date().toLocaleString()}</p>
            ${searchState.searchQuery ? `<p><strong>Search Query:</strong> ${searchState.searchQuery}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th>Style</th>
                <th>UPC</th>
                <th>Description</th>
                <th>Size</th>
                <th>Color</th>
                <th>Department</th>
                <th>Class</th>
                <th>Subclass</th>
                <th>Vendor</th>
                <th>Retail Price</th>
                <th>Wholesale Price</th>
                <th>Status</th>
                <th>Season</th>
                <th>Last Modified</th>
                <th>Creation Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">
            <p>Generated from Item Maintenance V2</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Optionally close the window after printing
        // printWindow.close();
      }, 250);
    };
  };

  // Handle saved session load
  const handleLoadSession = (session: SearchSession) => {
    if (!checkPendingChanges()) return;
    dispatch(setSearchQuery(session.searchQuery || ''));
    if (session.vendorMode) {
      dispatch(setVendorMode(session.vendorMode));
    }
    if (session.filters) {
      const filters = session.filters as SearchFilters;
      dispatch(setFilters(filters));
      
      // Generate active filters from the loaded session
      const activeFilters: { key: string; label: string }[] = [];
      
      // Item Details
      if (filters.itemDetails) {
        if (filters.itemDetails.style) {
          activeFilters.push({ key: 'item-style', label: `Style: ${filters.itemDetails.style}` });
        }
        if (filters.itemDetails.sku) {
          activeFilters.push({ key: 'item-sku', label: `SKU: ${filters.itemDetails.sku}` });
        }
        if (filters.itemDetails.description) {
          activeFilters.push({ key: 'item-description', label: `Description: ${filters.itemDetails.description}` });
        }
        if (filters.itemDetails.size) {
          activeFilters.push({ key: 'item-size', label: `Size: ${filters.itemDetails.size}` });
        }
        if (filters.itemDetails.color) {
          activeFilters.push({ key: 'item-color', label: `Color: ${filters.itemDetails.color}` });
        }
      }
      
      // Hierarchy
      if (filters.hierarchy?.departments?.length) {
        filters.hierarchy.departments.forEach(dept => {
          activeFilters.push({ key: `dept-${dept}`, label: `Department: ${dept}` });
        });
      }
      if (filters.hierarchy?.classes?.length) {
        filters.hierarchy.classes.forEach(cls => {
          activeFilters.push({ key: `class-${cls}`, label: `Class: ${cls}` });
        });
      }
      if (filters.hierarchy?.subclasses?.length) {
        filters.hierarchy.subclasses.forEach(subcls => {
          activeFilters.push({ key: `subclass-${subcls}`, label: `Subclass: ${subcls}` });
        });
      }
      
      // Vendor
      if (filters.vendor?.vendorName?.length) {
        filters.vendor.vendorName.forEach(vendor => {
          activeFilters.push({ key: `vendor-${vendor}`, label: `Vendor: ${vendor}` });
        });
      }
      if (filters.vendor?.vendorColor) {
        activeFilters.push({ key: 'vendor-color', label: `Vendor Color: ${filters.vendor.vendorColor}` });
      }
      
      // Pricing
      if (filters.pricing?.retailPrice) {
        const min = filters.pricing.retailPrice.min || 0;
        const max = filters.pricing.retailPrice.max || '∞';
        activeFilters.push({ key: 'retail-price', label: `Retail Price: $${min} - $${max}` });
      }
      if (filters.pricing?.wholesalePrice) {
        const min = filters.pricing.wholesalePrice.min || 0;
        const max = filters.pricing.wholesalePrice.max || '∞';
        activeFilters.push({ key: 'wholesale-price', label: `Wholesale Price: $${min} - $${max}` });
      }
      if (filters.pricing?.markdownPrice) {
        const min = filters.pricing.markdownPrice.min || 0;
        const max = filters.pricing.markdownPrice.max || '∞';
        activeFilters.push({ key: 'markdown-price', label: `Markdown Price: $${min} - $${max}` });
      }
      
      // Status - handle both string and array types (type mismatch in SearchFilters)
      if (filters.status?.activeCode) {
        const activeCodes = Array.isArray(filters.status.activeCode) 
          ? filters.status.activeCode 
          : [filters.status.activeCode];
        activeCodes.forEach(code => {
          if (typeof code === 'string' && code.trim() && code.toUpperCase() !== 'ALL') {
            activeFilters.push({ key: 'status-active-code', label: `Active Code: ${code}` });
          }
        });
      }
      if (filters.status?.status) {
        const statuses = Array.isArray(filters.status.status) 
          ? filters.status.status 
          : [filters.status.status];
        statuses.forEach(status => {
          if (typeof status === 'string' && status.trim() && status !== 'All') {
            activeFilters.push({ key: 'status-status', label: `Status: ${status}` });
          }
        });
      }
      if (filters.status?.season) {
        const seasons = Array.isArray(filters.status.season) 
          ? filters.status.season 
          : [filters.status.season];
        seasons.forEach(season => {
          if (typeof season === 'string' && season.trim()) {
            activeFilters.push({ key: 'status-season', label: `Season: ${season}` });
          }
        });
      }
      if (filters.status?.stat3) {
        const stat3s = Array.isArray(filters.status.stat3) 
          ? filters.status.stat3 
          : [filters.status.stat3];
        stat3s.forEach(stat3 => {
          if (typeof stat3 === 'string' && stat3.trim() && stat3.toUpperCase() !== 'ALL') {
            activeFilters.push({ key: 'status-stat3', label: `Stat 3: ${stat3}` });
          }
        });
      }
      
      // Dates
      if (filters.dates?.lastModified) {
        activeFilters.push({ key: 'last-modified', label: 'Last Modified Date' });
      }
      if (filters.dates?.creation) {
        activeFilters.push({ key: 'creation-date', label: 'Creation Date' });
      }
      
      dispatch(setActiveFilters(activeFilters));
    } else {
      dispatch(setActiveFilters([]));
    }
    
    if (session.sortConfig) {
      dispatch(setSortConfig(session.sortConfig));
    }
    
    // Trigger search with loaded session data
    // Note: The FilterPanel will also auto-apply filters, but that's okay as it will use the same values
    performSearch();
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar
        searchQuery={searchState.searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onLoadSession={handleLoadSession}
        currentSearchQuery={searchState.searchQuery}
        currentFilters={searchState.filters}
        onFilterToggle={() => setFilterPanelOpen(!filterPanelOpen)}
        filterPanelOpen={filterPanelOpen}
        currentSortConfig={searchState.sortConfig}
        onDownload={handleDownload}
        onPrint={handlePrint}
        hasResults={searchState.results && searchState.results.length > 0}
        vendorMode={searchState.vendorMode}
        onVendorModeChange={handleVendorModeChange}
        currentVendorMode={searchState.vendorMode}
      />

      <div className="flex">
        <FilterPanel
          open={filterPanelOpen}
          onOpenChange={setFilterPanelOpen}
          activeFilters={searchState.activeFilters}
          onApplyFilters={handleApplyFilters}
          initialFilters={searchState.filters}
          vendorMode={searchState.vendorMode}
          onVendorModeChange={handleVendorModeChange}
        />

        <main className="flex-1">
          <div className="p-6">
            {/* Show active filters if any are applied */}
            {searchState.activeFilters.length > 0 && (
              <ActiveFilters
                filters={searchState.activeFilters}
                onRemove={handleRemoveFilter}
              />
            )}

            {/* Show record count if search has been performed */}
            {searchState.recordCount !== null && (
              <RecordCount
                count={searchState.recordCount}
                loading={searchState.loading}
              />
            )}

            {searchState.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{searchState.error}</p>
              </div>
            )}

            {/* Show empty state if no search criteria entered */}
            {(() => {
              const hasCriteria = hasSearchCriteria();
              console.log('App render decision:', {
                hasCriteria,
                loading: searchState.loading,
                resultsCount: searchState.results?.length || 0,
                willShowEmpty: !hasCriteria && !searchState.loading,
                willShowGrid: hasCriteria || searchState.loading
              });
              
              if (!hasCriteria && !searchState.loading) {
                return <EmptyState />;
              }
              
              return (
                <ResultsGrid
                  results={searchState.results || []}
                  loading={searchState.loading}
                  hasSearchCriteria={hasCriteria}
                  vendorMode={searchState.vendorMode}
                  onPendingChangesChange={setHasPendingChanges}
                onUpdate={(articleId, field, value) => {
                  try {
                    // Update the result in state
                    const updatedResults = (searchState.results || []).map(item =>
                      item.article_id === articleId
                        ? { ...item, [field]: value }
                        : item
                    );
                    dispatch(setResults(updatedResults));
                    // TODO: Call API to persist the change
                    console.log('Saving update:', articleId, field, value);
                  } catch (error) {
                    console.error('Error updating result:', error);
                  }
                }}
                onBulkUpdate={(updates) => {
                  // Batch update multiple rows at once
                  const updatedResults = searchState.results.map(item => {
                    const update = updates.find(u => u.articleId === item.article_id);
                    if (update) {
                      return { ...item, [update.field]: update.value };
                    }
                    return item;
                  });
                  dispatch(setResults(updatedResults));
                  // TODO: Call API to persist all changes
                  console.log('Saving bulk update:', updates.length, 'rows');
                }}
                />
              );
            })()}
          </div>
        </main>
      </div>
    </div>
  );
}

