import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SidebarLayout from '@/layouts/sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, User, Clock, Monitor, Globe, FileText, Database } from 'lucide-react';

interface ActivityLog {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    activity_type: string;
    module: string;
    description: string;
    old_data: any;
    new_data: any;
    ip_address: string;
    user_agent: string;
    created_at: string;
}

interface Props {
    activityLog: ActivityLog;
}

export default function UserActivityLogShow({ activityLog }: Props) {
    const breadcrumbItems: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Log Aktivitas Pengguna', href: '/user-activity-logs' },
        { title: 'Detail Aktivitas', href: `/user-activity-logs/${activityLog.id}` },
    ];

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('id-ID', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const getActivityTypeBadge = (type: string) => {
        const variants: Record<string, string> = {
            'create': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200',
            'update': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200',
            'delete': 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200',
            'view': 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200',
            'login': 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200',
            'logout': 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200',
        };
        
        return variants[type] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200';
    };

    const formatActivityType = (type: string) => {
        const types: Record<string, string> = {
            'create': 'Membuat',
            'update': 'Mengubah',
            'delete': 'Menghapus',
            'view': 'Melihat',
            'login': 'Login',
            'logout': 'Logout',
        };
        return types[type] || type;
    };

    const formatModule = (module: string) => {
        const modules: Record<string, string> = {
            'anggota_keluarga': 'Anggota Keluarga',
            'kartu_keluarga': 'Kartu Keluarga',
            'warga_musiman': 'Warga Musiman',
            'users': 'Pengguna',
            'auth': 'Autentikasi',
        };
        return modules[module] || module;
    };

    return (
        <SidebarLayout breadcrumbs={breadcrumbItems}>
            <Head title={`Detail Aktivitas #${activityLog.id}`} />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Detail Aktivitas Pengguna</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Informasi lengkap aktivitas pengguna</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/user-activity-logs">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activity Details */}
                    <Card className="border-blue-200/50 dark:border-blue-700/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <FileText className="h-5 w-5" />
                                Informasi Aktivitas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        ID Aktivitas
                                    </label>
                                    <p className="text-gray-800 dark:text-gray-200 font-mono">#{activityLog.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Jenis Aktivitas
                                    </label>
                                    <div className="mt-1">
                                        <Badge className={getActivityTypeBadge(activityLog.activity_type)}>
                                            {formatActivityType(activityLog.activity_type)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Modul
                                </label>
                                <p className="text-gray-800 dark:text-gray-200">{formatModule(activityLog.module)}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Deskripsi
                                </label>
                                <p className="text-gray-800 dark:text-gray-200">{activityLog.description}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Waktu Aktivitas
                                </label>
                                <p className="text-gray-800 dark:text-gray-200">{formatDate(activityLog.created_at)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Details */}
                    <Card className="border-blue-200/50 dark:border-blue-700/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <User className="h-5 w-5" />
                                Informasi Pengguna
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Nama Pengguna
                                </label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{activityLog.user.name}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Email
                                </label>
                                <p className="text-gray-800 dark:text-gray-200">{activityLog.user.email}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    IP Address
                                </label>
                                <p className="text-gray-800 dark:text-gray-200 font-mono">{activityLog.ip_address || '-'}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <Monitor className="h-4 w-4" />
                                    User Agent
                                </label>
                                <p className="text-gray-800 dark:text-gray-200 text-sm break-all">
                                    {activityLog.user_agent || '-'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Changes */}
                {(activityLog.old_data || activityLog.new_data) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Old Data */}
                        {activityLog.old_data && (
                            <Card className="border-red-200/50 dark:border-red-700/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                                        <Database className="h-5 w-5" />
                                        Data Sebelumnya
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="bg-red-50/50 dark:bg-red-900/20 p-4 rounded-lg text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                                        {JSON.stringify(activityLog.old_data, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>
                        )}

                        {/* New Data */}
                        {activityLog.new_data && (
                            <Card className="border-green-200/50 dark:border-green-700/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                        <Database className="h-5 w-5" />
                                        Data Sesudahnya
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="bg-green-50/50 dark:bg-green-900/20 p-4 rounded-lg text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                                        {JSON.stringify(activityLog.new_data, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
