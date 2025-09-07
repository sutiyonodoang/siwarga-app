import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export function usePermissions() {
    const { auth } = usePage<SharedData>().props;
    
    const hasPermission = (permission: string): boolean => {
        if (!auth.user || !auth.user.permissions) {
            return false;
        }
        return auth.user.permissions.includes(permission);
    };

    const hasRole = (role: string): boolean => {
        if (!auth.user || !auth.user.roles) {
            return false;
        }
        return auth.user.roles.includes(role);
    };

    const hasAnyRole = (roles: string[]): boolean => {
        if (!auth.user || !auth.user.roles) {
            return false;
        }
        return roles.some(role => auth.user?.roles?.includes(role) || false);
    };

    const isAdmin = (): boolean => {
        return hasRole('admin');
    };

    const isOperator = (): boolean => {
        return hasRole('operator');
    };

    const isViewer = (): boolean => {
        return hasRole('viewer');
    };

    return {
        hasPermission,
        hasRole,
        hasAnyRole,
        isAdmin,
        isOperator,
        isViewer,
        user: auth.user,
        permissions: auth.user?.permissions || [],
        roles: auth.user?.roles || [],
    };
}
