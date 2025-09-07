import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { SmallModeToggle } from '@/components/ui/small-mode-toggle';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { isSmallMobile, isMobile, isSmallMode, deviceType } = useSidebar();
    
    // Determine if we should use small layout
    const useSmallLayout = isSmallMobile || (isSmallMode && !isMobile);
    
    return (
        <header 
            className={`
                flex shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 transition-[width,height] ease-linear 
                group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50
                ${useSmallLayout 
                    ? 'h-12 px-2' 
                    : 'h-16 px-6 md:px-4'
                }
            `}
            data-device-type={deviceType}
            data-small-mode={isSmallMode}
        >
            <div className={`flex items-center ${useSmallLayout ? 'gap-1' : 'gap-2'}`}>
                <SidebarTrigger 
                    className={useSmallLayout ? '-ml-0.5 h-6 w-6' : '-ml-1'} 
                />
                <div className={useSmallLayout ? 'hidden xs:block' : ''}>
                    <Breadcrumbs breadcrumbs={breadcrumbs} variant="colored" />
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <SmallModeToggle />
            </div>
        </header>
    );
}
