
import React from "react";

export function Command({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ${className ?? ''}`} {...props}>
      {children}
    </div>
  );
}

export function CommandInput({ className, onValueChange, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { onValueChange?: (value: string) => void }) {
  return <input 
    className={`w-full px-2 py-1 border-b outline-none ${className ?? ''}`} 
    onChange={(e) => onValueChange?.(e.target.value)}
    {...props} 
  />;
}

export function CommandList({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`list-none m-0 p-0 ${className ?? ''}`} {...props}>{children}</div>;
}

export function CommandItem({ children, className, onClick, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };
  return <div className={`cursor-pointer px-2 py-1 hover:bg-gray-100 ${className ?? ''}`} onClick={handleClick} {...props}>{children}</div>;
}

export function CommandGroup({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-2 ${className ?? ''}`} {...props}>{children}</div>;
}

export function CommandSeparator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={`my-2 border-t ${className ?? ''}`} {...props} />;
}

export function CommandEmpty({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`text-center text-gray-400 py-2 ${className ?? ''}`} {...props}>{children}</div>;
}
