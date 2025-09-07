import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SidebarLayout from '@/layouts/sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { ProtectedPage } from '@/components/protected-page';
import { usePermissions } from '@/hooks/use-permissions';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Warga Mukim',
        href: '/anggota-keluarga',
    },
];

interface AnggotaKeluarga {
    id: number;
    no_kk: string;
    no_urut: number;
    nama_lengkap: string;
    nik: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string;
    pendidikan: string;
    jenis_pekerjaan: string;
    golongan_darah: string;
    status_perkawinan: string;
    tanggal_perkawinan: string;
    status_hubungan_dalam_keluarga: string;
    kewarganegaraan: string;
    no_paspor: string;
    no_kitap: string;
    nama_ayah: string;
    nama_ibu: string;
    has_e_ktp: boolean;
    kondisi_e_ktp: string;
}

interface Props {
    anggotaKeluarga: {
        data: AnggotaKeluarga[];
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

export default function AnggotaKeluargaIndex({ anggotaKeluarga, filters }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number|null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const { hasPermission } = usePermissions();

    const handleSearch = () => {
        router.get('/anggota-keluarga', {
            search: search || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Format tanggal dari YYYY-MM-DD ke DD MM YYYY
    const formatTanggal = (tanggal: string | null): string => {
        if (!tanggal) return '-';
        try {
            const date = new Date(tanggal);
            if (isNaN(date.getTime())) return tanggal; // Return original if invalid
            
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            
            return `${day} ${month} ${year}`;
        } catch {
            return tanggal || '-';
        }
    };

    const truncateText = (text: string, maxLength: number = 15): string => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const calculateAge = (birthDate: string): string => {
        if (!birthDate) return '-';
        try {
            const birth = new Date(birthDate);
            const today = new Date();
            
            if (isNaN(birth.getTime())) return '-';
            
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            
            return age.toString() + ' tahun';
        } catch {
            return '-';
        }
    };

    const formatStatusEKTP = (hasEKTP: boolean, kondisiEKTP: string): string => {
        if (!hasEKTP) return 'Belum Ada';
        if (!kondisiEKTP) return 'Ada';
        return kondisiEKTP;
    };

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (selectedId) {
            router.delete(`/anggota-keluarga/${selectedId}`);
        }
        setConfirmOpen(false);
        setSelectedId(null);
    };

    const cancelDelete = () => {
        setConfirmOpen(false);
        setSelectedId(null);
    };

    return (
        <ProtectedPage permission="anggota_keluarga_read">
            <SidebarLayout breadcrumbs={breadcrumbs}>
                <Head title="Warga Mukim" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between p-6 rounded-lg border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Warga Mukim
                        </h1>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-md transition-all duration-200 hover:shadow-lg">
                        <Link href="/anggota-keluarga/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Data
                        </Link>
                    </Button>
                </div>
                
                <Card className="border-blue-200/50 dark:border-blue-700/50 shadow-xl">
                    <CardHeader className="border-b border-blue-200/50 dark:border-blue-700/50">
                        <CardTitle className="text-gray-800 dark:text-gray-200">Daftar Anggota Keluarga Warga Mukim</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Search Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama, NIK, atau nomor KK..."
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

                        {anggotaKeluarga.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20">
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">No</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">No KK/NIK</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Nama</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Jenis Kelamin</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Tanggal Lahir</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Usia</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Status eKTP</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {anggotaKeluarga.data.map((anggota, index) => (
                                            <tr key={anggota.id} className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200">
                                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{(anggotaKeluarga.current_page - 1) * anggotaKeluarga.per_page + index + 1}</td>
                                                <td className="px-4 py-2">
                                                    <div>
                                                        <div className="font-medium text-gray-800 dark:text-gray-200 font-mono text-sm">
                                                            {anggota.no_kk}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                            {anggota.nik}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 font-medium">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="cursor-help">
                                                                    {truncateText(anggota.nama_lengkap)}
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{anggota.nama_lengkap}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        anggota.jenis_kelamin === 'LAKI-LAKI' 
                                                            ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200' 
                                                            : anggota.jenis_kelamin === 'PEREMPUAN'
                                                                ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border border-pink-200'
                                                                : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200'
                                                    }`}>
                                                        {anggota.jenis_kelamin === 'LAKI-LAKI' ? 'Laki-laki' : anggota.jenis_kelamin === 'PEREMPUAN' ? 'Perempuan' : anggota.jenis_kelamin || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{formatTanggal(anggota.tanggal_lahir)}</td>
                                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 font-medium">{calculateAge(anggota.tanggal_lahir)}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        anggota.has_e_ktp 
                                                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
                                                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
                                                    }`}>
                                                        {formatStatusEKTP(anggota.has_e_ktp, anggota.kondisi_e_ktp)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                                            <Link href={`/anggota-keluarga/${anggota.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        {hasPermission('anggota_keluarga_edit') && (
                                                            <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                                                <Link href={`/anggota-keluarga/${anggota.id}/edit`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(anggota.id)}
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
                            <div className="text-center py-12 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border-2 border-dashed border-blue-200/50 dark:border-blue-700/50">
                                <div className="mb-4">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center">
                                        <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
                                    Belum ada data anggota keluarga.
                                </p>
                                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-md transition-all duration-200 hover:shadow-lg">
                                    <Link href="/anggota-keluarga/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Anggota Keluarga
                                    </Link>
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {anggotaKeluarga.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-200/50 dark:border-blue-700/50">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {((anggotaKeluarga.current_page - 1) * anggotaKeluarga.per_page) + 1} sampai{' '}
                                    {Math.min(anggotaKeluarga.current_page * anggotaKeluarga.per_page, anggotaKeluarga.total)} dari{' '}
                                    {anggotaKeluarga.total} hasil
                                </div>
                                <div className="flex gap-2">
                                    {anggotaKeluarga.links.map((link, index) => (
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
            
            <ConfirmDialog
                open={confirmOpen}
                title="Konfirmasi Hapus"
                description="Yakin ingin menghapus anggota keluarga ini?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </SidebarLayout>
        </ProtectedPage>
    );
}
