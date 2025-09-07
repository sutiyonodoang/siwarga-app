import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { SimpleSidebarHeader } from '@/components/simple-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

function SidebarLayoutContent({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <>
            <AppSidebar />
            <AppContent 
                variant="sidebar" 
                className="overflow-x-hidden bg-white dark:bg-gray-900 min-h-[100dvh] p-2 sm:p-4"
            >
                <SimpleSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </>
    );
}

export default function SidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <SidebarLayoutContent breadcrumbs={breadcrumbs}>
                {children}
            </SidebarLayoutContent>
        </AppShell>
    );
}
