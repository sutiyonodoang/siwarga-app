import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, User, Home, Calendar, Phone } from 'lucide-react';
import SidebarLayout from '@/layouts/sidebar-layout';
import { RegionSelect } from '@/components/RegionSelect';
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
    alasan_kedatangan: string;
    nomor_telepon_darurat: string | null;
    nama_kontak_darurat: string | null;
    hubungan_kontak_darurat: string | null;
    status_aktif: boolean;
}

interface KartuKeluarga {
    no_kk: string;
    nama_kepala_keluarga: string;
}

interface Props {
    wargaMusiman: WargaMusiman;
    kartuKeluarga: KartuKeluarga[];
}

export default function Edit({ wargaMusiman, kartuKeluarga }: Props) {
    // Helper function to format date from dd-mm-yyyy to yyyy-mm-dd
    const formatDateForInput = (dateString: string | null): string => {
        if (!dateString) return '';
        try {
            // If it's already in yyyy-mm-dd format, return as is
            if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return dateString;
            }
            // If it's in dd-mm-yyyy format, convert to yyyy-mm-dd
            if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
                const [day, month, year] = dateString.split('-');
                return `${year}-${month}-${day}`;
            }
            // If it's a full datetime string, parse it
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
            return '';
        } catch {
            return '';
        }
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
        {
            title: 'Edit',
            href: `/warga-musiman/${wargaMusiman.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nama_lengkap: wargaMusiman.nama_lengkap,
        nik: wargaMusiman.nik,
        jenis_kelamin: wargaMusiman.jenis_kelamin,
        tempat_lahir: wargaMusiman.tempat_lahir,
        tanggal_lahir: formatDateForInput(wargaMusiman.tanggal_lahir),
        agama: wargaMusiman.agama,
        pendidikan: wargaMusiman.pendidikan || '',
        jenis_pekerjaan: wargaMusiman.jenis_pekerjaan || '',
        status_perkawinan: wargaMusiman.status_perkawinan,
        status_hubungan_dalam_keluarga: wargaMusiman.status_hubungan_dalam_keluarga,
        status_hubungan_custom: wargaMusiman.status_hubungan_custom || '',
        kewarganegaraan: wargaMusiman.kewarganegaraan,
        // Warga Musiman fields
        tanggal_mulai: formatDateForInput(wargaMusiman.tanggal_mulai),
        tanggal_selesai: formatDateForInput(wargaMusiman.tanggal_selesai),
        alamat_asal: wargaMusiman.alamat_asal,
        province_id: wargaMusiman.province_id || '',
        regency_id: wargaMusiman.regency_id || '',
        district_id: wargaMusiman.district_id || '',
        village_id: wargaMusiman.village_id || '',
        rt: wargaMusiman.rt || '',
        rw: wargaMusiman.rw || '',
        alasan_kedatangan: wargaMusiman.alasan_kedatangan,
        nomor_telepon_darurat: wargaMusiman.nomor_telepon_darurat || '',
        nama_kontak_darurat: wargaMusiman.nama_kontak_darurat || '',
        hubungan_kontak_darurat: wargaMusiman.hubungan_kontak_darurat || '',
        status_aktif: wargaMusiman.status_aktif,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/warga-musiman/${wargaMusiman.id}`);
    };

    return (
        <SidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Warga Musiman - ${wargaMusiman.nama_lengkap}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Edit Warga Musiman</h1>
                    <Button variant="outline" asChild className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200">
                        <Link href={`/warga-musiman/${wargaMusiman.id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="informasi-dasar" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-emerald-50 to-green-50 p-1 rounded-lg border border-emerald-200">
                            <TabsTrigger 
                                value="informasi-dasar" 
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300"
                            >
                                <User className="mr-2 h-4 w-4" />
                                Informasi Dasar
                            </TabsTrigger>
                            <TabsTrigger 
                                value="warga-musiman" 
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300"
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                Warga Musiman
                            </TabsTrigger>
                            <TabsTrigger 
                                value="alamat" 
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Alamat Asal
                            </TabsTrigger>
                            <TabsTrigger 
                                value="kontak-darurat" 
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300"
                            >
                                <Phone className="mr-2 h-4 w-4" />
                                Kontak Darurat
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="informasi-dasar" className="mt-6">
                            {/* Informasi Dasar */}
                            <Card className="bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 border-b border-emerald-200/50 dark:border-emerald-700/50 rounded-t-lg">
                                    <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
                                        <User className="h-5 w-5 mr-2 text-emerald-600" />
                                        Informasi Dasar
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Data pribadi warga musiman
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">{/* Existing informasi dasar content */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                                        <Input
                                            id="nama_lengkap"
                                            value={data.nama_lengkap}
                                            onChange={(e) => setData('nama_lengkap', e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                        />
                                        {errors.nama_lengkap && <p className="text-sm text-destructive">{errors.nama_lengkap}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nik">NIK</Label>
                                        <Input
                                            id="nik"
                                            value={data.nik}
                                            onChange={(e) => setData('nik', e.target.value)}
                                            placeholder="Masukkan NIK (16 digit)"
                                            maxLength={16}
                                        />
                                        {errors.nik && <p className="text-sm text-destructive">{errors.nik}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                        <Select value={data.jenis_kelamin} onValueChange={(value) => setData('jenis_kelamin', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LAKI-LAKI">Laki-laki</SelectItem>
                                                <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.jenis_kelamin && <p className="text-sm text-destructive">{errors.jenis_kelamin}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                        <Input
                                            id="tempat_lahir"
                                            value={data.tempat_lahir}
                                            onChange={(e) => setData('tempat_lahir', e.target.value)}
                                            placeholder="Masukkan tempat lahir"
                                        />
                                        {errors.tempat_lahir && <p className="text-sm text-destructive">{errors.tempat_lahir}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                        <Input
                                            id="tanggal_lahir"
                                            type="date"
                                            value={data.tanggal_lahir}
                                            onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                        />
                                        {errors.tanggal_lahir && <p className="text-sm text-destructive">{errors.tanggal_lahir}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="agama">Agama</Label>
                                        <Select value={data.agama} onValueChange={(value) => setData('agama', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih agama" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Islam">Islam</SelectItem>
                                                <SelectItem value="Kristen">Kristen</SelectItem>
                                                <SelectItem value="Katolik">Katolik</SelectItem>
                                                <SelectItem value="Hindu">Hindu</SelectItem>
                                                <SelectItem value="Buddha">Buddha</SelectItem>
                                                <SelectItem value="Konghucu">Konghucu</SelectItem>
                                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.agama && <p className="text-sm text-destructive">{errors.agama}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status_perkawinan">Status Perkawinan</Label>
                                        <Select value={data.status_perkawinan} onValueChange={(value) => setData('status_perkawinan', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status perkawinan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="belum_kawin">Belum Kawin</SelectItem>
                                                <SelectItem value="kawin">Kawin</SelectItem>
                                                <SelectItem value="cerai_hidup">Cerai Hidup</SelectItem>
                                                <SelectItem value="cerai_mati">Cerai Mati</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status_perkawinan && <p className="text-sm text-destructive">{errors.status_perkawinan}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status_hubungan_dalam_keluarga">Status Hubungan</Label>
                                        <Select value={data.status_hubungan_dalam_keluarga} onValueChange={(value) => {
                                            setData('status_hubungan_dalam_keluarga', value);
                                            // Clear custom field if not "lainnya"
                                            if (value !== 'lainnya') {
                                                setData('status_hubungan_custom', '');
                                            }
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status hubungan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="menantu">Menantu</SelectItem>
                                                <SelectItem value="cucu">Cucu</SelectItem>
                                                <SelectItem value="orang_tua">Orang Tua</SelectItem>
                                                <SelectItem value="mertua">Mertua</SelectItem>
                                                <SelectItem value="famili_lain">Famili Lain</SelectItem>
                                                <SelectItem value="pembantu">Pembantu</SelectItem>
                                                <SelectItem value="lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status_hubungan_dalam_keluarga && <p className="text-sm text-destructive">{errors.status_hubungan_dalam_keluarga}</p>}

                                        {data.status_hubungan_dalam_keluarga === 'lainnya' && (
                                            <div className="mt-2">
                                                <Label htmlFor="status_hubungan_custom">Status Hubungan Lainnya</Label>
                                                <Input
                                                    id="status_hubungan_custom"
                                                    value={data.status_hubungan_custom}
                                                    onChange={(e) => setData('status_hubungan_custom', e.target.value)}
                                                    placeholder="Masukkan status hubungan lainnya"
                                                    className="mt-1"
                                                />
                                                {errors.status_hubungan_custom && <p className="text-sm text-destructive">{errors.status_hubungan_custom}</p>}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kewarganegaraan">Kewarganegaraan</Label>
                                        <Select value={data.kewarganegaraan} onValueChange={(value) => setData('kewarganegaraan', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kewarganegaraan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="WNI">WNI</SelectItem>
                                                <SelectItem value="WNA">WNA</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.kewarganegaraan && <p className="text-sm text-destructive">{errors.kewarganegaraan}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        </TabsContent>

                        <TabsContent value="warga-musiman" className="mt-6">
                            {/* Informasi Warga Musiman */}
                            <Card className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-700/50 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 border-b border-purple-200/50 dark:border-purple-700/50 rounded-t-lg">
                                    <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
                                        <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                                        Informasi Warga Musiman
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Data khusus untuk warga musiman
                                    </CardDescription>
                                </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                                        <Input
                                            id="tanggal_mulai"
                                            type="date"
                                            value={data.tanggal_mulai}
                                            onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        />
                                        {errors.tanggal_mulai && <p className="text-sm text-destructive">{errors.tanggal_mulai}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                        <Input
                                            id="tanggal_selesai"
                                            type="date"
                                            value={data.tanggal_selesai}
                                            onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                        />
                                        {errors.tanggal_selesai && <p className="text-sm text-destructive">{errors.tanggal_selesai}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status_aktif">Status Aktif</Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="status_aktif"
                                                checked={Boolean(data.status_aktif)}
                                                onCheckedChange={(checked) => setData('status_aktif', checked === true)}
                                            />
                                            <Label htmlFor="status_aktif">
                                                {data.status_aktif ? 'Aktif' : 'Tidak Aktif'}
                                            </Label>
                                        </div>
                                        {errors.status_aktif && <p className="text-sm text-destructive">{errors.status_aktif}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        </TabsContent>

                        <TabsContent value="alamat" className="mt-6">
                            {/* Alamat Asal */}
                            <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border-b border-blue-200/50 dark:border-blue-700/50 rounded-t-lg">
                                    <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
                                        <Home className="h-5 w-5 mr-2 text-blue-600" />
                                        Alamat Asal
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Informasi alamat asal warga musiman
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Alamat Asal</Label>
                                    <RegionSelect
                                        onChange={(regionData) => {
                                            setData({
                                                ...data,
                                                province_id: regionData.province_id || '',
                                                regency_id: regionData.regency_id || '',
                                                district_id: regionData.district_id || '',
                                                village_id: regionData.village_id || '',
                                            });
                                        }}
                                        value={{
                                            province_id: data.province_id,
                                            regency_id: data.regency_id,
                                            district_id: data.district_id,
                                            village_id: data.village_id,
                                        }}
                                    />
                                    {errors.province_id && <p className="text-sm text-destructive">{errors.province_id}</p>}
                                    {errors.regency_id && <p className="text-sm text-destructive">{errors.regency_id}</p>}
                                    {errors.district_id && <p className="text-sm text-destructive">{errors.district_id}</p>}
                                    {errors.village_id && <p className="text-sm text-destructive">{errors.village_id}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rt">RT</Label>
                                        <Input
                                            id="rt"
                                            value={data.rt}
                                            onChange={(e) => setData('rt', e.target.value)}
                                            placeholder="Masukkan RT"
                                        />
                                        {errors.rt && <p className="text-sm text-destructive">{errors.rt}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rw">RW</Label>
                                        <Input
                                            id="rw"
                                            value={data.rw}
                                            onChange={(e) => setData('rw', e.target.value)}
                                            placeholder="Masukkan RW"
                                        />
                                        {errors.rw && <p className="text-sm text-destructive">{errors.rw}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alamat_asal">Detail Alamat</Label>
                                    <Textarea
                                        id="alamat_asal"
                                        value={data.alamat_asal}
                                        onChange={(e) => setData('alamat_asal', e.target.value)}
                                        placeholder="Masukkan detail alamat (nama jalan, nomor rumah, dll.)"
                                        rows={2}
                                    />
                                    {errors.alamat_asal && <p className="text-sm text-destructive">{errors.alamat_asal}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alasan_kedatangan">Alasan Kedatangan/Tinggal</Label>
                                    <Textarea
                                        id="alasan_kedatangan"
                                        value={data.alasan_kedatangan}
                                        onChange={(e) => setData('alasan_kedatangan', e.target.value)}
                                        placeholder="Masukkan alasan kedatangan/tinggal"
                                        rows={3}
                                    />
                                    {errors.alasan_kedatangan && <p className="text-sm text-destructive">{errors.alasan_kedatangan}</p>}
                                </div>
                            </CardContent>
                        </Card>
                        </TabsContent>

                        <TabsContent value="kontak-darurat" className="mt-6">
                            {/* Kontak Darurat */}
                            <Card className="bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-900 dark:to-orange-900/20 border-orange-200/50 dark:border-orange-700/50 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 border-b border-orange-200/50 dark:border-orange-700/50 rounded-t-lg">
                                    <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
                                        <Phone className="h-5 w-5 mr-2 text-orange-600" />
                                        Kontak Darurat
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Informasi kontak darurat warga musiman
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nomor_telepon_darurat">Nomor Telepon Darurat</Label>
                                        <Input
                                            id="nomor_telepon_darurat"
                                            value={data.nomor_telepon_darurat}
                                            onChange={(e) => setData('nomor_telepon_darurat', e.target.value)}
                                            placeholder="Masukkan nomor telepon darurat"
                                        />
                                        {errors.nomor_telepon_darurat && <p className="text-sm text-destructive">{errors.nomor_telepon_darurat}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nama_kontak_darurat">Nama Kontak Darurat</Label>
                                        <Input
                                            id="nama_kontak_darurat"
                                            value={data.nama_kontak_darurat}
                                            onChange={(e) => setData('nama_kontak_darurat', e.target.value)}
                                            placeholder="Masukkan nama kontak darurat"
                                        />
                                        {errors.nama_kontak_darurat && <p className="text-sm text-destructive">{errors.nama_kontak_darurat}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hubungan_kontak_darurat">Hubungan Kontak Darurat</Label>
                                        <Input
                                            id="hubungan_kontak_darurat"
                                            value={data.hubungan_kontak_darurat}
                                            onChange={(e) => setData('hubungan_kontak_darurat', e.target.value)}
                                            placeholder="Masukkan hubungan dengan kontak darurat"
                                        />
                                        {errors.hubungan_kontak_darurat && <p className="text-sm text-destructive">{errors.hubungan_kontak_darurat}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outline" asChild className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200">
                            <Link href={`/warga-musiman/${wargaMusiman.id}`}>Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0">
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}
