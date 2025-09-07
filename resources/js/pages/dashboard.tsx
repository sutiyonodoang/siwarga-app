import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobileVariant } from '@/hooks/use-small-mobile';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, User, Calendar, Heart, UserPlus, Shield, House, ChevronDown, ChevronUp, CreditCard, FileText, IdCard } from 'lucide-react';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Statistics {
    totalKartuKeluarga: number;
    totalAnggotaKeluarga: number;
    maleCount: number;
    femaleCount: number;
    childrenCount: number;
    adultCount: number;
    elderlyCount: number;
    marriedCount: number;
    unmarriedCount: number;
    divorcedCount: number;
    widowedCount: number;
    // Social statistics
    masyarakatMiskinCount: number;
    hasBpjsKesehatanCount: number;
    hasBpjsKetenagakerjaanCount: number;
    // BPJS Ketenagakerjaan breakdown
    belumBpjsKetenagakerjaanCount: number;
    // E-KTP breakdown
    hasEktpCount: number;
    hasEktpBaikCount: number;
    hasEktpRusakCount: number;
    hasEktpHilangCount: number;
    belumEktpCount: number;
    // Akta Kelahiran breakdown
    hasAktaKelahiranCount: number;
    belumAktaKelahiranCount: number;
    // Kartu Keluarga breakdown
    kkTidakPerluPerbaikanCount: number;
    kkPerluPerbaikanCount: number;
    // BPJS Details
    bpjsPbiNegaraCount: number;
    bpjsPbiDaerahCount: number;
    bpjsNonPbiCount: number;
    bpjsPpuCount: number;
    bpjsPbpuCount: number;
    bpjsBpCount: number;
    bpjsAktifCount: number;
    bpjsTidakAktifCount: number;
    // Warga Musiman statistics
    totalWargaMusiman: number;
    wargaMusimanAktifCount: number;
    wargaMusimanHarianCount: number;
    wargaMusimanMingguanCount: number;
    wargaMusimanBulananCount: number;
    wargaMusimanTahunanCount: number;
    // Warga Musiman gender breakdown
    wargaMusimanMaleCount: number;
    wargaMusimanFemaleCount: number;
    // Warga Musiman age breakdown
    wargaMusimanChildrenCount: number;
    wargaMusimanAdultCount: number;
    wargaMusimanElderlyCount: number;
    // Warga Mukim statistics
    totalWargaMukim: number;
    mukimMaleCount: number;
    mukimFemaleCount: number;
    // Warga Mukim age breakdown
    mukimChildrenCount: number;
    mukimAdultCount: number;
    mukimElderlyCount: number;
    mukimMarriedCount: number;
    mukimUnmarriedCount: number;
    mukimDivorcedCount: number;
    mukimWidowedCount: number;
    mukimHasBpjsKesehatanCount: number;
    mukimHasBpjsKetenagakerjaanCount: number;
    mukimBelumBpjsKetenagakerjaanCount: number;
    mukimHasEktpCount: number;
    mukimBelumEktpCount: number;
    mukimHasAktaKelahiranCount: number;
    mukimBelumAktaKelahiranCount: number;
    mukimKkPerluPerbaikanCount: number;
    // Total KK gender breakdown (from anggota_keluarga)
    kkMaleCount: number;
    kkFemaleCount: number;
    // Total KK age breakdown (from anggota_keluarga)
    kkChildrenCount: number;
    kkAdultCount: number;
    kkElderlyCount: number;
}

interface KartuKeluarga {
    no_kk: string;
    nama_kepala_keluarga: string;
    alamat: string;
    created_at: string;
}

interface AnggotaKeluarga {
    id: number;
    nama_lengkap: string;
    nik: string;
    jenis_kelamin: string | null;
    tanggal_lahir: string | null;
    created_at: string;
    no_urut?: number;
    is_warga_musiman: boolean;
}

interface Props {
    statistics?: Statistics;
    recentKartuKeluarga?: KartuKeluarga[];
    recentAnggotaKeluarga?: AnggotaKeluarga[];
}

