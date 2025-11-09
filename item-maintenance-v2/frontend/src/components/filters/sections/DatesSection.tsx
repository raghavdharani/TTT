/**
 * Dates Filter Section
 */

import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { cn } from '../../ui/utils';

interface DatesSectionProps {
  value?: {
    lastModified?: { from?: Date; to?: Date };
    creation?: { from?: Date; to?: Date };
  };
  onChange?: (value: {
    lastModified?: { from?: Date; to?: Date };
    creation?: { from?: Date; to?: Date };
  }) => void;
}

export function DatesSection({ value, onChange }: DatesSectionProps) {
  const dateFrom = value?.lastModified?.from;
  const dateTo = value?.lastModified?.to;
  const creationFrom = value?.creation?.from;
  const creationTo = value?.creation?.to;

  const presetButtons = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
  ];

  const handlePreset = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onChange?.({
      ...value,
      lastModified: { from, to },
    });
  };

  const handleLastModifiedFromChange = (date: Date | undefined) => {
    onChange?.({
      ...value,
      lastModified: {
        ...value?.lastModified,
        from: date,
      },
    });
  };

  const handleLastModifiedToChange = (date: Date | undefined) => {
    onChange?.({
      ...value,
      lastModified: {
        ...value?.lastModified,
        to: date,
      },
    });
  };

  const handleCreationFromChange = (date: Date | undefined) => {
    onChange?.({
      ...value,
      creation: {
        ...value?.creation,
        from: date,
      },
    });
  };

  const handleCreationToChange = (date: Date | undefined) => {
    onChange?.({
      ...value,
      creation: {
        ...value?.creation,
        to: date,
      },
    });
  };

  return (
    <AccordionItem value="dates" className="border rounded-lg mb-2 px-3">
      <AccordionTrigger className="text-gray-900 hover:no-underline py-3">
        Dates
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <Label className="text-gray-700">Presets</Label>
          <div className="flex flex-wrap gap-2">
            {presetButtons.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => handlePreset(preset.days)}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700">Last Modified Date</Label>
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left rounded-lg',
                    !dateFrom && 'text-gray-500'
                  )}
                >
                  {dateFrom
                    ? dateFrom.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'From date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={handleLastModifiedFromChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left rounded-lg',
                    !dateTo && 'text-gray-500'
                  )}
                >
                  {dateTo
                    ? dateTo.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'To date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={handleLastModifiedToChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700">Creation Date</Label>
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left rounded-lg',
                    !creationFrom && 'text-gray-500'
                  )}
                >
                  {creationFrom
                    ? creationFrom.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'From date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={creationFrom}
                  onSelect={handleCreationFromChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left rounded-lg',
                    !creationTo && 'text-gray-500'
                  )}
                >
                  {creationTo
                    ? creationTo.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'To date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={creationTo}
                  onSelect={handleCreationToChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

