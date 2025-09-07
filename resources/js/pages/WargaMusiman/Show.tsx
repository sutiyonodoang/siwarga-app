import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, MapPin, Phone, User, Calendar, Home } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import SidebarLayout from '@/layouts/sidebar-layout';
import { type BreadcrumbItem } from '@/types';

interface WargaMusiman {
    id: number;
    no_kk: string;
    nama_lengkap: string;
    nik: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string;
    pendidikan: string | null;
    jenis_pekerjaan: string | null;
    status_perkawinan: string;
    status_hubungan_dalam_keluarga: string;
    status_hubungan_custom: string | null;
    kewarganegaraan: string;
    // Warga Musiman fields
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
    alasan_kedatangan: string;
    nomor_telepon_darurat: string | null;
    nama_kontak_darurat: string | null;
    hubungan_kontak_darurat: string | null;
    status_aktif: boolean;
    kartu_keluarga: {
        nama_kepala_keluarga: string;
        alamat: string;
    };
    creator: {
        name: string;
    };
    created_at: string;
}

interface Props {
    wargaMusiman: WargaMusiman;
}

export default function Show({ wargaMusiman }: Props) {
    const getJenisKelaminLabel = (jenis: string) => {
        return jenis === 'LAKI-LAKI' ? 'Laki-laki' : 'Perempuan';
    };

    const getStatusPerkawinanLabel = (status: string) => {
        const labels = {
            belum_kawin: 'Belum Kawin',
            kawin: 'Kawin',
            cerai_hidup: 'Cerai Hidup',
            cerai_mati: 'Cerai Mati',
        };
        return labels[status as keyof typeof labels] || status;
    };

    const getStatusHubunganLabel = (status: string, customStatus?: string | null) => {
        const labels = {
            menantu: 'Menantu',
            cucu: 'Cucu',
            orang_tua: 'Orang Tua',
            mertua: 'Mertua',
            famili_lain: 'Famili Lain',
            pembantu: 'Pembantu',
            lainnya: 'Lainnya',
        };
        if (status === 'lainnya' && customStatus) {
            return customStatus;
        }
        return labels[status as keyof typeof labels] || status;
    };

    const getKewarganegaraanLabel = (kewarganegaraan: string) => {
        return kewarganegaraan === 'WNI' ? 'Warga Negara Indonesia' : 'Warga Negara Asing';
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Warga Musiman',
            href: '/warga-musiman',
        },
        {
            title: wargaMusiman.nama_lengkap,
            href: `/warga-musiman/${wargaMusiman.id}`,
        },
    ];

    return (
        <SidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Warga Musiman - ${wargaMusiman.nama_lengkap}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Detail Warga Musiman</h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200">
                            <Link href={`/warga-musiman/${wargaMusiman.id}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="outline" asChild className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200">
                            <Link href="/warga-musiman">Kembali</Link>
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="informasi-dasar" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-emerald-50 to-green-50 p-1 rounded-lg border border-emerald-200">
                        <TabsTrigger 
                            value="informasi-dasar" 
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300"
                        >
                            <User className="mr-2 h-4 w-4" />
                            Informasi Dasar
                        </TabsTrigger>
                        <TabsTrigger 
                            value="kartu-keluarga" 
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Kartu Keluarga
                        </TabsTrigger>
                        <TabsTrigger 
                            value="warga-musiman" 
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300"
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            Warga Musiman
                        </TabsTrigger>
                        <TabsTrigger 
                            value="kontak-darurat" 
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300"
                        >
                            <Phone className="mr-2 h-4 w-4" />
                            Kontak Darurat
                        </TabsTrigger>
                        <TabsTrigger 
                            value="sistem" 
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300"
                        >
                            <MapPin className="mr-2 h-4 w-4" />
                            Sistem
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="informasi-dasar" className="mt-6">
                        {/* Informasi Dasar */}
                    <Card className="bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 border-b border-emerald-200/50 dark:border-emerald-700/50">
                            <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
                                <User className="h-5 w-5 mr-2 text-emerald-600" />
                                Informasi Dasar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                                    <p className="text-sm font-medium">{wargaMusiman.nama_lengkap}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">NIK</label>
                                    <p className="text-sm font-medium">{wargaMusiman.nik}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Jenis Kelamin</label>
                                    <p className="text-sm font-medium">{getJenisKelaminLabel(wargaMusiman.jenis_kelamin)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tempat, Tanggal Lahir</label>
                                    <p className="text-sm font-medium">
                                        {wargaMusiman.tempat_lahir}, {format(new Date(wargaMusiman.tanggal_lahir), 'dd MMMM yyyy', { locale: id })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Agama</label>
                                    <p className="text-sm font-medium">{wargaMusiman.agama}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status Perkawinan</label>
                                    <p className="text-sm font-medium">{getStatusPerkawinanLabel(wargaMusiman.status_perkawinan)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status Hubungan</label>
                                    <p className="text-sm font-medium">{getStatusHubunganLabel(wargaMusiman.status_hubungan_dalam_keluarga, wargaMusiman.status_hubungan_custom)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Kewarganegaraan</label>
                                    <p className="text-sm font-medium">{getKewarganegaraanLabel(wargaMusiman.kewarganegaraan)}</p>
                                </div>
                                {wargaMusiman.pendidikan && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Pendidikan</label>
                                        <p className="text-sm font-medium">{wargaMusiman.pendidikan}</p>
                                    </div>
                                )}
                                {wargaMusiman.jenis_pekerjaan && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Pekerjaan</label>
                                        <p className="text-sm font-medium">{wargaMusiman.jenis_pekerjaan}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    </TabsContent>

                    <TabsContent value="kartu-keluarga" className="mt-6">
                        {/* Informasi Kartu Keluarga */}
                        <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200/50 dark:border-blue-700/50">
                            <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
                                <Home className="h-5 w-5 mr-2 text-blue-600" />
                                Kartu Keluarga
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">No. KK</label>
                                    <p className="text-sm font-medium">{wargaMusiman.no_kk}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Kepala Keluarga</label>
                                    <p className="text-sm font-medium">{wargaMusiman.kartu_keluarga.nama_kepala_keluarga}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground">Alamat</label>
                                    <p className="text-sm font-medium">{wargaMusiman.kartu_keluarga.alamat}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    </TabsContent>

                    <TabsContent value="warga-musiman" className="mt-6">
                        {/* Informasi Warga Musiman */}
                        <Card className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-purple-50/50 to-violet-50/50 dark:from-purple-900/20 dark:to-violet-900/20 border-b border-purple-200/50 dark:border-purple-700/50">
                                <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
                                    <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                                Informasi Warga Musiman
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tanggal Mulai</label>
                                    <p className="text-sm font-medium">
                                        {format(new Date(wargaMusiman.tanggal_mulai), 'dd MMMM yyyy', { locale: id })}
                                    </p>
                                </div>
                                {wargaMusiman.tanggal_selesai && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Tanggal Selesai</label>
                                        <p className="text-sm font-medium">
                                            {format(new Date(wargaMusiman.tanggal_selesai), 'dd MMMM yyyy', { locale: id })}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <Badge variant={wargaMusiman.status_aktif ? 'default' : 'secondary'}>
                                        {wargaMusiman.status_aktif ? 'Aktif' : 'Tidak Aktif'}
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Alamat Asal</label>
                                    <div className="text-sm font-medium space-y-1">
                                        {wargaMusiman.alamat_asal && (
                                            <p>{wargaMusiman.alamat_asal}</p>
                                        )}
                                        {(wargaMusiman.rt || wargaMusiman.rw) && (
                                            <p>
                                                RT/RW: {wargaMusiman.rt || '-'} / {wargaMusiman.rw || '-'}
                                            </p>
                                        )}
                                        {wargaMusiman.village && (
                                            <p>Desa/Kelurahan: {wargaMusiman.village.name}</p>
                                        )}
                                        {wargaMusiman.district && (
                                            <p>Kecamatan: {wargaMusiman.district.name}</p>
                                        )}
                                        {wargaMusiman.regency && (
                                            <p>Kota/Kabupaten: {wargaMusiman.regency.name}</p>
                                        )}
                                        {wargaMusiman.province && (
                                            <p>Provinsi: {wargaMusiman.province.name}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Alasan Kedatangan/Tinggal</label>
                                    <p className="text-sm font-medium whitespace-pre-wrap">{wargaMusiman.alasan_kedatangan}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    </TabsContent>

                    <TabsContent value="kontak-darurat" className="mt-6">
                        {/* Kontak Darurat */}
                        {(wargaMusiman.nomor_telepon_darurat || wargaMusiman.nama_kontak_darurat) ? (
                            <Card className="bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-900 dark:to-orange-900/20 border-orange-200/50 dark:border-orange-700/50 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-900/20 dark:to-red-900/20 border-b border-orange-200/50 dark:border-orange-700/50">
                                    <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
                                        <Phone className="h-5 w-5 mr-2 text-orange-600" />
                                        Kontak Darurat
                                    </CardTitle>
                                </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {wargaMusiman.nomor_telepon_darurat && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Nomor Telepon</label>
                                            <p className="text-sm font-medium">{wargaMusiman.nomor_telepon_darurat}</p>
                                        </div>
                                    )}
                                    {wargaMusiman.nama_kontak_darurat && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Nama Kontak</label>
                                            <p className="text-sm font-medium">{wargaMusiman.nama_kontak_darurat}</p>
                                        </div>
                                    )}
                                    {wargaMusiman.hubungan_kontak_darurat && (
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-muted-foreground">Hubungan</label>
                                            <p className="text-sm font-medium">{wargaMusiman.hubungan_kontak_darurat}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        ) : (
                            <Card className="bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-900 dark:to-orange-900/20 border-orange-200/50 dark:border-orange-700/50 shadow-lg">
                                <CardContent className="text-center py-8">
                                    <Phone className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <p className="text-gray-500">Tidak ada informasi kontak darurat.</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="sistem" className="mt-6">
                        {/* Informasi Sistem */}
                        <Card className="bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/20 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-gray-800/20 dark:to-slate-800/20 border-b border-gray-200/50 dark:border-gray-700/50">
                                <CardTitle className="text-gray-800 dark:text-gray-200">
                                    Informasi Sistem
                                </CardTitle>
                            </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Dibuat Oleh</label>
                                    <p className="text-sm font-medium">{wargaMusiman.creator.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</label>
                                    <p className="text-sm font-medium">
                                        {format(new Date(wargaMusiman.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </SidebarLayout>
    );
}
