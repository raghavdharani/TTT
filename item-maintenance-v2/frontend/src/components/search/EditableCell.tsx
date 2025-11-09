/**
 * Editable Cell Component
 * Allows inline editing of table cells
 */

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface EditableCellProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: 'text' | 'number';
  className?: string;
}

export function EditableCell({ value, onSave, type = 'text', className }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(String(value));
  };

  const handleSave = () => {
    const finalValue = type === 'number' ? parseFloat(editValue) || 0 : editValue;
    onSave(finalValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <td className={className}>
        <div className="flex items-center gap-1">
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 text-sm border border-[#1976D2] rounded focus:outline-none focus:ring-1 focus:ring-[#1976D2]"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Save"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Cancel"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </td>
    );
  }

  return (
    <td
      className={`${className} cursor-pointer hover:bg-blue-50`}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
    >
      {value}
    </td>
  );
}

