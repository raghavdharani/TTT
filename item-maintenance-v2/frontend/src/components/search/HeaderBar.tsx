/**
 * HeaderBar Component
 * Contains global search bar and action buttons
 * Based on the provided design image
 */

import React from 'react';
import { Search, Filter, Download, Users, Printer } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { SavedSessions } from './SavedSessions';

interface HeaderBarProps {
  onFilterToggle: () => void;
  filterPanelOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch?: () => void;
  onLoadSession?: (session: any) => void;
  currentSearchQuery?: string;
  currentFilters?: any;
  currentSortConfig?: any;
  currentVendorMode?: 'primary' | 'secondary';
  onDownload?: () => void;
  onPrint?: () => void;
  hasResults?: boolean;
  vendorMode?: 'primary' | 'secondary';
  onVendorModeChange?: (mode: 'primary' | 'secondary') => void;
}

export function HeaderBar({
  onFilterToggle,
  filterPanelOpen,
  searchQuery,
  onSearchChange,
  onSearch,
  onLoadSession,
  currentSearchQuery,
  currentFilters,
  currentSortConfig,
  currentVendorMode,
  onDownload,
  onPrint,
  hasResults = false,
  vendorMode = 'primary',
  onVendorModeChange,
}: HeaderBarProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-gray-600 hover:text-[#1976D2]">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/merchandising" className="text-gray-600 hover:text-[#1976D2]">
                Merchandising
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">Item Maintenance</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Item Maintenance</h1>
          
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by SKU, UPC, or description..."
              className="pl-10 rounded-lg border-gray-300 focus:border-[#1976D2] focus:ring-[#1976D2]"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onSearch) {
                  onSearch();
                }
              }}
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Vendor Mode Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-white">
              <Users className="h-4 w-4 text-gray-600" />
              <Select
                value={vendorMode || 'primary'}
                onValueChange={(val) => onVendorModeChange?.(val as 'primary' | 'secondary')}
              >
                <SelectTrigger className="h-8 w-[140px] border-0 focus:ring-0 p-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Vendor</SelectItem>
                  <SelectItem value="secondary">Secondary Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onFilterToggle}
              className={`rounded-lg ${filterPanelOpen ? 'bg-blue-50 border-[#1976D2] text-[#1976D2]' : ''}`}
              aria-label="Toggle filter panel"
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg"
              aria-label="Download"
              onClick={onDownload}
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg"
              aria-label="Print"
              onClick={onPrint}
              disabled={!hasResults}
              title={hasResults ? 'Print results' : 'No results to print'}
            >
              <Printer className={`h-5 w-5 ${!hasResults ? 'text-gray-400' : ''}`} />
            </Button>
            <SavedSessions
              onLoadSession={onLoadSession || (() => {})}
              currentSearchQuery={currentSearchQuery}
              currentFilters={currentFilters}
              currentSortConfig={currentSortConfig}
              currentVendorMode={currentVendorMode}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

