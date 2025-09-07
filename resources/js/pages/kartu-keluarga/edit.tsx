
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RegionSelect } from '@/components/RegionSelect';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

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
    province_id?: string | number | null;
    regency_id?: string | number | null;
    district_id?: string | number | null;
    village_id?: string | number | null;
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
        title: 'Edit Kartu Keluarga',
        href: '/kartu-keluarga/edit',
    },
];

export default function KartuKeluargaEdit({ kartuKeluarga }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        no_kk: kartuKeluarga.no_kk,
        nama_kepala_keluarga: kartuKeluarga.nama_kepala_keluarga,
        alamat: kartuKeluarga.alamat,
        rt_rw: kartuKeluarga.rt_rw || '',
        provinsi: kartuKeluarga.provinsi || '',
        kabupaten_kota: kartuKeluarga.kabupaten_kota || '',
        kecamatan: kartuKeluarga.kecamatan || '',
        desa_kelurahan: kartuKeluarga.desa_kelurahan || '',
        kode_pos: kartuKeluarga.kode_pos || '',
        // Extract date part from ISO string for date input
        tanggal_dikeluarkan: kartuKeluarga.tanggal_dikeluarkan ? kartuKeluarga.tanggal_dikeluarkan.split('T')[0] : '',
        qr_code: kartuKeluarga.qr_code || '',
        // Preserve original values as strings
        province_id: kartuKeluarga.province_id ? String(kartuKeluarga.province_id) : '',
        regency_id: kartuKeluarga.regency_id ? String(kartuKeluarga.regency_id) : '',
        district_id: kartuKeluarga.district_id ? String(kartuKeluarga.district_id) : '',
        village_id: kartuKeluarga.village_id ? String(kartuKeluarga.village_id) : '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/kartu-keluarga/${kartuKeluarga.no_kk}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Kartu Keluarga - ${kartuKeluarga.no_kk}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between p-6 rounded-lg border border-blue-200/50 dark:border-purple-700/50 shadow-lg">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Edit Kartu Keluarga</h1>
                    <Button variant="outline" asChild className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200">
                        <Link href="/kartu-keluarga">Kembali</Link>
                    </Button>
                </div>
                
                <Card className="border-blue-200/50 dark:border-purple-700/50 shadow-xl">
                    <CardHeader className="border-b border-blue-200/50 dark:border-purple-700/50">
                        <CardTitle className="text-gray-800 dark:text-gray-200">Form Edit Kartu Keluarga</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="no_kk">Nomor KK</Label>
                                    <Input
                                        id="no_kk"
                                        value={data.no_kk}
                                        onChange={(e) => setData('no_kk', e.target.value)}
                                        required
                                        readOnly
                                    />
                                    {errors.no_kk && <div className="text-red-500 text-sm">{errors.no_kk}</div>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="nama_kepala_keluarga">Nama Kepala Keluarga</Label>
                                    <Input
                                        id="nama_kepala_keluarga"
                                        value={data.nama_kepala_keluarga}
                                        onChange={(e) => setData('nama_kepala_keluarga', e.target.value)}
                                        required
                                    />
                                    {errors.nama_kepala_keluarga && <div className="text-red-500 text-sm">{errors.nama_kepala_keluarga}</div>}
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Input
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        required
                                    />
                                    {errors.alamat && <div className="text-red-500 text-sm">{errors.alamat}</div>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="rt_rw">RT/RW</Label>
                                    <Input
                                        id="rt_rw"
                                        value={data.rt_rw}
                                        onChange={(e) => setData('rt_rw', e.target.value)}
                                    />
                                    {errors.rt_rw && <div className="text-red-500 text-sm">{errors.rt_rw}</div>}
                                </div>
                                
                                <RegionSelect
                                    value={{
                                        province_id: data.province_id && data.province_id !== '' ? String(data.province_id) : undefined,
                                        regency_id: data.regency_id && data.regency_id !== '' ? String(data.regency_id) : undefined,
                                        district_id: data.district_id && data.district_id !== '' ? String(data.district_id) : undefined,
                                        village_id: data.village_id && data.village_id !== '' ? String(data.village_id) : undefined,
                                    }}
                                    onChange={(value) => {
                                        setData({
                                            ...data,
                                            province_id: value.province_id || '',
                                            provinsi: value.province_name || '',
                                            regency_id: value.regency_id || '',
                                            kabupaten_kota: value.regency_name || '',
                                            district_id: value.district_id || '',
                                            kecamatan: value.district_name || '',
                                            village_id: value.village_id || '',
                                            desa_kelurahan: value.village_name || '',
                                        });
                                    }}
                                />
                                
                                <div className="space-y-2">
                                    <Label htmlFor="kode_pos">Kode Pos</Label>
                                    <Input
                                        id="kode_pos"
                                        value={data.kode_pos}
                                        onChange={(e) => setData('kode_pos', e.target.value)}
                                    />
                                    {errors.kode_pos && <div className="text-red-500 text-sm">{errors.kode_pos}</div>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_dikeluarkan">Tanggal Dikeluarkan</Label>
                                    <Input
                                        id="tanggal_dikeluarkan"
                                        type="date"
                                        value={data.tanggal_dikeluarkan}
                                        onChange={(e) => setData('tanggal_dikeluarkan', e.target.value)}
                                    />
                                    {errors.tanggal_dikeluarkan && <div className="text-red-500 text-sm">{errors.tanggal_dikeluarkan}</div>}
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" asChild className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200">
                                    <Link href="/kartu-keluarga">Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-md transition-all duration-200 hover:shadow-lg">
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}