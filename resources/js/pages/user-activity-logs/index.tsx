import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import SidebarLayout from '@/layouts/sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, Search, Calendar, User, Filter } from 'lucide-react';

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
    ip_address: string;
    created_at: string;
}

interface Props {
    activityLogs: {
        data: ActivityLog[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    filters: {
        activity_type?: string;
        module?: string;
        user_id?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
    activityTypes: Record<string, string>;
    modules: Record<string, string>;
}

export default function UserActivityLogIndex({ activityLogs, filters, activityTypes, modules }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [activityType, setActivityType] = useState(filters.activity_type || 'all');
    const [module, setModule] = useState(filters.module || 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const breadcrumbItems: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Log Aktivitas Pengguna', href: '/user-activity-logs' },
    ];

    const handleSearch = () => {
        router.get('/user-activity-logs', {
            search: search || undefined,
            activity_type: (activityType && activityType !== 'all') ? activityType : undefined,
            module: (module && module !== 'all') ? module : undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setActivityType('all');
        setModule('all');
        setDateFrom('');
        setDateTo('');
        router.get('/user-activity-logs', {}, {
            preserveState: true,
            replace: true,
        });
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
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

    return (
        <SidebarLayout breadcrumbs={breadcrumbItems}>
            <Head title="Log Aktivitas Pengguna" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Log Aktivitas Pengguna</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Pantau dan kelola aktivitas pengguna sistem</p>
                    </div>
                </div>

                {/* Filter Card */}
                <Card className="border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Filter className="h-5 w-5" />
                            Filter & Pencarian
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Pencarian
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari aktivitas, pengguna..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Jenis Aktivitas
                                </label>
                                <Select value={activityType} onValueChange={setActivityType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis aktivitas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Jenis</SelectItem>
                                        {Object.entries(activityTypes).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Modul
                                </label>
                                <Select value={module} onValueChange={setModule}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih modul" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Modul</SelectItem>
                                        {Object.entries(modules).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Dari Tanggal
                                </label>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Sampai Tanggal
                                </label>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleSearch} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Search className="h-4 w-4 mr-2" />
                                Cari
                            </Button>
                            <Button variant="outline" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Card */}
                <Card className="border-blue-200/50 dark:border-blue-700/50">
                    <CardHeader>
                        <CardTitle className="text-gray-700 dark:text-gray-300">
                            Hasil: {activityLogs.total} aktivitas ditemukan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activityLogs.data.length > 0 ? (
                            <div className="space-y-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20">
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Waktu</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Pengguna</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Aktivitas</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Modul</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Deskripsi</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">IP Address</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activityLogs.data.map((log) => (
                                                <tr key={log.id} className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200">
                                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200 text-sm">
                                                        {formatDate(log.created_at)}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <div>
                                                            <div className="font-medium text-gray-800 dark:text-gray-200">{log.user.name}</div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">{log.user.email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Badge className={getActivityTypeBadge(log.activity_type)}>
                                                            {activityTypes[log.activity_type] || log.activity_type}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200 capitalize">
                                                        {modules[log.module] || log.module}
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                                        {log.description}
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm">
                                                        {log.ip_address}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                                            <Link href={`/user-activity-logs/${log.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {activityLogs.last_page > 1 && (
                                    <div className="flex justify-center items-center space-x-2 mt-6">
                                        {activityLogs.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                disabled={!link.url}
                                                className={link.active ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.visit(link.url);
                                                    }
                                                }}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-500 dark:text-gray-400">
                                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Tidak ada aktivitas yang ditemukan</p>
                                    <p className="text-sm mt-2">Coba ubah filter atau kriteria pencarian</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </SidebarLayout>
    );
}
