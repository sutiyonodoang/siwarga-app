import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SmallModeToggle } from '@/components/ui/small-mode-toggle';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function SimpleSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 h-16 px-6 md:px-4 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div>
                    <Breadcrumbs breadcrumbs={breadcrumbs} variant="colored" />
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <SmallModeToggle />
            </div>
        </header>
    );
}
