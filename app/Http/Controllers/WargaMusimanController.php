<?php

namespace App\Http\Controllers;

use App\Models\AnggotaKeluarga;
use App\Models\KartuKeluarga;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WargaMusimanController extends Controller
{
    /**
     * Display a listing of warga musiman.
     */
    public function index(Request $request): Response
    {
        $query = AnggotaKeluarga::with(['kartuKeluarga', 'creator', 'province', 'regency', 'district', 'village'])
            ->wargaMusiman()
            ->orderBy('created_at', 'desc');

        // Filter berdasarkan status aktif
        if ($request->has('status') && $request->status !== '') {
            $query->where('status_aktif', $request->boolean('status'));
        }

        // Search berdasarkan nama atau NIK
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('alamat_asal', 'like', "%{$search}%");
            });
        }

        $wargaMusiman = $query->paginate(10)->withQueryString();

        return Inertia::render('WargaMusiman/Index', [
            'wargaMusiman' => $wargaMusiman,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new warga musiman.
     */
    public function create(): Response
    {
        $kartuKeluarga = KartuKeluarga::select('no_kk', 'nama_kepala_keluarga')
            ->whereNotNull('no_kk')
            ->where('no_kk', '!=', '')
            ->orderBy('nama_kepala_keluarga')
            ->get();

        return Inertia::render('WargaMusiman/Create', [
            'kartuKeluarga' => $kartuKeluarga,
        ]);
    }

    /**
     * Store a newly created warga musiman in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'no_kk' => 'required|string|exists:kartu_keluarga,no_kk',
            'nama_lengkap' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:anggota_keluarga,nik',
            'jenis_kelamin' => 'required|in:LAKI-LAKI,PEREMPUAN',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date|before_or_equal:today',
            'agama' => 'required|string|max:255',
            'pendidikan' => 'nullable|string|max:255',
            'jenis_pekerjaan' => 'nullable|string|max:255',
            'status_perkawinan' => 'required|in:belum_kawin,kawin,cerai_hidup,cerai_mati',
            'status_hubungan_dalam_keluarga' => 'required|string|max:255',
            'status_hubungan_custom' => 'nullable|string|max:255',
            'kewarganegaraan' => 'required|string|max:255',
            // Warga Musiman fields
            'tanggal_mulai' => 'required|date|after_or_equal:today',
            'tanggal_selesai' => 'nullable|date|after:tanggal_mulai',
            'alamat_asal' => 'nullable|string|max:500',
            'province_id' => 'nullable|exists:reg_provinces,id',
            'regency_id' => 'nullable|exists:reg_regencies,id',
            'district_id' => 'nullable|exists:reg_districts,id',
            'village_id' => 'nullable|exists:reg_villages,id',
            'rt' => 'nullable|string|max:10',
            'rw' => 'nullable|string|max:10',
            'alasan_kedatangan' => 'required|string|max:1000',
            'nomor_telepon_darurat' => 'nullable|string|max:20',
            'nama_kontak_darurat' => 'nullable|string|max:255',
            'hubungan_kontak_darurat' => 'nullable|string|max:255',
        ]);

        // Get the next no_urut for this kartu keluarga
        $lastAnggota = AnggotaKeluarga::where('no_kk', $validated['no_kk'])
            ->orderBy('no_urut', 'desc')
            ->first();

        $nextNoUrut = $lastAnggota ? $lastAnggota->no_urut + 1 : 1;

        AnggotaKeluarga::create([
            ...$validated,
            'no_urut' => $nextNoUrut,
            'is_warga_musiman' => true,
            'status_aktif' => true,
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('warga-musiman.index')
            ->with('message', 'Warga Musiman berhasil ditambahkan.');
    }

    /**
     * Display the specified warga musiman.
     *
     * @param \App\Models\AnggotaKeluarga $wargaMusiman
     * @return \Inertia\Response
     */
    public function show(AnggotaKeluarga $wargaMusiman): Response
    {
        // Ensure this is a warga musiman
        if (!$wargaMusiman->is_warga_musiman) {
            abort(404);
        }

        $wargaMusiman->load(['kartuKeluarga', 'creator', 'province', 'regency', 'district', 'village']);

        return Inertia::render('WargaMusiman/Show', [
            'wargaMusiman' => $wargaMusiman,
        ]);
    }

    /**
     * Show the form for editing the specified warga musiman.
     *
     * @param \App\Models\AnggotaKeluarga $wargaMusiman
     * @return \Inertia\Response
     */
    public function edit(AnggotaKeluarga $wargaMusiman): Response
    {
        // Ensure this is a warga musiman
        if (!$wargaMusiman->is_warga_musiman) {
            abort(404);
        }

        $kartuKeluarga = KartuKeluarga::select('no_kk', 'nama_kepala_keluarga')
            ->whereNotNull('no_kk')
            ->where('no_kk', '!=', '')
            ->orderBy('nama_kepala_keluarga')
            ->get();

        return Inertia::render('WargaMusiman/Edit', [
            'wargaMusiman' => $wargaMusiman,
            'kartuKeluarga' => $kartuKeluarga,
        ]);
    }

    /**
     * Update the specified warga musiman in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\AnggotaKeluarga $wargaMusiman
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, AnggotaKeluarga $wargaMusiman): RedirectResponse
    {
        // Ensure this is a warga musiman
        if (!$wargaMusiman->is_warga_musiman) {
            abort(404);
        }

        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:anggota_keluarga,nik,' . $wargaMusiman->id,
            'jenis_kelamin' => 'required|in:LAKI-LAKI,PEREMPUAN',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date|before_or_equal:today',
            'agama' => 'required|string|max:255',
            'pendidikan' => 'nullable|string|max:255',
            'jenis_pekerjaan' => 'nullable|string|max:255',
            'status_perkawinan' => 'required|in:belum_kawin,kawin,cerai_hidup,cerai_mati',
            'status_hubungan_dalam_keluarga' => 'required|string|max:255',
            'status_hubungan_custom' => 'nullable|string|max:255',
            'kewarganegaraan' => 'required|string|max:255',
            // Warga Musiman fields
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after:tanggal_mulai',
            'alamat_asal' => 'nullable|string|max:500',
            'province_id' => 'nullable|exists:reg_provinces,id',
            'regency_id' => 'nullable|exists:reg_regencies,id',
            'district_id' => 'nullable|exists:reg_districts,id',
            'village_id' => 'nullable|exists:reg_villages,id',
            'rt' => 'nullable|string|max:10',
            'rw' => 'nullable|string|max:10',
            'alasan_kedatangan' => 'required|string|max:1000',
            'nomor_telepon_darurat' => 'nullable|string|max:20',
            'nama_kontak_darurat' => 'nullable|string|max:255',
            'hubungan_kontak_darurat' => 'nullable|string|max:255',
            'status_aktif' => 'boolean',
        ]);

        $wargaMusiman->update($validated);

        return redirect()->route('warga-musiman.index')
            ->with('message', 'Warga Musiman berhasil diperbarui.');
    }

    /**
     * Remove the specified warga musiman from storage.
     *
     * @param \App\Models\AnggotaKeluarga $wargaMusiman
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(AnggotaKeluarga $wargaMusiman): RedirectResponse
    {
        // Ensure this is a warga musiman
        if (!$wargaMusiman->is_warga_musiman) {
            abort(404);
        }

        $wargaMusiman->delete();

        return redirect()->route('warga-musiman.index')
            ->with('message', 'Warga Musiman berhasil dihapus.');
    }

    /**
     * Toggle status aktif warga musiman.
     *
     * @param \App\Models\AnggotaKeluarga $wargaMusiman
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggleStatus(AnggotaKeluarga $wargaMusiman): RedirectResponse
    {
        // Ensure this is a warga musiman
        if (!$wargaMusiman->is_warga_musiman) {
            abort(404);
        }

        $wargaMusiman->update([
            'status_aktif' => !$wargaMusiman->status_aktif,
        ]);

        $status = $wargaMusiman->status_aktif ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()
            ->with('message', "Status warga musiman berhasil {$status}.");
    }
}
