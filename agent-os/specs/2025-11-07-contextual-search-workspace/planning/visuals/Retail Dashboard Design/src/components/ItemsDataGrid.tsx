import { useState } from 'react';
import { ItemRecord } from '../App';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { X, Edit, Trash2, Download, ArrowUpDown, PackageOpen, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';

interface ItemsDataGridProps {
  activeFilters: { key: string; label: string }[];
  onRemoveFilter: (key: string) => void;
  onItemClick: (item: ItemRecord) => void;
  searchQuery: string;
}

// Mock data
const mockItems: ItemRecord[] = [
  {
    id: '1',
    sku: 'FW-NK-001',
    upc: '123456789012',
    description: 'Nike Air Max 270 - Black/White',
    department: 'Footwear',
    class: 'Athletic',
    vendor: 'Nike',
    wholesalePrice: 75.00,
    retailPrice: 149.99,
    status: 'Active',
    lastModified: '2025-11-02',
    size: 'US 10',
    color: 'Black/White',
    season: 'Fall 2025'
  },
  {
    id: '2',
    sku: 'FW-AD-045',
    upc: '234567890123',
    description: 'Adidas Ultraboost 22 - Navy',
    department: 'Footwear',
    class: 'Athletic',
    vendor: 'Adidas',
    wholesalePrice: 82.50,
    retailPrice: 179.99,
    status: 'Active',
    lastModified: '2025-10-28',
    size: 'US 9.5',
    color: 'Navy',
    season: 'Fall 2025'
  },
  {
    id: '3',
    sku: 'FW-PM-122',
    upc: '345678901234',
    description: 'Puma RS-X - White/Red',
    department: 'Footwear',
    class: 'Casual',
    vendor: 'Puma',
    wholesalePrice: 55.00,
    retailPrice: 109.99,
    status: 'Active',
    lastModified: '2025-10-25',
    size: 'US 11',
    color: 'White/Red',
    season: 'Spring 2025'
  },
  {
    id: '4',
    sku: 'FW-NK-087',
    upc: '456789012345',
    description: 'Nike Pegasus 39 - Grey/Orange',
    department: 'Footwear',
    class: 'Athletic',
    vendor: 'Nike',
    wholesalePrice: 65.00,
    retailPrice: 129.99,
    status: 'Active',
    lastModified: '2025-10-20',
    size: 'US 10.5',
    color: 'Grey/Orange',
    season: 'Summer 2025'
  },
  {
    id: '5',
    sku: 'FW-RB-203',
    upc: '567890123456',
    description: 'Reebok Classic Leather - White',
    department: 'Footwear',
    class: 'Casual',
    vendor: 'Reebok',
    wholesalePrice: 45.00,
    retailPrice: 89.99,
    status: 'Active',
    lastModified: '2025-10-15',
    size: 'US 9',
    color: 'White',
    season: 'Spring 2025'
  },
  {
    id: '6',
    sku: 'FW-AD-156',
    upc: '678901234567',
    description: 'Adidas Stan Smith - Green/White',
    department: 'Footwear',
    class: 'Casual',
    vendor: 'Adidas',
    wholesalePrice: 42.00,
    retailPrice: 84.99,
    status: 'Active',
    lastModified: '2025-10-10',
    size: 'US 8.5',
    color: 'Green/White',
    season: 'Spring 2025'
  },
  {
    id: '7',
    sku: 'FW-NK-199',
    upc: '789012345678',
    description: 'Nike React Infinity - Blue',
    department: 'Footwear',
    class: 'Athletic',
    vendor: 'Nike',
    wholesalePrice: 78.00,
    retailPrice: 159.99,
    status: 'Inactive',
    lastModified: '2025-09-30',
    size: 'US 11.5',
    color: 'Blue',
    season: 'Fall 2025'
  },
  {
    id: '8',
    sku: 'FW-PM-078',
    upc: '890123456789',
    description: 'Puma Suede Classic - Black',
    department: 'Footwear',
    class: 'Casual',
    vendor: 'Puma',
    wholesalePrice: 38.00,
    retailPrice: 74.99,
    status: 'Active',
    lastModified: '2025-09-25',
    size: 'US 10',
    color: 'Black',
    season: 'Fall 2025'
  },
];

export function ItemsDataGrid({ activeFilters, onRemoveFilter, onItemClick, searchQuery }: ItemsDataGridProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(mockItems.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    // In a real app, this would update the backend
    console.log(`Update item ${id} status to ${newStatus}`);
  };

  // Check if there are any search criteria applied
  const hasSearchCriteria = searchQuery.trim().length > 0 || activeFilters.length > 0;

  // Show empty search state if no criteria applied
  if (!hasSearchCriteria) {
    return (
      <div className="space-y-4">
        <Card className="p-16 text-center rounded-lg shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
              <Search className="h-10 w-10 text-[#1976D2]" />
            </div>
            <h3 className="text-gray-900 mb-3">Start Your Search</h3>
            <p className="text-gray-600 mb-8">
              Enter search criteria in the search bar above or use the filters to find items in the catalog.
            </p>
            <div className="space-y-3 text-left bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-700">You can search by:</p>
              <ul className="text-sm text-gray-600 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#1976D2] mt-1">•</span>
                  <span>SKU or UPC codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1976D2] mt-1">•</span>
                  <span>Product descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1976D2] mt-1">•</span>
                  <span>Department, class, or vendor filters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1976D2] mt-1">•</span>
                  <span>Price ranges and date filters</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="pl-3 pr-2 py-1.5 bg-blue-50 text-[#1976D2] border border-blue-200 rounded-full"
            >
              {filter.label}
              <button
                onClick={() => onRemoveFilter(filter.key)}
                className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {selectedRows.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-900">
              {selectedRows.length} item{selectedRows.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Data Table */}
      <Card className="rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === mockItems.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('sku')}>
                  <div className="flex items-center gap-1">
                    SKU/UPC
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
                  <div className="flex items-center gap-1">
                    Description
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('department')}>
                  <div className="flex items-center gap-1">
                    Department
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('class')}>
                  <div className="flex items-center gap-1">
                    Class
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('vendor')}>
                  <div className="flex items-center gap-1">
                    Vendor
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('wholesalePrice')}>
                  <div className="flex items-center justify-end gap-1">
                    Wholesale
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('retailPrice')}>
                  <div className="flex items-center justify-end gap-1">
                    Retail
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('lastModified')}>
                  <div className="flex items-center gap-1">
                    Last Modified
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onItemClick(item)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedRows.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-900">{item.sku}</div>
                    <div className="text-gray-500 text-sm">{item.upc}</div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-gray-900 truncate">{item.description}</div>
                  </TableCell>
                  <TableCell className="text-gray-700">{item.department}</TableCell>
                  <TableCell className="text-gray-700">{item.class}</TableCell>
                  <TableCell className="text-gray-700">{item.vendor}</TableCell>
                  <TableCell className="text-right text-gray-900">
                    ${item.wholesalePrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-gray-900">
                    ${item.retailPrice.toFixed(2)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={item.status.toLowerCase()}
                      onValueChange={(value) => handleStatusChange(item.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 rounded-lg border-0 bg-transparent">
                        <SelectValue>
                          <Badge
                            className={`rounded-full ${
                              item.status === 'Active'
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-gray-700">{item.lastModified}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing 1 to {Math.min(itemsPerPage, mockItems.length)} of {mockItems.length} results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="rounded-lg"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg bg-[#1976D2] text-white hover:bg-[#1565C0] hover:text-white"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              2
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              3
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="rounded-lg"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Empty State (shown when no results) */}
      {mockItems.length === 0 && (
        <Card className="p-12 text-center rounded-lg shadow-sm">
          <PackageOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or search criteria
          </p>
          <Button className="rounded-lg bg-[#1976D2] hover:bg-[#1565C0]">
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
