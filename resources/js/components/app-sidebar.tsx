
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { usePermissions } from '@/hooks/use-permissions';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Shield, Activity } from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

const allNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        permission: undefined, // Dashboard is accessible to all authenticated users
    },
    {
        title: '',
        href: '',
        icon: null,
        isSeparator: true,
    },
    {
        title: 'Kartu Keluarga',
        href: '/kartu-keluarga',
        icon: BookOpen,
        permission: 'kartu_keluarga_read',
    },
    {
        title: 'Warga Mukim',
        href: '/anggota-keluarga',
        icon: BookOpen,
        permission: 'anggota_keluarga_read',
    },
    {
        title: 'Warga Musiman',
        href: '/warga-musiman',
        icon: BookOpen,
        permission: 'warga_musiman_read',
    },
    {
        title: '',
        href: '',
        icon: null,
        isSeparator: true,
    },
    {
        title: 'Kelola Pengguna',
        href: '/users',
        icon: Users,
        permission: 'user_read',
    },
    {
        title: 'Role Management',
        href: '/roles',
        icon: Shield,
        permission: 'user_edit', // Role management requires user edit permission
    },
    {
        title: 'Log Aktivitas',
        href: '/user-activity-logs',
        icon: Activity,
        permission: 'user_activity_log_read',
    },
];

const footerNavItems: NavItem[] = [
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const { hasPermission } = usePermissions();
    
    // Check if user has viewer role only
    const isViewerOnly = useMemo(() => {
        if (!auth?.user?.roles) return false;
        const userRoles = auth.user.roles;
        return userRoles.includes('viewer') && !userRoles.includes('admin') && !userRoles.includes('operator');
    }, [auth?.user?.roles]);
    
    // Filter menu items based on permissions and user role
    const filteredNavItems = useMemo(() => {
        // If user is viewer only, show only dashboard
        if (isViewerOnly) {
            return allNavItems.filter(item => 
                item.title === 'Dashboard' || (!item.permission && !item.isSeparator)
            );
        }
        
        return allNavItems.filter(item => {
            // Always show separators
            if (item.isSeparator) {
                return true;
            }
            
            // Show item if no permission required or user has permission
            if (!item.permission) {
                return true;
            }
            
            return hasPermission(item.permission);
        });
    }, [hasPermission, isViewerOnly]);

    // Remove unnecessary separators (at start, end, or consecutive)
    const cleanNavItems = useMemo(() => {
        const cleaned: NavItem[] = [];
        let lastWasSeparator = true; // Start as true to remove leading separators
        
        for (const item of filteredNavItems) {
            if (item.isSeparator) {
                if (!lastWasSeparator && cleaned.length > 0) {
                    cleaned.push(item);
                    lastWasSeparator = true;
                }
            } else {
                cleaned.push(item);
                lastWasSeparator = false;
            }
        }
        
        // Remove trailing separator
        if (cleaned.length > 0 && cleaned[cleaned.length - 1].isSeparator) {
            cleaned.pop();
        }
        
        return cleaned;
    }, [filteredNavItems]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={cleanNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {auth?.user ? (
                    <NavUser />
                ) : (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={route('login')} className="w-full text-left">Login</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
