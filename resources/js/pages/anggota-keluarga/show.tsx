import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SidebarLayout from '@/layouts/sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, MapPin, User, Shield, Users, Home } from 'lucide-react';

interface AnggotaKeluarga {
    id: number;
    no_kk: string;
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
    // Atribut sosial survey - struktur sesuai database
    is_masyarakat_miskin: boolean;
    has_bpjs_kesehatan: boolean;
    status_bpjs_kesehatan_aktif: boolean;
    jenis_keanggotaan_bpjs: string | null;
    detail_nonpbi_bpjs: string | null;
    has_bpjs_ketenagakerjaan: boolean;
    has_e_ktp: boolean;
    kondisi_e_ktp: string | null;
    perlu_update_kk: boolean;
    has_akta_kelahiran: boolean;
    catatan_sosial: string | null;
}

interface Props {
    anggotaKeluarga: AnggotaKeluarga;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Warga Mukim',
        href: '/anggota-keluarga',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

export default function AnggotaKeluargaShow({ anggotaKeluarga }: Props) {
    return (
        <SidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Anggota Keluarga - ${anggotaKeluarga.nama_lengkap}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Detail Anggota Keluarga</h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200">
                            <Link href={`/anggota-keluarga/${anggotaKeluarga.id}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="outline" asChild className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200">
                            <Link href="/anggota-keluarga">Kembali</Link>
                        </Button>
                    </div>
                </div>
                
                <Tabs defaultValue="data-pribadi" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 border border-emerald-200/50 dark:border-emerald-700/50">
                        <TabsTrigger value="data-pribadi" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-50 data-[state=active]:to-green-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200">
                            <User className="h-4 w-4" />
                            Data Pribadi
                        </TabsTrigger>
                        <TabsTrigger value="data-keluarga" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-50 data-[state=active]:to-green-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200">
                            <Home className="h-4 w-4" />
                            Data Keluarga
                        </TabsTrigger>
                        <TabsTrigger value="status-sosial" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-50 data-[state=active]:to-green-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200">
                            <Shield className="h-4 w-4" />
                            Status Sosial
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="data-pribadi" className="space-y-4">
                        <Card className="bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 border-b border-emerald-200/50 dark:border-emerald-700/50">
                                <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
                                    <User className="h-5 w-5 mr-2 text-emerald-600" />
                                    Informasi Pribadi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">NIK</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.nik}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Nama Lengkap</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.nama_lengkap}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Jenis Kelamin</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.jenis_kelamin || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <MapPin className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Tempat Lahir</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.tempat_lahir || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <Calendar className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Tanggal Lahir</h3>
                                                <p className="text-gray-600">
                                                    {anggotaKeluarga.tanggal_lahir ? 
                                                        new Date(anggotaKeluarga.tanggal_lahir).toLocaleDateString('id-ID') : '-'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Agama</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.agama || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Pendidikan</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.pendidikan || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Jenis Pekerjaan</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.jenis_pekerjaan || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Golongan Darah</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.golongan_darah || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Status Perkawinan</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.status_perkawinan || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <Calendar className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Tanggal Perkawinan</h3>
                                                <p className="text-gray-600">
                                                    {anggotaKeluarga.tanggal_perkawinan ? 
                                                        new Date(anggotaKeluarga.tanggal_perkawinan).toLocaleDateString('id-ID') : '-'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Kewarganegaraan</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.kewarganegaraan || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="data-keluarga" className="space-y-4">
                        <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200/50 dark:border-blue-700/50">
                                <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
                                    <Home className="h-5 w-5 mr-2 text-blue-600" />
                                    Data Keluarga
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <Home className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">No KK</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.no_kk}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <Home className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">No Urut</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.no_urut}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <Users className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Status Hubungan dalam Keluarga</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.status_hubungan_dalam_keluarga || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Nama Ayah</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.nama_ayah || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Nama Ibu</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.nama_ibu || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">No Paspor</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.no_paspor || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <User className="h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">No KITAP</h3>
                                                <p className="text-gray-600">{anggotaKeluarga.no_kitap || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="status-sosial" className="space-y-4">
                        <Card className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Kolom Kiri */}
                                    <div className="space-y-4">
                                        {/* 1. Masyarakat Miskin */}
                                        <div>
                                            <p className="font-bold">Masyarakat Miskin</p>
                                            <p className="text-gray-600 ml-4">
                                                {anggotaKeluarga.is_masyarakat_miskin ? 'Ya' : 'Tidak'}
                                            </p>
                                        </div>

                                        {/* 2. BPJS Kesehatan */}
                                        <div>
                                            <p className="font-bold">BPJS Kesehatan</p>
                                            <div className="text-gray-600 space-y-1 ml-4">
                                                <p><span className="font-medium">Kepemilikan:</span> {anggotaKeluarga.has_bpjs_kesehatan ? 'Ya' : 'Tidak'}</p>
                                                {anggotaKeluarga.has_bpjs_kesehatan && (
                                                    <>
                                                        <p><span className="font-medium">Status:</span> {anggotaKeluarga.status_bpjs_kesehatan_aktif ? 'Aktif' : 'Tidak Aktif'}</p>
                                                        {anggotaKeluarga.status_bpjs_kesehatan_aktif && anggotaKeluarga.jenis_keanggotaan_bpjs && (
                                                            <>
                                                                <p><span className="font-medium">Jenis Keanggotaan:</span> {anggotaKeluarga.jenis_keanggotaan_bpjs === 'pbi' ? 'PBI' : 'Non-PBI'}</p>
                                                                {anggotaKeluarga.jenis_keanggotaan_bpjs === 'non-pbi' && anggotaKeluarga.detail_nonpbi_bpjs && (
                                                                    <p><span className="font-medium">Detail Non-PBI:</span> {
                                                                        anggotaKeluarga.detail_nonpbi_bpjs === 'PPU' ? 'PPU (Pekerja Penerima Upah)' :
                                                                        anggotaKeluarga.detail_nonpbi_bpjs === 'PBPU' ? 'PBPU (Pekerja Bukan Penerima Upah)' :
                                                                        anggotaKeluarga.detail_nonpbi_bpjs === 'BP' ? 'BP (Bukan Pekerja)' :
                                                                        anggotaKeluarga.detail_nonpbi_bpjs === 'PBI_DAERAH' ? 'PBI Daerah' :
                                                                        anggotaKeluarga.detail_nonpbi_bpjs === 'penerima-upah' ? 'Penerima Upah' :
                                                                        anggotaKeluarga.detail_nonpbi_bpjs === 'bukan-penerima-upah' ? 'Bukan Penerima Upah' :
                                                                        anggotaKeluarga.detail_nonpbi_bpjs
                                                                    }</p>
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* 3. BPJS Ketenagakerjaan */}
                                        <div>
                                            <p className="font-bold">BPJS Ketenagakerjaan</p>
                                            <p className="text-gray-600 ml-4">
                                                {anggotaKeluarga.has_bpjs_ketenagakerjaan ? 'Memiliki' : 'Tidak Memiliki'}
                                            </p>
                                        </div>

                                        {/* 4. E-KTP */}
                                        <div>
                                            <p className="font-bold">E-KTP</p>
                                            <div className="text-gray-600 space-y-1 ml-4">
                                                <p><span className="font-medium">Kepemilikan:</span> {anggotaKeluarga.has_e_ktp ? 'Sudah Memiliki' : 'Belum Memiliki'}</p>
                                                {anggotaKeluarga.has_e_ktp && anggotaKeluarga.kondisi_e_ktp && (
                                                    <p><span className="font-medium">Kondisi:</span> {
                                                        anggotaKeluarga.kondisi_e_ktp === 'baik' ? 'Baik' :
                                                        anggotaKeluarga.kondisi_e_ktp === 'rusak' ? 'Rusak' :
                                                        anggotaKeluarga.kondisi_e_ktp === 'hilang' ? 'Hilang' :
                                                        anggotaKeluarga.kondisi_e_ktp
                                                    }</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kolom Kanan */}
                                    <div className="space-y-4">
                                        {/* 5. Kartu Keluarga */}
                                        <div>
                                            <p className="font-bold">Kartu Keluarga</p>
                                            <p className="text-gray-600 ml-4">
                                                {anggotaKeluarga.perlu_update_kk ? 'Perlu Update' : 'Tidak Perlu Update'}
                                            </p>
                                        </div>

                                        {/* 6. Akta Kelahiran */}
                                        <div>
                                            <p className="font-bold">Akta Kelahiran</p>
                                            <p className="text-gray-600 ml-4">
                                                {anggotaKeluarga.has_akta_kelahiran ? 'Memiliki' : 'Tidak Memiliki'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {anggotaKeluarga.catatan_sosial && (
                                    <div className="border-t pt-6 mt-6">
                                        <div>
                                            <p className="font-bold mb-2">Catatan Sosial</p>
                                            <p className="text-gray-600 whitespace-pre-wrap ml-4">{anggotaKeluarga.catatan_sosial}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </SidebarLayout>
    );
}
