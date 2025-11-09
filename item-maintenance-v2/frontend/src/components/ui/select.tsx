import * as React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from './utils';

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  labels: Map<string, string>;
  registerLabel: (value: string, label: string) => void;
  triggerRef: React.RefObject<HTMLElement>;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

export const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [labels] = React.useState(() => new Map<string, string>());
  const triggerRef = React.useRef<HTMLElement>(null);
  
  const registerLabel = React.useCallback((value: string, label: string) => {
    labels.set(value, label);
  }, [labels]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, labels, registerLabel, triggerRef }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { id?: string }
>(({ className, children, id, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');
  
  // Combine refs to set both the forwarded ref and the context ref
  const combinedRef = React.useCallback((node: HTMLButtonElement | null) => {
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
    if (context.triggerRef) {
      (context.triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  }, [ref, context.triggerRef]);

  return (
    <button
      ref={combinedRef}
      id={id}
      type="button"
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => context.setOpen(!context.open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');

  // Find the selected item's label from the labels map
  const selectedLabel = React.useMemo(() => {
    if (!context.value) return placeholder;
    const label = context.labels.get(context.value);
    if (label) return label;
    // If no label found, capitalize the first letter of the value
    if (context.value) {
      return context.value.charAt(0).toUpperCase() + context.value.slice(1);
    }
    return context.value;
  }, [context.value, context.labels, placeholder]);

  return <span className={cn(context.value ? 'text-gray-900' : 'text-gray-500')}>{selectedLabel || placeholder}</span>;
};

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');
  const [position, setPosition] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Update position when dropdown opens or trigger moves
  const updatePosition = React.useCallback(() => {
    if (context.triggerRef.current) {
      const rect = context.triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [context.triggerRef]);

  React.useEffect(() => {
    if (context.open) {
      updatePosition();
    }
  }, [context.open, updatePosition]);

  React.useEffect(() => {
    if (!context.open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        context.triggerRef.current &&
        !context.triggerRef.current.contains(target)
      ) {
        context.setOpen(false);
      }
    };

    const handleScroll = () => {
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [context.open, context, updatePosition]);

  if (!context.open || !position) return null;

  const content = (
    <div
      ref={(node) => {
        contentRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        'z-[9999] min-w-[8rem] rounded-md border border-gray-200 bg-white shadow-lg max-h-[200px] overflow-y-auto',
        className
      )}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );

  // Render as portal to escape overflow constraints
  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
});
SelectContent.displayName = 'SelectContent';

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');

  // Register the label when the component mounts
  React.useEffect(() => {
    const label = typeof children === 'string' ? children : React.Children.toArray(children).join('');
    if (label) {
      context.registerLabel(value, label);
    }
  }, [value, children, context]);

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      onClick={() => {
        context.onValueChange?.(value);
        context.setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = 'SelectItem';

