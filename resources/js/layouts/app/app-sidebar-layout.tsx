import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { useSidebar } from '@/components/ui/sidebar';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

function AppSidebarLayoutContent({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { isSmallMobile, isMobile, isSmallMode, deviceType } = useSidebar();
    
    // Determine if we should use small layout
    const useSmallLayout = isSmallMobile || (isSmallMode && !isMobile);
    
    return (
        <>
            <AppSidebar />
            <AppContent 
                variant="sidebar" 
                className={`
                    overflow-x-hidden bg-white dark:bg-gray-900 min-h-[100dvh]
                    ${useSmallLayout 
                        ? 'p-1' 
                        : 'p-2 sm:p-4'
                    }
                `}
                data-device-type={deviceType}
                data-small-mode={isSmallMode}
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </>
    );
}

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebarLayoutContent breadcrumbs={breadcrumbs}>
                {children}
            </AppSidebarLayoutContent>
        </AppShell>
    );
}
