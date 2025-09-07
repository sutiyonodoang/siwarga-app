import { usePermissions } from '@/hooks/use-permissions';
import { PropsWithChildren } from 'react';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';

interface ProtectedPageProps {
    permission?: string;
    role?: string;
    redirectTo?: string;
    fallback?: React.ReactNode;
}

export function ProtectedPage({ 
    children, 
    permission, 
    role, 
    redirectTo = '/dashboard',
    fallback = null 
}: PropsWithChildren<ProtectedPageProps>) {
    const { hasPermission, hasRole, user } = usePermissions();
    
    const hasAccess = (() => {
        if (!user) return false;
        
        if (permission && !hasPermission(permission)) {
            return false;
        }
        
        if (role && !hasRole(role)) {
            return false;
        }
        
        return true;
    })();

    useEffect(() => {
        if (!hasAccess && redirectTo) {
            router.get(redirectTo);
        }
    }, [hasAccess, redirectTo]);

    if (!hasAccess) {
        if (fallback) {
            return <>{fallback}</>;
        }
        
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                    <button 
                        onClick={() => router.get('/dashboard')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
