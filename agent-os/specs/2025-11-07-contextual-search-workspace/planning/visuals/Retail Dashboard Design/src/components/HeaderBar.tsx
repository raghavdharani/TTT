import { Search, Filter, Download, Settings } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

interface HeaderBarProps {
  onFilterToggle: () => void;
  filterPanelOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HeaderBar({ onFilterToggle, filterPanelOpen, searchQuery, onSearchChange }: HeaderBarProps) {
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
          <h1 className="text-gray-900 flex-shrink-0">Item Maintenance</h1>
          
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by SKU, UPC, or description..."
              className="pl-10 rounded-lg border-gray-300 focus:border-[#1976D2] focus:ring-[#1976D2]"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={onFilterToggle}
              className={`rounded-lg ${filterPanelOpen ? 'bg-blue-50 border-[#1976D2]' : ''}`}
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-lg">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-lg">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
