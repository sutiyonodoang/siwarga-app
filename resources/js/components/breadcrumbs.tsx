import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useSidebar } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';

export function Breadcrumbs({ breadcrumbs, variant = 'default' }: { breadcrumbs: BreadcrumbItemType[]; variant?: 'default' | 'colored' }) {
    const { isSmallMobile, isMobile, deviceType } = useSidebar();
    
    const textColorClass = variant === 'colored' ? 'text-gray-700 font-medium' : 'text-gray-700 dark:text-gray-300';
    const linkColorClass = variant === 'colored' ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100';
    const separatorColorClass = variant === 'colored' ? 'text-gray-400' : 'text-gray-400 dark:text-gray-500';
    
    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList className={`${isSmallMobile && isMobile ? 'text-xs' : ''} ${textColorClass} flex items-center gap-1`}>
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem className="flex items-center">
                                        {isLast ? (
                                            <BreadcrumbPage className={`${isSmallMobile && isMobile ? 'text-xs' : ''} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold`}>
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link 
                                                    href={item.href}
                                                    className={`${isSmallMobile && isMobile ? 'text-xs' : ''} ${linkColorClass} transition-all duration-200`}
                                                >
                                                    {item.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator className={`${isSmallMobile && isMobile ? 'scale-75' : ''} ${separatorColorClass} mx-1`} />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
