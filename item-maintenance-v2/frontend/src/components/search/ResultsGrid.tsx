/**
 * Results Grid Component
 * Displays search results in a table format with inline editing and column customization
 */

import React, { useState, useEffect, useRef } from 'react';
import { SmartEditableCell } from './SmartEditableCell';
import { ColumnCustomizer, ColumnConfig } from './ColumnCustomizer';
import { ModifyOptionsMenu } from './ModifyOptionsMenu';
import { GripVertical, Edit2, Lock } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Article {
  article_id: string;
  style: string;
  upc: string;
  description: string;
  size?: string;
  color?: string;
  department?: string;
  class?: string;
  subclass?: string;
  last_modified_date: string;
  creation_date: string;
  active_code: string;
  season: string;
  primary_vendor?: string;
  retail_price?: number;
  wholesale_price?: number;
}

interface ResultsGridProps {
  results: Article[];
  loading: boolean;
  hasSearchCriteria?: boolean;
  vendorMode?: 'primary' | 'secondary';
  onUpdate?: (articleId: string, field: string, value: any) => void;
  onBulkUpdate?: (updates: Array<{ articleId: string; field: string; value: any }>) => void;
}

const defaultColumns: ColumnConfig[] = [
  { id: 'upc', label: 'UPC', visible: true, order: 0 },
  { id: 'first_digits', label: 'First Digits', visible: false, order: 1 },
  { id: 'vendor', label: 'Vendor', visible: true, order: 2 },
  { id: 'style', label: 'Style', visible: true, order: 3 },
  { id: 'mfg_number', label: 'MFG#', visible: false, order: 4 },
  { id: 'color_name', label: 'Color Name', visible: true, order: 5 },
  { id: 'vendor_color', label: 'Vendor Color', visible: true, order: 6 },
  { id: 'size', label: 'Size', visible: true, order: 7 },
  { id: 'size_code', label: 'Size Code', visible: false, order: 8 },
  { id: 'description', label: 'Description', visible: true, order: 9 },
  { id: 'pos_description', label: 'POS Description', visible: true, order: 10 },
  { id: 'short_description', label: 'Short Description', visible: false, order: 11 },
  { id: 'status', label: 'Status', visible: true, order: 12 },
  { id: 'first_cost', label: 'First Cost', visible: true, order: 13 },
  { id: 'wholesale_price', label: 'Wholesale Cost', visible: true, order: 14 },
  { id: 'retail_price', label: 'Retail Price', visible: true, order: 15 },
  { id: 'markdown_price', label: 'Markdown Price', visible: false, order: 16 },
  { id: 'markdown_date', label: 'Markdown Date', visible: false, order: 17 },
  { id: 'outlet_price', label: 'Outlet Price', visible: false, order: 18 },
  { id: 'outlet_markdown_price', label: 'Outlet Markdown Price', visible: false, order: 19 },
  { id: 'department', label: 'Department', visible: true, order: 20 },
  { id: 'class', label: 'Class', visible: true, order: 21 },
  { id: 'subclass', label: 'Sub-Class', visible: true, order: 22 },
  { id: 'sub_dept', label: 'Sub Dept', visible: false, order: 23 },
  { id: 'attribute1', label: 'Attribute 1', visible: false, order: 24 },
  { id: 'attribute2', label: 'Attribute 2', visible: false, order: 25 },
  { id: 'attribute3', label: 'Attribute 3', visible: false, order: 26 },
  { id: 'season', label: 'Season', visible: true, order: 27 },
  { id: 'prepack', label: 'PrePack', visible: false, order: 28 },
  { id: 'last_modified_date', label: 'Last Modify Date', visible: true, order: 29 },
  { id: 'alt_style_sku_upc', label: 'Alt Style/SKU/UPC', visible: false, order: 30 },
  { id: 'active_code', label: 'Active Code', visible: true, order: 31 },
  { id: 'available_on_web', label: 'Available on Web', visible: false, order: 32 },
  { id: 'stat3', label: 'Stat 3', visible: true, order: 33 },
  { id: 'item_picture', label: 'Item Picture', visible: false, order: 34 },
  { id: 'item_weight', label: 'Item Weight', visible: false, order: 35 },
  { id: 'item_length', label: 'Item Length', visible: false, order: 36 },
  { id: 'item_width', label: 'Item Width', visible: false, order: 37 },
  { id: 'item_height', label: 'Item Height', visible: false, order: 38 },
  { id: 'case_length', label: 'Case Length', visible: false, order: 39 },
  { id: 'case_width', label: 'Case Width', visible: false, order: 40 },
  { id: 'case_height', label: 'Case Height', visible: false, order: 41 },
  { id: 'case_weight', label: 'Case Weight', visible: false, order: 42 },
  { id: 'case_cube', label: 'Case Cube', visible: false, order: 43 },
  { id: 'shipping_code', label: 'Shipping Code', visible: false, order: 44 },
  { id: 'taxable_code', label: 'Taxable Code', visible: false, order: 45 },
  { id: 'case_quantity', label: 'Case Quantity', visible: false, order: 46 },
  { id: 'lead_time', label: 'Lead Time', visible: false, order: 47 },
  { id: 'duty_code', label: 'Duty Code', visible: false, order: 48 },
  { id: 'employee_price', label: 'Employee Price', visible: false, order: 49 },
];

