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
    status_hubungan_custom: string | null;
    kewarganegaraan: string | null;
    no_paspor: string | null;
    no_kitap: string | null;
    nama_ayah: string | null;
    nama_ibu: string | null;
    // Atribut sosial survey - schema baru
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
    created_at: string;
    updated_at: string;
}

interface KartuKeluarga {
    no_kk: string;
    nama_kepala_keluarga: string;
}

interface Props {
    anggotaKeluarga: AnggotaKeluarga;
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
        title: 'Edit Warga Mukim',
        href: '/anggota-keluarga/edit',
    },
];

export default function AnggotaKeluargaEdit({ anggotaKeluarga, kartuKeluarga }: Props) {
    const { isSmallMobile, isMobile, isSmallMode, deviceType } = useIsMobileVariant();
    const useSmallLayout = isSmallMobile || (isSmallMode && !isMobile);
    
    // State untuk search di combobox
    const [query, setQuery] = useState('');
    const [selectedKK, setSelectedKK] = useState<KartuKeluarga | null>(() => {
        // Find the current KK from the list
        return kartuKeluarga.find(kk => kk.no_kk === anggotaKeluarga.no_kk) || null;
    });
    
    // Filter kartu keluarga berdasarkan query
    const filteredKartuKeluarga = query === ''
        ? kartuKeluarga
        : kartuKeluarga.filter((kk) =>
            kk.no_kk.toLowerCase().includes(query.toLowerCase()) ||
            kk.nama_kepala_keluarga.toLowerCase().includes(query.toLowerCase())
        );
    
    // Helper function to format date for input[type="date"]
    const formatDateForInput = (dateString: string | null): string => {
        if (!dateString) return '';
        // Handle ISO format like "1982-03-27T00:00:00.000000Z"
        if (dateString.includes('T')) {
            return dateString.split('T')[0];
        }
        return dateString;
    };

    // Helper function to determine status hubungan
    const getStatusHubungan = () => {
        const standardOptions = ['Kepala Keluarga', 'Suami', 'Istri', 'Anak'];
        const currentStatus = anggotaKeluarga.status_hubungan_dalam_keluarga;
        
        if (standardOptions.includes(currentStatus || '')) {
            return currentStatus || '';
        } else if (currentStatus && !standardOptions.includes(currentStatus)) {
            // Jika nilai bukan dari pilihan standar, set ke 'Lainnya'
            return 'Lainnya';
        }
        return '';
    };

    const { data, setData, put, processing, errors } = useForm({
        // Data Pribadi
        no_kk: anggotaKeluarga.no_kk || '',
        no_urut: anggotaKeluarga.no_urut || 0,
        nama_lengkap: anggotaKeluarga.nama_lengkap || '',
        nik: anggotaKeluarga.nik || '',
        jenis_kelamin: anggotaKeluarga.jenis_kelamin || '',
        tempat_lahir: anggotaKeluarga.tempat_lahir || '',
        tanggal_lahir: formatDateForInput(anggotaKeluarga.tanggal_lahir),
        agama: anggotaKeluarga.agama || '',
        pendidikan: anggotaKeluarga.pendidikan || '',
        jenis_pekerjaan: anggotaKeluarga.jenis_pekerjaan || '',
        golongan_darah: anggotaKeluarga.golongan_darah || '',
        status_perkawinan: anggotaKeluarga.status_perkawinan || '',
        tanggal_perkawinan: formatDateForInput(anggotaKeluarga.tanggal_perkawinan),
        status_hubungan_dalam_keluarga: getStatusHubungan(),
        status_hubungan_custom: getStatusHubungan() === 'Lainnya' ? anggotaKeluarga.status_hubungan_dalam_keluarga : (anggotaKeluarga.status_hubungan_custom || ''),
        kewarganegaraan: anggotaKeluarga.kewarganegaraan || '',
        no_paspor: anggotaKeluarga.no_paspor || '',
        no_kitap: anggotaKeluarga.no_kitap || '',
        nama_ayah: anggotaKeluarga.nama_ayah || '',
        nama_ibu: anggotaKeluarga.nama_ibu || '',
        
        // Atribut Sosial - Sinkronisasi dengan form create
        is_masyarakat_miskin: anggotaKeluarga.is_masyarakat_miskin || false,
        has_bpjs_kesehatan: anggotaKeluarga.has_bpjs_kesehatan || false,
        status_bpjs_kesehatan: anggotaKeluarga.jenis_keanggotaan_bpjs === 'pbi' ? 'PBI_NEGARA' : anggotaKeluarga.jenis_keanggotaan_bpjs === 'non-pbi' ? 'NON_PBI' : '',
        jenis_bpjs_kesehatan: anggotaKeluarga.detail_nonpbi_bpjs || '',
        detail_nonpbi_bpjs: anggotaKeluarga.detail_nonpbi_bpjs || '',
        is_bpjs_kesehatan_aktif: anggotaKeluarga.status_bpjs_kesehatan_aktif || false,
        has_bpjs_ketenagakerjaan: anggotaKeluarga.has_bpjs_ketenagakerjaan || false,
        status_e_ktp: anggotaKeluarga.has_e_ktp ? (anggotaKeluarga.kondisi_e_ktp === 'baik' ? 'SUDAH_PUNYA_BAGUS' : anggotaKeluarga.kondisi_e_ktp === 'rusak' ? 'SUDAH_PUNYA_RUSAK' : 'SUDAH_PUNYA_BAGUS') : 'BELUM_PUNYA',
        status_kk_update: anggotaKeluarga.perlu_update_kk ? 'PERLU_UPDATE' : 'TIDAK_PERLU_UPDATE',
        has_akta_kelahiran: anggotaKeluarga.has_akta_kelahiran || false,
        catatan_sosial: anggotaKeluarga.catatan_sosial || '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/anggota-keluarga/${anggotaKeluarga.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Anggota Keluarga - ${anggotaKeluarga.nama_lengkap}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200/50 dark:border-green-700/50 shadow-sm">
                    <h1 className={`font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ${useSmallLayout ? 'text-lg' : 'text-2xl'}`}>
                        Edit Anggota Keluarga
                    </h1>
                    <Button variant="outline" asChild size={useSmallLayout ? 'sm' : 'default'} className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200">
                        <Link href="/anggota-keluarga">Kembali</Link>
                    </Button>
                </div>
                
                <form onSubmit={submit} className="space-y-4">
                    <Card className="bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-900/20 border-green-200/50 dark:border-green-700/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-200/50 dark:border-green-700/50">
                            <CardTitle className={`text-gray-800 dark:text-gray-200 ${useSmallLayout ? 'text-lg' : ''}`}>
                                Form Edit Anggota Keluarga
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="pribadi" className="w-full">
                                <TabsList className={`grid w-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 border border-green-200/50 dark:border-green-700/50 grid-cols-3`}>
                                    <TabsTrigger value="pribadi" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-50 data-[state=active]:to-emerald-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200 ${useSmallLayout ? 'text-xs px-2' : ''}`}>
                                        Data Pribadi
                                    </TabsTrigger>
                                    <TabsTrigger value="keluarga" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-50 data-[state=active]:to-emerald-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200 ${useSmallLayout ? 'text-xs px-2' : ''}`}>
                                        Data Keluarga
                                    </TabsTrigger>
                                    <TabsTrigger value="sosial" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-50 data-[state=active]:to-emerald-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200 ${useSmallLayout ? 'text-xs px-2' : ''}`}>
                                        Survei Sosial
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="pribadi" className="space-y-4">
                                    <div className={`grid gap-4 ${useSmallLayout ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                                        <div className="space-y-2 relative">
                                            <Label htmlFor="no_kk" className={useSmallLayout ? 'text-sm' : ''}>
                                                Kartu Keluarga *
                                            </Label>
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
                                            <Label htmlFor="no_urut" className={useSmallLayout ? 'text-sm' : ''}>
                                                Nomor Urut *
                                            </Label>
                                            <Input
                                                id="no_urut"
                                                type="number"
                                                value={data.no_urut}
                                                onChange={(e) => setData('no_urut', parseInt(e.target.value))}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                                required
                                            />
                                            {errors.no_urut && <p className="text-red-500 text-sm">{errors.no_urut}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nama_lengkap" className={useSmallLayout ? 'text-sm' : ''}>
                                                Nama Lengkap *
                                            </Label>
                                            <Input
                                                id="nama_lengkap"
                                                value={data.nama_lengkap}
                                                onChange={(e) => setData('nama_lengkap', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                                required
                                            />
                                            {errors.nama_lengkap && <p className="text-red-500 text-sm">{errors.nama_lengkap}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nik" className={useSmallLayout ? 'text-sm' : ''}>
                                                NIK *
                                            </Label>
                                            <Input
                                                id="nik"
                                                value={data.nik}
                                                onChange={(e) => setData('nik', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                                required
                                            />
                                            {errors.nik && <p className="text-red-500 text-sm">{errors.nik}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jenis_kelamin" className={useSmallLayout ? 'text-sm' : ''}>
                                                Jenis Kelamin
                                            </Label>
                                            <Select value={data.jenis_kelamin} onValueChange={(value) => setData('jenis_kelamin', value)}>
                                                <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="LAKI-LAKI">Laki-laki</SelectItem>
                                                    <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.jenis_kelamin && <p className="text-red-500 text-sm">{errors.jenis_kelamin}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tempat_lahir" className={useSmallLayout ? 'text-sm' : ''}>
                                                Tempat Lahir
                                            </Label>
                                            <Input
                                                id="tempat_lahir"
                                                value={data.tempat_lahir}
                                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.tempat_lahir && <p className="text-red-500 text-sm">{errors.tempat_lahir}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tanggal_lahir" className={useSmallLayout ? 'text-sm' : ''}>
                                                Tanggal Lahir
                                            </Label>
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
                                            <Label htmlFor="agama" className={useSmallLayout ? 'text-sm' : ''}>
                                                Agama
                                            </Label>
                                            <Input
                                                id="agama"
                                                value={data.agama}
                                                onChange={(e) => setData('agama', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.agama && <p className="text-red-500 text-sm">{errors.agama}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pendidikan" className={useSmallLayout ? 'text-sm' : ''}>
                                                Pendidikan
                                            </Label>
                                            <Input
                                                id="pendidikan"
                                                value={data.pendidikan}
                                                onChange={(e) => setData('pendidikan', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.pendidikan && <p className="text-red-500 text-sm">{errors.pendidikan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jenis_pekerjaan" className={useSmallLayout ? 'text-sm' : ''}>
                                                Jenis Pekerjaan
                                            </Label>
                                            <Input
                                                id="jenis_pekerjaan"
                                                value={data.jenis_pekerjaan}
                                                onChange={(e) => setData('jenis_pekerjaan', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.jenis_pekerjaan && <p className="text-red-500 text-sm">{errors.jenis_pekerjaan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="golongan_darah" className={useSmallLayout ? 'text-sm' : ''}>
                                                Golongan Darah
                                            </Label>
                                            <Input
                                                id="golongan_darah"
                                                value={data.golongan_darah}
                                                onChange={(e) => setData('golongan_darah', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.golongan_darah && <p className="text-red-500 text-sm">{errors.golongan_darah}</p>}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="keluarga" className="space-y-4">
                                    <div className={`grid gap-4 ${useSmallLayout ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                                        <div className="space-y-2">
                                            <Label htmlFor="status_perkawinan" className={useSmallLayout ? 'text-sm' : ''}>
                                                Status Perkawinan
                                            </Label>
                                            <Select 
                                                value={data.status_perkawinan} 
                                                onValueChange={(value) => {
                                                    setData('status_perkawinan', value);
                                                    // Clear tanggal_perkawinan if status is BELUM KAWIN
                                                    if (value === 'BELUM KAWIN') {
                                                        setData('tanggal_perkawinan', '');
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                    <SelectValue placeholder="Pilih Status Perkawinan" />
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
                                            <Label htmlFor="tanggal_perkawinan" className={useSmallLayout ? 'text-sm' : ''}>
                                                Tanggal Perkawinan
                                            </Label>
                                            <Input
                                                id="tanggal_perkawinan"
                                                type="date"
                                                value={data.tanggal_perkawinan}
                                                onChange={(e) => setData('tanggal_perkawinan', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                                disabled={data.status_perkawinan === 'BELUM KAWIN'}
                                            />
                                            {errors.tanggal_perkawinan && <p className="text-red-500 text-sm">{errors.tanggal_perkawinan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="status_hubungan_dalam_keluarga" className={useSmallLayout ? 'text-sm' : ''}>
                                                Status Hubungan dalam Keluarga
                                            </Label>
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
                                            <Label htmlFor="kewarganegaraan" className={useSmallLayout ? 'text-sm' : ''}>
                                                Kewarganegaraan
                                            </Label>
                                            <Select 
                                                value={data.kewarganegaraan} 
                                                onValueChange={(value) => {
                                                    setData('kewarganegaraan', value);
                                                    // Clear no_kitap if kewarganegaraan is WNI
                                                    if (value === 'WNI') {
                                                        setData('no_kitap', '');
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className={useSmallLayout ? 'h-8 text-sm' : ''}>
                                                    <SelectValue placeholder="Pilih Kewarganegaraan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="WNI">WNI</SelectItem>
                                                    <SelectItem value="WNA">WNA</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.kewarganegaraan && <p className="text-red-500 text-sm">{errors.kewarganegaraan}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="no_paspor" className={useSmallLayout ? 'text-sm' : ''}>
                                                No Paspor
                                            </Label>
                                            <Input
                                                id="no_paspor"
                                                value={data.no_paspor}
                                                onChange={(e) => setData('no_paspor', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.no_paspor && <p className="text-red-500 text-sm">{errors.no_paspor}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="no_kitap" className={useSmallLayout ? 'text-sm' : ''}>
                                                No KITAP
                                            </Label>
                                            <Input
                                                id="no_kitap"
                                                value={data.no_kitap}
                                                onChange={(e) => setData('no_kitap', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                                disabled={data.kewarganegaraan === 'WNI'}
                                            />
                                            {errors.no_kitap && <p className="text-red-500 text-sm">{errors.no_kitap}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nama_ayah" className={useSmallLayout ? 'text-sm' : ''}>
                                                Nama Ayah
                                            </Label>
                                            <Input
                                                id="nama_ayah"
                                                value={data.nama_ayah}
                                                onChange={(e) => setData('nama_ayah', e.target.value)}
                                                className={useSmallLayout ? 'h-8 text-sm' : ''}
                                            />
                                            {errors.nama_ayah && <p className="text-red-500 text-sm">{errors.nama_ayah}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nama_ibu" className={useSmallLayout ? 'text-sm' : ''}>
                                                Nama Ibu
                                            </Label>
                                            <Input
                                                id="nama_ibu"
                                                value={data.nama_ibu}
                                                onChange={(e) => setData('nama_ibu', e.target.value)}
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
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => window.history.back()}
                                    size={useSmallLayout ? 'sm' : 'default'}
                                    className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-200"
                                >
                                    Batal
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    size={useSmallLayout ? 'sm' : 'default'}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-md transition-all duration-200 hover:shadow-lg"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}