import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobileVariant } from '@/hooks/use-small-mobile';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface KartuKeluarga {
    no_kk: string;
    nama_kepala_keluarga: string;
}

interface Props {
    kartuKeluarga: KartuKeluarga[];
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
        title: 'Tambah Warga Mukim',
        href: '/anggota-keluarga/create',
    },
];

export default function AnggotaKeluargaCreate({ kartuKeluarga }: Props) {
    const { isSmallMobile, isMobile, isSmallMode, deviceType } = useIsMobileVariant();
    const useSmallLayout = isSmallMobile || (isSmallMode && !isMobile);
    
    // State untuk search di combobox
    const [query, setQuery] = useState('');
    const [selectedKK, setSelectedKK] = useState<KartuKeluarga | null>(null);
    
    // Filter kartu keluarga berdasarkan query
    const filteredKartuKeluarga = query === ''
        ? kartuKeluarga
        : kartuKeluarga.filter((kk) =>
            kk.no_kk.toLowerCase().includes(query.toLowerCase()) ||
            kk.nama_kepala_keluarga.toLowerCase().includes(query.toLowerCase())
        );
    
    const { data, setData, post, processing, errors } = useForm({
        // Data Pribadi
        no_kk: '',
        no_urut: 0,
        nama_lengkap: '',
        nik: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        agama: '',
        pendidikan: '',
        jenis_pekerjaan: '',
        golongan_darah: '',
        status_perkawinan: '',
        tanggal_perkawinan: '',
        status_hubungan_dalam_keluarga: '',
        status_hubungan_custom: '',
        kewarganegaraan: '',
        no_paspor: '',
        no_kitap: '',
        nama_ayah: '',
        nama_ibu: '',
        
        // Atribut Sosial - Struktur Baru
        is_masyarakat_miskin: false,
        has_bpjs_kesehatan: false,
        status_bpjs_kesehatan: '',
        jenis_bpjs_kesehatan: '',
        detail_nonpbi_bpjs: '',
        is_bpjs_kesehatan_aktif: false,
        has_bpjs_ketenagakerjaan: false,
        status_e_ktp: '',
        status_kk_update: '',
        has_akta_kelahiran: false,
        catatan_sosial: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/anggota-keluarga');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Anggota Keluarga" />
            <div 
                className={`
                    flex h-full flex-1 flex-col gap-4 rounded-xl overflow-x-auto
                    ${useSmallLayout ? 'p-2' : 'p-4'}
                `}
                data-device-type={deviceType}
                data-small-mode={isSmallMode}
            >
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200/50 dark:border-green-700/50 shadow-sm">
                    <h1 className={`font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ${useSmallLayout ? 'text-lg' : 'text-2xl'}`}>
                        Tambah Anggota Keluarga
                    </h1>
                    <Button variant="outline" asChild size={useSmallLayout ? 'sm' : 'default'} className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200">
                        <Link href="/anggota-keluarga">Kembali</Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-900/20 border-green-200/50 dark:border-green-700/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-200/50 dark:border-green-700/50">
                            <CardTitle className={`text-gray-800 dark:text-gray-200 ${useSmallLayout ? 'text-lg' : ''}`}>Form Anggota Keluarga</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="pribadi" className="w-full">
                                <TabsList className={`grid w-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 border border-green-200/50 dark:border-green-700/50 ${useSmallLayout ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                    <TabsTrigger value="pribadi" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-50 data-[state=active]:to-emerald-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200 ${useSmallLayout ? 'text-xs' : ''}`}>
                                        Data Pribadi
                                    </TabsTrigger>
                                    <TabsTrigger value="keluarga" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-50 data-[state=active]:to-emerald-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200 ${useSmallLayout ? 'text-xs' : ''}`}>
                                        Data Keluarga
                                    </TabsTrigger>
                                    {!useSmallLayout ? (
                                        <TabsTrigger value="sosial" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-50 data-[state=active]:to-emerald-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200">
                                            Atribut Sosial
                                        </TabsTrigger>
                                    ) : (
                                        <TabsTrigger value="sosial" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-50 data-[state=active]:to-emerald-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200">
                                            Sosial
                                        </TabsTrigger>
                                    )}
                                </TabsList>

                                <TabsContent value="pribadi" className="space-y-4">
                                    <div className={`grid gap-4 ${useSmallLayout ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div className="space-y-2 relative">
                                            <Label htmlFor="no_kk" className={useSmallLayout ? 'text-sm' : ''}>Nomor KK *</Label>
                                            <div className="relative">
                                                <Combobox 
                                                    value={selectedKK} 
                                                    onChange={(value) => {
                                                        setSelectedKK(value);
                                                        setData('no_kk', value ? value.no_kk : '');
                                                    }}
                                                >
                                                    <div className="relative w-full">
                                                        <Combobox.Input
                                                            className={`w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 truncate ${useSmallLayout ? 'h-8 text-sm' : ''}`}
                                                            displayValue={(kk: KartuKeluarga) => {
                                                                if (!kk) return '';
                                                                const maxLength = useSmallLayout ? 25 : 35;
                                                                const fullText = `${kk.no_kk} - ${kk.nama_kepala_keluarga}`;
                                                                return fullText.length > maxLength 
                                                                    ? fullText.substring(0, maxLength) + '...' 
                                                                    : fullText;
                                                            }}
                                                            onChange={(event) => setQuery(event.target.value)}
                                                            placeholder="Cari nomor KK atau nama kepala keluarga..."
                                                        />
                                                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <ChevronUpDownIcon
                                                                className="h-5 w-5 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                        </Combobox.Button>
                                                    </div>
                                                    <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full max-w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700 left-0 right-0">
                                                        {filteredKartuKeluarga.length === 0 && query !== '' ? (
                                                            <div className="relative cursor-default select-none py-2 px-4 text-gray-500 dark:text-gray-400">
                                                                Tidak ada data yang ditemukan.
                                                            </div>
                                                        ) : (
                                                            filteredKartuKeluarga.map((kk) => (
                                                                <Combobox.Option
                                                                    key={kk.no_kk}
                                                                    className={({ active }) =>
                                                                        `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${
                                                                            active 
                                                                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 dark:from-green-900/50 dark:to-emerald-900/50 dark:text-green-100' 
                                                                                : 'text-gray-900 dark:text-gray-100'
                                                                        }`
                                                                    }
                                                                    value={kk}
                                                                >
                                                                    {({ selected, active }) => (
                                                                        <>
                                                                            <span className="block truncate">
                                                                                <span className="font-mono text-sm font-medium">{kk.no_kk}</span>
                                                                                <span className="text-gray-500 dark:text-gray-400 ml-2">- {kk.nama_kepala_keluarga}</span>
                                                                            </span>
                                                                            {selected ? (
                                                                                <span
                                                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                                                        active ? 'text-green-700 dark:text-green-200' : 'text-green-600 dark:text-green-400'
                                                                                    }`}
                                                                                >
                                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                </span>
                                                                            ) : null}
                                                                        </>
                                                                    )}
                                                                </Combobox.Option>
                                                            ))
                                                        )}
                                                    </Combobox.Options>
                                                </Combobox>
                                            </div>
                                            {errors.no_kk && <p className="text-red-500 text-sm">{errors.no_kk}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="no_urut" className={useSmallLayout ? 'text-sm' : ''}>Nomor Urut *</Label>
                                            <Input
                                                id="no_urut"
                                                type="number"
                                                value={data.no_urut}
                                                onChange={(e) => setData('no_urut', parseInt(e.target.value) || 0)}
                                                placeholder="Nomor urut anggota keluarga"
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.no_urut && <p className="text-red-500 text-sm">{errors.no_urut}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nama_lengkap" className={useSmallLayout ? 'text-sm' : ''}>Nama Lengkap *</Label>
                                            <Input
                                                id="nama_lengkap"
                                                value={data.nama_lengkap}
                                                onChange={(e) => setData('nama_lengkap', e.target.value)}
                                                placeholder="Nama lengkap"
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.nama_lengkap && <p className="text-red-500 text-sm">{errors.nama_lengkap}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nik" className={useSmallLayout ? 'text-sm' : ''}>NIK *</Label>
                                            <Input
                                                id="nik"
                                                value={data.nik}
                                                onChange={(e) => setData('nik', e.target.value)}
                                                placeholder="NIK (16 digit)"
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.nik && <p className="text-red-500 text-sm">{errors.nik}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jenis_kelamin" className={useSmallLayout ? 'text-sm' : ''}>Jenis Kelamin</Label>
                                            <Select value={data.jenis_kelamin} onValueChange={(value) => setData('jenis_kelamin', value)}>
                                                <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="LAKI-LAKI">Laki-laki</SelectItem>
                                                    <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.jenis_kelamin && <p className="text-red-500 text-sm">{errors.jenis_kelamin}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tempat_lahir" className={useSmallLayout ? 'text-sm' : ''}>Tempat Lahir</Label>
                                            <Input
                                                id="tempat_lahir"
                                                value={data.tempat_lahir}
                                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                placeholder="Tempat lahir"
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.tempat_lahir && <p className="text-red-500 text-sm">{errors.tempat_lahir}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tanggal_lahir" className={useSmallLayout ? 'text-sm' : ''}>Tanggal Lahir</Label>
                                            <Input
                                                id="tanggal_lahir"
                                                type="date"
                                                value={data.tanggal_lahir}
                                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.tanggal_lahir && <p className="text-red-500 text-sm">{errors.tanggal_lahir}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="agama" className={useSmallLayout ? 'text-sm' : ''}>Agama</Label>
                                            <Input
                                                id="agama"
                                                value={data.agama}
                                                onChange={(e) => setData('agama', e.target.value)}
                                                placeholder="Agama"
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.agama && <p className="text-red-500 text-sm">{errors.agama}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pendidikan" className={useSmallLayout ? 'text-sm' : ''}>Pendidikan</Label>
                                            <Input
                                                id="pendidikan"
                                                value={data.pendidikan}
                                                onChange={(e) => setData('pendidikan', e.target.value)}
                                                placeholder="Pendidikan terakhir"
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.pendidikan && <p className="text-red-500 text-sm">{errors.pendidikan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jenis_pekerjaan" className={useSmallLayout ? 'text-sm' : ''}>Jenis Pekerjaan</Label>
                                            <Input
                                                id="jenis_pekerjaan"
                                                value={data.jenis_pekerjaan}
                                                onChange={(e) => setData('jenis_pekerjaan', e.target.value)}
                                                placeholder="Jenis pekerjaan"
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.jenis_pekerjaan && <p className="text-red-500 text-sm">{errors.jenis_pekerjaan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="golongan_darah" className={useSmallLayout ? 'text-sm' : ''}>Golongan Darah</Label>
                                            <Select value={data.golongan_darah} onValueChange={(value) => setData('golongan_darah', value)}>
                                                <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                    <SelectValue placeholder="Pilih golongan darah" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="A">A</SelectItem>
                                                    <SelectItem value="B">B</SelectItem>
                                                    <SelectItem value="AB">AB</SelectItem>
                                                    <SelectItem value="O">O</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.golongan_darah && <p className="text-red-500 text-sm">{errors.golongan_darah}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="status_perkawinan" className={useSmallLayout ? 'text-sm' : ''}>Status Perkawinan</Label>
                                            <Select 
                                                value={data.status_perkawinan} 
                                                onValueChange={(value) => {
                                                    setData('status_perkawinan', value);
                                                    // Reset tanggal perkawinan jika status berubah ke 'BELUM KAWIN'
                                                    if (value === 'BELUM KAWIN') {
                                                        setData('tanggal_perkawinan', '');
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                    <SelectValue placeholder="Pilih status perkawinan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="KAWIN TERCATAT">Kawin Tercatat</SelectItem>
                                                    <SelectItem value="BELUM KAWIN">Belum Kawin</SelectItem>
                                                    <SelectItem value="CERAI HIDUP">Cerai Hidup</SelectItem>
                                                    <SelectItem value="CERAI MATI">Cerai Mati</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.status_perkawinan && <p className="text-red-500 text-sm">{errors.status_perkawinan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tanggal_perkawinan" className={`${useSmallLayout ? 'text-sm' : ''} ${!data.status_perkawinan || data.status_perkawinan === 'BELUM KAWIN' ? 'text-gray-400' : ''}`}>
                                                Tanggal Perkawinan
                                                {(!data.status_perkawinan || data.status_perkawinan === 'BELUM KAWIN') && <span className="text-xs ml-1">(Pilih status perkawinan terlebih dahulu)</span>}
                                            </Label>
                                            <Input
                                                id="tanggal_perkawinan"
                                                type="date"
                                                value={data.tanggal_perkawinan}
                                                onChange={(e) => setData('tanggal_perkawinan', e.target.value)}
                                                disabled={!data.status_perkawinan || data.status_perkawinan === 'BELUM KAWIN'}
                                                className={`${useSmallLayout ? 'h-8 text-sm' : ''} ${!data.status_perkawinan || data.status_perkawinan === 'BELUM KAWIN' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                                            />
                                            {errors.tanggal_perkawinan && <p className="text-red-500 text-sm">{errors.tanggal_perkawinan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="status_hubungan_dalam_keluarga" className={useSmallLayout ? 'text-sm' : ''}>Status Hubungan dalam Keluarga</Label>
                                            <Select 
                                                value={data.status_hubungan_dalam_keluarga} 
                                                onValueChange={(value) => {
                                                    setData('status_hubungan_dalam_keluarga', value);
                                                    // Clear custom field if not "Lainnya"
                                                    if (value !== 'Lainnya') {
                                                        setData('status_hubungan_custom', '');
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                    <SelectValue placeholder="Pilih status hubungan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Kepala Keluarga">Kepala Keluarga</SelectItem>
                                                    <SelectItem value="Suami">Suami</SelectItem>
                                                    <SelectItem value="Istri">Istri</SelectItem>
                                                    <SelectItem value="Anak">Anak</SelectItem>
                                                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.status_hubungan_dalam_keluarga && <p className="text-red-500 text-sm">{errors.status_hubungan_dalam_keluarga}</p>}
                                        </div>

                                        {data.status_hubungan_dalam_keluarga === 'Lainnya' && (
                                            <div className="space-y-2">
                                                <Label htmlFor="status_hubungan_custom" className={useSmallLayout ? 'text-sm' : ''}>
                                                    Status Hubungan Lainnya
                                                </Label>
                                                <Input
                                                    id="status_hubungan_custom"
                                                    value={data.status_hubungan_custom || ''}
                                                    onChange={(e) => setData('status_hubungan_custom', e.target.value)}
                                                    placeholder="Tuliskan status hubungan lainnya"
                                                    className={useSmallLayout ? 'h-8 text-sm' : ''}
                                                />
                                                {errors.status_hubungan_custom && <p className="text-red-500 text-sm">{errors.status_hubungan_custom}</p>}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="kewarganegaraan" className={useSmallLayout ? 'text-sm' : ''}>Kewarganegaraan</Label>
                                            <Select 
                                                value={data.kewarganegaraan} 
                                                onValueChange={(value) => {
                                                    setData('kewarganegaraan', value);
                                                    // Reset KITAP jika kewarganegaraan berubah ke WNI
                                                    if (value === 'WNI') {
                                                        setData('no_kitap', '');
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                    <SelectValue placeholder="Pilih kewarganegaraan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="WNI">WNI</SelectItem>
                                                    <SelectItem value="WNA">WNA</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.kewarganegaraan && <p className="text-red-500 text-sm">{errors.kewarganegaraan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="no_paspor" className={useSmallLayout ? 'text-sm' : ''}>Nomor Paspor</Label>
                                            <Input
                                                id="no_paspor"
                                                value={data.no_paspor}
                                                onChange={(e) => setData('no_paspor', e.target.value)}
                                                placeholder="Nomor paspor"
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.no_paspor && <p className="text-red-500 text-sm">{errors.no_paspor}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="no_kitap" className={`${useSmallLayout ? 'text-sm' : ''} ${data.kewarganegaraan !== 'WNA' ? 'text-gray-400' : ''}`}>
                                                Nomor KITAP
                                                {data.kewarganegaraan !== 'WNA' && <span className="text-xs ml-1">(Hanya untuk WNA)</span>}
                                            </Label>
                                            <Input
                                                id="no_kitap"
                                                value={data.no_kitap}
                                                onChange={(e) => setData('no_kitap', e.target.value)}
                                                placeholder="Nomor KITAP"
                                                disabled={data.kewarganegaraan !== 'WNA'}
                                                className={`${useSmallLayout ? 'h-8 text-sm' : ''} ${data.kewarganegaraan !== 'WNA' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                                            />
                                            {errors.no_kitap && <p className="text-red-500 text-sm">{errors.no_kitap}</p>}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="keluarga" className="space-y-4">
                                    <div className={`grid gap-4 ${useSmallLayout ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div className="space-y-2">
                                            <Label htmlFor="nama_ayah" className={useSmallLayout ? 'text-sm' : ''}>Nama Ayah</Label>
                                            <Input
                                                id="nama_ayah"
                                                value={data.nama_ayah}
                                                onChange={(e) => setData('nama_ayah', e.target.value)}
                                                placeholder="Nama ayah"
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.nama_ayah && <p className="text-red-500 text-sm">{errors.nama_ayah}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nama_ibu" className={useSmallLayout ? 'text-sm' : ''}>Nama Ibu</Label>
                                            <Input
                                                id="nama_ibu"
                                                value={data.nama_ibu}
                                                onChange={(e) => setData('nama_ibu', e.target.value)}
                                                placeholder="Nama ibu"
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.nama_ibu && <p className="text-red-500 text-sm">{errors.nama_ibu}</p>}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="sosial" className="space-y-4">
                                    <div className={`${useSmallLayout ? 'space-y-6' : 'grid grid-cols-2 gap-6'}`}>
                                        {/* 1. Status Ekonomi */}
                                        <div className="space-y-3">
                                            <h4 className={`font-medium ${useSmallLayout ? 'text-sm' : 'text-base'}`}>
                                                1. Status Ekonomi
                                            </h4>
                                            <div className="ml-6">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="is_masyarakat_miskin"
                                                        checked={!!data.is_masyarakat_miskin}
                                                        onCheckedChange={(checked) => setData('is_masyarakat_miskin', Boolean(checked))}
                                                    />
                                                    <Label htmlFor="is_masyarakat_miskin" className={useSmallLayout ? 'text-sm' : ''}>
                                                        Masyarakat Miskin
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2. BPJS Kesehatan */}
                                        <div className="space-y-3">
                                            <h4 className={`font-medium ${useSmallLayout ? 'text-sm' : 'text-base'}`}>
                                                2. BPJS Kesehatan
                                            </h4>
                                            <div className="ml-6 space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="has_bpjs_kesehatan"
                                                        checked={!!data.has_bpjs_kesehatan}
                                                        onCheckedChange={(checked) => {
                                                            setData('has_bpjs_kesehatan', Boolean(checked));
                                                            if (!checked) {
                                                                setData('status_bpjs_kesehatan', '');
                                                                setData('jenis_bpjs_kesehatan', '');
                                                                setData('detail_nonpbi_bpjs', '');
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor="has_bpjs_kesehatan" className={useSmallLayout ? 'text-sm' : ''}>
                                                        Memiliki BPJS Kesehatan
                                                    </Label>
                                                </div>
                                            
                                                {data.has_bpjs_kesehatan && (
                                                    <div className="ml-6 space-y-3">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="status_bpjs_kesehatan" className={useSmallLayout ? 'text-sm' : ''}>
                                                                Status BPJS Kesehatan
                                                            </Label>
                                                            <Select 
                                                                value={data.status_bpjs_kesehatan} 
                                                                onValueChange={(value) => {
                                                                    setData('status_bpjs_kesehatan', value);
                                                                    if (value !== 'NON_PBI') {
                                                                        setData('jenis_bpjs_kesehatan', '');
                                                                        setData('detail_nonpbi_bpjs', '');
                                                                    }
                                                                }}
                                                            >
                                                                <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                                    <SelectValue placeholder="Pilih status BPJS" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="PBI_NEGARA">PBI Negara</SelectItem>
                                                                    <SelectItem value="NON_PBI">Non PBI</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            {errors.status_bpjs_kesehatan && <p className="text-red-500 text-sm">{errors.status_bpjs_kesehatan}</p>}
                                                        </div>
                                                        
                                                        {data.status_bpjs_kesehatan === 'NON_PBI' && (
                                                            <div className="ml-6 space-y-3">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="jenis_bpjs_kesehatan" className={useSmallLayout ? 'text-sm' : ''}>
                                                                        Detail Kategori Non PBI
                                                                    </Label>
                                                                    <Select 
                                                                        value={data.jenis_bpjs_kesehatan} 
                                                                        onValueChange={(value) => {
                                                                            setData('jenis_bpjs_kesehatan', value);
                                                                            setData('detail_nonpbi_bpjs', value);
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                                            <SelectValue placeholder="Pilih jenis BPJS" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="PPU">PPU (Pekerja Penerima Upah)</SelectItem>
                                                                            <SelectItem value="PBPU">PBPU (Pekerja Bukan Penerima Upah)</SelectItem>
                                                                            <SelectItem value="BP">BP (Bukan Pekerja)</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {errors.jenis_bpjs_kesehatan && <p className="text-red-500 text-sm">{errors.jenis_bpjs_kesehatan}</p>}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 3. BPJS Ketenagakerjaan */}
                                        <div className="space-y-3">
                                            <h4 className={`font-medium ${useSmallLayout ? 'text-sm' : 'text-base'}`}>
                                                3. BPJS Ketenagakerjaan
                                            </h4>
                                            <div className="ml-6">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="has_bpjs_ketenagakerjaan"
                                                        checked={!!data.has_bpjs_ketenagakerjaan}
                                                        onCheckedChange={(checked) => setData('has_bpjs_ketenagakerjaan', Boolean(checked))}
                                                    />
                                                    <Label htmlFor="has_bpjs_ketenagakerjaan" className={useSmallLayout ? 'text-sm' : ''}>
                                                        Memiliki BPJS Ketenagakerjaan
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 4. E-KTP */}
                                        <div className="space-y-3">
                                            <h4 className={`font-medium ${useSmallLayout ? 'text-sm' : 'text-base'}`}>
                                                4. Kepemilikan E-KTP
                                            </h4>
                                            <div className="ml-6 space-y-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="status_e_ktp" className={useSmallLayout ? 'text-sm' : ''}>
                                                        Status E-KTP
                                                    </Label>
                                                    <Select value={data.status_e_ktp} onValueChange={(value) => setData('status_e_ktp', value)}>
                                                        <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                            <SelectValue placeholder="Pilih status E-KTP" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="BELUM_PUNYA">Belum Punya</SelectItem>
                                                            <SelectItem value="SUDAH_PUNYA_BAGUS">Sudah Punya (Kondisi Bagus)</SelectItem>
                                                            <SelectItem value="SUDAH_PUNYA_RUSAK">Sudah Punya (Kondisi Rusak)</SelectItem>
                                                            <SelectItem value="HILANG">Hilang</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.status_e_ktp && <p className="text-red-500 text-sm">{errors.status_e_ktp}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 5. Kartu Keluarga */}
                                        <div className="space-y-3">
                                            <h4 className={`font-medium ${useSmallLayout ? 'text-sm' : 'text-base'}`}>
                                                5. Status Kartu Keluarga
                                            </h4>
                                            <div className="ml-6 space-y-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="status_kk_update" className={useSmallLayout ? 'text-sm' : ''}>
                                                        Status Update KK
                                                    </Label>
                                                    <Select value={data.status_kk_update} onValueChange={(value) => setData('status_kk_update', value)}>
                                                        <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                            <SelectValue placeholder="Pilih status update KK" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PERLU_UPDATE">Perlu Update</SelectItem>
                                                            <SelectItem value="TIDAK_PERLU_UPDATE">Tidak Perlu Update</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.status_kk_update && <p className="text-red-500 text-sm">{errors.status_kk_update}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 6. Akta Kelahiran */}
                                        <div className="space-y-3">
                                            <h4 className={`font-medium ${useSmallLayout ? 'text-sm' : 'text-base'}`}>
                                                6. Akta Kelahiran
                                            </h4>
                                            <div className="ml-6">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="has_akta_kelahiran"
                                                        checked={!!data.has_akta_kelahiran}
                                                        onCheckedChange={(checked) => setData('has_akta_kelahiran', Boolean(checked))}
                                                    />
                                                    <Label htmlFor="has_akta_kelahiran" className={useSmallLayout ? 'text-sm' : ''}>
                                                        Memiliki Akta Kelahiran
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Catatan Tambahan - Span full width */}
                                    <div className="space-y-2 mt-6">
                                        <Label htmlFor="catatan_sosial" className={useSmallLayout ? 'text-sm' : ''}>
                                            Catatan Tambahan
                                        </Label>
                                        <Textarea
                                            id="catatan_sosial"
                                            value={data.catatan_sosial}
                                            onChange={(e) => setData('catatan_sosial', e.target.value)}
                                            placeholder="Catatan tambahan mengenai status sosial warga"
                                            className={useSmallLayout ? 'text-sm' : ''}
                                            rows={3}
                                        />
                                        {errors.catatan_sosial && <p className="text-red-500 text-sm">{errors.catatan_sosial}</p>}
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className={`flex gap-2 pt-4 ${useSmallLayout ? 'flex-col' : 'justify-end'}`}>
                                <Button 
                                    variant="outline" 
                                    asChild 
                                    size={useSmallLayout ? 'sm' : 'default'}
                                    className={`bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200 ${useSmallLayout ? 'w-full' : ''}`}
                                >
                                    <Link href="/anggota-keluarga">Batal</Link>
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    size={useSmallLayout ? 'sm' : 'default'}
                                    className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-md transition-all duration-200 hover:shadow-lg ${useSmallLayout ? 'w-full' : ''}`}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
