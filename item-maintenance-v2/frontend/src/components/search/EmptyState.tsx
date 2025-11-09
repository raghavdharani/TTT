/**
 * Empty State Component
 * Displays when no search has been performed or no results found
 */

import React from 'react';
import { Search } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Large Search Icon */}
      <div className="mb-6">
        <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
          <Search className="w-12 h-12 text-[#1976D2]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Main Message */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Start Your Search
      </h2>

      {/* Instructions */}
      <p className="text-gray-600 text-center max-w-md mb-8">
        Please enter a search query in the search bar above or apply filters to view results.
      </p>

      {/* Search Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md w-full">
        <p className="text-sm font-medium text-gray-700 mb-2">You can search for:</p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>SKU or UPC codes</li>
          <li>Product descriptions</li>
          <li>Department, class, or vendor filters</li>
          <li>Price ranges and date filters</li>
        </ul>
      </div>
    </div>
  );
}

