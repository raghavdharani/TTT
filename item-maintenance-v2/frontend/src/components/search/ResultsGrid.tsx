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
  onPendingChangesChange?: (hasChanges: boolean) => void; // Callback to notify parent about pending changes
}

// Column configuration version - increment this to force reset of saved column configs
const COLUMN_CONFIG_VERSION = '2.0';

const defaultColumns: ColumnConfig[] = [
  // Table 1 columns (from first image - exact order and labels)
  { id: 'upc', label: 'UPC', visible: true, order: 0 },
  { id: 'first_digits', label: 'First Digits', visible: true, order: 1 },
  { id: 'vendor', label: 'Vendor', visible: true, order: 2 },
  { id: 'style', label: 'Style', visible: true, order: 3 },
  { id: 'color_name', label: 'Color Name', visible: true, order: 4 },
  { id: 'vendor_color', label: 'Vendor Color', visible: true, order: 5 },
  { id: 'size', label: 'Size', visible: true, order: 6 },
  { id: 'description', label: 'Description', visible: true, order: 7 },
  { id: 'pos_description', label: 'POS Description', visible: true, order: 8 },
  { id: 'first_cost', label: 'First Cost', visible: true, order: 9 },
  { id: 'wholesale_price', label: 'Wholesale Cost', visible: true, order: 10 },
  // Table 2 columns (from second image - exact order and labels)
  { id: 'retail_price', label: 'Retail Price', visible: true, order: 11 },
  { id: 'markdown_price', label: 'Markdown Price', visible: true, order: 12 },
  { id: 'markdown_date', label: 'Markdown Date', visible: true, order: 13 },
  { id: 'outlet_price', label: 'Outlet Price', visible: true, order: 14 },
  { id: 'outlet_markdown_price', label: 'Outlet Markdown', visible: true, order: 15 },
  { id: 'outlet_markdown_date', label: 'Outlet Markdown Date', visible: true, order: 16 },
  { id: 'department', label: 'Department', visible: true, order: 17 },
  { id: 'class', label: 'Class', visible: true, order: 18 },
  { id: 'subclass', label: 'Sub-Class', visible: true, order: 19 },
  { id: 'sub_dept', label: 'Sub Dept', visible: true, order: 20 },
  { id: 'attribute1', label: 'Attribute 1', visible: true, order: 21 },
  { id: 'attribute2', label: 'Attribute 2', visible: true, order: 22 },
  // Table 3 columns (from third image - exact order and labels)
  { id: 'attribute3', label: 'Attribute 3', visible: true, order: 23 },
  { id: 'season', label: 'Season', visible: true, order: 24 },
  { id: 'prepack', label: 'Prepack', visible: true, order: 25 },
  { id: 'last_modified_date', label: 'Last Modified', visible: true, order: 26 },
  { id: 'alt_style_sku_upc', label: 'Alt Style/SKU', visible: true, order: 27 },
  { id: 'active_code', label: 'Active Code', visible: true, order: 28 },
  { id: 'status', label: 'Status', visible: true, order: 29 },
  { id: 'available_on_web', label: 'Available On Web', visible: true, order: 30 },
  { id: 'stat3', label: 'Stat 3', visible: true, order: 31 },
  { id: 'item_picture', label: 'Item Picture', visible: true, order: 32 },
  { id: 'employee_price', label: 'Employee Price', visible: true, order: 33 },
  { id: 'web_back_order_eligible', label: 'Web Back Order Eligible', visible: true, order: 34 },
];

