/**
 * Column Customizer Component
 * Allows users to show/hide and reorder columns with drag-and-drop
 */

import React, { useState } from 'react';
import { Settings, ChevronUp, ChevronDown, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

interface ColumnCustomizerProps {
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
}

export function ColumnCustomizer({ columns, onColumnsChange }: ColumnCustomizerProps) {
  const [open, setOpen] = useState(false);
  const [localColumns, setLocalColumns] = useState(columns);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleToggleVisibility = (id: string) => {
    const updated = localColumns.map(col =>
      col.id === id ? { ...col, visible: !col.visible } : col
    );
    setLocalColumns(updated);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...localColumns];
    const sorted = [...updated].sort((a, b) => a.order - b.order);
    const draggedItem = sorted[draggedIndex];
    sorted.splice(draggedIndex, 1);
    sorted.splice(dropIndex, 0, draggedItem);
    
    sorted.forEach((col, i) => {
      col.order = i;
    });
    
    setLocalColumns(sorted);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...localColumns].sort((a, b) => a.order - b.order);
    const updated = [...sorted];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated.forEach((col, i) => {
      col.order = i;
    });
    setLocalColumns(updated);
  };

  const handleMoveDown = (index: number) => {
    const sorted = [...localColumns].sort((a, b) => a.order - b.order);
    if (index === sorted.length - 1) return;
    const updated = [...sorted];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((col, i) => {
      col.order = i;
    });
    setLocalColumns(updated);
  };

  const handleApply = () => {
    onColumnsChange(localColumns);
    setOpen(false);
  };

  const handleReset = () => {
    setLocalColumns(columns);
  };

  const sortedColumns = [...localColumns].sort((a, b) => a.order - b.order);

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-lg"
        onClick={() => setOpen(true)}
        aria-label="Customize columns"
      >
        <Settings className="h-5 w-5" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize Columns</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto">
            <div className="text-sm text-gray-600 mb-2">
              Drag rows to reorder, or use the up/down arrows. Check/uncheck to show/hide columns.
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Drag</th>
                  <th className="text-left p-2">Visible</th>
                  <th className="text-left p-2">Column</th>
                  <th className="text-left p-2">Order</th>
                </tr>
              </thead>
              <tbody>
                {sortedColumns.map((column, index) => (
                  <tr 
                    key={column.id} 
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      dragOverIndex === index ? 'bg-blue-50' : ''
                    } ${draggedIndex === index ? 'opacity-50' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                        <button
                          onClick={() => handleToggleVisibility(column.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {column.visible ? (
                            <Eye className="h-4 w-4 text-gray-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={column.visible}
                          onChange={() => handleToggleVisibility(column.id)}
                          className="rounded"
                        />
                        <span className={column.visible ? 'text-gray-900' : 'text-gray-400'}>
                          {column.label}
                        </span>
                      </label>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                          title="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === sortedColumns.length - 1}
                          className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                          title="Move down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply} className="bg-[#1976D2] hover:bg-[#1565C0]">
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
}

