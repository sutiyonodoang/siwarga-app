import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useCallback } from 'react';

interface AutocompleteOption {
    id: string | number;
    name: string;
}

interface AutocompleteProps {
    value: string;
    onValueChange: (value: string) => void;
    onSelect: (option: AutocompleteOption) => void;
    fetchData: (search: string) => Promise<AutocompleteOption[]>;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function Autocomplete({
    value,
    onValueChange,
    onSelect,
    fetchData,
    placeholder = 'Search...',
    className,
    disabled = false,
}: AutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<AutocompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const loadOptions = useCallback(async (search: string) => {
        if (!search) {
            setOptions([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const results = await fetchData(search);
            setOptions(results);
            setIsOpen(results.length > 0);
        } catch (error) {
            console.error('Error fetching autocomplete data:', error);
            setOptions([]);
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    }, [fetchData]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadOptions(value);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [value, loadOptions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < options.length) {
                    handleSelect(options[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    const handleSelect = (option: AutocompleteOption) => {
        onValueChange(option.name);
        onSelect(option);
        setIsOpen(false);
        setHighlightedIndex(-1);
        setOptions([]);
    };

    return (
        <div ref={containerRef} className="relative">
            <Input
                ref={inputRef}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => value && options.length > 0 && setIsOpen(true)}
                placeholder={placeholder}
                className={cn(className)}
                disabled={disabled}
            />
            {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"></div>
                </div>
            )}
            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                    {options.map((option, index) => (
                        <div
                            key={option.id}
                            className={cn(
                                'relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-hidden',
                                highlightedIndex === index ? 'bg-accent text-accent-foreground' : ''
                            )}
                            onClick={() => handleSelect(option)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}