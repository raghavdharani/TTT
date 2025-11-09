import * as React from 'react';
import { cn } from './utils';

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined);

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, defaultValue, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
    const controlledValue = value !== undefined ? value : internalValue;
    const handleValueChange = onValueChange || setInternalValue;

    const contextValue: RadioGroupContextValue = {
      value: controlledValue,
      onValueChange: handleValueChange,
    };

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('grid gap-2', className)}
          role="radiogroup"
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, children, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    if (!context) throw new Error('RadioGroupItem must be used within RadioGroup');

    const isChecked = context.value === value;
    const itemId = id || `radio-${value}`;

    return (
      <div className="flex items-center space-x-2">
        <input
          ref={ref}
          type="radio"
          id={itemId}
          value={value}
          checked={isChecked}
          onChange={() => context.onValueChange?.(value)}
          className={cn(
            'h-4 w-4 border-gray-300 text-[#1976D2] focus:ring-[#1976D2] focus:ring-2',
            className
          )}
          {...props}
        />
        {children && (
          <label
            htmlFor={itemId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {children}
          </label>
        )}
      </div>
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

