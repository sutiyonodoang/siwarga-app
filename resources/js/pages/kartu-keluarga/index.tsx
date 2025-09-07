import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { ProtectedPage } from '@/components/protected-page';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kartu Keluarga',
        href: '/kartu-keluarga',
    },
];

interface KartuKeluarga {
    no_kk: string;
    nama_kepala_keluarga: string;
    alamat: string;
    rt_rw: string | null;
    kode_pos: string | null;
    desa_kelurahan: string | null;
    kecamatan: string | null;
    kabupaten_kota: string | null;
    provinsi: string | null;
    tanggal_dikeluarkan: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    kartuKeluarga: {
        data: KartuKeluarga[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function KartuKeluargaIndex({ kartuKeluarga, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get('/kartu-keluarga', {
            search: search || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };
    // Function to truncate text with ellipsis
    const truncateText = (text: string, maxLength: number = 30) => {
        if (!text) return '-';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Function to get full address
    const getFullAddress = (kk: KartuKeluarga) => {
        const parts = [
            kk.alamat,
            kk.rt_rw ? `RT/RW ${kk.rt_rw}` : null,
            kk.desa_kelurahan,
            kk.kecamatan,
            kk.kabupaten_kota,
            kk.provinsi,
            kk.kode_pos
        ].filter(Boolean);
        
        return parts.join(', ');
    };

    // Function to format date to dd mm yyyy
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        
        try {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            return '-';
        }
    };

    return (
        <ProtectedPage permission="kartu_keluarga_read">
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Kartu Keluarga" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between p-6 rounded-lg border border-blue-200/50 dark:border-purple-700/50 shadow-lg">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kartu Keluarga</h1>
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-md transition-all duration-200 hover:shadow-lg">
                        <Link href="/kartu-keluarga/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Data
                        </Link>
                    </Button>
                </div>
                
                <Card className="border-blue-200/50 dark:border-purple-700/50 shadow-xl">
                    <CardHeader className="border-b border-blue-200/50 dark:border-purple-700/50">
                        <CardTitle className="text-gray-800 dark:text-gray-200">Daftar Kartu Keluarga</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Search Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama kepala keluarga, nomor KK, atau alamat..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSearch} variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200">
                                <Search className="mr-2 h-4 w-4" />
                                Cari
                            </Button>
                        </div>

                        {kartuKeluarga.data.length > 0 ? (
                            <TooltipProvider>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-blue-200/50 dark:border-purple-700/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20">
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">No KK</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Kepala Keluarga</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Alamat</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">RT/RW</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Tanggal Dikeluarkan</th>
                                                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {kartuKeluarga.data.map((kk, index) => (
                                                <tr key={kk.no_kk} className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200">
                                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200 font-mono text-sm">{kk.no_kk}</td>
                                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200 font-medium">{kk.nama_kepala_keluarga}</td>
                                                    <td className="px-4 py-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="cursor-help hover:text-blue-600 dark:hover:text-purple-400 transition-colors text-gray-800 dark:text-gray-200">
                                                                    {truncateText(kk.alamat)}
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-sm bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                                                                <div className="text-sm">
                                                                    <p className="font-medium text-blue-800">Alamat Lengkap:</p>
                                                                    <p className="text-gray-700">{getFullAddress(kk)}</p>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{kk.rt_rw || '-'}</td>
                                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{formatDate(kk.tanggal_dikeluarkan)}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                                                <Link href={`/kartu-keluarga/${kk.no_kk}`}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                                                <Link href={`/kartu-keluarga/${kk.no_kk}/edit`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                type="button"
                                                                onClick={() => {
                                                                    if (confirm('Yakin ingin menghapus data ini?')) {
                                                                        router.delete(`/kartu-keluarga/${kk.no_kk}`);
                                                                    }
                                                                }}
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
                            </TooltipProvider>
                        ) : (
                            <div className="text-center py-12 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border-2 border-dashed border-blue-200/50 dark:border-purple-700/50">
                                <div className="mb-4">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center">
                                        <Plus className="w-8 h-8 text-blue-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">Belum ada data kartu keluarga.</p>
                                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-md transition-all duration-200 hover:shadow-lg">
                                    <Link href="/kartu-keluarga/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Kartu Keluarga Pertama
                                    </Link>
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {kartuKeluarga.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-200/50 dark:border-purple-700/50">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {((kartuKeluarga.current_page - 1) * kartuKeluarga.per_page) + 1} sampai{' '}
                                    {Math.min(kartuKeluarga.current_page * kartuKeluarga.per_page, kartuKeluarga.total)} dari{' '}
                                    {kartuKeluarga.total} hasil
                                </div>
                                <div className="flex gap-2">
                                    {kartuKeluarga.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className={link.active ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0' : 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}
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
        </AppLayout>
        </ProtectedPage>
    );
}