import { Button } from '@/components/ui/button';
import { useIsMobileVariant } from '@/hooks/use-small-mobile';
import { Minimize2, Maximize2 } from 'lucide-react';

export function SmallModeToggle({ variant = 'default' }: { variant?: 'default' | 'colored' }) {
    const { isSmallMode, deviceType, toggleSmallMode } = useIsMobileVariant();

    // Only show toggle on desktop and mobile (not small-mobile as it's always small)
    if (deviceType === 'small-mobile') {
        return null;
    }

    const buttonClassName = variant === 'colored' 
        ? "h-8 w-8 text-white hover:bg-white/10 hover:text-white" 
        : "h-8 w-8";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleSmallMode}
            title={isSmallMode ? 'Mode Normal' : 'Mode Kompak'}
            className={buttonClassName}
        >
            {isSmallMode ? (
                <Maximize2 className="h-4 w-4" />
            ) : (
                <Minimize2 className="h-4 w-4" />
            )}
        </Button>
    );
}
