/**
 * Record Count Component
 * Displays record count
 */

import React from 'react';

interface RecordCountProps {
  count: number | null;
  loading: boolean;
}

export function RecordCount({ count, loading }: RecordCountProps) {
  if (loading) {
    return (
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <p className="text-gray-600">Searching...</p>
      </div>
    );
  }

  if (count === null) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <p className="text-gray-900">
        <span className="font-semibold">{count.toLocaleString()}</span> records found
      </p>
    </div>
  );
}

