<?php

namespace App\Http\Controllers;

use App\Models\KartuKeluarga;
use App\Models\AnggotaKeluarga;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class DashboardControllerNew extends Controller
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
                
                // Get recent family cards
                $recentKartuKeluarga = KartuKeluarga::orderBy('created_at', 'desc')->limit(5)->get();
                
                // Get recent family members
                $recentAnggotaKeluarga = AnggotaKeluarga::orderBy('created_at', 'desc')->limit(5)->get();

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
                ],
                'recentKartuKeluarga' => $recentKartuKeluarga,
                'recentAnggotaKeluarga' => $recentAnggotaKeluarga,
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
                ],
                'recentKartuKeluarga' => [],
                'recentAnggotaKeluarga' => [],
            ]);
        }
    }
}