export function ResultsGrid({ results, loading, hasSearchCriteria = false, onUpdate, onBulkUpdate, vendorMode = 'primary' }: ResultsGridProps) {
  // Add error boundary state
  const [error, setError] = useState<Error | null>(null);
  
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    try {
      const saved = localStorage.getItem('columnConfig');
      return saved ? JSON.parse(saved) : defaultColumns;
    } catch (e) {
      console.error('Error loading column config:', e);
      return defaultColumns;
    }
  });

  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
  const [dragOverColumnIndex, setDragOverColumnIndex] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [bulkEditField, setBulkEditField] = useState<string>('');
  const [bulkEditValue, setBulkEditValue] = useState<string>('');
  
  // Modify options state
  const [copiedValues, setCopiedValues] = useState<{ columnId: string; values: any[] } | null>(null);
  const [originalValues, setOriginalValues] = useState<Map<string, Map<string, any>>>(new Map()); // articleId -> field -> original value
  const [modifiedValues, setModifiedValues] = useState<Map<string, Map<string, any>>>(new Map()); // articleId -> field -> modified value

  // ALL REFS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const prevResultsIdsRef = React.useRef<string>('');
  const selectAllCheckboxRef = React.useRef<HTMLInputElement>(null);

  // Save column config to localStorage
  useEffect(() => {
    localStorage.setItem('columnConfig', JSON.stringify(columns));
  }, [columns]);

  // Clear selection when results change (new search performed)
  // Only clear if the actual article IDs changed (not just a re-render)
  useEffect(() => {
    const safeResults = Array.isArray(results) ? results : [];
    const currentIds = safeResults.map(r => r.article_id).join(',');
    if (prevResultsIdsRef.current && prevResultsIdsRef.current !== currentIds) {
      // Results actually changed, clear selection
      setSelectedRows(new Set());
      setBulkEditField('');
      setBulkEditValue('');
      // Clear copied values and modified values
      setCopiedValues(null);
      setModifiedValues(new Map());
    }
    prevResultsIdsRef.current = currentIds;
  }, [results]);

  // Initialize original values when results change
  // This must be after getCellValue is defined, so we'll move it later

  // Debug logging
  useEffect(() => {
    const safeResults = Array.isArray(results) ? results : [];
    console.log('ResultsGrid render:', { 
      resultsCount: safeResults.length, 
      loading, 
      hasSearchCriteria 
    });
  }, [results, loading, hasSearchCriteria]);

  // Safety check - ensure results is an array (must be after all hooks)
  const safeResults = Array.isArray(results) ? results : [];
  
  // Update indeterminate state for select all checkbox
  // MUST be before any conditional returns
  const isAllSelected = safeResults.length > 0 && selectedRows.size === safeResults.length;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < safeResults.length;
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  // Initialize original values when results change (MUST be before any conditional returns)
  useEffect(() => {
    const safeResultsArray = Array.isArray(results) ? results : [];
    if (safeResultsArray.length === 0) {
      setOriginalValues(new Map());
      return;
    }
    const newOriginalValues = new Map<string, Map<string, any>>();
    const sortedCols = [...columns].sort((a, b) => a.order - b.order).filter(col => col.visible);
    safeResultsArray.forEach(article => {
      const articleMap = new Map<string, any>();
      sortedCols.forEach(col => {
        // We need getCellValue here, but it's defined later. We'll use a workaround.
        const item = article as any;
        let value: any;
        // Simplified value extraction - we'll use the actual getCellValue logic later
        switch (col.id) {
          case 'vendor':
            value = vendorMode === 'secondary' ? item.secondary_vendor : item.primary_vendor || item.vendor;
            break;
          case 'retail_price':
            value = vendorMode === 'secondary' ? item.secondary_retail_price : item.primary_retail_price || item.retail_price;
            break;
          case 'wholesale_price':
            value = vendorMode === 'secondary' ? item.secondary_wholesale_price : item.primary_wholesale_price || item.wholesale_price;
            break;
          case 'status':
          case 'active_code':
            value = vendorMode === 'secondary' ? item.secondary_active_code : item.primary_active_code || item.active_code;
            break;
          default:
            value = item[col.id] || '';
        }
        articleMap.set(col.id, value);
      });
      newOriginalValues.set(article.article_id, articleMap);
    });
    setOriginalValues(newOriginalValues);
  }, [results, columns.map(c => c.id).join(','), vendorMode]);

  // Show error if one occurred
  if (error) {
    return (
      <div className="mt-4 bg-white border border-red-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-red-200">
          <h3 className="text-lg font-semibold text-red-900">Error</h3>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-600">{error.message}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // Don't render anything if no search criteria (EmptyState will be shown by parent)
  // But always show something if loading, has results, or has search criteria
  // IMPORTANT: If hasSearchCriteria is true, we MUST render something (even if empty)
  if (!hasSearchCriteria && !loading && safeResults.length === 0) {
    console.log('ResultsGrid: Returning null - no criteria, not loading, no results');
    return null;
  }
  
  // Debug: Log what we're about to render
  console.log('ResultsGrid render decision:', {
    hasSearchCriteria,
    loading,
    safeResultsLength: safeResults.length,
    willShowLoading: loading,
    willShowNoResults: safeResults.length === 0 && hasSearchCriteria && !loading,
    willShowTable: safeResults.length > 0 && !loading
  });

  if (loading) {
    return (
      <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Results</h3>
          <ColumnCustomizer columns={columns} onColumnsChange={setColumns} />
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  // Show "No results found" only if search criteria exist but no results
  if (safeResults.length === 0 && hasSearchCriteria && !loading) {
    return (
      <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Results</h3>
          <ColumnCustomizer columns={columns} onColumnsChange={setColumns} />
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-600">No results found. Try adjusting your search or filters.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '-';
    return `$${price.toFixed(2)}`;
  };

  const handleCellUpdate = (articleId: string, field: string, value: any) => {
    if (onUpdate) {
      onUpdate(articleId, field, value);
    } else {
      // Default: just log for now
      console.log('Update:', articleId, field, value);
    }
  };

  const getCellValue = (article: Article, columnId: string): string | number => {
    const item = article as any;
    
    switch (columnId) {
      // Basic identifiers
      case 'upc': return item.upc || '-';
      case 'first_digits': return item.first_digits || (item.upc ? item.upc.substring(0, 12) : '-');
      case 'style': return item.style || '-';
      case 'mfg_number': return item.mfg_number || item.mfgNumber || '-';
      case 'alt_style_sku_upc': return item.alt_style_sku_upc || item.altStyleSkuUpc || '-';
      
      // Vendor
      case 'vendor': 
        if (vendorMode === 'secondary') {
          return item.secondary_vendor || item.secondaryVendor || '-';
        }
        return item.primary_vendor || item.primaryVendor || '-';
      
      // Color and Size
      case 'color_name': return item.color_name || item.colorName || item.color || '-';
      case 'vendor_color': return item.vendor_color || item.vendorColor || '-';
      case 'size': return item.size || '-';
      case 'size_code': return item.size_code || item.sizeCode || '-';
      
      // Descriptions
      case 'description': return item.description || '-';
      case 'pos_description': return item.pos_description || item.posDescription || '-';
      case 'short_description': return item.short_description || item.shortDescription || '-';
      
      // Status
      case 'status': 
        if (vendorMode === 'secondary') {
          return item.secondary_active_code || item.secondaryActiveCode || '-';
        }
        return item.primary_active_code || item.primaryActiveCode || item.active_code || item.activeCode || '-';
      case 'active_code': 
        if (vendorMode === 'secondary') {
          return item.secondary_active_code || item.secondaryActiveCode || '-';
        }
        return item.primary_active_code || item.primaryActiveCode || item.active_code || item.activeCode || '-';
      case 'available_on_web': return item.available_on_web || item.availableOnWeb || '-';
      case 'stat3': return item.stat3 || item.stat3 || '-';
      
      // Pricing
      case 'first_cost': 
        if (vendorMode === 'secondary') {
          return item.secondary_first_cost || item.secondaryFirstCost || 0;
        }
        return item.primary_first_cost || item.primaryFirstCost || item.first_cost || item.firstCost || 0;
      case 'wholesale_price': 
        if (vendorMode === 'secondary') {
          return item.secondary_wholesale_price || item.secondaryWholesalePrice || 0;
        }
        return item.primary_wholesale_price || item.primaryWholesalePrice || item.wholesale_price || item.wholesalePrice || 0;
      case 'retail_price': 
        if (vendorMode === 'secondary') {
          return item.secondary_retail_price || item.secondaryRetailPrice || 0;
        }
        return item.primary_retail_price || item.primaryRetailPrice || item.retail_price || item.retailPrice || 0;
      case 'markdown_price': 
        if (vendorMode === 'secondary') {
          return item.secondary_retail_markdown_price || item.secondaryRetailMarkdownPrice || 0;
        }
        return item.primary_retail_markdown_price || item.primaryRetailMarkdownPrice || item.retail_markdown_price || item.retailMarkdownPrice || 0;
      case 'markdown_date': return item.markdown_date ? formatDate(item.markdown_date) : '-';
      case 'outlet_price': 
        if (vendorMode === 'secondary') {
          return item.secondary_outlet_price || item.secondaryOutletPrice || 0;
        }
        return item.primary_outlet_price || item.primaryOutletPrice || item.outlet_price || item.outletPrice || 0;
      case 'outlet_markdown_price': 
        if (vendorMode === 'secondary') {
          return item.secondary_outlet_markdown_price || item.secondaryOutletMarkdownPrice || 0;
        }
        return item.primary_outlet_markdown_price || item.primaryOutletMarkdownPrice || item.outlet_markdown_price || item.outletMarkdownPrice || 0;
      case 'employee_price': return item.employee_price || item.employeePrice || 0;
      
      // Hierarchy
      case 'department': return item.department || '-';
      case 'class': return item.class || '-';
      case 'subclass': return item.subclass || '-';
      case 'sub_dept': return item.sub_dept || item.subDept || '-';
      case 'attribute1': return item.attribute1 || '-';
      case 'attribute2': return item.attribute2 || '-';
      case 'attribute3': return item.attribute3 || '-';
      
      // Other
      case 'season': return item.season || '-';
      case 'prepack': 
        if (vendorMode === 'secondary') {
          return item.secondary_prepack || item.secondaryPrepack || 0;
        }
        return item.primary_prepack || item.primaryPrepack || item.prepack || 0;
      case 'last_modified_date': return item.last_modified_date ? formatDate(item.last_modified_date) : '-';
      
      // Physical attributes
      case 'item_picture': return item.item_picture || item.itemPicture || '-';
      case 'item_weight': return item.item_weight || item.itemWeight || 0;
      case 'item_length': return item.item_length || item.itemLength || 0;
      case 'item_width': return item.item_width || item.itemWidth || 0;
      case 'item_height': return item.item_height || item.itemHeight || 0;
      case 'case_length': return item.case_length || item.caseLength || 0;
      case 'case_width': return item.case_width || item.caseWidth || 0;
      case 'case_height': return item.case_height || item.caseHeight || 0;
      case 'case_weight': return item.case_weight || item.caseWeight || 0;
      case 'case_cube': return item.case_cube || item.caseCube || 0;
      case 'case_quantity': return item.case_quantity || item.caseQuantity || 0;
      
      // Codes
      case 'shipping_code': return item.shipping_code || item.shippingCode || '-';
      case 'taxable_code': return item.taxable_code || item.taxableCode || '-';
      case 'lead_time': return item.lead_time || item.leadTime || '-';
      case 'duty_code': return item.duty_code || item.dutyCode || '-';
      
      // Legacy support
      case 'last_modified': return item.last_modified_date ? formatDate(item.last_modified_date) : '-';
      case 'creation_date': return item.creation_date ? formatDate(item.creation_date) : '-';
      case 'color': return item.color || '-';
      
      default: return '-';
    }
  };

  // Only certain fields should be editable based on business requirements
  // In primary vendor mode: most fields are editable except UPC, dates, and some system fields
  // In secondary vendor mode: ONLY price fields (retail_price, wholesale_price) and status are editable
  // Dates, UPC, and system-managed fields are read-only
  const isEditable = (columnId: string): boolean => {
    if (vendorMode === 'secondary') {
      // In secondary vendor mode, only price fields and status are editable
      return ['retail_price', 'wholesale_price', 'status', 'active_code'].includes(columnId);
    }
    // In primary vendor mode, most fields are editable except:
    // - UPC and First Digits (unique identifiers)
    // - Dates (system-managed)
    // - Item Picture (link)
    const readOnlyFields = [
      'upc', 'first_digits', 'last_modified_date', 'creation_date', 
      'item_picture', 'markdown_date'
    ];
    return !readOnlyFields.includes(columnId);
  };

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order).filter(col => col.visible);

  const handleColumnDragStart = (index: number) => {
    setDraggedColumnIndex(index);
  };

  const handleColumnDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverColumnIndex(index);
  };

  const handleColumnDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedColumnIndex === null || draggedColumnIndex === dropIndex) {
      setDraggedColumnIndex(null);
      setDragOverColumnIndex(null);
      return;
    }

    const updated = [...sortedColumns];
    const draggedColumn = updated[draggedColumnIndex];
    updated.splice(draggedColumnIndex, 1);
    updated.splice(dropIndex, 0, draggedColumn);
    
    updated.forEach((col, i) => {
      col.order = i;
    });
    
    // Update all columns with new order
    const allColumns = columns.map(col => {
      const found = updated.find(c => c.id === col.id);
      return found ? { ...col, order: found.order } : col;
    });
    
    setColumns(allColumns);
    setDraggedColumnIndex(null);
    setDragOverColumnIndex(null);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumnIndex(null);
    setDragOverColumnIndex(null);
  };

  // Row selection handlers
  const handleRowSelect = (articleId: string, checked: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(articleId);
      } else {
        newSet.delete(articleId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(safeResults.map(r => r.article_id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Bulk edit handlers
  const handleBulkEdit = () => {
    if (!bulkEditField || !onUpdate || !bulkEditValue) return;

    // Get field config to determine how to process the value
    const fieldConfig = getFieldConfig(bulkEditField);
    if (!fieldConfig) return;

    const getArticleFieldName = (colId: string): string => {
      if (vendorMode === 'secondary') {
        switch (colId) {
          case 'status': return 'secondary_active_code';
          case 'vendor': return 'secondary_vendor';
          case 'retail_price': return 'secondary_retail_price';
          case 'wholesale_price': return 'secondary_wholesale_price';
          default: return colId;
        }
      } else {
        switch (colId) {
          case 'status': return 'primary_active_code';
          case 'vendor': return 'primary_vendor';
          case 'retail_price': return 'primary_retail_price';
          case 'wholesale_price': return 'primary_wholesale_price';
          default: return colId;
        }
      }
    };
    const articleFieldName = getArticleFieldName(bulkEditField);

    // Process the value based on field type
    let finalValue: any = bulkEditValue;
    if (fieldConfig.type === 'price') {
      finalValue = parseFloat(bulkEditValue.replace('$', '')) || 0;
    } else if (fieldConfig.type === 'number') {
      finalValue = parseFloat(bulkEditValue) || 0;
    } else {
      finalValue = String(bulkEditValue);
    }

    // Apply to all selected rows - batch all updates together
    if (onBulkUpdate) {
      // Use bulk update if available (more efficient)
      const updates = Array.from(selectedRows).map(articleId => ({
        articleId,
        field: articleFieldName,
        value: finalValue,
      }));
      onBulkUpdate(updates);
    } else if (onUpdate) {
      // Fallback to individual updates (less efficient but works)
      // Collect all updates first, then apply them
      const updates: Array<{ articleId: string; field: string; value: any }> = [];
      selectedRows.forEach(articleId => {
        updates.push({ articleId, field: articleFieldName, value: finalValue });
      });
      
      // Apply all updates in a single batch by updating state once
      // Since we can't batch Redux dispatches easily, we'll use a workaround:
      // Update the results array directly and dispatch once
      if (updates.length > 0) {
        // For now, call onUpdate for each, but the parent should batch them
        // TODO: Implement proper batching in parent component
        updates.forEach(update => {
          handleCellUpdate(update.articleId, update.field, update.value);
        });
      }
    }

    // Clear bulk edit state
    setBulkEditField('');
    setBulkEditValue('');
    setSelectedRows(new Set());
  };

  // Get field type and options for SmartEditableCell
  const getFieldConfig = (columnId: string) => {
    switch (columnId) {
      case 'size':
        return {
          type: 'select',
          options: [
            { value: 'XS', label: 'XS' },
            { value: 'S', label: 'S' },
            { value: 'M', label: 'M' },
            { value: 'L', label: 'L' },
            { value: 'XL', label: 'XL' },
            { value: 'XXL', label: 'XXL' },
            { value: 'One Size', label: 'One Size' },
          ],
        };
      case 'color':
        return {
          type: 'select',
          options: [
            { value: 'Black', label: 'Black' },
            { value: 'White', label: 'White' },
            { value: 'Blue', label: 'Blue' },
            { value: 'Red', label: 'Red' },
            { value: 'Gray', label: 'Gray' },
            { value: 'Navy', label: 'Navy' },
            { value: 'Khaki', label: 'Khaki' },
            { value: 'Beige', label: 'Beige' },
          ],
        };
      case 'status':
        return {
          type: 'select',
          options: [
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
            { value: 'Discontinued', label: 'Discontinued' },
          ],
        };
      case 'season':
        return {
          type: 'select',
          options: [
            { value: 'Spring', label: 'Spring' },
            { value: 'Summer', label: 'Summer' },
            { value: 'Fall', label: 'Fall' },
            { value: 'Winter', label: 'Winter' },
            { value: 'All Season', label: 'All Season' },
          ],
        };
      case 'department':
        return {
          type: 'select',
          options: [
            { value: '01', label: 'Department 01' },
            { value: '02', label: 'Department 02' },
            { value: '03', label: 'Department 03' },
            { value: '04', label: 'Department 04' },
            { value: '05', label: 'Department 05' },
            // TODO: Populate from coll reference table
          ],
        };
      case 'class':
        return {
          type: 'select',
          options: [
            { value: '01', label: 'Class 01' },
            { value: '02', label: 'Class 02' },
            { value: '03', label: 'Class 03' },
            { value: '04', label: 'Class 04' },
            { value: '05', label: 'Class 05' },
            // TODO: Populate from types reference table
          ],
        };
      case 'subclass':
        return {
          type: 'select',
          options: [
            { value: 'Subclass 01', label: 'Subclass 01' },
            { value: 'Subclass 02', label: 'Subclass 02' },
            { value: 'Subclass 03', label: 'Subclass 03' },
            { value: 'Subclass 04', label: 'Subclass 04' },
            { value: 'Subclass 05', label: 'Subclass 05' },
          ],
        };
      case 'color_name':
      case 'color':
        return {
          type: 'select',
          options: [
            { value: 'Black', label: 'Black' },
            { value: 'White', label: 'White' },
            { value: 'Blue', label: 'Blue' },
            { value: 'Red', label: 'Red' },
            { value: 'Gray', label: 'Gray' },
            { value: 'Navy', label: 'Navy' },
            { value: 'Khaki', label: 'Khaki' },
            { value: 'Beige', label: 'Beige' },
            { value: 'Blue-400', label: 'Blue-400' },
            { value: 'Black-1', label: 'Black-1' },
            { value: 'Beige-250', label: 'Beige-250' },
          ],
        };
      case 'vendor':
        return {
          type: 'select',
          options: [
            { value: 'Vendor A', label: 'Vendor A' },
            { value: 'Vendor B', label: 'Vendor B' },
            { value: 'Vendor C', label: 'Vendor C' },
            { value: 'Vendor D', label: 'Vendor D' },
            { value: 'Vendor E', label: 'Vendor E' },
            { value: 'Vendor F', label: 'Vendor F' },
            { value: 'Vendor G', label: 'Vendor G' },
            { value: 'Vendor H', label: 'Vendor H' },
            { value: 'Vendor I', label: 'Vendor I' },
            { value: 'Vendor J', label: 'Vendor J' },
            { value: 'Vendor K', label: 'Vendor K' },
          ],
        };
      case 'active_code':
        return {
          type: 'select',
          options: [
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
            { value: 'Discontinued', label: 'Discontinued' },
            { value: 'Y', label: 'Y' },
            { value: 'N', label: 'N' },
          ],
        };
      case 'stat3':
        return {
          type: 'select',
          options: [
            { value: 'ALL', label: 'ALL' },
            { value: 'Option1', label: 'Option 1' },
            { value: 'Option2', label: 'Option 2' },
            { value: 'Option3', label: 'Option 3' },
          ],
        };
      case 'available_on_web':
        return {
          type: 'select',
          options: [
            { value: 'Y', label: 'Y' },
            { value: 'N', label: 'N' },
          ],
        };
      // Price fields
      case 'first_cost':
      case 'wholesale_price':
      case 'retail_price':
      case 'markdown_price':
      case 'outlet_price':
      case 'outlet_markdown_price':
      case 'employee_price':
        return { type: 'price' };
      // Number fields
      case 'prepack':
      case 'item_weight':
      case 'item_length':
      case 'item_width':
      case 'item_height':
      case 'case_length':
      case 'case_width':
      case 'case_height':
      case 'case_weight':
      case 'case_cube':
      case 'case_quantity':
        return { type: 'number' };
      // Date fields
      case 'markdown_date':
      case 'last_modified_date':
      case 'creation_date':
      case 'last_modified':
        return { type: 'date' };
      default:
        return { type: 'text' };
    }
  };

  // Get editable columns for bulk edit dropdown (must be after getFieldConfig and sortedColumns)
  const editableColumns = sortedColumns.filter(col => isEditable(col.id));

  // Check if a field is a value field (price or number)
  const isValueField = (columnId: string): boolean => {
    const fieldConfig = getFieldConfig(columnId);
    return fieldConfig.type === 'price' || fieldConfig.type === 'number';
  };

  // Get article field name for updates
  const getArticleFieldNameForUpdate = (columnId: string): string => {
    if (vendorMode === 'secondary') {
      switch (columnId) {
        case 'status':
        case 'active_code': return 'secondary_active_code';
        case 'vendor': return 'secondary_vendor';
        case 'retail_price': return 'secondary_retail_price';
        case 'wholesale_price': return 'secondary_wholesale_price';
        case 'first_cost': return 'secondary_first_cost';
        case 'markdown_price': return 'secondary_retail_markdown_price';
        case 'outlet_price': return 'secondary_outlet_price';
        case 'outlet_markdown_price': return 'secondary_outlet_markdown_price';
        case 'prepack': return 'secondary_prepack';
        default: return columnId;
      }
    } else {
      switch (columnId) {
        case 'status':
        case 'active_code': return 'primary_active_code';
        case 'vendor': return 'primary_vendor';
        case 'retail_price': return 'primary_retail_price';
        case 'wholesale_price': return 'primary_wholesale_price';
        case 'first_cost': return 'primary_first_cost';
        case 'markdown_price': return 'primary_retail_markdown_price';
        case 'outlet_price': return 'primary_outlet_price';
        case 'outlet_markdown_price': return 'primary_outlet_markdown_price';
        case 'prepack': return 'primary_prepack';
        default: return columnId;
      }
    }
  };

  // Modify option handlers
  const handleCopyAll = (columnId: string) => {
    const values = safeResults.map(article => getCellValue(article, columnId));
    setCopiedValues({ columnId, values });
  };

  const handleCopySelected = (columnId: string) => {
    const values = Array.from(selectedRows).map(articleId => {
      const article = safeResults.find(r => r.article_id === articleId);
      return article ? getCellValue(article, columnId) : null;
    }).filter(v => v !== null);
    setCopiedValues({ columnId, values });
  };

  const handlePaste = (targetColumnId: string) => {
    if (!copiedValues || copiedValues.values.length === 0) return;
    
    const fieldName = getArticleFieldNameForUpdate(targetColumnId);
    const updates: Array<{ articleId: string; field: string; value: any }> = [];
    
    // If we have selected rows, paste to selected rows only
    // Otherwise, paste to all rows (matching the number of copied values)
    const targetRows = selectedRows.size > 0 
      ? Array.from(selectedRows)
      : results.slice(0, copiedValues.values.length).map(r => r.article_id);
    
    if (targetRows.length !== copiedValues.values.length) {
      alert(`Cannot paste: Number of selected rows (${targetRows.length}) must match number of copied values (${copiedValues.values.length})`);
      return;
    }
    
    targetRows.forEach((articleId, index) => {
      const copiedValue = copiedValues.values[index];
      if (copiedValue !== null && copiedValue !== undefined) {
        let finalValue: any = copiedValue;
        const fieldConfig = getFieldConfig(targetColumnId);
        if (fieldConfig.type === 'price' || fieldConfig.type === 'number') {
          finalValue = typeof copiedValue === 'number' ? copiedValue : parseFloat(String(copiedValue)) || 0;
        }
        updates.push({ articleId, field: fieldName, value: finalValue });
        
        // Track modification
        setModifiedValues(prev => {
          const newMap = new Map(prev);
          if (!newMap.has(articleId)) {
            newMap.set(articleId, new Map());
          }
          newMap.get(articleId)!.set(targetColumnId, finalValue);
          return newMap;
        });
      }
    });

    if (onBulkUpdate && updates.length > 0) {
      onBulkUpdate(updates);
    }
  };

  const handleFillAll = (columnId: string, value: any) => {
    const fieldName = getArticleFieldNameForUpdate(columnId);
    const updates: Array<{ articleId: string; field: string; value: any }> = [];
    
    safeResults.forEach(article => {
      let finalValue: any = value;
      const fieldConfig = getFieldConfig(columnId);
      if (fieldConfig.type === 'price' || fieldConfig.type === 'number') {
        finalValue = parseFloat(value) || 0;
      }
      updates.push({ articleId: article.article_id, field: fieldName, value: finalValue });
      
      // Track modification
      setModifiedValues(prev => {
        const newMap = new Map(prev);
        if (!newMap.has(article.article_id)) {
          newMap.set(article.article_id, new Map());
        }
        newMap.get(article.article_id)!.set(columnId, finalValue);
        return newMap;
      });
    });

    if (onBulkUpdate) {
      onBulkUpdate(updates);
    }
  };

  const handleFillSelected = (columnId: string, value: any) => {
    const fieldName = getArticleFieldNameForUpdate(columnId);
    const updates: Array<{ articleId: string; field: string; value: any }> = [];
    
    let finalValue: any = value;
    const fieldConfig = getFieldConfig(columnId);
    if (fieldConfig.type === 'price' || fieldConfig.type === 'number') {
      finalValue = parseFloat(value) || 0;
    }

    Array.from(selectedRows).forEach(articleId => {
      updates.push({ articleId, field: fieldName, value: finalValue });
      
      // Track modification
      setModifiedValues(prev => {
        const newMap = new Map(prev);
        if (!newMap.has(articleId)) {
          newMap.set(articleId, new Map());
        }
        newMap.get(articleId)!.set(columnId, finalValue);
        return newMap;
      });
    });

    if (onBulkUpdate && updates.length > 0) {
      onBulkUpdate(updates);
    }
  };

  const handleUndoAll = (columnId: string) => {
    const fieldName = getArticleFieldNameForUpdate(columnId);
    const updates: Array<{ articleId: string; field: string; value: any }> = [];
    
    safeResults.forEach(article => {
      const originalValue = originalValues.get(article.article_id)?.get(columnId);
      if (originalValue !== undefined) {
        updates.push({ articleId: article.article_id, field: fieldName, value: originalValue });
        
        // Remove from modified values
        setModifiedValues(prev => {
          const newMap = new Map(prev);
          const articleMods = newMap.get(article.article_id);
          if (articleMods) {
            articleMods.delete(columnId);
            if (articleMods.size === 0) {
              newMap.delete(article.article_id);
            }
          }
          return newMap;
        });
      }
    });

    if (onBulkUpdate && updates.length > 0) {
      onBulkUpdate(updates);
    }
  };

  const handleUndoSelected = (columnId: string) => {
    const fieldName = getArticleFieldNameForUpdate(columnId);
    const updates: Array<{ articleId: string; field: string; value: any }> = [];
    
    Array.from(selectedRows).forEach(articleId => {
      const originalValue = originalValues.get(articleId)?.get(columnId);
      if (originalValue !== undefined) {
        updates.push({ articleId, field: fieldName, value: originalValue });
        
        // Remove from modified values
        setModifiedValues(prev => {
          const newMap = new Map(prev);
          const articleMods = newMap.get(articleId);
          if (articleMods) {
            articleMods.delete(columnId);
            if (articleMods.size === 0) {
              newMap.delete(articleId);
            }
          }
          return newMap;
        });
      }
    });

    if (onBulkUpdate && updates.length > 0) {
      onBulkUpdate(updates);
    }
  };

  const handlePercentOffAll = (columnId: string, percent: number) => {
    const fieldName = getArticleFieldNameForUpdate(columnId);
    const updates: Array<{ articleId: string; field: string; value: any }> = [];
    const multiplier = 1 - (percent / 100);
    
    safeResults.forEach(article => {
      const currentValue = getCellValue(article, columnId);
      if (typeof currentValue === 'number' && currentValue > 0) {
        const newValue = currentValue * multiplier;
        updates.push({ articleId: article.article_id, field: fieldName, value: newValue });
        
        // Track modification
        setModifiedValues(prev => {
          const newMap = new Map(prev);
          if (!newMap.has(article.article_id)) {
            newMap.set(article.article_id, new Map());
          }
          newMap.get(article.article_id)!.set(columnId, newValue);
          return newMap;
        });
      }
    });

    if (onBulkUpdate && updates.length > 0) {
      onBulkUpdate(updates);
    }
  };

  const handlePercentOffSelected = (columnId: string, percent: number) => {
    const fieldName = getArticleFieldNameForUpdate(columnId);
    const updates: Array<{ articleId: string; field: string; value: any }> = [];
    const multiplier = 1 - (percent / 100);
    
    Array.from(selectedRows).forEach(articleId => {
      const article = safeResults.find(r => r.article_id === articleId);
      if (article) {
        const currentValue = getCellValue(article, columnId);
        if (typeof currentValue === 'number' && currentValue > 0) {
          const newValue = currentValue * multiplier;
          updates.push({ articleId, field: fieldName, value: newValue });
          
          // Track modification
          setModifiedValues(prev => {
            const newMap = new Map(prev);
            if (!newMap.has(articleId)) {
              newMap.set(articleId, new Map());
            }
            newMap.get(articleId)!.set(columnId, newValue);
            return newMap;
          });
        }
      }
    });

    if (onBulkUpdate && updates.length > 0) {
      onBulkUpdate(updates);
    }
  };

  const handlePercentIncrAll = (columnId: string, percent: number) => {
    const fieldName = getArticleFieldNameForUpdate(columnId);
    const updates: Array<{ articleId: string; field: string; value: any }> = [];
    const multiplier = 1 + (percent / 100);
    
    safeResults.forEach(article => {
      const currentValue = getCellValue(article, columnId);
      if (typeof currentValue === 'number' && currentValue > 0) {
        const newValue = currentValue * multiplier;
        updates.push({ articleId: article.article_id, field: fieldName, value: newValue });
        
        // Track modification
        setModifiedValues(prev => {
          const newMap = new Map(prev);
          if (!newMap.has(article.article_id)) {
            newMap.set(article.article_id, new Map());
          }
          newMap.get(article.article_id)!.set(columnId, newValue);
          return newMap;
        });
      }
    });

    if (onBulkUpdate && updates.length > 0) {
      onBulkUpdate(updates);
    }
  };

  const handlePercentIncrSelected = (columnId: string, percent: number) => {
    const fieldName = getArticleFieldNameForUpdate(columnId);
    const updates: Array<{ articleId: string; field: string; value: any }> = [];
    const multiplier = 1 + (percent / 100);
    
    Array.from(selectedRows).forEach(articleId => {
      const article = safeResults.find(r => r.article_id === articleId);
      if (article) {
        const currentValue = getCellValue(article, columnId);
        if (typeof currentValue === 'number' && currentValue > 0) {
          const newValue = currentValue * multiplier;
          updates.push({ articleId, field: fieldName, value: newValue });
          
          // Track modification
          setModifiedValues(prev => {
            const newMap = new Map(prev);
            if (!newMap.has(articleId)) {
              newMap.set(articleId, new Map());
            }
            newMap.get(articleId)!.set(columnId, newValue);
            return newMap;
          });
        }
      }
    });

    if (onBulkUpdate && updates.length > 0) {
      onBulkUpdate(updates);
    }
  };

  // Render bulk edit value input
  const renderBulkEditValue = () => {
    if (!bulkEditField) return null;
    
    try {
      const fieldConfig = getFieldConfig(bulkEditField);
      if (!fieldConfig) return null;
      
      return (
        <>
          <div className="flex items-center gap-2">
            <Label htmlFor="bulk-value" className="text-sm text-gray-700">Value:</Label>
            {fieldConfig.type === 'select' ? (
              <Select value={bulkEditValue} onValueChange={setBulkEditValue}>
                <SelectTrigger id="bulk-value" className="w-[180px]">
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent>
                  {fieldConfig.options?.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="bulk-value"
                type={fieldConfig.type === 'price' || fieldConfig.type === 'number' ? 'number' : 'text'}
                value={bulkEditValue}
                onChange={(e) => setBulkEditValue(e.target.value)}
                placeholder="Enter value"
                className="w-[180px]"
              />
            )}
          </div>
          <Button
            onClick={handleBulkEdit}
            className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
            disabled={!bulkEditValue}
          >
            Apply to {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedRows(new Set());
              setBulkEditField('');
              setBulkEditValue('');
            }}
          >
            Cancel
          </Button>
        </>
      );
    } catch (error) {
      console.error('Error rendering bulk edit value input:', error);
      return null;
    }
  };

  // Always render something if we have search criteria or results
  console.log('ResultsGrid rendering:', { 
    hasSearchCriteria, 
    loading, 
    resultsLength: safeResults.length,
    shouldRender: hasSearchCriteria || loading || safeResults.length > 0
  });

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Results</h3>
        <ColumnCustomizer columns={columns} onColumnsChange={setColumns} />
      </div>

      {/* Bulk Edit Toolbar */}
      {selectedRows.size > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm font-medium text-gray-700">
              {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="bulk-field" className="text-sm text-gray-700">Field:</Label>
              <Select value={bulkEditField} onValueChange={setBulkEditField}>
                <SelectTrigger id="bulk-field" className="w-[180px]">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {editableColumns.map(col => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {renderBulkEditValue()}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={selectAllCheckboxRef}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1976D2] focus:ring-[#1976D2] focus:ring-2"
                />
              </th>
              {sortedColumns.map((column, index) => (
                <th
                  key={column.id}
                  draggable
                  onDragStart={() => handleColumnDragStart(index)}
                  onDragOver={(e) => handleColumnDragOver(e, index)}
                  onDrop={(e) => handleColumnDrop(e, index)}
                  onDragEnd={handleColumnDragEnd}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-move select-none ${
                    dragOverColumnIndex === index ? 'bg-blue-100' : ''
                  } ${draggedColumnIndex === index ? 'opacity-50' : ''} ${
                    vendorMode === 'secondary' && isEditable(column.id) ? 'bg-amber-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 group relative">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span>{column.label}</span>
                    {vendorMode === 'secondary' && (
                      <>
                        {isEditable(column.id) ? (
                          <Edit2 className="h-3 w-3 text-amber-600" title="Editable in secondary vendor mode" />
                        ) : (
                          <Lock className="h-3 w-3 text-gray-400" title="Read-only in secondary vendor mode" />
                        )}
                      </>
                    )}
                    <div className="ml-auto">
                      <ModifyOptionsMenu
                        columnId={column.id}
                        columnLabel={column.label}
                        isValueField={isValueField(column.id)}
                        onCopyAll={handleCopyAll}
                        onCopySelected={handleCopySelected}
                        onPaste={handlePaste}
                        onFillAll={handleFillAll}
                        onFillSelected={handleFillSelected}
                        onUndoAll={handleUndoAll}
                        onUndoSelected={handleUndoSelected}
                        onPercentOffAll={handlePercentOffAll}
                        onPercentOffSelected={handlePercentOffSelected}
                        onPercentIncrAll={handlePercentIncrAll}
                        onPercentIncrSelected={handlePercentIncrSelected}
                        hasSelectedRows={selectedRows.size > 0}
                        hasCopiedValues={copiedValues !== null}
                      />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeResults.map((article) => (
              <tr 
                key={article.article_id} 
                className={`hover:bg-gray-50 transition-colors ${
                  selectedRows.has(article.article_id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <Checkbox
                    checked={selectedRows.has(article.article_id)}
                    onChange={(e) => handleRowSelect(article.article_id, e.target.checked)}
                  />
                </td>
                {sortedColumns.map((column) => {
                  const value = getCellValue(article, column.id);
                  const editable = isEditable(column.id);

                  // Status is now editable, so we don't need special rendering

                  if (editable && onUpdate) {
                    const fieldConfig = getFieldConfig(column.id);
                    // Map column IDs to actual article field names
                    const getArticleFieldName = (colId: string): string => {
                      if (vendorMode === 'secondary') {
                        switch (colId) {
                          case 'status': return 'secondary_active_code';
                          case 'vendor': return 'secondary_vendor';
                          case 'retail_price': return 'secondary_retail_price';
                          case 'wholesale_price': return 'secondary_wholesale_price';
                          default: return colId;
                        }
                      } else {
                        switch (colId) {
                          case 'status': return 'primary_active_code';
                          case 'vendor': return 'primary_vendor';
                          case 'retail_price': return 'primary_retail_price';
                          case 'wholesale_price': return 'primary_wholesale_price';
                          default: return colId;
                        }
                      }
                    };
                    const articleFieldName = getArticleFieldName(column.id);
                    let rawValue: any;
                    if (vendorMode === 'secondary') {
                      switch (column.id) {
                        case 'status': rawValue = (article as any).secondary_active_code || value; break;
                        case 'retail_price': rawValue = (article as any).secondary_retail_price || value; break;
                        case 'wholesale_price': rawValue = (article as any).secondary_wholesale_price || value; break;
                        default: rawValue = value;
                      }
                    } else {
                      switch (column.id) {
                        case 'status': rawValue = (article as any).primary_active_code || article.active_code || value; break;
                        case 'retail_price': rawValue = (article as any).primary_retail_price || article.retail_price || value; break;
                        case 'wholesale_price': rawValue = (article as any).primary_wholesale_price || article.wholesale_price || value; break;
                        default: rawValue = value;
                      }
                    }
                    
                  return (
                    <td 
                      key={column.id} 
                      className={`px-4 py-3 whitespace-nowrap text-sm ${
                        vendorMode === 'secondary' && isEditable(column.id) 
                          ? 'bg-amber-50/50 border-l-4 border-amber-500' 
                          : ''
                      }`}
                      title={vendorMode === 'secondary' && isEditable(column.id) ? 'Editable in secondary vendor mode' : ''}
                    >
                        <SmartEditableCell
                          value={rawValue}
                          onSave={(newValue) => {
                            let finalValue: any = newValue;
                            if (fieldConfig.type === 'price') {
                              finalValue = typeof newValue === 'string' 
                                ? parseFloat(newValue.replace('$', '')) || 0 
                                : newValue;
                            } else if (fieldConfig.type === 'date') {
                              finalValue = newValue instanceof Date 
                                ? newValue.toISOString() 
                                : newValue;
                            } else {
                              finalValue = String(newValue);
                            }
                            // Use the correct article field name for saving
                            handleCellUpdate(article.article_id, articleFieldName, finalValue);
                          }}
                          fieldType={fieldConfig.type}
                          options={fieldConfig.options}
                          className={vendorMode === 'secondary' && isEditable(column.id) ? 'ring-1 ring-amber-400 rounded' : ''}
                          isEditable={true}
                        />
                      </td>
                    );
                  }

                  const displayValue = column.id.includes('price') && typeof value === 'number'
                    ? formatPrice(value)
                    : value;

                  return (
                    <td 
                      key={column.id} 
                      className={`px-4 py-3 whitespace-nowrap text-sm ${
                        vendorMode === 'secondary' 
                          ? 'text-gray-500 bg-gray-50/50' 
                          : 'text-gray-600'
                      }`}
                    >
                      <span>{displayValue}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
