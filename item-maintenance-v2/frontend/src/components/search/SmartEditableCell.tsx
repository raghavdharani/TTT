/**
 * Smart Editable Cell Component
 * Uses appropriate UI components based on field type (dropdown, date picker, etc.)
 */

import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';

// Helper function to format dates (using native Date methods, no external dependency)
const formatDate = (date: Date | string): string => {
  if (!date) return '-';
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    // Format as "MMM dd, yyyy" (e.g., "Jan 15, 2024")
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month} ${day.toString().padStart(2, '0')}, ${year}`;
  } catch (error) {
    return '-';
  }
};

interface SmartEditableCellProps {
  value: string | number;
  onSave: (value: string | number | Date) => void;
  fieldType: string;
  className?: string;
  options?: { value: string; label: string }[];
  isEditable?: boolean;
}

export function SmartEditableCell({ 
  value, 
  onSave, 
  fieldType, 
  className,
  options,
  isEditable = true
}: SmartEditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string | number | Date>(
    fieldType === 'date' ? (value ? new Date(value as string) : new Date()) : value
  );

  // Update editValue when value prop changes (important for dropdowns)
  useEffect(() => {
    if (fieldType === 'date') {
      setEditValue(value ? new Date(value as string) : new Date());
    } else {
      setEditValue(value);
    }
  }, [value, fieldType]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    if (fieldType === 'date') {
      setEditValue(value ? new Date(value as string) : new Date());
    } else {
      setEditValue(value);
    }
  };

  // Handle input focus to select all text for overwrite
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (fieldType === 'date') {
      setEditValue(value ? new Date(value as string) : new Date());
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Render appropriate input based on field type
  const renderInput = () => {
    switch (fieldType) {
      case 'select':
      case 'dropdown':
        if (!options || options.length === 0) {
          // Fallback to text input if no options
          return (
            <Input
              value={String(editValue)}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full px-2 py-1 text-sm border border-[#1976D2] rounded focus:outline-none focus:ring-1 focus:ring-[#1976D2]"
              autoFocus
            />
          );
        }
        return (
          <Select
            value={String(editValue)}
            onValueChange={(val) => {
              setEditValue(val);
              // Call onSave directly with the new value
              onSave(val);
              setIsEditing(false);
            }}
          >
            <SelectTrigger className="w-full min-w-[150px] px-3 py-2 text-sm border border-[#1976D2] rounded focus:outline-none focus:ring-1 focus:ring-[#1976D2]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full px-2 py-1 text-sm border border-[#1976D2] rounded focus:outline-none focus:ring-1 focus:ring-[#1976D2] flex items-center justify-between">
                {editValue instanceof Date ? formatDate(editValue) : String(value)}
                <CalendarIcon className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={editValue instanceof Date ? editValue : undefined}
                onSelect={(date) => {
                  if (date) {
                    setEditValue(date);
                    onSave(date);
                    setIsEditing(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'number':
      case 'price':
        return (
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
            onFocus={handleInputFocus}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full min-w-[120px] px-3 py-2 text-sm border border-[#1976D2] rounded focus:outline-none focus:ring-1 focus:ring-[#1976D2]"
            autoFocus
            step={fieldType === 'price' ? '0.01' : '1'}
          />
        );

      default:
        return (
          <Input
            value={String(editValue)}
            onChange={(e) => setEditValue(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full min-w-[150px] px-3 py-2 text-sm border border-[#1976D2] rounded focus:outline-none focus:ring-1 focus:ring-[#1976D2]"
            autoFocus
          />
        );
    }
  };

  if (isEditing && fieldType !== 'select' && fieldType !== 'dropdown' && fieldType !== 'date') {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            {renderInput()}
          </div>
          <button
            onClick={handleSave}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Save (Enter)"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Cancel (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (isEditing && (fieldType === 'select' || fieldType === 'dropdown' || fieldType === 'date')) {
    return (
      <div className={className}>
        {renderInput()}
      </div>
    );
  }

  const displayValue = fieldType === 'date' && value
    ? formatDate(new Date(value as string))
    : fieldType === 'price' && typeof value === 'number'
    ? `$${value.toFixed(2)}`
    : value;

  return (
    <div
      className={`${className} cursor-pointer hover:bg-blue-50`}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
    >
      {displayValue}
    </div>
  );
}

