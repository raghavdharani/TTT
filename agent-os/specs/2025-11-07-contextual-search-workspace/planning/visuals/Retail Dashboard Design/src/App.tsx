import { useState } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { FilterPanel } from './components/FilterPanel';
import { ItemsDataGrid } from './components/ItemsDataGrid';
import { ItemDetailDrawer } from './components/ItemDetailDrawer';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';

export interface ItemRecord {
  id: string;
  sku: string;
  upc: string;
  description: string;
  department: string;
  class: string;
  vendor: string;
  wholesalePrice: number;
  retailPrice: number;
  status: string;
  lastModified: string;
  size?: string;
  color?: string;
  season?: string;
}

export default function App() {
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ItemRecord | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ key: string; label: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleItemClick = (item: ItemRecord) => {
    setSelectedItem(item);
    setDetailDrawerOpen(true);
  };

  const handleRemoveFilter = (key: string) => {
    setActiveFilters(activeFilters.filter(f => f.key !== key));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <HeaderBar 
        onFilterToggle={() => setFilterPanelOpen(!filterPanelOpen)}
        filterPanelOpen={filterPanelOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <FilterPanel 
          open={filterPanelOpen} 
          onOpenChange={setFilterPanelOpen}
          activeFilters={activeFilters}
          onApplyFilters={(filters) => setActiveFilters(filters)}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <ItemsDataGrid 
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onItemClick={handleItemClick}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      <ItemDetailDrawer 
        item={selectedItem}
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
      />

      <Button
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-[#1976D2] hover:bg-[#1565C0]"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