export default function Dashboard({ 
    statistics = {
        totalKartuKeluarga: 0,
        totalAnggotaKeluarga: 0,
        maleCount: 0,
        femaleCount: 0,
        childrenCount: 0,
        adultCount: 0,
        elderlyCount: 0,
        marriedCount: 0,
        unmarriedCount: 0,
        divorcedCount: 0,
        widowedCount: 0,
        masyarakatMiskinCount: 0,
        hasBpjsKesehatanCount: 0,
        hasBpjsKetenagakerjaanCount: 0,
        belumBpjsKetenagakerjaanCount: 0,
        hasEktpCount: 0,
        hasEktpBaikCount: 0,
        hasEktpRusakCount: 0,
        hasEktpHilangCount: 0,
        belumEktpCount: 0,
        hasAktaKelahiranCount: 0,
        belumAktaKelahiranCount: 0,
        kkTidakPerluPerbaikanCount: 0,
        kkPerluPerbaikanCount: 0,
        bpjsPbiNegaraCount: 0,
        bpjsPbiDaerahCount: 0,
        bpjsNonPbiCount: 0,
        bpjsPpuCount: 0,
        bpjsPbpuCount: 0,
        bpjsBpCount: 0,
        bpjsAktifCount: 0,
        bpjsTidakAktifCount: 0,
        // Warga Musiman statistics
        totalWargaMusiman: 0,
        wargaMusimanAktifCount: 0,
        wargaMusimanHarianCount: 0,
        wargaMusimanMingguanCount: 0,
        wargaMusimanBulananCount: 0,
        wargaMusimanTahunanCount: 0,
        // Warga Musiman gender breakdown
        wargaMusimanMaleCount: 0,
        wargaMusimanFemaleCount: 0,
        // Warga Musiman age breakdown
        wargaMusimanChildrenCount: 0,
        wargaMusimanAdultCount: 0,
        wargaMusimanElderlyCount: 0,
        // Warga Mukim statistics
        totalWargaMukim: 0,
        mukimMaleCount: 0,
        mukimFemaleCount: 0,
        // Warga Mukim age breakdown
        mukimChildrenCount: 0,
        mukimAdultCount: 0,
        mukimElderlyCount: 0,
        mukimMarriedCount: 0,
        mukimUnmarriedCount: 0,
        mukimDivorcedCount: 0,
        mukimWidowedCount: 0,
        mukimHasBpjsKesehatanCount: 0,
        mukimHasBpjsKetenagakerjaanCount: 0,
        mukimBelumBpjsKetenagakerjaanCount: 0,
        mukimHasEktpCount: 0,
        mukimBelumEktpCount: 0,
        mukimHasAktaKelahiranCount: 0,
        mukimBelumAktaKelahiranCount: 0,
        mukimKkPerluPerbaikanCount: 0,
        // Total KK gender breakdown (from anggota_keluarga)
        kkMaleCount: 0,
        kkFemaleCount: 0,
        // Total KK age breakdown (from anggota_keluarga)
        kkChildrenCount: 0,
        kkAdultCount: 0,
        kkElderlyCount: 0,
    }, 
    recentKartuKeluarga = [], 
    recentAnggotaKeluarga = [] 
}: Props) {
    const { isSmallMobile, isMobile, deviceType } = useIsMobileVariant();
    const [showBpjsDetail, setShowBpjsDetail] = useState(false);
    const [socialStatsView, setSocialStatsView] = useState('all');
    const [chartFilter, setChartFilter] = useState<'all' | 'total' | 'keluarga' | 'mukim' | 'musiman'>('all');
    
    // Pagination state for anggota keluarga table
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Pagination state for kepala keluarga table
    const [currentPageKK, setCurrentPageKK] = useState(1);
    const itemsPerPageKK = 10;
    
    // Pagination state for warga musiman tables
    const [currentPageMusiman, setCurrentPageMusiman] = useState(1);
    const [currentPageKKMusiman, setCurrentPageKKMusiman] = useState(1);
    const itemsPerPageMusiman = 10;
    const itemsPerPageKKMusiman = 10;
    
    // Pagination logic for anggota keluarga
    const getPaginatedAnggotaKeluarga = () => {
        if (!recentAnggotaKeluarga || recentAnggotaKeluarga.length === 0) return [];
        
        // Filter hanya warga mukim (is_warga_musiman = false)
        const wargaMukim = recentAnggotaKeluarga.filter(anggota => anggota.is_warga_musiman === false);
        const sortedData = wargaMukim.sort((a, b) => (a.no_urut || 0) - (b.no_urut || 0));
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return sortedData.slice(startIndex, endIndex);
    };
    
    // Pagination logic for kepala keluarga
    const getPaginatedKepalaKeluarga = () => {
        if (!recentKartuKeluarga || recentKartuKeluarga.length === 0) return [];
        
        const sortedData = [...recentKartuKeluarga];
        const startIndex = (currentPageKK - 1) * itemsPerPageKK;
        const endIndex = startIndex + itemsPerPageKK;
        
        return sortedData.slice(startIndex, endIndex);
    };
    
    // Filter and pagination logic for warga musiman
    const getWargaMusiman = () => {
        if (!recentAnggotaKeluarga) return [];
        return recentAnggotaKeluarga.filter(anggota => anggota.is_warga_musiman === true);
    };
    
    const getPaginatedWargaMusiman = () => {
        const wargaMusiman = getWargaMusiman();
        const sortedData = wargaMusiman.sort((a, b) => (a.no_urut || 0) - (b.no_urut || 0));
        const startIndex = (currentPageMusiman - 1) * itemsPerPageMusiman;
        const endIndex = startIndex + itemsPerPageMusiman;
        
        return sortedData.slice(startIndex, endIndex);
    };
    
    const getPaginatedKepalaKeluargaMusiman = () => {
        if (!recentKartuKeluarga || recentKartuKeluarga.length === 0) return [];
        
        const sortedData = [...recentKartuKeluarga];
        const startIndex = (currentPageKKMusiman - 1) * itemsPerPageKKMusiman;
        const endIndex = startIndex + itemsPerPageKKMusiman;
        
        return sortedData.slice(startIndex, endIndex);
    };
    
    // Hitung total pages berdasarkan warga mukim saja
    const wargaMukimCount = recentAnggotaKeluarga?.filter(anggota => anggota.is_warga_musiman === false).length || 0;
    const totalPages = Math.ceil(wargaMukimCount / itemsPerPage);
    const paginatedData = getPaginatedAnggotaKeluarga();
    
    const totalPagesKK = Math.ceil((recentKartuKeluarga?.length || 0) / itemsPerPageKK);
    const paginatedDataKK = getPaginatedKepalaKeluarga();
    
    const wargaMusiman = getWargaMusiman();
    const totalPagesMusiman = Math.ceil((wargaMusiman?.length || 0) / itemsPerPageMusiman);
    const paginatedDataMusiman = getPaginatedWargaMusiman();
    
    const totalPagesKKMusiman = Math.ceil((recentKartuKeluarga?.length || 0) / itemsPerPageKKMusiman);
    const paginatedDataKKMusiman = getPaginatedKepalaKeluargaMusiman();
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    const handlePageChangeKK = (page: number) => {
        setCurrentPageKK(page);
    };
    
    const handlePageChangeMusiman = (page: number) => {
        setCurrentPageMusiman(page);
    };
    
    const handlePageChangeKKMusiman = (page: number) => {
        setCurrentPageKKMusiman(page);
    };
    
    // Function to get filtered gender data based on selected filter
    const getFilteredGenderData = () => {
        switch (chartFilter) {
            case 'keluarga':
                // Total KK: gender dari anggota keluarga yang ada dalam tabel KK
                return [
                    { name: 'Laki-laki', value: statistics.kkMaleCount || 0, color: '#3B82F6' },
                    { name: 'Perempuan', value: statistics.kkFemaleCount || 0, color: '#EC4899' }
                ];
            case 'musiman':
                // Warga Musiman: is_warga_musiman = true
                return [
                    { name: 'Laki-laki', value: statistics.wargaMusimanMaleCount || 0, color: '#3B82F6' },
                    { name: 'Perempuan', value: statistics.wargaMusimanFemaleCount || 0, color: '#EC4899' }
                ];
            case 'mukim':
                // Warga Mukim: is_warga_musiman = false
                return [
                    { name: 'Laki-laki', value: statistics.mukimMaleCount || 0, color: '#3B82F6' },
                    { name: 'Perempuan', value: statistics.mukimFemaleCount || 0, color: '#EC4899' }
                ];
            case 'total':
            case 'all':
            default:
                // Total Warga: semua data anggota keluarga
                return [
                    { name: 'Laki-laki', value: statistics.maleCount, color: '#3B82F6' },
                    { name: 'Perempuan', value: statistics.femaleCount, color: '#EC4899' }
                ];
        }
    };

    // Function to get filtered age data based on selected filter
    const getFilteredAgeData = () => {
        switch (chartFilter) {
            case 'keluarga':
                // Total KK: kelompok umur dari anggota keluarga yang ada dalam tabel KK
                return [
                    { name: 'Anak-anak', value: statistics.kkChildrenCount || 0, color: '#10B981' },
                    { name: 'Dewasa', value: statistics.kkAdultCount || 0, color: '#F59E0B' },
                    { name: 'Lansia', value: statistics.kkElderlyCount || 0, color: '#8B5CF6' }
                ];
            case 'musiman':
                // Warga Musiman: kelompok umur dari is_warga_musiman = true
                return [
                    { name: 'Anak-anak', value: statistics.wargaMusimanChildrenCount || 0, color: '#10B981' },
                    { name: 'Dewasa', value: statistics.wargaMusimanAdultCount || 0, color: '#F59E0B' },
                    { name: 'Lansia', value: statistics.wargaMusimanElderlyCount || 0, color: '#8B5CF6' }
                ];
            case 'mukim':
                // Warga Mukim: kelompok umur dari is_warga_musiman = false
                return [
                    { name: 'Anak-anak', value: statistics.mukimChildrenCount || 0, color: '#10B981' },
                    { name: 'Dewasa', value: statistics.mukimAdultCount || 0, color: '#F59E0B' },
                    { name: 'Lansia', value: statistics.mukimElderlyCount || 0, color: '#8B5CF6' }
                ];
            case 'total':
            case 'all':
            default:
                // Total Warga: semua data anggota keluarga
                return [
                    { name: 'Anak-anak', value: statistics.childrenCount, color: '#10B981' },
                    { name: 'Dewasa', value: statistics.adultCount, color: '#F59E0B' },
                    { name: 'Lansia', value: statistics.elderlyCount, color: '#8B5CF6' }
                ];
        }
    };
    
    // Function to get chart title
    const getChartTitle = (type: 'gender' | 'age') => {
        const typeLabels = {
            gender: 'Distribusi Jenis Kelamin',
            age: 'Distribusi Kelompok Umur'
        };
        
        return typeLabels[type];
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div 
                className={`
                    flex h-full flex-1 flex-col gap-4 rounded-xl overflow-x-auto min-h-[100dvh] 
                    bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30
                    ${isSmallMobile && isMobile 
                        ? 'p-1 gap-2' 
                        : 'p-2 sm:p-4'
                    }
                `}
                data-device-type={deviceType}
            >
                <h1 className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ${isSmallMobile && isMobile ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
                    Laporan Data
                </h1>
                
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[800px] bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <TabsTrigger 
                            value="overview"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hover:bg-blue-50 transition-all duration-200"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger 
                            value="sosial"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hover:bg-blue-50 transition-all duration-200"
                        >
                            Statistik Sosial
                        </TabsTrigger>
                        <TabsTrigger 
                            value="mukim"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white hover:bg-green-50 transition-all duration-200"
                        >
                            Data Warga Mukim
                        </TabsTrigger>
                        <TabsTrigger 
                            value="musiman"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white hover:bg-green-50 transition-all duration-200"
                        >
                            Data Warga Musiman
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Statistics Cards - Overview */}
                        <div className={`
                            grid gap-4
                            ${isSmallMobile && isMobile
                                ? 'grid-cols-1 gap-2'
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                            }
                        `}>
                            <Card 
                                className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-blue-300`}
                            >
                                <CardHeader className={`
                                    flex flex-row items-center justify-between space-y-0
                                    ${isSmallMobile && isMobile ? 'pb-1 p-2' : 'pb-2'}
                                `}>
                                    <CardTitle className={`font-medium text-blue-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        {isSmallMobile && isMobile ? 'Total KK' : 'Jumlah Total KK'}
                                    </CardTitle>
                                    <div className="p-2 bg-blue-500 rounded-full">
                                        <House className={`text-white ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-2 pt-0' : ''}>
                                    <div className={`font-bold text-blue-900 ${isSmallMobile && isMobile ? 'text-lg' : 'text-2xl'}`}>
                                        {statistics.totalKartuKeluarga}
                                    </div>
                                    <p className={`text-blue-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        Keluarga terdaftar
                                    </p>
                                </CardContent>
                            </Card>

                            <Card 
                                className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-green-300 cursor-pointer ${chartFilter === 'total' ? 'ring-2 ring-green-500 shadow-lg' : ''}`}
                                onClick={() => setChartFilter(chartFilter === 'total' ? 'all' : 'total')}
                            >
                                <CardHeader className={`
                                    flex flex-row items-center justify-between space-y-0
                                    ${isSmallMobile && isMobile ? 'pb-1 p-2' : 'pb-2'}
                                `}>
                                    <CardTitle className={`font-medium text-green-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        {isSmallMobile && isMobile ? 'Total Warga' : 'Jumlah Total Warga'}
                                    </CardTitle>
                                    <div className="p-2 bg-green-500 rounded-full">
                                        <User className={`text-white ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-2 pt-0' : ''}>
                                    <div className={`font-bold text-green-900 ${isSmallMobile && isMobile ? 'text-lg' : 'text-2xl'}`}>
                                        {statistics.totalAnggotaKeluarga}
                                    </div>
                                    <p className={`text-green-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        Warga terdaftar
                                    </p>
                                </CardContent>
                            </Card>

                            <Card 
                                className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-purple-300 cursor-pointer ${chartFilter === 'mukim' ? 'ring-2 ring-purple-500 shadow-lg' : ''}`}
                                onClick={() => setChartFilter(chartFilter === 'mukim' ? 'all' : 'mukim')}
                            >
                                <CardHeader className={`
                                    flex flex-row items-center justify-between space-y-0
                                    ${isSmallMobile && isMobile ? 'pb-1 p-2' : 'pb-2'}
                                `}>
                                    <CardTitle className={`font-medium text-purple-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        {isSmallMobile && isMobile ? 'Warga Mukim' : 'Jumlah Warga Mukim'}
                                    </CardTitle>
                                    <div className="p-2 bg-purple-500 rounded-full">
                                        <Users className={`text-white ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-2 pt-0' : ''}>
                                    <div className={`font-bold text-purple-900 ${isSmallMobile && isMobile ? 'text-lg' : 'text-2xl'}`}>
                                        {statistics.totalWargaMukim}
                                    </div>
                                    <p className={`text-purple-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        Warga mukim terdaftar
                                    </p>
                                </CardContent>
                            </Card>

                            <Card 
                                className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-cyan-300 cursor-pointer ${chartFilter === 'musiman' ? 'ring-2 ring-cyan-500 shadow-lg' : ''}`}
                                onClick={() => setChartFilter(chartFilter === 'musiman' ? 'all' : 'musiman')}
                            >
                                <CardHeader className={`
                                    flex flex-row items-center justify-between space-y-0
                                    ${isSmallMobile && isMobile ? 'pb-1 p-2' : 'pb-2'}
                                `}>
                                    <CardTitle className={`font-medium text-cyan-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        {isSmallMobile && isMobile ? 'Warga Musiman' : 'Jumlah Warga Musiman'}
                                    </CardTitle>
                                    <div className="p-2 bg-cyan-500 rounded-full">
                                        <UserPlus className={`text-white ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-2 pt-0' : ''}>
                                    <div className={`font-bold text-cyan-900 ${isSmallMobile && isMobile ? 'text-lg' : 'text-2xl'}`}>
                                        {statistics.totalWargaMusiman || 0}
                                    </div>
                                    <p className={`text-cyan-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        Warga musiman terdaftar
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                
                {/* Pie Charts Section */}
                <div className={`
                    grid gap-4 
                    ${isSmallMobile && isMobile 
                        ? 'grid-cols-1 gap-2' 
                        : 'grid-cols-1 md:grid-cols-2'
                    }
                `}>
                    {/* Filter Indicator */}
                    {/* {chartFilter !== 'all' && (
                        <div className="col-span-full">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                                <span className="text-blue-800 font-medium">
                                    📊 Filter Aktif: {
                                        chartFilter === 'total' ? 'Total Warga' :
                                        chartFilter === 'keluarga' ? 'Total KK (dari Anggota Keluarga)' :
                                        chartFilter === 'mukim' ? 'Warga Mukim (is_warga_musiman = false)' :
                                        chartFilter === 'musiman' ? 'Warga Musiman (is_warga_musiman = true)' : ''
                                    }
                                </span>
                                <button 
                                    onClick={() => setChartFilter('all')}
                                    className="ml-3 text-blue-600 hover:text-blue-800 underline text-sm"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    )} */}
                    
                    {/* Gender Distribution Chart */}
                    <Card className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gray-100/60 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300`}>
                        <CardHeader className={`${isSmallMobile && isMobile ? 'p-3 pb-2' : ''} bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg`}>
                            <CardTitle className={`${isSmallMobile && isMobile ? 'text-sm' : ''} text-center font-semibold`}>
                                {getChartTitle('gender')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={`${isSmallMobile && isMobile ? 'p-3 pt-0' : ''} flex justify-center`}>
                            <ResponsiveContainer 
                                width="100%" 
                                height={isSmallMobile && isMobile ? 200 : 250}
                            >
                                <PieChart>
                                    <Pie
                                        data={getFilteredGenderData()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ percent }) => `${((percent ?? 0) * 100).toFixed(1)}%`}
                                        outerRadius={isSmallMobile && isMobile ? 60 : 80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {getFilteredGenderData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value, name) => [value, name]}
                                        labelStyle={{ fontSize: isSmallMobile && isMobile ? '12px' : '14px' }}
                                        contentStyle={{ 
                                            fontSize: isSmallMobile && isMobile ? '12px' : '14px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                        }}
                                    />
                                    <Legend 
                                        wrapperStyle={{ fontSize: isSmallMobile && isMobile ? '12px' : '14px' }}
                                        formatter={(value, entry) => `${value} (${entry.payload?.value ?? 0})`}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Age Groups Distribution Chart */}
                    <Card className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gray-100/60 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300`}>
                        <CardHeader className={`${isSmallMobile && isMobile ? 'p-3 pb-2' : ''} bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg`}>
                            <CardTitle className={`${isSmallMobile && isMobile ? 'text-sm' : ''} text-center font-semibold`}>
                                {getChartTitle('age')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={`${isSmallMobile && isMobile ? 'p-3 pt-0' : ''} flex justify-center`}>
                            <ResponsiveContainer 
                                width="100%" 
                                height={isSmallMobile && isMobile ? 200 : 250}
                            >
                                <PieChart>
                                    <Pie
                                        data={getFilteredAgeData()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ percent }) => `${((percent ?? 0) * 100).toFixed(1)}%`}
                                        outerRadius={isSmallMobile && isMobile ? 60 : 80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {getFilteredAgeData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value, name) => [value, name]}
                                        labelStyle={{ fontSize: isSmallMobile && isMobile ? '12px' : '14px' }}
                                        contentStyle={{ 
                                            fontSize: isSmallMobile && isMobile ? '12px' : '14px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                        }}
                                    />
                                    <Legend 
                                        wrapperStyle={{ fontSize: isSmallMobile && isMobile ? '12px' : '14px' }}
                                        formatter={(value, entry) => `${value} (${entry.payload?.value ?? 0})`}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                    </TabsContent>

                    <TabsContent value="sosial" className="space-y-6">
                        {/* Social Statistics Header with Toggle */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Statistik Sosial</h2>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Tampilkan:</span>
                                <select 
                                    value={socialStatsView}
                                    onChange={(e) => setSocialStatsView(e.target.value)}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Semua Warga Mukim</option>
                                    <option value="mukim">Filter Berdasarkan Mukim</option>
                                </select>
                            </div>
                        </div>

                        {/* Social Statistics Cards */}
                        <div className={`
                            grid gap-4 
                            ${isSmallMobile && isMobile 
                                ? 'grid-cols-1 gap-2' 
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                            }
                        `}>
                            <Card className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-purple-300`}>
                                <CardHeader className={`
                                    flex flex-row items-center justify-between space-y-0 
                                    ${isSmallMobile && isMobile ? 'pb-1 p-2' : 'pb-2'}
                                `}>
                                    <CardTitle className={`font-medium text-purple-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        💍 Status Perkawinan
                                        {socialStatsView === 'mukim' && <span className="text-xs text-purple-600 ml-1">(Mukim)</span>}
                                        {socialStatsView === 'musiman' && <span className="text-xs text-purple-600 ml-1">(Musiman)</span>}
                                    </CardTitle>
                                    <div className="p-2 bg-purple-500 rounded-full">
                                        <Heart className={`text-white ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-2 pt-0' : ''}>
                                    <div className={`text-purple-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-xs'} space-y-1`}>
                                        {socialStatsView === 'all' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Kawin:</span>
                                                    <span className="font-semibold">{statistics.marriedCount}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>{isSmallMobile && isMobile ? 'Blm' : 'Belum'} Kawin:</span>
                                                    <span className="font-semibold">{statistics.unmarriedCount}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Cerai:</span>
                                                    <span className="font-semibold">{statistics.divorcedCount}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Duda/Janda:</span>
                                                    <span className="font-semibold">{statistics.widowedCount}</span>
                                                </div>
                                            </>
                                        )}
                                        {socialStatsView === 'mukim' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Kawin:</span>
                                                    <span className="font-semibold">{statistics.mukimMarriedCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>{isSmallMobile && isMobile ? 'Blm' : 'Belum'} Kawin:</span>
                                                    <span className="font-semibold">{statistics.mukimUnmarriedCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Cerai:</span>
                                                    <span className="font-semibold">{statistics.mukimDivorcedCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Duda/Janda:</span>
                                                    <span className="font-semibold">{statistics.mukimWidowedCount || 0}</span>
                                                </div>
                                            </>
                                        )}
                                        {socialStatsView === 'musiman' && (
                                            <div className="text-center py-4 text-purple-600">
                                                <p className="text-sm">Data status perkawinan warga musiman belum tersedia</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card 
                                className={`cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 ${isSmallMobile && isMobile ? 'text-sm' : ''}`}
                                onClick={() => setShowBpjsDetail(!showBpjsDetail)}
                            >
                                <CardHeader className={`
                                    flex flex-row items-center justify-between space-y-0 
                                    ${isSmallMobile && isMobile ? 'pb-1 p-2' : 'pb-2'}
                                `}>
                                    <CardTitle className={`font-medium text-blue-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        🏥 BPJS Kesehatan
                                        {socialStatsView === 'mukim' && <span className="text-xs text-blue-600 ml-1">(Filter Mukim)</span>}
                                    </CardTitle>
                                    <div className="flex items-center space-x-2">
                                        <div className="p-2 bg-blue-500 rounded-full">
                                            <Shield className={`text-white ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                        </div>
                                        {showBpjsDetail ? (
                                            <ChevronUp className={`text-blue-600 ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                        ) : (
                                            <ChevronDown className={`text-blue-600 ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-2 pt-0' : ''}>
                                    <div className={`font-bold text-blue-900 ${isSmallMobile && isMobile ? 'text-lg' : 'text-2xl'} flex items-center gap-2`}>
                                        <span>
                                            {socialStatsView === 'all' && (
                                                statistics.mukimHasBpjsKesehatanCount || 
                                                ((statistics.bpjsPbiNegaraCount || 0) +
                                                 (statistics.bpjsPpuCount || 0) +
                                                 (statistics.bpjsPbpuCount || 0) +
                                                 (statistics.bpjsBpCount || 0))
                                            )}
                                            {socialStatsView === 'mukim' && (
                                                statistics.mukimHasBpjsKesehatanCount || 0
                                            )}
                                        </span>
                                        <span className="text-gray-400">|</span>
                                        <span className={`text-blue-600 ${isSmallMobile && isMobile ? 'text-sm' : 'text-lg'}`}>
                                            {socialStatsView === 'all' && statistics.totalWargaMukim > 0 && (
                                                ((statistics.mukimHasBpjsKesehatanCount || 
                                                    ((statistics.bpjsPbiNegaraCount || 0) +
                                                     (statistics.bpjsPpuCount || 0) +
                                                     (statistics.bpjsPbpuCount || 0) +
                                                     (statistics.bpjsBpCount || 0))) / statistics.totalWargaMukim * 100).toFixed(1) + '%'
                                            )}
                                            {socialStatsView === 'mukim' && statistics.totalWargaMukim > 0 && (
                                                ((statistics.mukimHasBpjsKesehatanCount || 0) / statistics.totalWargaMukim * 100).toFixed(1) + '%'
                                            )}
                                            {((socialStatsView === 'all' && statistics.totalWargaMukim === 0) || 
                                              (socialStatsView === 'mukim' && statistics.totalWargaMukim === 0)) && '0.0%'}
                                            {' dari '}
                                            {socialStatsView === 'all' ? 'warga mukim' : 'warga mukim'}
                                        </span>
                                    </div>
                                    <p className={`text-blue-500 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'} mt-1 opacity-75`}>
                                        Tap untuk detail
                                    </p>
                                    {showBpjsDetail && (
                                        <div className="mt-4 space-y-3 text-sm">
                                            {/* Level 1: Jenis Keanggotaan */}
                                            <div className="space-y-2">
                                                <div className="font-semibold text-blue-700 text-xs uppercase tracking-wide">
                                                    Jenis Keanggotaan
                                                </div>
                                                <div className="pl-3 space-y-1 border-l-2 border-blue-200">
                                                    <div className="flex justify-between">
                                                        <span className="text-xs">PBI (Penerima Bantuan Iuran)</span>
                                                        <span className="font-medium">{statistics.bpjsPbiNegaraCount || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-xs">Non-PBI (Non Penerima Bantuan Iuran)</span>
                                                        <span className="font-medium">{(statistics.bpjsPpuCount || 0) + (statistics.bpjsPbpuCount || 0) + (statistics.bpjsBpCount || 0)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <hr className="border-gray-200" />

                                            {/* Level 2: Detail Non-PBI */}
                                            <div className="space-y-2">
                                                <div className="font-semibold text-green-700 text-xs uppercase tracking-wide">
                                                    Detail Non-PBI
                                                </div>
                                                <div className="pl-3 space-y-1 border-l-2 border-green-200">
                                                    <div className="flex justify-between">
                                                        <span className="text-xs">PPU (Pekerja Penerima Upah)</span>
                                                        <span className="font-medium">{statistics.bpjsPpuCount || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-xs">PBPU (Pekerja Bukan Penerima Upah)</span>
                                                        <span className="font-medium">{statistics.bpjsPbpuCount || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-xs">BP (Bukan Pekerja)</span>
                                                        <span className="font-medium">{statistics.bpjsBpCount || 0}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <hr className="border-gray-300" />

                                            {/* Level 3: Total dan Status */}
                                            <div className="space-y-2 bg-gray-50 p-3 rounded">
                                                <div className="flex justify-between font-semibold text-gray-800">
                                                    <span className="text-sm">Total Terdaftar BPJS:</span>
                                                    <span className="text-lg">{statistics.hasBpjsKesehatanCount || 
                                                        ((statistics.bpjsPbiNegaraCount || 0) +
                                                         (statistics.bpjsPpuCount || 0) +
                                                         (statistics.bpjsPbpuCount || 0) +
                                                         (statistics.bpjsBpCount || 0))
                                                    }</span>
                                                </div>
                                                <div className="flex justify-between text-green-600 font-medium">
                                                    <span className="text-sm">Status Aktif:</span>
                                                    <span>{statistics.bpjsAktifCount || 4}</span>
                                                </div>
                                                <div className="flex justify-between text-red-600 text-sm">
                                                    <span>Status Tidak Aktif:</span>
                                                    <span>{statistics.bpjsTidakAktifCount || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-green-300`}>
                                <CardHeader className={`
                                    flex flex-row items-center justify-between space-y-0 
                                    ${isSmallMobile && isMobile ? 'pb-1 p-2' : 'pb-2'}
                                `}>
                                    <CardTitle className={`font-medium text-green-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        💼 BPJS Ketenagakerjaan
                                        {socialStatsView === 'mukim' && <span className="text-xs text-green-600 ml-1">(Filter Mukim)</span>}
                                    </CardTitle>
                                    <div className="p-2 bg-green-500 rounded-full">
                                        <CreditCard className={`text-white ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-2 pt-0' : ''}>
                                    <div className="mt-2 text-sm text-green-700 space-y-1">
                                        {socialStatsView === 'all' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>• Punya:</span>
                                                    <span className="font-semibold">{statistics.mukimHasBpjsKetenagakerjaanCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>• Tidak punya:</span>
                                                    <span className="font-semibold">{statistics.mukimBelumBpjsKetenagakerjaanCount || 0}</span>
                                                </div>
                                            </>
                                        )}
                                        {socialStatsView === 'mukim' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>• Punya:</span>
                                                    <span className="font-semibold">{statistics.mukimHasBpjsKetenagakerjaanCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>• Tidak punya:</span>
                                                    <span className="font-semibold">{statistics.mukimBelumBpjsKetenagakerjaanCount || 0}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-purple-300`}>
                                <CardHeader className={`
                                    flex flex-row items-center justify-between space-y-0 
                                    ${isSmallMobile && isMobile ? 'pb-1 p-2' : 'pb-2'}
                                `}>
                                    <CardTitle className={`font-medium text-purple-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        📄 Akta Kelahiran
                                        {socialStatsView === 'mukim' && <span className="text-xs text-purple-600 ml-1">(Filter Mukim)</span>}
                                    </CardTitle>
                                    <div className="p-2 bg-purple-500 rounded-full">
                                        <FileText className={`text-white ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-2 pt-0' : ''}>
                                    <div className="mt-2 text-sm text-purple-700 space-y-1">
                                        {socialStatsView === 'all' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>• Punya:</span>
                                                    <span className="font-semibold">{statistics.mukimHasAktaKelahiranCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>• Belum punya:</span>
                                                    <span className="font-semibold">{statistics.mukimBelumAktaKelahiranCount || 0}</span>
                                                </div>
                                            </>
                                        )}
                                        {socialStatsView === 'mukim' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>• Punya:</span>
                                                    <span className="font-semibold">{statistics.mukimHasAktaKelahiranCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>• Belum punya:</span>
                                                    <span className="font-semibold">{statistics.mukimBelumAktaKelahiranCount || 0}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-orange-300`}>
                                <CardHeader className={`
                                    flex flex-row items-center justify-between space-y-0 
                                    ${isSmallMobile && isMobile ? 'pb-1 p-2' : 'pb-2'}
                                `}>
                                    <CardTitle className={`font-medium text-orange-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        📝 Pembaruan KK
                                        {socialStatsView === 'mukim' && <span className="text-xs text-orange-600 ml-1">(Filter Mukim)</span>}
                                    </CardTitle>
                                    <div className="p-2 bg-orange-500 rounded-full">
                                        <IdCard className={`text-white ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-2 pt-0' : ''}>
                                    <div className={`font-bold text-orange-900 ${isSmallMobile && isMobile ? 'text-lg' : 'text-2xl'}`}>
                                        {socialStatsView === 'all' && (statistics.mukimKkPerluPerbaikanCount || 0)}
                                        {socialStatsView === 'mukim' && (statistics.mukimKkPerluPerbaikanCount || 0)}
                                    </div>
                                    <p className={`text-orange-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        Perlu perbaikan data
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className={`${isSmallMobile && isMobile ? 'text-sm' : ''} bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-indigo-300`}>
                                <CardHeader className={`
                                    flex flex-row items-center justify-between space-y-0 
                                    ${isSmallMobile && isMobile ? 'pb-1 p-2' : 'pb-2'}
                                `}>
                                    <CardTitle className={`font-medium text-indigo-800 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                        🆔 E-KTP
                                        {socialStatsView === 'mukim' && <span className="text-xs text-indigo-600 ml-1">(Filter Mukim)</span>}
                                    </CardTitle>
                                    <div className="p-2 bg-indigo-500 rounded-full">
                                        <IdCard className={`text-white ${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-2 pt-0' : ''}>
                                    <div className="mt-2 text-sm text-indigo-700 space-y-1">
                                        {socialStatsView === 'all' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>• Memiliki:</span>
                                                    <span className="font-semibold">{statistics.mukimHasEktpCount || 0}</span>
                                                </div>
                                                <div className="ml-4 space-y-0.5">
                                                    <div className="flex justify-between text-xs">
                                                        <span>- Baik:</span>
                                                        <span className="font-medium">{statistics.hasEktpBaikCount || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span>- Rusak:</span>
                                                        <span className="font-medium">{statistics.hasEktpRusakCount || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span>- Hilang:</span>
                                                        <span className="font-medium">{statistics.hasEktpHilangCount || 0}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>• Tidak memiliki:</span>
                                                    <span className="font-semibold">{statistics.mukimBelumEktpCount || 0}</span>
                                                </div>
                                            </>
                                        )}
                                        {socialStatsView === 'mukim' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>• Memiliki:</span>
                                                    <span className="font-semibold">{statistics.mukimHasEktpCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>• Tidak memiliki:</span>
                                                    <span className="font-semibold">{statistics.mukimBelumEktpCount || 0}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="mukim" className="space-y-6">
                        {/* Recent Data Section */}
                        <div className={`
                            flex gap-4 overflow-x-auto
                            ${isSmallMobile && isMobile 
                                ? 'flex-col gap-2' 
                                : 'flex-row'
                            }
                        `}>
                            {/* Daftar Kepala Keluarga - 35% width */}
                            <Card className={`${isSmallMobile && isMobile ? 'text-sm w-full' : 'text-sm'} ${!isSmallMobile || !isMobile ? 'w-[35%]' : ''} bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <CardHeader className={`${isSmallMobile && isMobile ? 'p-3 pb-2' : ''} bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg`}>
                                    <CardTitle className={`${isSmallMobile && isMobile ? 'text-sm' : ''} flex items-center gap-2 font-semibold`}>
                                        <House className={`${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                        {isSmallMobile && isMobile ? 'Daftar KK' : 'Daftar Kepala Keluarga'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-3 pt-0' : ''}>
                                    {recentKartuKeluarga && recentKartuKeluarga.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className={`space-y-3 ${isSmallMobile && isMobile ? 'space-y-2' : ''}`}>
                                                {paginatedDataKK.map((kk) => (
                                                    <div key={kk.no_kk} className={`
                                                        p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500 hover:shadow-md hover:scale-105 transition-all duration-300
                                                        ${isSmallMobile && isMobile ? 'p-2' : ''}
                                                    `}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <p className={`font-semibold text-gray-900 dark:text-gray-100 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {kk.nama_kepala_keluarga}
                                                                </p>
                                                                <p className={`text-green-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    No. KK: {kk.no_kk}
                                                                </p>
                                                                <p className={`text-gray-500 ${isSmallMobile && isMobile ? 'text-xs' : 'text-xs'}`}>
                                                                    📍 {kk.alamat}
                                                                </p>
                                                            </div>
                                                            {/* <div className={`text-right ${isSmallMobile && isMobile ? 'ml-2' : 'ml-4'}`}>
                                                                <div className={`text-green-600 font-medium ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {new Date(kk.created_at).toLocaleDateString('id-ID', {
                                                                        day: '2-digit',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}
                                                                </div>
                                                                <div className={`text-gray-500 ${isSmallMobile && isMobile ? 'text-xs' : 'text-xs'}`}>
                                                                    {new Date(kk.created_at).toLocaleTimeString('id-ID', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Pagination Controls for Kepala Keluarga */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className={`text-gray-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                    Menampilkan {((currentPageKK - 1) * itemsPerPageKK) + 1} - {Math.min(currentPageKK * itemsPerPageKK, recentKartuKeluarga.length)} dari {recentKartuKeluarga.length} data
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handlePageChangeKK(currentPageKK - 1)}
                                                        disabled={currentPageKK === 1}
                                                        className={`
                                                            px-3 py-1 rounded-md border border-gray-300 
                                                            ${currentPageKK === 1 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                            }
                                                            ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                            transition-colors duration-200
                                                        `}
                                                    >
                                                        ‹ Prev
                                                    </button>
                                                    
                                                    {/* Page Numbers */}
                                                    {Array.from({ length: totalPagesKK }, (_, i) => i + 1).map((page) => (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChangeKK(page)}
                                                            className={`
                                                                px-3 py-1 rounded-md border border-gray-300
                                                                ${currentPageKK === page
                                                                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                                }
                                                                ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                                transition-colors duration-200
                                                            `}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                    
                                                    <button
                                                        onClick={() => handlePageChangeKK(currentPageKK + 1)}
                                                        disabled={currentPageKK === totalPagesKK}
                                                        className={`
                                                            px-3 py-1 rounded-md border border-gray-300
                                                            ${currentPageKK === totalPagesKK 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                            }
                                                            ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                            transition-colors duration-200
                                                        `}
                                                    >
                                                        Next ›
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="relative mb-4">
                                                <House className="mx-auto h-12 w-12 text-gray-300" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 rounded-full opacity-30 blur-xl"></div>
                                            </div>
                                            <p className={`text-gray-500 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                Tidak ada data kartu keluarga.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            
                            {/* Daftar Anggota Keluarga - 65% width */}
                            <Card className={`${isSmallMobile && isMobile ? 'text-sm w-full' : 'text-sm'} ${!isSmallMobile || !isMobile ? 'w-[65%]' : ''} bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <CardHeader className={`${isSmallMobile && isMobile ? 'p-3 pb-2' : ''} bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg`}>
                                    <CardTitle className={`${isSmallMobile && isMobile ? 'text-sm' : ''} flex items-center gap-2 font-semibold`}>
                                        <Users className={`${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                        {isSmallMobile && isMobile ? 'Daftar Anggota' : 'Daftar Anggota Keluarga'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-3 pt-0' : ''}>
                                    {wargaMukimCount > 0 ? (
                                        <div className="space-y-4">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                                                    <thead>
                                                        <tr className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-b border-gray-300">
                                                            <th className={`text-left py-3 px-3 font-semibold ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                NIK
                                                            </th>
                                                            <th className={`text-left py-3 px-3 font-semibold ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                Nama
                                                            </th>
                                                            <th className={`text-left py-3 px-3 font-semibold ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                Tgl Lahir
                                                            </th>
                                                            <th className={`text-left py-3 px-3 font-semibold ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                JK
                                                            </th>
                                                            <th className={`text-left py-3 px-3 font-semibold ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                Usia
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paginatedData.map((anggota, index) => (
                                                            <tr key={anggota.id} className={`
                                                                border-b border-gray-100 hover:bg-gradient-to-r hover:shadow-sm hover:scale-[1.01] transition-all duration-300
                                                                ${index % 2 === 0 
                                                                    ? 'bg-white hover:from-green-50 hover:to-blue-50' 
                                                                    : 'bg-gray-50 hover:from-green-50 hover:to-blue-50'
                                                                }
                                                            `}>
                                                                <td className={`py-3 px-3 text-gray-900 font-medium ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {anggota.nik}
                                                                </td>
                                                                <td className={`py-3 px-3 text-gray-900 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {anggota.nama_lengkap}
                                                                </td>
                                                                <td className={`py-3 px-3 text-gray-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {anggota.tanggal_lahir 
                                                                        ? new Date(anggota.tanggal_lahir).toLocaleDateString('id-ID', {
                                                                            day: '2-digit',
                                                                            month: '2-digit',
                                                                            year: 'numeric'
                                                                        })
                                                                        : '-'
                                                                    }
                                                                </td>
                                                                <td className={`py-3 px-3 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {anggota.jenis_kelamin ? (
                                                                        <span className={`
                                                                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm
                                                                            ${anggota.jenis_kelamin === 'LAKI-LAKI' 
                                                                                ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300'
                                                                                : 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border border-pink-300'
                                                                            }
                                                                            ${isSmallMobile && isMobile ? 'text-xs px-1 py-0.5' : ''}
                                                                        `}>
                                                                            {isSmallMobile && isMobile 
                                                                                ? (anggota.jenis_kelamin === 'LAKI-LAKI' ? 'L' : anggota.jenis_kelamin === 'PEREMPUAN' ? 'P' : '-')
                                                                                : anggota.jenis_kelamin
                                                                            }
                                                                        </span>
                                                                    ) : '-'}
                                                                </td>
                                                                <td className={`py-3 px-3 text-gray-600 font-medium ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {anggota.tanggal_lahir 
                                                                        ? `${new Date().getFullYear() - new Date(anggota.tanggal_lahir).getFullYear()} th`
                                                                        : '-'
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                            {/* Pagination Controls */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className={`text-gray-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                    Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, wargaMukimCount)} dari {wargaMukimCount} data
                                                </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                            className={`
                                                                px-3 py-1 rounded-md border border-gray-300 
                                                                ${currentPage === 1 
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                                }
                                                                ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                                transition-colors duration-200
                                                            `}
                                                        >
                                                            ‹ Prev
                                                        </button>
                                                        
                                                        {/* Page Numbers */}
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                            <button
                                                                key={page}
                                                                onClick={() => handlePageChange(page)}
                                                                className={`
                                                                    px-3 py-1 rounded-md border
                                                                    ${currentPage === page
                                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-blue-600'
                                                                    }
                                                                    ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                                    transition-colors duration-200
                                                                `}
                                                            >
                                                                {page}
                                                            </button>
                                                        ))}
                                                        
                                                        <button
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                            className={`
                                                                px-3 py-1 rounded-md border border-gray-300
                                                                ${currentPage === totalPages 
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                                }
                                                                ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                                transition-colors duration-200
                                                            `}
                                                        >
                                                            Next ›
                                                        </button>
                                                    </div>
                                                </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="relative mb-4">
                                                <Users className="mx-auto h-12 w-12 text-gray-300" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 rounded-full opacity-30 blur-xl"></div>
                                            </div>
                                            <p className={`text-gray-500 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                Tidak ada data anggota keluarga.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="musiman" className="space-y-6">
                        {/* Recent Data Section for Warga Musiman */}
                        <div className={`
                            flex gap-4 overflow-x-auto
                            ${isSmallMobile && isMobile 
                                ? 'flex-col gap-2' 
                                : 'flex-row'
                            }
                        `}>
                            {/* Daftar Kepala Keluarga Musiman - 35% width */}
                            <Card className={`${isSmallMobile && isMobile ? 'text-sm w-full' : 'text-sm'} ${!isSmallMobile || !isMobile ? 'w-[35%]' : ''} bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <CardHeader className={`${isSmallMobile && isMobile ? 'p-3 pb-2' : ''} bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg`}>
                                    <CardTitle className={`${isSmallMobile && isMobile ? 'text-sm' : ''} flex items-center gap-2 font-semibold`}>
                                        <House className={`${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                        {isSmallMobile && isMobile ? 'Daftar KK' : 'Daftar Kepala Keluarga'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-3 pt-0' : ''}>
                                    {recentKartuKeluarga && recentKartuKeluarga.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className={`space-y-3 ${isSmallMobile && isMobile ? 'space-y-2' : ''}`}>
                                                {paginatedDataKKMusiman.map((kk) => (
                                                    <div key={kk.no_kk} className={`
                                                        p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500 hover:shadow-md hover:scale-105 transition-all duration-300
                                                        ${isSmallMobile && isMobile ? 'p-2' : ''}
                                                    `}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <p className={`font-semibold text-gray-900 dark:text-gray-100 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {kk.nama_kepala_keluarga}
                                                                </p>
                                                                <p className={`text-green-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    No. KK: {kk.no_kk}
                                                                </p>
                                                                <p className={`text-gray-500 ${isSmallMobile && isMobile ? 'text-xs' : 'text-xs'}`}>
                                                                    📍 {kk.alamat}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Pagination Controls for Kepala Keluarga Musiman */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className={`text-gray-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                    Menampilkan {((currentPageKKMusiman - 1) * itemsPerPageKKMusiman) + 1} - {Math.min(currentPageKKMusiman * itemsPerPageKKMusiman, recentKartuKeluarga.length)} dari {recentKartuKeluarga.length} data
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handlePageChangeKKMusiman(currentPageKKMusiman - 1)}
                                                        disabled={currentPageKKMusiman === 1}
                                                        className={`
                                                            px-3 py-1 rounded-md border border-gray-300 
                                                            ${currentPageKKMusiman === 1 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                            }
                                                            ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                            transition-colors duration-200
                                                        `}
                                                    >
                                                        ‹ Prev
                                                    </button>
                                                    
                                                    {/* Page Numbers */}
                                                    {Array.from({ length: totalPagesKKMusiman }, (_, i) => i + 1).map((page) => (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChangeKKMusiman(page)}
                                                            className={`
                                                                px-3 py-1 rounded-md border border-gray-300
                                                                ${currentPageKKMusiman === page
                                                                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                                }
                                                                ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                                transition-colors duration-200
                                                            `}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                    
                                                    <button
                                                        onClick={() => handlePageChangeKKMusiman(currentPageKKMusiman + 1)}
                                                        disabled={currentPageKKMusiman === totalPagesKKMusiman}
                                                        className={`
                                                            px-3 py-1 rounded-md border border-gray-300
                                                            ${currentPageKKMusiman === totalPagesKKMusiman 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                            }
                                                            ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                            transition-colors duration-200
                                                        `}
                                                    >
                                                        Next ›
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="relative mb-4">
                                                <House className="mx-auto h-12 w-12 text-gray-300" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 rounded-full opacity-30 blur-xl"></div>
                                            </div>
                                            <p className={`text-gray-500 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                Tidak ada data kartu keluarga.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            
                            {/* Daftar Anggota Keluarga Musiman - 65% width */}
                            <Card className={`${isSmallMobile && isMobile ? 'text-sm w-full' : 'text-sm'} ${!isSmallMobile || !isMobile ? 'w-[65%]' : ''} bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <CardHeader className={`${isSmallMobile && isMobile ? 'p-3 pb-2' : ''} bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg`}>
                                    <CardTitle className={`${isSmallMobile && isMobile ? 'text-sm' : ''} flex items-center gap-2 font-semibold`}>
                                        <Users className={`${isSmallMobile && isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                        {isSmallMobile && isMobile ? 'Daftar Warga Musiman' : 'Daftar Anggota Keluarga Musiman'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={isSmallMobile && isMobile ? 'p-3 pt-0' : ''}>
                                    {wargaMusiman && wargaMusiman.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                                                    <thead>
                                                        <tr className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-b border-gray-300">
                                                            <th className={`text-left py-3 px-3 font-semibold ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                NIK
                                                            </th>
                                                            <th className={`text-left py-3 px-3 font-semibold ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                Nama
                                                            </th>
                                                            <th className={`text-left py-3 px-3 font-semibold ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                Tgl Lahir
                                                            </th>
                                                            <th className={`text-left py-3 px-3 font-semibold ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                JK
                                                            </th>
                                                            <th className={`text-left py-3 px-3 font-semibold ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                Usia
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paginatedDataMusiman.map((anggota, index) => (
                                                            <tr key={anggota.id} className={`
                                                                border-b border-gray-100 hover:bg-gradient-to-r hover:shadow-sm hover:scale-[1.01] transition-all duration-300
                                                                ${index % 2 === 0 
                                                                    ? 'bg-white hover:from-green-50 hover:to-blue-50' 
                                                                    : 'bg-gray-50 hover:from-green-50 hover:to-blue-50'
                                                                }
                                                            `}>
                                                                <td className={`py-3 px-3 text-gray-900 font-medium ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    <span 
                                                                        className="cursor-pointer hover:text-green-600 transition-colors duration-200"
                                                                        title={anggota.nik}
                                                                        onClick={() => navigator.clipboard.writeText(anggota.nik)}
                                                                    >
                                                                        {anggota.nik && anggota.nik.length > 10 ? `...${anggota.nik.slice(-10)}` : anggota.nik}
                                                                    </span>
                                                                </td>
                                                                <td className={`py-3 px-3 text-gray-900 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    <span 
                                                                        className="cursor-pointer hover:text-green-600 transition-colors duration-200"
                                                                        title={anggota.nama_lengkap}
                                                                    >
                                                                        {anggota.nama_lengkap && anggota.nama_lengkap.length > 10 ? `${anggota.nama_lengkap.slice(0, 10)}...` : anggota.nama_lengkap}
                                                                    </span>
                                                                </td>
                                                                <td className={`py-3 px-3 text-gray-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {anggota.tanggal_lahir 
                                                                        ? new Date(anggota.tanggal_lahir).toLocaleDateString('id-ID', {
                                                                            day: '2-digit',
                                                                            month: '2-digit',
                                                                            year: 'numeric'
                                                                        })
                                                                        : '-'
                                                                    }
                                                                </td>
                                                                <td className={`py-3 px-3 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {anggota.jenis_kelamin ? (
                                                                        <span className={`
                                                                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm
                                                                            ${anggota.jenis_kelamin === 'LAKI-LAKI' 
                                                                                ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300'
                                                                                : 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border border-pink-300'
                                                                            }
                                                                            ${isSmallMobile && isMobile ? 'text-xs px-1 py-0.5' : ''}
                                                                        `}>
                                                                            {isSmallMobile && isMobile 
                                                                                ? (anggota.jenis_kelamin === 'LAKI-LAKI' ? 'L' : anggota.jenis_kelamin === 'PEREMPUAN' ? 'P' : '-')
                                                                                : anggota.jenis_kelamin
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-gray-400">-</span>
                                                                    )}
                                                                </td>
                                                                <td className={`py-3 px-3 text-gray-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                                    {anggota.tanggal_lahir 
                                                                        ? (() => {
                                                                            const birthDate = new Date(anggota.tanggal_lahir);
                                                                            const today = new Date();
                                                                            const age = today.getFullYear() - birthDate.getFullYear();
                                                                            const monthDiff = today.getMonth() - birthDate.getMonth();
                                                                            return monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
                                                                        })()
                                                                        : '-'
                                                                    } tahun
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                            {/* Pagination Controls */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className={`text-gray-600 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                    Menampilkan {((currentPageMusiman - 1) * itemsPerPageMusiman) + 1} - {Math.min(currentPageMusiman * itemsPerPageMusiman, wargaMusiman.length)} dari {wargaMusiman.length} data
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handlePageChangeMusiman(currentPageMusiman - 1)}
                                                        disabled={currentPageMusiman === 1}
                                                        className={`
                                                            px-3 py-1 rounded-md border border-gray-300 
                                                            ${currentPageMusiman === 1 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                            }
                                                            ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                            transition-colors duration-200
                                                        `}
                                                    >
                                                        ‹ Prev
                                                    </button>
                                                    
                                                    {/* Page Numbers */}
                                                    {Array.from({ length: totalPagesMusiman }, (_, i) => i + 1).map((page) => (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChangeMusiman(page)}
                                                            className={`
                                                                px-3 py-1 rounded-md border border-gray-300
                                                                ${currentPageMusiman === page
                                                                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                                }
                                                                ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                                transition-colors duration-200
                                                            `}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                    
                                                    <button
                                                        onClick={() => handlePageChangeMusiman(currentPageMusiman + 1)}
                                                        disabled={currentPageMusiman === totalPagesMusiman}
                                                        className={`
                                                            px-3 py-1 rounded-md border border-gray-300
                                                            ${currentPageMusiman === totalPagesMusiman 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                            }
                                                            ${isSmallMobile && isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
                                                            transition-colors duration-200
                                                        `}
                                                    >
                                                        Next ›
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="relative mb-4">
                                                <Users className="mx-auto h-12 w-12 text-gray-300" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 rounded-full opacity-30 blur-xl"></div>
                                            </div>
                                            <p className={`text-gray-500 ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}`}>
                                                Tidak ada data anggota keluarga musiman.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
