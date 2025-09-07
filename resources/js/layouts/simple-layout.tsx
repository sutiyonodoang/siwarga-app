import { type ReactNode } from 'react';

interface SimpleLayoutProps {
    children: ReactNode;
    breadcrumbs?: any[];
}

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mx-auto max-w-7xl">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">SIWarga App</h1>
                </div>
                {children}
            </div>
        </div>
    );
}
