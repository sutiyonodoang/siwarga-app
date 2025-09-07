<?php

namespace App\Http\Controllers;

use App\Models\KartuKeluarga;
use App\Models\AnggotaKeluarga;
use App\Models\UserActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            // Get statistics for the dashboard with error handling
            $totalKartuKeluarga = 0;
            $totalAnggotaKeluarga = 0;
            $maleCount = 0;
            $femaleCount = 0;
            $childrenCount = 0;
            $adultCount = 0;
            $elderlyCount = 0;
            $marriedCount = 0;
            $unmarriedCount = 0;
            $divorcedCount = 0;
            $widowedCount = 0;
            
            // Status Sosial Statistics
            $masyarakatMiskinCount = 0;
            $hasBpjsKesehatanCount = 0;
            $hasBpjsKetenagakerjaanCount = 0;
            $hasEktpCount = 0;
            $hasAktaKelahiranCount = 0;
            $hasKartuKeluargaCount = 0;
            
            // BPJS Ketenagakerjaan breakdown
            $belumBpjsKetenagakerjaanCount = 0;
            
            // E-KTP breakdown
            $hasEktpBaikCount = 0;
            $hasEktpRusakCount = 0;
            $hasEktpHilangCount = 0;
            $belumEktpCount = 0;
            
            // Akta Kelahiran breakdown
            $belumAktaKelahiranCount = 0;
            
            // Kartu Keluarga breakdown
            $kkTidakPerluPerbaikanCount = 0;
            $kkPerluPerbaikanCount = 0;
            
            // Warga Musiman Statistics
            $totalWargaMusiman = 0;
            $wargaMusimanAktifCount = 0;
            $wargaMusimanHarianCount = 0;
            $wargaMusimanMingguanCount = 0;
            $wargaMusimanBulananCount = 0;
            $wargaMusimanTahunanCount = 0;
            
            $recentKartuKeluarga = [];
            $recentAnggotaKeluarga = [];

            try {
                $totalKartuKeluarga = KartuKeluarga::count();
                $totalAnggotaKeluarga = AnggotaKeluarga::count();
                
                // Get statistics by gender
                $maleCount = AnggotaKeluarga::where('jenis_kelamin', 'LAKI-LAKI')->count();
                $femaleCount = AnggotaKeluarga::where('jenis_kelamin', 'PEREMPUAN')->count();
                
                // Get statistics by age groups (approximate) - SQLite compatible
                $childrenCount = AnggotaKeluarga::whereRaw("CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tanggal_lahir) AS INTEGER) < 18")->count();
                $adultCount = AnggotaKeluarga::whereRaw("CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tanggal_lahir) AS INTEGER) BETWEEN 18 AND 65")->count();
                $elderlyCount = AnggotaKeluarga::whereRaw("CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tanggal_lahir) AS INTEGER) > 65")->count();
                
                // Get statistics by marital status
                $marriedCount = AnggotaKeluarga::where('status_perkawinan', 'KAWIN TERCATAT')->count();
                $unmarriedCount = AnggotaKeluarga::where('status_perkawinan', 'BELUM KAWIN')->count();
                $divorcedCount = AnggotaKeluarga::where('status_perkawinan', 'CERAI HIDUP')->count();
                $widowedCount = AnggotaKeluarga::where('status_perkawinan', 'CERAI MATI')->count();
                
                // Get statistics for social status
                $masyarakatMiskinCount = AnggotaKeluarga::where('is_masyarakat_miskin', true)->count();
                $hasBpjsKesehatanCount = AnggotaKeluarga::where('has_bpjs_kesehatan', true)->count();
                
                // BPJS Ketenagakerjaan breakdown
                $hasBpjsKetenagakerjaanCount = AnggotaKeluarga::where('has_bpjs_ketenagakerjaan', true)->count();
                $belumBpjsKetenagakerjaanCount = AnggotaKeluarga::where('has_bpjs_ketenagakerjaan', false)->count();
                
                // E-KTP breakdown - using has_e_ktp and kondisi_e_ktp fields
                $hasEktpCount = AnggotaKeluarga::where('has_e_ktp', true)->count();
                $hasEktpBaikCount = AnggotaKeluarga::where('has_e_ktp', true)->where('kondisi_e_ktp', 'baik')->count();
                $hasEktpRusakCount = AnggotaKeluarga::where('has_e_ktp', true)->where('kondisi_e_ktp', 'rusak')->count();
                $hasEktpHilangCount = AnggotaKeluarga::where('has_e_ktp', true)->where('kondisi_e_ktp', 'hilang')->count();
                $belumEktpCount = AnggotaKeluarga::where('has_e_ktp', false)->count();
                
                $hasAktaKelahiranCount = AnggotaKeluarga::where('has_akta_kelahiran', true)->count();
                $belumAktaKelahiranCount = AnggotaKeluarga::where('has_akta_kelahiran', false)->count();
                
                // Kartu Keluarga breakdown - using perlu_update_kk field from anggota_keluarga
                $kkTidakPerluPerbaikanCount = AnggotaKeluarga::where('perlu_update_kk', false)->count();
                $kkPerluPerbaikanCount = AnggotaKeluarga::where('perlu_update_kk', true)->count();
                
                // Get detailed BPJS Kesehatan statistics
                $bpjsPbiNegaraCount = AnggotaKeluarga::where('has_bpjs_kesehatan', true)
                    ->where('status_bpjs_kesehatan', 'PBI_NEGARA')->count();
                $bpjsNonPbiCount = AnggotaKeluarga::where('has_bpjs_kesehatan', true)
                    ->where('status_bpjs_kesehatan', 'NON_PBI')->count();
                $bpjsPpuCount = AnggotaKeluarga::where('has_bpjs_kesehatan', true)
                    ->where('detail_nonpbi_bpjs', 'PPU')->count();
                $bpjsPbpuCount = AnggotaKeluarga::where('has_bpjs_kesehatan', true)
                    ->where('detail_nonpbi_bpjs', 'PBPU')->count();
                $bpjsBpCount = AnggotaKeluarga::where('has_bpjs_kesehatan', true)
                    ->where('detail_nonpbi_bpjs', 'BP')->count();
                $bpjsPbiDaerahCount = AnggotaKeluarga::where('has_bpjs_kesehatan', true)
                    ->where('detail_nonpbi_bpjs', 'PBI_DAERAH')->count();
                $bpjsAktifCount = AnggotaKeluarga::where('has_bpjs_kesehatan', true)
                    ->where('is_bpjs_kesehatan_aktif', true)->count();
                
                // Get Warga Musiman statistics
                $totalWargaMusiman = AnggotaKeluarga::where('is_warga_musiman', true)->count();
                $wargaMusimanAktifCount = AnggotaKeluarga::where('is_warga_musiman', true)
                    ->where('status_aktif', true)->count();
                $wargaMusimanHarianCount = AnggotaKeluarga::where('is_warga_musiman', true)
                    ->where('periode_tinggal', 'harian')->count();
                $wargaMusimanMingguanCount = AnggotaKeluarga::where('is_warga_musiman', true)
                    ->where('periode_tinggal', 'mingguan')->count();
                $wargaMusimanBulananCount = AnggotaKeluarga::where('is_warga_musiman', true)
                    ->where('periode_tinggal', 'bulanan')->count();
                $wargaMusimanTahunanCount = AnggotaKeluarga::where('is_warga_musiman', true)
                    ->where('periode_tinggal', 'tahunan')->count();
                
                // Get Warga Musiman statistics by gender
                $wargaMusimanMaleCount = AnggotaKeluarga::where('is_warga_musiman', true)
                    ->where('jenis_kelamin', 'LAKI-LAKI')->count();
                $wargaMusimanFemaleCount = AnggotaKeluarga::where('is_warga_musiman', true)
                    ->where('jenis_kelamin', 'PEREMPUAN')->count();
                    
                // Get Warga Musiman statistics by age groups
                $wargaMusimanChildrenCount = AnggotaKeluarga::where('is_warga_musiman', true)
                    ->whereRaw("CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tanggal_lahir) AS INTEGER) < 18")->count();
                $wargaMusimanAdultCount = AnggotaKeluarga::where('is_warga_musiman', true)
                    ->whereRaw("CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tanggal_lahir) AS INTEGER) BETWEEN 18 AND 65")->count();
                $wargaMusimanElderlyCount = AnggotaKeluarga::where('is_warga_musiman', true)
                    ->whereRaw("CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tanggal_lahir) AS INTEGER) > 65")->count();
                
                // Get Warga Mukim statistics (non-warga musiman)
                $totalWargaMukim = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)
                          ->orWhereNull('is_warga_musiman');
                })->count();
                
                // Warga Mukim - Statistics by gender
                $mukimMaleCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('jenis_kelamin', 'LAKI-LAKI')->count();
                
                $mukimFemaleCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('jenis_kelamin', 'PEREMPUAN')->count();
                
                // Warga Mukim - Statistics by age groups
                $mukimChildrenCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->whereRaw("CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tanggal_lahir) AS INTEGER) < 18")->count();
                
                $mukimAdultCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->whereRaw("CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tanggal_lahir) AS INTEGER) BETWEEN 18 AND 65")->count();
                
                $mukimElderlyCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->whereRaw("CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tanggal_lahir) AS INTEGER) > 65")->count();
                
                // Warga Mukim - Statistics by marital status
                $mukimMarriedCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('status_perkawinan', 'KAWIN TERCATAT')->count();
                
                $mukimUnmarriedCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('status_perkawinan', 'BELUM KAWIN')->count();
                
                $mukimDivorcedCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('status_perkawinan', 'CERAI HIDUP')->count();
                
                $mukimWidowedCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('status_perkawinan', 'CERAI MATI')->count();
                
                // Warga Mukim - BPJS Kesehatan
                $mukimHasBpjsKesehatanCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('has_bpjs_kesehatan', true)->count();
                
                // Warga Mukim - BPJS Ketenagakerjaan
                $mukimHasBpjsKetenagakerjaanCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('has_bpjs_ketenagakerjaan', true)->count();
                
                $mukimBelumBpjsKetenagakerjaanCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('has_bpjs_ketenagakerjaan', false)->count();
                
                // Warga Mukim - E-KTP
                $mukimHasEktpCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('has_e_ktp', true)->count();
                
                $mukimBelumEktpCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('has_e_ktp', false)->count();
                
                // Warga Mukim - Akta Kelahiran
                $mukimHasAktaKelahiranCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('has_akta_kelahiran', true)->count();
                
                $mukimBelumAktaKelahiranCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('has_akta_kelahiran', false)->count();
                
                // Warga Mukim - KK Perbaikan
                $mukimKkPerluPerbaikanCount = AnggotaKeluarga::where(function($query) {
                    $query->where('is_warga_musiman', false)->orWhereNull('is_warga_musiman');
                })->where('perlu_update_kk', true)->count();
                
                // Get recent family cards
                $recentKartuKeluarga = KartuKeluarga::orderBy('created_at', 'desc')->limit(5)->get();
                
                // Get recent family members
                $recentAnggotaKeluarga = AnggotaKeluarga::orderBy('created_at', 'desc')->limit(5)->get();

                // Get activity statistics
                $today = now()->startOfDay();
                $thisWeek = now()->startOfWeek();
                $thisMonth = now()->startOfMonth();

                $todayActivities = UserActivityLog::whereDate('created_at', $today)->count();
                $thisWeekActivities = UserActivityLog::where('created_at', '>=', $thisWeek)->count();
                $thisMonthActivities = UserActivityLog::where('created_at', '>=', $thisMonth)->count();
                $recentActivities = UserActivityLog::with('user')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get();

            } catch (\Exception $e) {
                Log::error('Dashboard data error: ' . $e->getMessage());
                // Use default values if there's an error
            }

            return Inertia::render('dashboard', [
                'statistics' => [
                    'totalKartuKeluarga' => $totalKartuKeluarga,
                    'totalAnggotaKeluarga' => $totalAnggotaKeluarga,
                    'maleCount' => $maleCount,
                    'femaleCount' => $femaleCount,
                    'childrenCount' => $childrenCount,
                    'adultCount' => $adultCount,
                    'elderlyCount' => $elderlyCount,
                    'marriedCount' => $marriedCount,
                    'unmarriedCount' => $unmarriedCount,
                    'divorcedCount' => $divorcedCount,
                    'widowedCount' => $widowedCount,
                    'masyarakatMiskinCount' => $masyarakatMiskinCount,
                    'hasBpjsKesehatanCount' => $hasBpjsKesehatanCount,
                    'hasBpjsKetenagakerjaanCount' => $hasBpjsKetenagakerjaanCount,
                    'belumBpjsKetenagakerjaanCount' => $belumBpjsKetenagakerjaanCount,
                    'hasEktpCount' => $hasEktpCount,
                    'hasEktpBaikCount' => $hasEktpBaikCount,
                    'hasEktpRusakCount' => $hasEktpRusakCount,
                    'hasEktpHilangCount' => $hasEktpHilangCount,
                    'belumEktpCount' => $belumEktpCount,
                    'hasAktaKelahiranCount' => $hasAktaKelahiranCount,
                    'belumAktaKelahiranCount' => $belumAktaKelahiranCount,
                    'kkTidakPerluPerbaikanCount' => $kkTidakPerluPerbaikanCount,
                    'kkPerluPerbaikanCount' => $kkPerluPerbaikanCount,
                    'bpjsPbiNegaraCount' => $bpjsPbiNegaraCount,
                    'bpjsNonPbiCount' => $bpjsNonPbiCount,
                    'bpjsPpuCount' => $bpjsPpuCount,
                    'bpjsPbpuCount' => $bpjsPbpuCount,
                    'bpjsBpCount' => $bpjsBpCount,
                    'bpjsPbiDaerahCount' => $bpjsPbiDaerahCount,
                    'bpjsAktifCount' => $bpjsAktifCount,
                    // Warga Musiman statistics
                    'totalWargaMusiman' => $totalWargaMusiman,
                    'wargaMusimanAktifCount' => $wargaMusimanAktifCount,
                    'wargaMusimanHarianCount' => $wargaMusimanHarianCount,
                    'wargaMusimanMingguanCount' => $wargaMusimanMingguanCount,
                    'wargaMusimanBulananCount' => $wargaMusimanBulananCount,
                    'wargaMusimanTahunanCount' => $wargaMusimanTahunanCount,
                    // Warga Musiman gender breakdown
                    'wargaMusimanMaleCount' => $wargaMusimanMaleCount,
                    'wargaMusimanFemaleCount' => $wargaMusimanFemaleCount,
                    // Warga Musiman age breakdown
                    'wargaMusimanChildrenCount' => $wargaMusimanChildrenCount,
                    'wargaMusimanAdultCount' => $wargaMusimanAdultCount,
                    'wargaMusimanElderlyCount' => $wargaMusimanElderlyCount,
                    // Warga Mukim statistics
                    'totalWargaMukim' => $totalWargaMukim,
                    'mukimMaleCount' => $mukimMaleCount,
                    'mukimFemaleCount' => $mukimFemaleCount,
                    // Warga Mukim age breakdown
                    'mukimChildrenCount' => $mukimChildrenCount,
                    'mukimAdultCount' => $mukimAdultCount,
                    'mukimElderlyCount' => $mukimElderlyCount,
                    'mukimMarriedCount' => $mukimMarriedCount,
                    'mukimUnmarriedCount' => $mukimUnmarriedCount,
                    'mukimDivorcedCount' => $mukimDivorcedCount,
                    'mukimWidowedCount' => $mukimWidowedCount,
                    'mukimHasBpjsKesehatanCount' => $mukimHasBpjsKesehatanCount,
                    'mukimHasBpjsKetenagakerjaanCount' => $mukimHasBpjsKetenagakerjaanCount,
                    'mukimBelumBpjsKetenagakerjaanCount' => $mukimBelumBpjsKetenagakerjaanCount,
                    'mukimHasEktpCount' => $mukimHasEktpCount,
                    'mukimBelumEktpCount' => $mukimBelumEktpCount,
                    'mukimHasAktaKelahiranCount' => $mukimHasAktaKelahiranCount,
                    'mukimBelumAktaKelahiranCount' => $mukimBelumAktaKelahiranCount,
                    'mukimKkPerluPerbaikanCount' => $mukimKkPerluPerbaikanCount,
                ],
                'recentKartuKeluarga' => $recentKartuKeluarga,
                'recentAnggotaKeluarga' => $recentAnggotaKeluarga,
                'activityStatistics' => [
                    'today' => $todayActivities ?? 0,
                    'this_week' => $thisWeekActivities ?? 0,
                    'this_month' => $thisMonthActivities ?? 0,
                    'recent_activities' => $recentActivities ?? [],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard error: ' . $e->getMessage());
            return Inertia::render('dashboard', [
                'statistics' => [
                    'totalKartuKeluarga' => 0,
                    'totalAnggotaKeluarga' => 0,
                    'maleCount' => 0,
                    'femaleCount' => 0,
                    'childrenCount' => 0,
                    'adultCount' => 0,
                    'elderlyCount' => 0,
                    'marriedCount' => 0,
                    'unmarriedCount' => 0,
                    'divorcedCount' => 0,
                    'widowedCount' => 0,
                    'masyarakatMiskinCount' => 0,
                    'hasBpjsKesehatanCount' => 0,
                    'hasBpjsKetenagakerjaanCount' => 0,
                    'belumBpjsKetenagakerjaanCount' => 0,
                    'hasEktpCount' => 0,
                    'hasEktpBaikCount' => 0,
                    'hasEktpRusakCount' => 0,
                    'hasEktpHilangCount' => 0,
                    'belumEktpCount' => 0,
                    'hasAktaKelahiranCount' => 0,
                    'belumAktaKelahiranCount' => 0,
                    'kkTidakPerluPerbaikanCount' => 0,
                    'kkPerluPerbaikanCount' => 0,
                    'bpjsPbiNegaraCount' => 0,
                    'bpjsNonPbiCount' => 0,
                    'bpjsPpuCount' => 0,
                    'bpjsPbpuCount' => 0,
                    'bpjsBpCount' => 0,
                    'bpjsPbiDaerahCount' => 0,
                    'bpjsAktifCount' => 0,
                    // Warga Musiman statistics
                    'totalWargaMusiman' => 0,
                    'wargaMusimanAktifCount' => 0,
                    'wargaMusimanHarianCount' => 0,
                    'wargaMusimanMingguanCount' => 0,
                    'wargaMusimanBulananCount' => 0,
                    'wargaMusimanTahunanCount' => 0,
                    // Warga Musiman gender breakdown
                    'wargaMusimanMaleCount' => 0,
                    'wargaMusimanFemaleCount' => 0,
                    // Warga Musiman age breakdown
                    'wargaMusimanChildrenCount' => 0,
                    'wargaMusimanAdultCount' => 0,
                    'wargaMusimanElderlyCount' => 0,
                    // Warga Mukim statistics
                    'totalWargaMukim' => 0,
                    'mukimMaleCount' => 0,
                    'mukimFemaleCount' => 0,
                    // Warga Mukim age breakdown
                    'mukimChildrenCount' => 0,
                    'mukimAdultCount' => 0,
                    'mukimElderlyCount' => 0,
                    'mukimMarriedCount' => 0,
                    'mukimUnmarriedCount' => 0,
                    'mukimDivorcedCount' => 0,
                    'mukimWidowedCount' => 0,
                    'mukimHasBpjsKesehatanCount' => 0,
                    'mukimHasBpjsKetenagakerjaanCount' => 0,
                    'mukimBelumBpjsKetenagakerjaanCount' => 0,
                    'mukimHasEktpCount' => 0,
                    'mukimBelumEktpCount' => 0,
                    'mukimHasAktaKelahiranCount' => 0,
                    'mukimBelumAktaKelahiranCount' => 0,
                    'mukimKkPerluPerbaikanCount' => 0,
                ],
                'recentKartuKeluarga' => [],
                'recentAnggotaKeluarga' => [],
                'activityStatistics' => [
                    'today' => 0,
                    'this_week' => 0,
                    'this_month' => 0,
                    'recent_activities' => [],
                ],
            ]);
        }
    }
}