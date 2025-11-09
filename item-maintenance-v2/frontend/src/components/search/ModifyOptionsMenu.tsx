/**
 * Modify Options Menu Component
 * Provides column-level modify operations: Copy, Fill, Undo, Percentage operations
 */

import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface ModifyOptionsMenuProps {
  columnId: string;
  columnLabel: string;
  isValueField: boolean; // True for price/number fields
  onCopyAll: (columnId: string) => void;
  onCopySelected: (columnId: string) => void;
  onPaste: (columnId: string) => void;
  onFillAll: (columnId: string, value: any) => void;
  onFillSelected: (columnId: string, value: any) => void;
  onUndoAll: (columnId: string) => void;
  onUndoSelected: (columnId: string) => void;
  onPercentOffAll: (columnId: string, percent: number) => void;
  onPercentOffSelected: (columnId: string, percent: number) => void;
  onPercentIncrAll: (columnId: string, percent: number) => void;
  onPercentIncrSelected: (columnId: string, percent: number) => void;
  hasSelectedRows: boolean;
  hasCopiedValues: boolean;
}

export function ModifyOptionsMenu({
  columnId,
  columnLabel,
  isValueField,
  onCopyAll,
  onCopySelected,
  onPaste,
  onFillAll,
  onFillSelected,
  onUndoAll,
  onUndoSelected,
  onPercentOffAll,
  onPercentOffSelected,
  onPercentIncrAll,
  onPercentIncrSelected,
  hasSelectedRows,
  hasCopiedValues,
}: ModifyOptionsMenuProps) {
  const [fillDialogOpen, setFillDialogOpen] = useState(false);
  const [fillValue, setFillValue] = useState('');
  const [fillMode, setFillMode] = useState<'all' | 'selected'>('all');
  const [percentDialogOpen, setPercentDialogOpen] = useState(false);
  const [percentValue, setPercentValue] = useState('');
  const [percentMode, setPercentMode] = useState<'all' | 'selected'>('all');
  const [percentOperation, setPercentOperation] = useState<'off' | 'incr'>('off');

  const handleFillClick = (mode: 'all' | 'selected') => {
    setFillMode(mode);
    setFillValue('');
    setFillDialogOpen(true);
  };

  const handleFillSubmit = () => {
    if (!fillValue) return;
    if (fillMode === 'all') {
      onFillAll(columnId, fillValue);
    } else {
      onFillSelected(columnId, fillValue);
    }
    setFillDialogOpen(false);
    setFillValue('');
  };

  const handlePercentClick = (mode: 'all' | 'selected', operation: 'off' | 'incr') => {
    setPercentMode(mode);
    setPercentOperation(operation);
    setPercentValue('');
    setPercentDialogOpen(true);
  };

  const handlePercentSubmit = () => {
    const percent = parseFloat(percentValue);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      alert('Please enter a valid percentage between 0 and 100');
      return;
    }
    if (percentMode === 'all') {
      if (percentOperation === 'off') {
        onPercentOffAll(columnId, percent);
      } else {
        onPercentIncrAll(columnId, percent);
      }
    } else {
      if (percentOperation === 'off') {
        onPercentOffSelected(columnId, percent);
      } else {
        onPercentIncrSelected(columnId, percent);
      }
    }
    setPercentDialogOpen(false);
    setPercentValue('');
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            title="Modify Options"
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <div className="space-y-1">
            <div className="px-2 py-1 text-xs font-semibold text-gray-700 border-b mb-1">
              Modify Options: {columnLabel}
            </div>
            
            <button
              onClick={() => onCopyAll(columnId)}
              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
            >
              Copy All
            </button>
            <button
              onClick={() => onCopySelected(columnId)}
              disabled={!hasSelectedRows}
              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Copy Selected
            </button>
            <button
              onClick={() => onPaste(columnId)}
              disabled={!hasCopiedValues}
              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Paste
            </button>
            
            <div className="border-t my-1" />
            
            <button
              onClick={() => handleFillClick('all')}
              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
            >
              Fill All
            </button>
            <button
              onClick={() => handleFillClick('selected')}
              disabled={!hasSelectedRows}
              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Fill Selected
            </button>
            
            <div className="border-t my-1" />
            
            <button
              onClick={() => onUndoAll(columnId)}
              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
            >
              Undo All
            </button>
            <button
              onClick={() => onUndoSelected(columnId)}
              disabled={!hasSelectedRows}
              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Undo Selected
            </button>
            
            {isValueField && (
              <>
                <div className="border-t my-1" />
                <button
                  onClick={() => handlePercentClick('all', 'off')}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                >
                  % Off All
                </button>
                <button
                  onClick={() => handlePercentClick('selected', 'off')}
                  disabled={!hasSelectedRows}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  % Off Selected
                </button>
                <button
                  onClick={() => handlePercentClick('all', 'incr')}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                >
                  % Incr. All
                </button>
                <button
                  onClick={() => handlePercentClick('selected', 'incr')}
                  disabled={!hasSelectedRows}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  % Incr. Selected
                </button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Fill Dialog */}
      <Dialog open={fillDialogOpen} onOpenChange={setFillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Fill {fillMode === 'all' ? 'All' : 'Selected'} - {columnLabel}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="fill-value">Enter value:</Label>
              <Input
                id="fill-value"
                type={isValueField ? 'number' : 'text'}
                value={fillValue}
                onChange={(e) => setFillValue(e.target.value)}
                placeholder="Enter value"
                className="mt-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFillSubmit();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFillDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFillSubmit} disabled={!fillValue}>
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Percentage Dialog */}
      <Dialog open={percentDialogOpen} onOpenChange={setPercentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {percentOperation === 'off' ? '% Off' : '% Increase'} {percentMode === 'all' ? 'All' : 'Selected'} - {columnLabel}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="percent-value">Enter percentage (0-100):</Label>
              <Input
                id="percent-value"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={percentValue}
                onChange={(e) => setPercentValue(e.target.value)}
                placeholder="0.00"
                className="mt-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePercentSubmit();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPercentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePercentSubmit} disabled={!percentValue}>
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

