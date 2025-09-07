
import React, { useState, useRef, useEffect } from "react";

export function Popover({ open, onOpenChange, children }: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(open ?? false);
  useEffect(() => {
    if (open !== undefined) setIsOpen(open);
  }, [open]);
  const handleOpenChange = (val: boolean) => {
    setIsOpen(val);
    onOpenChange?.(val);
  };
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as any, { popoverOpen: isOpen, setPopoverOpen: handleOpenChange });
  });
}

export function PopoverTrigger({ children, asChild = false, popoverOpen, setPopoverOpen, ...props }: any) {
  const triggerProps = {
    onClick: () => setPopoverOpen && setPopoverOpen(!popoverOpen),
    'aria-expanded': popoverOpen,
    ...props
  };
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, triggerProps);
  }
  return <button type="button" {...triggerProps}>{children}</button>;
}

export function PopoverContent({ children, className = '', popoverOpen, setPopoverOpen, ...props }: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setPopoverOpen && setPopoverOpen(false);
      }
    }
    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverOpen, setPopoverOpen]);
  if (!popoverOpen) return null;
  return (
    <div ref={ref} className={`absolute z-50 w-72 rounded-md border bg-white p-4 shadow-md ${className}`} {...props}>
      {children}
    </div>
  );
}

export function PopoverAnchor({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}
