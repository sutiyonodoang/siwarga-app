import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RegionSelect } from '@/components/RegionSelect';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

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
        title: 'Tambah Data',
        href: '/kartu-keluarga/create',
    },
];

export default function KartuKeluargaCreate() {
    const { data, setData, post, processing, errors } = useForm({
        no_kk: '',
        nama_kepala_keluarga: '',
        alamat: '',
        rt_rw: '',
        provinsi: '',
        kabupaten_kota: '',
        kecamatan: '',
        desa_kelurahan: '',
        kode_pos: '',
        tanggal_dikeluarkan: '',
        qr_code: '',
        province_id: '',
        regency_id: '',
        district_id: '',
        village_id: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Form data being submitted:', data);
        console.log('Processing state:', processing);
        console.log('Current errors:', errors);
        
        post(route('kartu-keluarga.store'), {
            onStart: () => {
                console.log('Form submission started');
            },
            onSuccess: (page) => {
                console.log('Form submission successful:', page);
                // Redirect akan dilakukan otomatis oleh Inertia
            },
            onError: (errors) => {
                console.log('Form submission errors:', errors);
            },
            onFinish: () => {
                console.log('Form submission finished');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Data" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between p-6 rounded-lg border border-blue-200/50 dark:border-purple-700/50 shadow-lg">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tambah Data</h1>
                    <Button variant="outline" asChild className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200">
                        <Link href="/kartu-keluarga">Kembali</Link>
                    </Button>
                </div>
                
                <Card className="border-blue-200/50 dark:border-purple-700/50 shadow-xl">
                    <CardHeader className="border-b border-blue-200/50 dark:border-purple-700/50">
                        <CardTitle className="text-gray-800 dark:text-gray-200">Form Tambah Kartu Keluarga</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="no_kk">Nomor KK</Label>
                                    <Input
                                        id="no_kk"
                                        type="text"
                                        pattern="[0-9]{16}"
                                        maxLength={16}
                                        value={data.no_kk}
                                        onChange={(e) => {
                                            // Only allow numbers
                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                            setData('no_kk', value);
                                        }}
                                        onInput={(e) => {
                                            // Additional validation on input
                                            const target = e.target as HTMLInputElement;
                                            const value = target.value;
                                            
                                            if (value.length > 0 && value.length < 16) {
                                                target.setCustomValidity(`Nomor KK harus 16 digit (saat ini ${value.length} digit)`);
                                            } else if (value.length === 16) {
                                                target.setCustomValidity('');
                                            } else if (value.length === 0) {
                                                target.setCustomValidity('Nomor KK harus diisi');
                                            }
                                        }}
                                        placeholder="Masukkan 16 digit nomor KK"
                                        required
                                    />
                                    <div className="text-xs text-gray-500">
                                        Format: 16 digit angka (contoh: 1234567890123456)
                                    </div>
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
                                        province_id: data.province_id,
                                        regency_id: data.regency_id,
                                        district_id: data.district_id,
                                        village_id: data.village_id,
                                    }}
                                    onChange={(value) => {
                                        console.log('RegionSelect onChange:', value);
                                        setData(prev => ({
                                            ...prev,
                                            province_id: value.province_id || '',
                                            provinsi: value.province_name || '',
                                            regency_id: value.regency_id || '',
                                            kabupaten_kota: value.regency_name || '',
                                            district_id: value.district_id || '',
                                            kecamatan: value.district_name || '',
                                            village_id: value.village_id || '',
                                            desa_kelurahan: value.village_name || '',
                                        }));
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
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
