import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, MapPin, User } from 'lucide-react';

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
    qr_code: string | null;
    created_at: string;
    updated_at: string;
    anggotaKeluarga: AnggotaKeluarga[];
}

interface AnggotaKeluarga {
    id: number;
    no_urut: number;
    nama_lengkap: string;
    nik: string;
    jenis_kelamin: string | null;
    tempat_lahir: string | null;
    tanggal_lahir: string | null;
    agama: string | null;
    pendidikan: string | null;
    jenis_pekerjaan: string | null;
    golongan_darah: string | null;
    status_perkawinan: string | null;
    tanggal_perkawinan: string | null;
    status_hubungan_dalam_keluarga: string | null;
    kewarganegaraan: string | null;
    no_paspor: string | null;
    no_kitap: string | null;
    nama_ayah: string | null;
    nama_ibu: string | null;
}

interface Props {
    kartuKeluarga: KartuKeluarga;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kartu Keluarga',
        href: '/kartu-keluarga',
    },
    {
        title: 'Detail Kartu Keluarga',
        href: '/kartu-keluarga/show',
    },
];

export default function KartuKeluargaShow({ kartuKeluarga }: Props) {
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Kartu Keluarga - ${kartuKeluarga.no_kk}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between p-6 rounded-lg border border-blue-200/50 dark:border-purple-700/50 shadow-lg">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Detail Kartu Keluarga</h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200">
                            <Link href={`/kartu-keluarga/${kartuKeluarga.no_kk}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="outline" asChild className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200">
                            <Link href="/kartu-keluarga">Kembali</Link>
                        </Button>
                    </div>
                </div>
                
                <Card className="border-blue-200/50 dark:border-purple-700/50 shadow-xl">
                    <CardHeader className="border-b border-blue-200/50 dark:border-purple-700/50">
                        <CardTitle className="text-gray-800 dark:text-gray-200">Informasi Kartu Keluarga</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">Nomor KK</h3>
                                        <p className="text-gray-600">{kartuKeluarga.no_kk}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">Nama Kepala Keluarga</h3>
                                        <p className="text-gray-600">{kartuKeluarga.nama_kepala_keluarga}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">Alamat</h3>
                                        <p className="text-gray-600">{kartuKeluarga.alamat}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">RT/RW</h3>
                                        <p className="text-gray-600">{kartuKeluarga.rt_rw || '-'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">Kode Pos</h3>
                                        <p className="text-gray-600">{kartuKeluarga.kode_pos || '-'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">Desa/Kelurahan</h3>
                                        <p className="text-gray-600">{kartuKeluarga.desa_kelurahan || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">Kecamatan</h3>
                                        <p className="text-gray-600">{kartuKeluarga.kecamatan || '-'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">Kabupaten/Kota</h3>
                                        <p className="text-gray-600">{kartuKeluarga.kabupaten_kota || '-'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">Provinsi</h3>
                                        <p className="text-gray-600">{kartuKeluarga.provinsi || '-'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                    <div>
                                        <h3 className="font-medium">Tanggal Dikeluarkan</h3>
                                        <p className="text-gray-600">{formatDate(kartuKeluarga.tanggal_dikeluarkan)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-emerald-200/50 dark:border-emerald-700/50 shadow-xl">
                    <CardHeader className="border-b border-emerald-200/50 dark:border-emerald-700/50">
                        <CardTitle className="text-gray-800 dark:text-gray-200">Anggota Keluarga</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {kartuKeluarga.anggotaKeluarga && kartuKeluarga.anggotaKeluarga.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-emerald-200/50 dark:border-emerald-700/50 bg-gradient-to-r from-emerald-50/30 to-green-50/30 dark:from-emerald-900/20 dark:to-green-900/20">
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">No</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">NIK</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Nama Lengkap</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Jenis Kelamin</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Tanggal Lahir</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Status Hubungan</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kartuKeluarga.anggotaKeluarga.map((anggota) => (
                                            <tr key={anggota.id} className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-green-50/50 dark:hover:from-emerald-900/20 dark:hover:to-green-900/20 transition-all duration-200">
                                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{anggota.no_urut}</td>
                                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 font-mono text-sm">{anggota.nik}</td>
                                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 font-medium">{anggota.nama_lengkap}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        anggota.jenis_kelamin === 'LAKI-LAKI' 
                                                            ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200' 
                                                            : anggota.jenis_kelamin === 'PEREMPUAN'
                                                                ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border border-pink-200'
                                                                : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200'
                                                    }`}>
                                                        {anggota.jenis_kelamin === 'LAKI-LAKI' ? 'Laki-laki' : anggota.jenis_kelamin === 'PEREMPUAN' ? 'Perempuan' : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{formatDate(anggota.tanggal_lahir)}</td>
                                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{anggota.status_hubungan_dalam_keluarga || '-'}</td>
                                                <td className="px-4 py-2">
                                                    <Button variant="outline" size="sm" asChild className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-green-100 hover:border-emerald-300 transition-all duration-200">
                                                        <Link href={`/anggota-keluarga/${anggota.id}`}>Lihat</Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gradient-to-br from-emerald-50/30 to-green-50/30 dark:from-emerald-900/10 dark:to-green-900/10 rounded-lg border-2 border-dashed border-emerald-200/50 dark:border-emerald-700/50">
                                <div className="mb-4">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 rounded-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">Belum ada anggota keluarga.</p>
                                <Button asChild className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 border-0 shadow-md transition-all duration-200 hover:shadow-lg">
                                    <Link href={`/anggota-keluarga/create?no_kk=${kartuKeluarga.no_kk}`}>
                                        Tambah Anggota Keluarga
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}