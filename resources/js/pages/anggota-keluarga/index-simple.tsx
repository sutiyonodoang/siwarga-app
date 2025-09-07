import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleLayout from '@/layouts/simple-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

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
    kartuKeluarga: {
        nama_kepala_keluarga: string;
    };
}

interface Props {
    anggotaKeluarga: AnggotaKeluarga[];
}

export default function AnggotaKeluargaIndex({ anggotaKeluarga }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number|null>(null);

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
        <SimpleLayout>
            <Head title="Anggota Keluarga" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Anggota Keluarga</h1>
                    <Button asChild>
                        <Link href="/anggota-keluarga/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Anggota Keluarga
                        </Link>
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Anggota Keluarga</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {anggotaKeluarga.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-2 text-left">No</th>
                                            <th className="px-4 py-2 text-left">NIK</th>
                                            <th className="px-4 py-2 text-left">Nama</th>
                                            <th className="px-4 py-2 text-left">No KK</th>
                                            <th className="px-4 py-2 text-left">Kepala Keluarga</th>
                                            <th className="px-4 py-2 text-left">Jenis Kelamin</th>
                                            <th className="px-4 py-2 text-left">Tanggal Lahir</th>
                                            <th className="px-4 py-2 text-left">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {anggotaKeluarga.map((anggota) => (
                                            <tr key={anggota.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-2">{anggota.no_urut}</td>
                                                <td className="px-4 py-2">{anggota.nik}</td>
                                                <td className="px-4 py-2">{anggota.nama_lengkap}</td>
                                                <td className="px-4 py-2">{anggota.no_kk}</td>
                                                <td className="px-4 py-2">{anggota.kartuKeluarga?.nama_kepala_keluarga || '-'}</td>
                                                <td className="px-4 py-2">{anggota.jenis_kelamin || '-'}</td>
                                                <td className="px-4 py-2">{anggota.tanggal_lahir || '-'}</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex space-x-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/anggota-keluarga/${anggota.id}`}>
                                                                Lihat
                                                            </Link>
                                                        </Button>
                                                        <Button 
                                                            variant="destructive" 
                                                            size="sm"
                                                            onClick={() => handleDelete(anggota.id)}
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    Belum ada data anggota keluarga.
                                </p>
                                <Button asChild className="mt-4">
                                    <Link href="/anggota-keluarga/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Anggota Keluarga
                                    </Link>
                                </Button>
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
        </SimpleLayout>
    );
}
