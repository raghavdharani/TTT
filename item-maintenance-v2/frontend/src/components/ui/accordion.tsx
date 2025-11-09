import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from './utils';

interface AccordionContextValue {
  value: string[];
  onValueChange: (value: string[]) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);
const AccordionItemContext = React.createContext<{ value: string } | undefined>(undefined);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = 'single', defaultValue = [], value, onValueChange, className, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue);
    const controlledValue = value !== undefined ? value : internalValue;
    const handleValueChange = onValueChange || setInternalValue;

    const contextValue: AccordionContextValue = {
      value: controlledValue,
      onValueChange: handleValueChange,
      type,
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <AccordionContext.Provider value={contextValue}>
          {children}
        </AccordionContext.Provider>
      </div>
    );
  }
);
Accordion.displayName = 'Accordion';

export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div ref={ref} className={cn('', className)} data-value={value} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);
  if (!context || !item) {
    console.error('AccordionTrigger must be used within AccordionItem');
    return <button ref={ref} className={className} {...props}>{children}</button>;
  }

  const isOpen = context.value.includes(item.value);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
        className
      )}
      onClick={() => {
        if (context.type === 'single') {
          context.onValueChange(isOpen ? [] : [item.value]);
        } else {
          context.onValueChange(
            isOpen
              ? context.value.filter((v) => v !== item.value)
              : [...context.value, item.value]
          );
        }
      }}
      {...props}
    >
      {children}
      <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
    </button>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);
  if (!context || !item) {
    console.error('AccordionContent must be used within AccordionItem');
    return null;
  }

  const isOpen = context.value.includes(item.value);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden text-sm transition-all', className)}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
});
AccordionContent.displayName = 'AccordionContent';
