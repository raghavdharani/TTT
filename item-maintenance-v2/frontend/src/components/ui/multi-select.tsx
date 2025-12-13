/**
 * Multi-Select Component
 * A dropdown with checkboxes for selecting multiple values
 */

import React, { useRef, useEffect, useState } from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { ChevronDown, X } from 'lucide-react';
import { cn } from './utils';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select options',
  className,
  id,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const selectedLabels = value
    .map(v => options.find(opt => opt.value === v)?.label)
    .filter(Boolean) as string[];

  const displayText = selectedLabels.length === 0
    ? placeholder
    : selectedLabels.length === 1
    ? selectedLabels[0]
    : `${selectedLabels.length} selected`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      <Button
        id={id}
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className={cn(
          'w-full justify-between rounded-lg',
          value.length > 0 && 'bg-blue-50 border-blue-300',
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn('truncate', value.length === 0 && 'text-gray-500')}>
          {displayText}
        </span>
        <div className="flex items-center gap-1">
          {value.length > 0 && (
            <X
              className="h-4 w-4 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                handleClear(e);
              }}
            />
          )}
          <ChevronDown className={cn('h-4 w-4 shrink-0 opacity-50 transition-transform', isOpen && 'rotate-180')} />
        </div>
      </Button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 rounded-md border border-gray-200 bg-white p-2 shadow-lg max-h-60 overflow-auto">
          <div className="space-y-1">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => handleToggle(option.value)}
              >
                <Checkbox
                  checked={value.includes(option.value)}
                  onCheckedChange={() => handleToggle(option.value)}
                />
                <Label
                  className="flex-1 cursor-pointer text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          {value.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={handleClear}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

