<?php

namespace App\Http\Controllers;

use App\Models\AnggotaKeluarga;
use App\Models\KartuKeluarga;
use App\Traits\HasDataOwnership;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AnggotaKeluargaController extends Controller
{
    use HasDataOwnership, LogsActivity;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = AnggotaKeluarga::with('kartuKeluarga')
            ->where('is_warga_musiman', false); // Only show non-seasonal residents
        
        // Apply ownership filter for operators
        $query = $this->applyOwnershipFilter($query);
        
        // Add search functionality
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('no_kk', 'like', "%{$search}%");
            });
        }
        
        $anggotaKeluarga = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        
        return Inertia::render('anggota-keluarga/index', [
            'anggotaKeluarga' => $anggotaKeluarga,
            'filters' => $request->only(['search']),
            'can' => [
                'create' => auth()->user()->hasPermission('anggota-keluarga.create'),
                'edit' => auth()->user()->hasPermission('anggota-keluarga.edit'),
                'delete' => auth()->user()->hasPermission('anggota-keluarga.delete'),
                'view_all' => $this->canAccessAllData(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $query = KartuKeluarga::query();
        
        // Apply ownership filter - operators can only add members to their own kartu keluarga
        $query = $this->applyOwnershipFilter($query);
        
        $kartuKeluarga = $query->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('anggota-keluarga/create', [
            'kartuKeluarga' => $kartuKeluarga,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'no_kk' => 'required|exists:kartu_keluarga,no_kk',
            'no_urut' => 'required|integer',
            'nama_lengkap' => 'required|string|max:100',
            'nik' => 'required|unique:anggota_keluarga,nik',
            'jenis_kelamin' => 'nullable|in:LAKI-LAKI,PEREMPUAN',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'agama' => 'nullable|string|max:50',
            'pendidikan' => 'nullable|string|max:100',
            'jenis_pekerjaan' => 'nullable|string|max:100',
            'golongan_darah' => 'nullable|string|max:5',
            'status_perkawinan' => 'nullable|in:KAWIN TERCATAT,BELUM KAWIN,CERAI HIDUP,CERAI MATI',
            'tanggal_perkawinan' => 'nullable|date',
            'status_hubungan_dalam_keluarga' => 'nullable|string|max:50',
            'status_hubungan_custom' => 'nullable|string|max:100',
            'kewarganegaraan' => 'nullable|in:WNI,WNA',
            'no_paspor' => 'nullable|string|max:50',
            'no_kitap' => 'nullable|string|max:50',
            'nama_ayah' => 'nullable|string|max:100',
            'nama_ibu' => 'nullable|string|max:100',
            // Validation untuk atribut sosial survey - menggunakan field names yang benar
            'is_masyarakat_miskin' => 'boolean',
            'has_bpjs_kesehatan' => 'boolean',
            'status_bpjs_kesehatan' => 'nullable|string', // Field dari form
            'jenis_bpjs_kesehatan' => 'nullable|string', // Field dari form 
            'detail_nonpbi_bpjs' => 'nullable|string',
            'is_bpjs_kesehatan_aktif' => 'boolean', // Field dari form
            'has_bpjs_ketenagakerjaan' => 'boolean',
            'status_e_ktp' => 'nullable|string', // Field dari form
            'status_kk_update' => 'nullable|string', // Field dari form
            'has_akta_kelahiran' => 'boolean',
            'catatan_sosial' => 'nullable|string',
        ]);

        // Map form fields to database fields
        $data = $request->only([
            'no_kk', 'no_urut', 'nama_lengkap', 'nik', 'jenis_kelamin',
            'tempat_lahir', 'tanggal_lahir', 'agama', 'pendidikan', 'jenis_pekerjaan',
            'golongan_darah', 'status_perkawinan', 'tanggal_perkawinan', 
            'status_hubungan_dalam_keluarga', 'status_hubungan_custom', 'kewarganegaraan', 'no_paspor', 'no_kitap',
            'nama_ayah', 'nama_ibu', 'catatan_sosial'
        ]);

        // Handle status hubungan custom logic
        if ($data['status_hubungan_dalam_keluarga'] !== 'Lainnya') {
            $data['status_hubungan_custom'] = null;
        }

        // Map social survey fields correctly
        $data['is_masyarakat_miskin'] = $request->boolean('is_masyarakat_miskin');
        $data['has_bpjs_kesehatan'] = $request->boolean('has_bpjs_kesehatan');
        $data['status_bpjs_kesehatan_aktif'] = $request->boolean('is_bpjs_kesehatan_aktif');
        
        // Map BPJS type from form to database format
        if ($request->input('status_bpjs_kesehatan') === 'PBI_NEGARA') {
            $data['jenis_keanggotaan_bpjs'] = 'pbi';
        } elseif ($request->input('status_bpjs_kesehatan') === 'NON_PBI') {
            $data['jenis_keanggotaan_bpjs'] = 'non-pbi';
        } else {
            $data['jenis_keanggotaan_bpjs'] = null;
        }
        
        $data['detail_nonpbi_bpjs'] = $request->input('detail_nonpbi_bpjs');
        $data['has_bpjs_ketenagakerjaan'] = $request->boolean('has_bpjs_ketenagakerjaan');
        
        // Map E-KTP status from form to database format
        $status_e_ktp = $request->input('status_e_ktp');
        $data['has_e_ktp'] = !empty($status_e_ktp) && $status_e_ktp !== 'BELUM_PUNYA';
        
        if ($status_e_ktp === 'SUDAH_PUNYA_BAGUS') {
            $data['kondisi_e_ktp'] = 'baik';
        } elseif ($status_e_ktp === 'SUDAH_PUNYA_RUSAK') {
            $data['kondisi_e_ktp'] = 'rusak';
        } else {
            $data['kondisi_e_ktp'] = null;
        }
        
        // Map KK update status from form to database format
        $data['perlu_update_kk'] = $request->input('status_kk_update') === 'PERLU_UPDATE';
        $data['has_akta_kelahiran'] = $request->boolean('has_akta_kelahiran');

        // Set created_by for data ownership
        $this->setCreatedBy($data);

        $anggotaKeluarga = AnggotaKeluarga::create($data);

        // Log activity
        $this->logCreate('anggota_keluarga', "Menambahkan anggota keluarga: {$anggotaKeluarga->nama_lengkap}", $anggotaKeluarga->toArray());

        return redirect()->route('anggota-keluarga.index')->with('success', 'Anggota keluarga created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(AnggotaKeluarga $anggotaKeluarga)
    {
        // Check if user can access this record
        if (!$this->canAccessRecord($anggotaKeluarga)) {
            abort(403, 'You do not have permission to view this record.');
        }

        return Inertia::render('anggota-keluarga/show', [
            'anggotaKeluarga' => $anggotaKeluarga,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AnggotaKeluarga $anggotaKeluarga)
    {
        // Check if user can access this record
        if (!$this->canAccessRecord($anggotaKeluarga)) {
            abort(403, 'You do not have permission to edit this record.');
        }

        $query = KartuKeluarga::query();
        
        // Apply ownership filter for operators
        $query = $this->applyOwnershipFilter($query);
        
        $kartuKeluarga = $query->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('anggota-keluarga/edit', [
            'anggotaKeluarga' => $anggotaKeluarga,
            'kartuKeluarga' => $kartuKeluarga,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AnggotaKeluarga $anggotaKeluarga)
    {
        $request->validate([
            'no_kk' => 'required|exists:kartu_keluarga,no_kk',
            'no_urut' => 'required|integer',
            'nama_lengkap' => 'required|string|max:100',
            'nik' => [
                'required',
                Rule::unique('anggota_keluarga', 'nik')->ignore($anggotaKeluarga)
            ],
            'jenis_kelamin' => 'nullable|in:LAKI-LAKI,PEREMPUAN',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'agama' => 'nullable|string|max:50',
            'pendidikan' => 'nullable|string|max:100',
            'jenis_pekerjaan' => 'nullable|string|max:100',
            'golongan_darah' => 'nullable|string|max:5',
            'status_perkawinan' => 'nullable|in:KAWIN TERCATAT,BELUM KAWIN,CERAI HIDUP,CERAI MATI',
            'tanggal_perkawinan' => 'nullable|date',
            'status_hubungan_dalam_keluarga' => 'nullable|string|max:50',
            'status_hubungan_custom' => 'nullable|string|max:100',
            'kewarganegaraan' => 'nullable|in:WNI,WNA',
            'no_paspor' => 'nullable|string|max:50',
            'no_kitap' => 'nullable|string|max:50',
            'nama_ayah' => 'nullable|string|max:100',
            'nama_ibu' => 'nullable|string|max:100',
            // Validation untuk atribut sosial survey - menggunakan field names yang benar
            'is_masyarakat_miskin' => 'boolean',
            'has_bpjs_kesehatan' => 'boolean',
            'status_bpjs_kesehatan' => 'nullable|string', // Field dari form
            'jenis_bpjs_kesehatan' => 'nullable|string', // Field dari form 
            'detail_nonpbi_bpjs' => 'nullable|string',
            'is_bpjs_kesehatan_aktif' => 'boolean', // Field dari form
            'has_bpjs_ketenagakerjaan' => 'boolean',
            'status_e_ktp' => 'nullable|string', // Field dari form
            'status_kk_update' => 'nullable|string', // Field dari form
            'has_akta_kelahiran' => 'boolean',
            'catatan_sosial' => 'nullable|string',
        ]);

        // Map form fields to database fields - same logic as store method
        $data = $request->only([
            'no_kk', 'no_urut', 'nama_lengkap', 'nik', 'jenis_kelamin',
            'tempat_lahir', 'tanggal_lahir', 'agama', 'pendidikan', 'jenis_pekerjaan',
            'golongan_darah', 'status_perkawinan', 'tanggal_perkawinan', 
            'status_hubungan_dalam_keluarga', 'status_hubungan_custom', 'kewarganegaraan', 'no_paspor', 'no_kitap',
            'nama_ayah', 'nama_ibu', 'catatan_sosial'
        ]);

        // Handle status hubungan custom logic
        if ($data['status_hubungan_dalam_keluarga'] !== 'Lainnya') {
            $data['status_hubungan_custom'] = null;
        }

        // Map social survey fields correctly - consistent with store method
        $data['is_masyarakat_miskin'] = $request->boolean('is_masyarakat_miskin');
        $data['has_bpjs_kesehatan'] = $request->boolean('has_bpjs_kesehatan');
        $data['status_bpjs_kesehatan_aktif'] = $request->boolean('is_bpjs_kesehatan_aktif');
        
        // Map BPJS type from form to database format
        if ($request->input('status_bpjs_kesehatan') === 'PBI_NEGARA') {
            $data['jenis_keanggotaan_bpjs'] = 'pbi';
        } elseif ($request->input('status_bpjs_kesehatan') === 'NON_PBI') {
            $data['jenis_keanggotaan_bpjs'] = 'non-pbi';
        } else {
            $data['jenis_keanggotaan_bpjs'] = null;
        }
        
        $data['detail_nonpbi_bpjs'] = $request->input('detail_nonpbi_bpjs');
        $data['has_bpjs_ketenagakerjaan'] = $request->boolean('has_bpjs_ketenagakerjaan');
        
        // Map E-KTP status from form to database format
        $status_e_ktp = $request->input('status_e_ktp');
        $data['has_e_ktp'] = !empty($status_e_ktp) && $status_e_ktp !== 'BELUM_PUNYA';
        
        if ($status_e_ktp === 'SUDAH_PUNYA_BAGUS') {
            $data['kondisi_e_ktp'] = 'baik';
        } elseif ($status_e_ktp === 'SUDAH_PUNYA_RUSAK') {
            $data['kondisi_e_ktp'] = 'rusak';
        } else {
            $data['kondisi_e_ktp'] = null;
        }
        
        // Map KK update status from form to database format
        $data['perlu_update_kk'] = $request->input('status_kk_update') === 'PERLU_UPDATE';
        $data['has_akta_kelahiran'] = $request->boolean('has_akta_kelahiran');

        // Store old data for logging
        $oldData = $anggotaKeluarga->toArray();
        
        $anggotaKeluarga->update($data);

        // Log activity
        $this->logUpdate('anggota_keluarga', "Mengubah data anggota keluarga: {$anggotaKeluarga->nama_lengkap}", $oldData, $anggotaKeluarga->fresh()->toArray());

        return redirect()->route('anggota-keluarga.index')->with('success', 'Anggota keluarga updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AnggotaKeluarga $anggotaKeluarga)
    {
        // Check if user can access this record
        if (!$this->canAccessRecord($anggotaKeluarga)) {
            abort(403, 'You do not have permission to delete this record.');
        }

        $anggotaKeluarga->delete();

        // Log activity
        $this->logDelete('anggota_keluarga', "Menghapus anggota keluarga: {$anggotaKeluarga->nama_lengkap}", $anggotaKeluarga->toArray());

        return redirect()->route('anggota-keluarga.index')->with('success', 'Anggota keluarga deleted successfully.');
    }
}