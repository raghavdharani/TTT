import * as React from 'react';
import { cn } from './utils';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined);

export interface PopoverProps {
  children: React.ReactNode;
}

export const Popover = ({ children }: PopoverProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, className, children, ...props }, ref) => {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  const handleClick = () => {
    context.setOpen(!context.open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ref, onClick: handleClick, ...props });
  }
  return (
    <button ref={ref} className={className} onClick={handleClick} {...props}>
      {children}
    </button>
  );
});
PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'end' | 'center' }
>(({ className, children, align, ...props }, ref) => {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error('PopoverContent must be used within Popover');

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (context.open && !(e.target as Element).closest('[data-popover]')) {
        context.setOpen(false);
      }
    };
    if (context.open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [context.open]);

  if (!context.open) return null;

  return (
    <div
      ref={ref}
      data-popover
      className={cn(
        'z-50 w-72 rounded-md border border-gray-200 bg-white p-4 shadow-md outline-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
PopoverContent.displayName = 'PopoverContent';