export function ResultsGrid({ results, loading, hasSearchCriteria = false, onUpdate, onBulkUpdate, vendorMode = 'primary', onPendingChangesChange }: ResultsGridProps) {
  // Add error boundary state
  const [error, setError] = useState<Error | null>(null);
  
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    try {
      // Check version first - if version changed, reset to defaults
      const savedVersion = localStorage.getItem('columnConfigVersion');
      if (savedVersion !== COLUMN_CONFIG_VERSION) {
        console.log('Column config version changed, resetting to defaults');
        localStorage.removeItem('columnConfig');
        localStorage.setItem('columnConfigVersion', COLUMN_CONFIG_VERSION);
        return defaultColumns;
      }
      
      const saved = localStorage.getItem('columnConfig');
      const savedConfig = saved ? JSON.parse(saved) : null;
      
      // Check if saved config matches the new default structure
      // If the number of columns changed or structure is different, reset to defaults
      if (savedConfig && Array.isArray(savedConfig)) {
        // Check if saved config has all the new columns
        const savedIds = new Set(savedConfig.map((c: ColumnConfig) => c.id));
        const defaultIds = new Set(defaultColumns.map(c => c.id));
        
        // If columns don't match, reset to defaults
        if (savedIds.size !== defaultIds.size || 
            !Array.from(defaultIds).every(id => savedIds.has(id))) {
          console.log('Column structure changed, resetting to defaults');
          localStorage.removeItem('columnConfig');
          localStorage.setItem('columnConfigVersion', COLUMN_CONFIG_VERSION);
          return defaultColumns;
        }
        
        // For now, always use the default order to ensure correct display
        // User can reorder columns if needed, but we start with the correct order from images
        return defaultColumns;
      }
      
      // No saved config, use defaults
      localStorage.setItem('columnConfigVersion', COLUMN_CONFIG_VERSION);
      return defaultColumns;
    } catch (e) {
      console.error('Error loading column config:', e);
      localStorage.setItem('columnConfigVersion', COLUMN_CONFIG_VERSION);
      return defaultColumns;
    }
  });

  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
  const [dragOverColumnIndex, setDragOverColumnIndex] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  // Modify options state
  const [copiedValues, setCopiedValues] = useState<{ columnId: string; values: any[] } | null>(null);
  const [originalValues, setOriginalValues] = useState<Map<string, Map<string, any>>>(new Map()); // articleId -> field -> original value
  const [modifiedValues, setModifiedValues] = useState<Map<string, Map<string, any>>>(new Map()); // articleId -> field -> modified value
  
  // Pending changes state - tracks changes that haven't been confirmed yet
  const [pendingChanges, setPendingChanges] = useState<Map<string, Map<string, any>>>(new Map()); // articleId -> field -> new value
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

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
      // Results actually changed, clear selection and pending changes
      setSelectedRows(new Set());
      // Clear copied values, modified values, and pending changes
      setCopiedValues(null);
      setModifiedValues(new Map());
      setPendingChanges(new Map());
      setHasPendingChanges(false);
      if (onPendingChangesChange) {
        onPendingChangesChange(false);
      }
    }
    prevResultsIdsRef.current = currentIds;
  }, [results, onPendingChangesChange]);
  
  // Update hasPendingChanges whenever pendingChanges changes
  useEffect(() => {
    const hasChanges = pendingChanges.size > 0;
    setHasPendingChanges(hasChanges);
    if (onPendingChangesChange) {
      onPendingChangesChange(hasChanges);
    }
  }, [pendingChanges, onPendingChangesChange]);

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

  // Get article field name for updates (must be defined before handleConfirmChanges)
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

  // Track pending change instead of immediately committing
  const handleCellUpdate = (articleId: string, field: string, value: any, columnId: string) => {
    // Get the original value for this field
    const originalValue = originalValues.get(articleId)?.get(columnId);
    
    // Check if the value actually changed
    const hasChanged = originalValue !== value && 
      JSON.stringify(originalValue) !== JSON.stringify(value);
    
    if (hasChanged) {
      // Store as pending change
      setPendingChanges(prev => {
        const newMap = new Map(prev);
        if (!newMap.has(articleId)) {
          newMap.set(articleId, new Map());
        }
        newMap.get(articleId)!.set(columnId, value);
        return newMap;
      });
    } else {
      // Value reverted to original, remove from pending changes
      setPendingChanges(prev => {
        const newMap = new Map(prev);
        const articleChanges = newMap.get(articleId);
        if (articleChanges) {
          articleChanges.delete(columnId);
          if (articleChanges.size === 0) {
            newMap.delete(articleId);
          }
        }
        return newMap;
      });
    }
  };
  
  // Confirm and commit all pending changes
  const handleConfirmChanges = () => {
    if (!onUpdate && !onBulkUpdate) return;
    
    const updates: Array<{ articleId: string; field: string; value: any }> = [];
    
    pendingChanges.forEach((articleChanges, articleId) => {
      articleChanges.forEach((value, columnId) => {
        const fieldName = getArticleFieldNameForUpdate(columnId);
        updates.push({ articleId, field: fieldName, value });
      });
    });
    
    if (updates.length > 0) {
      if (onBulkUpdate) {
        onBulkUpdate(updates);
      } else if (onUpdate) {
        updates.forEach(update => {
          onUpdate(update.articleId, update.field, update.value);
        });
      }
      
      // Update original values to reflect confirmed changes
      setOriginalValues(prev => {
        const newMap = new Map(prev);
        pendingChanges.forEach((articleChanges, articleId) => {
          if (!newMap.has(articleId)) {
            newMap.set(articleId, new Map());
          }
          articleChanges.forEach((value, columnId) => {
            newMap.get(articleId)!.set(columnId, value);
          });
        });
        return newMap;
      });
      
      // Clear pending changes
      setPendingChanges(new Map());
      setHasPendingChanges(false);
      if (onPendingChangesChange) {
        onPendingChangesChange(false);
      }
    }
  };
  
  // Discard all pending changes
  const handleDiscardChanges = () => {
    setPendingChanges(new Map());
    setHasPendingChanges(false);
    if (onPendingChangesChange) {
      onPendingChangesChange(false);
    }
  };
  
  // Check if a cell has pending changes
  const hasPendingChange = (articleId: string, columnId: string): boolean => {
    return pendingChanges.get(articleId)?.has(columnId) || false;
  };
  
  // Get the display value for a cell (pending change or current value)
  const getDisplayValue = (article: Article, columnId: string): any => {
    const articleId = article.article_id;
    const pendingValue = pendingChanges.get(articleId)?.get(columnId);
    if (pendingValue !== undefined) {
      return pendingValue;
    }
    return getCellValue(article, columnId);
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
      case 'web_back_order_eligible': return item.web_back_order_eligible || item.webBackOrderEligible || '-';
      case 'outlet_markdown_date': return item.outlet_markdown_date ? formatDate(item.outlet_markdown_date) : '-';
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
            { value: 'Accessories-02', label: 'Accessories-02' },
            { value: 'Apparel-01', label: 'Apparel-01' },
            { value: 'Beauty & Cosmetics-07', label: 'Beauty & Cosmetics-07' },
            { value: 'Footwear-03', label: 'Footwear-03' },
            { value: 'Home & Living-04', label: 'Home & Living-04' },
            { value: 'Jewelry-05', label: 'Jewelry-05' },
            { value: 'Luggage-06', label: 'Luggage-06' },
          ],
        };
      case 'class':
        return {
          type: 'select',
          options: [
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
          ],
        };
      case 'subclass':
        return {
          type: 'select',
          options: [
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
      case 'web_back_order_eligible':
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
      case 'outlet_markdown_date':
      case 'last_modified_date':
      case 'creation_date':
      case 'last_modified':
        return { type: 'date' };
      default:
        return { type: 'text' };
    }
  };

  // Check if a field is a value field (price or number)
  const isValueField = (columnId: string): boolean => {
    const fieldConfig = getFieldConfig(columnId);
    return fieldConfig.type === 'price' || fieldConfig.type === 'number';
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
    
    // If we have selected rows, paste to selected rows only
    // Otherwise, paste to all rows (matching the number of copied values)
    const targetRows = selectedRows.size > 0 
      ? Array.from(selectedRows)
      : safeResults.slice(0, copiedValues.values.length).map(r => r.article_id);
    
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
        
        // Store as pending change
        handleCellUpdate(articleId, '', finalValue, targetColumnId);
      }
    });
  };

  const handleFillAll = (columnId: string, value: any) => {
    let finalValue: any = value;
    const fieldConfig = getFieldConfig(columnId);
    if (fieldConfig.type === 'price' || fieldConfig.type === 'number') {
      finalValue = parseFloat(value) || 0;
    }
    
    safeResults.forEach(article => {
      handleCellUpdate(article.article_id, '', finalValue, columnId);
    });
  };

  const handleFillSelected = (columnId: string, value: any) => {
    let finalValue: any = value;
    const fieldConfig = getFieldConfig(columnId);
    if (fieldConfig.type === 'price' || fieldConfig.type === 'number') {
      finalValue = parseFloat(value) || 0;
    }

    Array.from(selectedRows).forEach(articleId => {
      handleCellUpdate(articleId, '', finalValue, columnId);
    });
  };

  const handleUndoAll = (columnId: string) => {
    safeResults.forEach(article => {
      const originalValue = originalValues.get(article.article_id)?.get(columnId);
      if (originalValue !== undefined) {
        // Revert to original value (this will remove from pending changes if it matches)
        handleCellUpdate(article.article_id, '', originalValue, columnId);
      }
    });
  };

  const handleUndoSelected = (columnId: string) => {
    Array.from(selectedRows).forEach(articleId => {
      const originalValue = originalValues.get(articleId)?.get(columnId);
      if (originalValue !== undefined) {
        // Revert to original value (this will remove from pending changes if it matches)
        handleCellUpdate(articleId, '', originalValue, columnId);
      }
    });
  };

  const handlePercentOffAll = (columnId: string, percent: number) => {
    const multiplier = 1 - (percent / 100);
    
    safeResults.forEach(article => {
      // Use display value (which includes pending changes)
      const currentValue = getDisplayValue(article, columnId);
      if (typeof currentValue === 'number' && currentValue > 0) {
        const newValue = currentValue * multiplier;
        handleCellUpdate(article.article_id, '', newValue, columnId);
      }
    });
  };

  const handlePercentOffSelected = (columnId: string, percent: number) => {
    const multiplier = 1 - (percent / 100);
    
    Array.from(selectedRows).forEach(articleId => {
      const article = safeResults.find(r => r.article_id === articleId);
      if (article) {
        // Use display value (which includes pending changes)
        const currentValue = getDisplayValue(article, columnId);
        if (typeof currentValue === 'number' && currentValue > 0) {
          const newValue = currentValue * multiplier;
          handleCellUpdate(articleId, '', newValue, columnId);
        }
      }
    });
  };

  const handlePercentIncrAll = (columnId: string, percent: number) => {
    const multiplier = 1 + (percent / 100);
    
    safeResults.forEach(article => {
      // Use display value (which includes pending changes)
      const currentValue = getDisplayValue(article, columnId);
      if (typeof currentValue === 'number' && currentValue > 0) {
        const newValue = currentValue * multiplier;
        handleCellUpdate(article.article_id, '', newValue, columnId);
      }
    });
  };

  const handlePercentIncrSelected = (columnId: string, percent: number) => {
    const multiplier = 1 + (percent / 100);
    
    Array.from(selectedRows).forEach(articleId => {
      const article = safeResults.find(r => r.article_id === articleId);
      if (article) {
        // Use display value (which includes pending changes)
        const currentValue = getDisplayValue(article, columnId);
        if (typeof currentValue === 'number' && currentValue > 0) {
          const newValue = currentValue * multiplier;
          handleCellUpdate(articleId, '', newValue, columnId);
        }
      }
    });
  };


  // Always render something if we have search criteria or results
  console.log('ResultsGrid rendering:', { 
    hasSearchCriteria, 
    loading, 
    resultsLength: safeResults.length,
    shouldRender: hasSearchCriteria || loading || safeResults.length > 0
  });

  // Count total pending changes
  const pendingChangesCount = Array.from(pendingChanges.values()).reduce(
    (sum, articleChanges) => sum + articleChanges.size,
    0
  );

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Results</h3>
          <div className="flex items-center gap-4">
            {hasPendingChanges && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-md">
                <span className="text-sm font-medium text-yellow-800">
                  {pendingChangesCount} pending change{pendingChangesCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <ColumnCustomizer columns={columns} onColumnsChange={setColumns} />
          </div>
        </div>
        {/* Secondary Vendor Mode Banner - Inline with Results */}
        {vendorMode === 'secondary' && (
          <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-amber-900">Secondary Vendor Editing Mode: </span>
                <span className="text-sm text-amber-800">
                  Only <strong>price fields (Retail Price, Wholesale Price)</strong> and <strong>Status</strong> are editable. All other fields are read-only.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pending Changes Action Bar */}
      {hasPendingChanges && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-yellow-800 font-medium">
              You have {pendingChangesCount} unsaved change{pendingChangesCount !== 1 ? 's' : ''}. Review and confirm to save.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleDiscardChanges}
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleConfirmChanges}
              className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
            >
              Confirm & Save Changes
            </Button>
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
                  const editable = isEditable(column.id);
                  const cellHasPendingChange = hasPendingChange(article.article_id, column.id);
                  const displayValue = getDisplayValue(article, column.id);

                  if (editable) {
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
                    let rawValue: any = displayValue;
                    
                    return (
                      <td 
                        key={column.id} 
                        className={`px-4 py-3 whitespace-nowrap text-sm ${
                          cellHasPendingChange 
                            ? 'bg-yellow-100 border-l-4 border-yellow-500' 
                            : vendorMode === 'secondary' && isEditable(column.id) 
                              ? 'bg-amber-50/50 border-l-4 border-amber-500' 
                              : ''
                        }`}
                        title={
                          cellHasPendingChange 
                            ? 'This value has been changed (pending confirmation)' 
                            : vendorMode === 'secondary' && isEditable(column.id) 
                              ? 'Editable in secondary vendor mode' 
                              : ''
                        }
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
                            // Track as pending change instead of immediately committing
                            handleCellUpdate(article.article_id, articleFieldName, finalValue, column.id);
                          }}
                          fieldType={fieldConfig.type}
                          options={fieldConfig.options}
                          className={
                            cellHasPendingChange 
                              ? 'ring-2 ring-yellow-400 rounded font-medium' 
                              : vendorMode === 'secondary' && isEditable(column.id) 
                                ? 'ring-1 ring-amber-400 rounded' 
                                : ''
                          }
                          isEditable={true}
                        />
                      </td>
                    );
                  }

                  // Read-only cell
                  const formattedValue = column.id.includes('price') && typeof displayValue === 'number'
                    ? formatPrice(displayValue)
                    : displayValue;

                  return (
                    <td 
                      key={column.id} 
                      className={`px-4 py-3 whitespace-nowrap text-sm ${
                        cellHasPendingChange 
                          ? 'bg-yellow-100 border-l-4 border-yellow-500' 
                          : vendorMode === 'secondary' 
                            ? 'text-gray-500 bg-gray-50/50' 
                            : 'text-gray-600'
                      }`}
                      title={cellHasPendingChange ? 'This value has been changed (pending confirmation)' : ''}
                    >
                      <span className={cellHasPendingChange ? 'font-medium' : ''}>{formattedValue}</span>
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
