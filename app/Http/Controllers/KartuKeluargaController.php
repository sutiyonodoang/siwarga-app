<?php

namespace App\Http\Controllers;

use App\Models\KartuKeluarga;
use App\Traits\HasDataOwnership;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KartuKeluargaController extends Controller
{
    use HasDataOwnership;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = KartuKeluarga::query();
        
        // Apply ownership filter for operators
        $query = $this->applyOwnershipFilter($query);
        
        // Add search functionality
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_kepala_keluarga', 'like', "%{$search}%")
                  ->orWhere('no_kk', 'like', "%{$search}%")
                  ->orWhere('alamat', 'like', "%{$search}%");
            });
        }
        
        $kartuKeluarga = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        
        return Inertia::render('kartu-keluarga/index', [
            'kartuKeluarga' => $kartuKeluarga,
            'filters' => $request->only(['search']),
            'can' => [
                'create' => auth()->user()->hasPermission('kartu-keluarga.create'),
                'edit' => auth()->user()->hasPermission('kartu-keluarga.edit'),
                'delete' => auth()->user()->hasPermission('kartu-keluarga.delete'),
                'view_all' => $this->canAccessAllData(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('kartu-keluarga/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Debug logging
        \Log::info('KartuKeluarga store method called');
        \Log::info('Request data:', $request->all());
        \Log::info('Request method: ' . $request->method());
        \Log::info('Request URL: ' . $request->url());
        
        try {
            $validatedData = $request->validate([
                'no_kk' => [
                    'required',
                    'digits:16',
                    'numeric',
                    'unique:kartu_keluarga,no_kk'
                ],
                'nama_kepala_keluarga' => 'required|string|max:100',
                'alamat' => 'required|string',
                'rt_rw' => 'nullable|string|max:10',
                'kode_pos' => 'nullable|string|max:10',
                'desa_kelurahan' => 'nullable|string|max:100',
                'kecamatan' => 'nullable|string|max:100',
                'kabupaten_kota' => 'nullable|string|max:100',
                'provinsi' => 'nullable|string|max:100',
                'province_id' => 'nullable',  
                'regency_id' => 'nullable',   
                'district_id' => 'nullable',  
                'village_id' => 'nullable',
                'tanggal_dikeluarkan' => 'nullable|date',
                'qr_code' => 'nullable|string',
            ], [
                'no_kk.required' => 'Nomor KK harus diisi.',
                'no_kk.digits' => 'Nomor KK harus tepat 16 digit.',
                'no_kk.numeric' => 'Nomor KK hanya boleh berisi angka.',
                'no_kk.unique' => 'Nomor KK sudah terdaftar.',
                'nama_kepala_keluarga.required' => 'Nama kepala keluarga harus diisi.',
                'alamat.required' => 'Alamat harus diisi.',
            ]);

            // Clean up empty strings to null and convert IDs to string
            foreach (['province_id', 'regency_id', 'district_id', 'village_id'] as $field) {
                if (isset($validatedData[$field])) {
                    if ($validatedData[$field] === '' || $validatedData[$field] === null) {
                        $validatedData[$field] = null;
                    } else {
                        $validatedData[$field] = (string)$validatedData[$field];
                    }
                }
            }
            
            foreach (['rt_rw', 'kode_pos', 'tanggal_dikeluarkan', 'qr_code'] as $field) {
                if (isset($validatedData[$field]) && $validatedData[$field] === '') {
                    $validatedData[$field] = null;
                }
            }

            \Log::info('Validation passed, validated data:', $validatedData);

            // Set created_by for data ownership
            $this->setCreatedBy($validatedData);

            $kartuKeluarga = KartuKeluarga::create($validatedData);

            \Log::info('KartuKeluarga created successfully:', $kartuKeluarga->toArray());

            return redirect()->route('kartu-keluarga.index')->with('success', 'Kartu keluarga created successfully.');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed:', $e->errors());
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Error creating KartuKeluarga:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(KartuKeluarga $kartuKeluarga)
    {
        // Check if user can access this record
        if (!$this->canAccessRecord($kartuKeluarga)) {
            abort(403, 'You do not have permission to view this record.');
        }

        // Eager load anggota keluarga
        $kartuKeluarga->load('anggotaKeluarga');
        
        return Inertia::render('kartu-keluarga/show', [
            'kartuKeluarga' => $kartuKeluarga,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(KartuKeluarga $kartuKeluarga)
    {
        // Check if user can access this record
        if (!$this->canAccessRecord($kartuKeluarga)) {
            abort(403, 'You do not have permission to edit this record.');
        }

        // Convert date to Y-m-d format for input[type="date"]
        if ($kartuKeluarga->tanggal_dikeluarkan) {
            $kartuKeluarga->tanggal_dikeluarkan = \Carbon\Carbon::parse($kartuKeluarga->tanggal_dikeluarkan)->format('Y-m-d');
        }

        // Ensure region IDs are properly formatted
        $kartuKeluarga->province_id = $kartuKeluarga->province_id ? (string) $kartuKeluarga->province_id : null;
        $kartuKeluarga->regency_id = $kartuKeluarga->regency_id ? (string) $kartuKeluarga->regency_id : null;
        $kartuKeluarga->district_id = $kartuKeluarga->district_id ? (string) $kartuKeluarga->district_id : null;
        $kartuKeluarga->village_id = $kartuKeluarga->village_id ? (string) $kartuKeluarga->village_id : null;

        return Inertia::render('kartu-keluarga/edit', [
            'kartuKeluarga' => $kartuKeluarga,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, KartuKeluarga $kartuKeluarga)
    {
        $request->validate([
            'no_kk' => [
                'required',
                'digits:16',
                'numeric',
                'unique:kartu_keluarga,no_kk,' . $kartuKeluarga->no_kk . ',no_kk'
            ],
            'nama_kepala_keluarga' => 'required|string|max:100',
            'alamat' => 'required|string',
            'rt_rw' => 'nullable|string|max:10',
            'kode_pos' => 'nullable|string|max:10',
            'desa_kelurahan' => 'nullable|string|max:100',
            'kecamatan' => 'nullable|string|max:100',
            'kabupaten_kota' => 'nullable|string|max:100',
            'provinsi' => 'nullable|string|max:100',
            'province_id' => 'nullable',
            'regency_id' => 'nullable',
            'district_id' => 'nullable',
            'village_id' => 'nullable',
            'tanggal_dikeluarkan' => 'nullable|date',
            'qr_code' => 'nullable|string',
        ], [
            'no_kk.required' => 'Nomor KK harus diisi.',
            'no_kk.digits' => 'Nomor KK harus tepat 16 digit.',
            'no_kk.numeric' => 'Nomor KK hanya boleh berisi angka.',
            'no_kk.unique' => 'Nomor KK sudah terdaftar.',
        ]);

        $kartuKeluarga->update($request->all());

        return redirect()->route('kartu-keluarga.index')->with('success', 'Kartu keluarga updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KartuKeluarga $kartuKeluarga)
    {
        // Check if user can access this record
        if (!$this->canAccessRecord($kartuKeluarga)) {
            abort(403, 'You do not have permission to delete this record.');
        }

        $kartuKeluarga->delete();

        return redirect()->route('kartu-keluarga.index')->with('success', 'Kartu keluarga deleted successfully.');
    }
}