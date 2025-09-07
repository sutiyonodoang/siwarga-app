import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Edit, Trash2, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import SidebarLayout from '@/layouts/sidebar-layout';
import { ProtectedPage } from '@/components/protected-page';
import { usePermissions } from '@/hooks/use-permissions';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Warga Musiman',
        href: '/warga-musiman',
    },
];

interface WargaMusiman {
    id: number;
    no_kk: string;
    nama_lengkap: string;
    nik: string;
    tanggal_mulai: string;
    tanggal_selesai: string | null;
    alamat_asal: string;
    province_id: string | null;
    regency_id: string | null;
    district_id: string | null;
    village_id: string | null;
    rt: string | null;
    rw: string | null;
    province?: { name: string };
    regency?: { name: string };
    district?: { name: string };
    village?: { name: string };
    status_aktif: boolean;
    kartu_keluarga: {
        nama_kepala_keluarga: string;
    };
    created_at: string;
}

interface Props {
    wargaMusiman: {
        data: WargaMusiman[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    filters: {
        status?: string;
        search?: string;
    };
}

export default function Index({ wargaMusiman, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const { hasPermission } = usePermissions();

    const formatAddress = (warga: WargaMusiman) => {
        const parts = [];
        if (warga.province) parts.push(warga.province.name);
        if (warga.regency) parts.push(warga.regency.name);
        if (warga.district) parts.push(warga.district.name);
        if (warga.village) parts.push(warga.village.name);
        if (warga.rt || warga.rw) parts.push(`RT/RW: ${warga.rt || '-'}/${warga.rw || '-'}`);
        if (warga.alamat_asal) parts.push(warga.alamat_asal);
        return parts.join(', ');
    };

    const handleSearch = () => {
        router.get('/warga-musiman', {
            search: search || undefined,
            status: statusFilter === 'all' ? undefined : statusFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = () => {
        handleSearch();
    };

    const handleToggleStatus = (warga: WargaMusiman) => {
        if (confirm(`Apakah Anda yakin ingin ${warga.status_aktif ? 'nonaktifkan' : 'aktifkan'} warga musiman ini?`)) {
            router.patch(`/warga-musiman/${warga.id}/toggle-status`, {}, {
                preserveState: true,
            });
        }
    };

    const handleDelete = (warga: WargaMusiman) => {
        if (confirm('Apakah Anda yakin ingin menghapus warga musiman ini?')) {
            router.delete(`/warga-musiman/${warga.id}`, {
                preserveState: true,
            });
        }
    };

    return (
        <ProtectedPage permission="warga_musiman_read">
            <SidebarLayout breadcrumbs={breadcrumbs}>
                <Head title="Warga Musiman" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <div className="flex items-center justify-between p-6 rounded-lg border border-green-200/50 dark:border-green-700/50 shadow-lg">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                Warga Musiman
                            </h1>
                        </div>
                        <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0 shadow-md transition-all duration-200 hover:shadow-lg">
                            <Link href="/warga-musiman/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Data
                            </Link>
                        </Button>
                    </div>

                    <Card className="border-green-200/50 dark:border-green-700/50 shadow-xl">
                        <CardHeader className="border-b border-green-200/50 dark:border-green-700/50">
                            <CardTitle className="text-gray-800 dark:text-gray-200">Daftar Warga Musiman</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari nama, NIK, atau alamat asal..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <Select value={statusFilter} onValueChange={(value: string) => {
                                    setStatusFilter(value);
                                    setTimeout(handleFilterChange, 0);
                                }}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="1">Aktif</SelectItem>
                                        <SelectItem value="0">Tidak Aktif</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleSearch} variant="outline" className="hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all duration-200">
                                    <Search className="mr-2 h-4 w-4" />
                                    Cari
                                </Button>
                            </div>

                            {wargaMusiman.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-green-200/50 dark:border-green-700/50 bg-gradient-to-r from-green-50/30 to-blue-50/30 dark:from-green-900/20 dark:to-blue-900/20">
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">No</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Nama Lengkap</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Alamat Asal</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Tanggal Mulai</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                                <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wargaMusiman.data.map((warga, index) => (
                                                <tr key={warga.id} className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-blue-50/50 dark:hover:from-green-900/20 dark:hover:to-blue-900/20 transition-all duration-200">
                                                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">
                                                        {(wargaMusiman.current_page - 1) * wargaMusiman.per_page + index + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <div className="font-medium text-gray-800 dark:text-gray-200">
                                                                {warga.nama_lengkap}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                                {warga.nik}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1 text-gray-800 dark:text-gray-200">
                                                            <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                            <span 
                                                                className="max-w-xs truncate cursor-default" 
                                                                title={formatAddress(warga)}
                                                            >
                                                                {formatAddress(warga) || '-'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                                                        {format(new Date(warga.tanggal_mulai), 'dd/MM/yyyy', { locale: id })}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            warga.status_aktif
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                        }`}>
                                                            {warga.status_aktif ? 'Aktif' : 'Tidak Aktif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-center gap-1">
                                                            <Button variant="outline" size="sm" className="hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                                                <Link href={`/warga-musiman/${warga.id}`}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            {hasPermission('warga_musiman_edit') && (
                                                                <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                                                    <Link href={`/warga-musiman/${warga.id}/edit`}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleToggleStatus(warga)}
                                                                className="hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                {warga.status_aktif ? (
                                                                    <ToggleRight className="h-4 w-4" />
                                                                ) : (
                                                                    <ToggleLeft className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDelete(warga)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gradient-to-br from-green-50/30 to-blue-50/30 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg border-2 border-dashed border-green-200/50 dark:border-green-700/50">
                                    <div className="mb-4">
                                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 rounded-full flex items-center justify-center">
                                            <Plus className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
                                        Belum ada data warga musiman.
                                    </p>
                                    <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0 shadow-md transition-all duration-200 hover:shadow-lg">
                                        <Link href="/warga-musiman/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Warga Musiman
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            {/* Pagination */}
                            {wargaMusiman.last_page > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-green-200/50 dark:border-green-700/50">
                                    <div className="text-sm text-muted-foreground">
                                        Menampilkan {((wargaMusiman.current_page - 1) * wargaMusiman.per_page) + 1} sampai{' '}
                                        {Math.min(wargaMusiman.current_page * wargaMusiman.per_page, wargaMusiman.total)} dari{' '}
                                        {wargaMusiman.total} hasil
                                    </div>
                                    <div className="flex gap-2">
                                        {wargaMusiman.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                className={link.active ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0' : 'hover:bg-green-50 hover:text-green-600 hover:border-green-300'}
                                            >
                                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </SidebarLayout>
        </ProtectedPage>
    );
}
