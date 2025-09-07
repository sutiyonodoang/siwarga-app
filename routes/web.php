<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Debug route for testing data access
Route::get('/debug-data', function () {
    if (!auth()->check()) {
        return response()->json(['error' => 'Not logged in']);
    }
    
    $user = auth()->user();
    
    // Test direct queries like in controller
    $kkQuery = \App\Models\KartuKeluarga::query();
    
    // Simulate the same filtering as controller
    if ($user->hasRole('operator') && !$user->hasRole('admin')) {
        $kkQuery = $kkQuery->where('created_by', $user->id);
    }
    
    $akQuery = \App\Models\AnggotaKeluarga::with('kartuKeluarga')
        ->where('is_warga_musiman', false);
        
    if ($user->hasRole('operator') && !$user->hasRole('admin')) {
        $akQuery = $akQuery->where('created_by', $user->id);
    }
    
    return response()->json([
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'roles' => $user->roles->pluck('name'),
            'permissions' => [
                'kartu_keluarga_read' => $user->hasPermission('kartu_keluarga_read'),
                'anggota_keluarga_read' => $user->hasPermission('anggota_keluarga_read'),
            ]
        ],
        'data_counts' => [
            'total_kartu_keluarga' => \App\Models\KartuKeluarga::count(),
            'total_anggota_keluarga' => \App\Models\AnggotaKeluarga::count(),
            'filtered_kartu_keluarga' => $kkQuery->count(),
            'filtered_anggota_keluarga' => $akQuery->count(),
        ],
        'sample_data' => [
            'kartu_keluarga' => $kkQuery->take(5)->get(['no_kk', 'nama_kepala_keluarga', 'created_by']),
            'anggota_keluarga' => $akQuery->take(5)->get(['nama_lengkap', 'no_kk', 'created_by', 'is_warga_musiman']),
        ]
    ]);
});

// Simple GET test route
Route::get('test-simple', function() {
    \Log::info('Simple GET test route called');
    return response()->json(['message' => 'GET route working', 'time' => now()]);
});

// Test route without CSRF
Route::post('test-kartu-keluarga', function(\Illuminate\Http\Request $request) {
    \Log::info('Test route called with data:', $request->all());
    \Log::info('Request headers:', $request->headers->all());
    \Log::info('Request method: ' . $request->method());
    
    try {
        $kartuKeluarga = \App\Models\KartuKeluarga::create([
            'no_kk' => $request->no_kk,
            'nama_kepala_keluarga' => $request->nama_kepala_keluarga,
            'alamat' => $request->alamat,
            'rt_rw' => $request->rt_rw ?: null,
            'provinsi' => $request->provinsi ?: null,
            'kabupaten_kota' => $request->kabupaten_kota ?: null,
            'kecamatan' => $request->kecamatan ?: null,
            'desa_kelurahan' => $request->desa_kelurahan ?: null,
            'kode_pos' => $request->kode_pos ?: null,
            'tanggal_dikeluarkan' => $request->tanggal_dikeluarkan ?: null,
            // Convert numeric IDs to string
            'province_id' => $request->province_id ? (string)$request->province_id : null,
            'regency_id' => $request->regency_id ? (string)$request->regency_id : null,
            'district_id' => $request->district_id ? (string)$request->district_id : null,
            'village_id' => $request->village_id ? (string)$request->village_id : null,
        ]);
        
        \Log::info('KartuKeluarga created via test route:', $kartuKeluarga->toArray());
        
        return response()->json([
            'success' => true,
            'data' => $kartuKeluarga,
            'message' => 'Data berhasil disimpan via test route'
        ]);
    } catch (\Exception $e) {
        \Log::error('Error in test route:', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
        
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
})->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

// Regional data autocomplete routes - moved outside auth middleware for easier access
Route::prefix('api/regions')->group(function () {
    Route::get('provinces', [\App\Http\Controllers\Api\RegionController::class, 'provinces'])->name('api.regions.provinces');
    Route::get('regencies', [\App\Http\Controllers\Api\RegionController::class, 'regencies'])->name('api.regions.regencies');
    Route::get('districts', [\App\Http\Controllers\Api\RegionController::class, 'districts'])->name('api.regions.districts');
    Route::get('villages', [\App\Http\Controllers\Api\RegionController::class, 'villages'])->name('api.regions.villages');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Kartu Keluarga routes with permissions
    Route::middleware('permission:kartu_keluarga_read')->group(function () {
        Route::get('kartu-keluarga', [\App\Http\Controllers\KartuKeluargaController::class, 'index'])->name('kartu-keluarga.index');
    });
    
    Route::middleware('permission:kartu_keluarga_create')->group(function () {
        Route::get('kartu-keluarga/create', [\App\Http\Controllers\KartuKeluargaController::class, 'create'])->name('kartu-keluarga.create');
        Route::post('kartu-keluarga', [\App\Http\Controllers\KartuKeluargaController::class, 'store'])->name('kartu-keluarga.store');
    });
    
    Route::middleware('permission:kartu_keluarga_edit')->group(function () {
        Route::get('kartu-keluarga/{kartuKeluarga}/edit', [\App\Http\Controllers\KartuKeluargaController::class, 'edit'])->name('kartu-keluarga.edit');
        Route::put('kartu-keluarga/{kartuKeluarga}', [\App\Http\Controllers\KartuKeluargaController::class, 'update'])->name('kartu-keluarga.update');
        Route::patch('kartu-keluarga/{kartuKeluarga}', [\App\Http\Controllers\KartuKeluargaController::class, 'update'])->name('kartu-keluarga.update');
    });
    
    Route::middleware('permission:kartu_keluarga_delete')->group(function () {
        Route::delete('kartu-keluarga/{kartuKeluarga}', [\App\Http\Controllers\KartuKeluargaController::class, 'destroy'])->name('kartu-keluarga.destroy');
    });
    
    Route::middleware('permission:kartu_keluarga_read')->group(function () {
        Route::get('kartu-keluarga/{kartuKeluarga}', [\App\Http\Controllers\KartuKeluargaController::class, 'show'])->name('kartu-keluarga.show');
    });
    
    // Anggota Keluarga routes with permissions
    Route::middleware('permission:anggota_keluarga_read')->group(function () {
        Route::get('anggota-keluarga', [\App\Http\Controllers\AnggotaKeluargaController::class, 'index'])->name('anggota-keluarga.index');
    });
    
    Route::middleware('permission:anggota_keluarga_create')->group(function () {
        Route::get('anggota-keluarga/create', [\App\Http\Controllers\AnggotaKeluargaController::class, 'create'])->name('anggota-keluarga.create');
        Route::post('anggota-keluarga', [\App\Http\Controllers\AnggotaKeluargaController::class, 'store'])->name('anggota-keluarga.store');
    });
    
    Route::middleware('permission:anggota_keluarga_edit')->group(function () {
        Route::get('anggota-keluarga/{anggotaKeluarga}/edit', [\App\Http\Controllers\AnggotaKeluargaController::class, 'edit'])->name('anggota-keluarga.edit');
        Route::put('anggota-keluarga/{anggotaKeluarga}', [\App\Http\Controllers\AnggotaKeluargaController::class, 'update'])->name('anggota-keluarga.update');
        Route::patch('anggota-keluarga/{anggotaKeluarga}', [\App\Http\Controllers\AnggotaKeluargaController::class, 'update'])->name('anggota-keluarga.update');
    });
    
    Route::middleware('permission:anggota_keluarga_delete')->group(function () {
        Route::delete('anggota-keluarga/{anggotaKeluarga}', [\App\Http\Controllers\AnggotaKeluargaController::class, 'destroy'])->name('anggota-keluarga.destroy');
    });
    
    Route::middleware('permission:anggota_keluarga_read')->group(function () {
        Route::get('anggota-keluarga/{anggotaKeluarga}', [\App\Http\Controllers\AnggotaKeluargaController::class, 'show'])->name('anggota-keluarga.show');
    });
    
    // Warga Musiman routes with permissions
    Route::middleware('permission:warga_musiman_read')->group(function () {
        Route::get('warga-musiman', [\App\Http\Controllers\WargaMusimanController::class, 'index'])->name('warga-musiman.index');
    });
    
    Route::middleware('permission:warga_musiman_create')->group(function () {
        Route::get('warga-musiman/create', [\App\Http\Controllers\WargaMusimanController::class, 'create'])->name('warga-musiman.create');
        Route::post('warga-musiman', [\App\Http\Controllers\WargaMusimanController::class, 'store'])->name('warga-musiman.store');
    });
    
    Route::middleware('permission:warga_musiman_edit')->group(function () {
        Route::get('warga-musiman/{wargaMusiman}/edit', [\App\Http\Controllers\WargaMusimanController::class, 'edit'])->name('warga-musiman.edit');
        Route::put('warga-musiman/{wargaMusiman}', [\App\Http\Controllers\WargaMusimanController::class, 'update'])->name('warga-musiman.update');
        Route::patch('warga-musiman/{wargaMusiman}', [\App\Http\Controllers\WargaMusimanController::class, 'update'])->name('warga-musiman.update');
        Route::patch('warga-musiman/{wargaMusiman}/toggle-status', [\App\Http\Controllers\WargaMusimanController::class, 'toggleStatus'])->name('warga-musiman.toggle-status');
    });
    
    Route::middleware('permission:warga_musiman_delete')->group(function () {
        Route::delete('warga-musiman/{wargaMusiman}', [\App\Http\Controllers\WargaMusimanController::class, 'destroy'])->name('warga-musiman.destroy');
    });
    
    Route::middleware('permission:warga_musiman_read')->group(function () {
        Route::get('warga-musiman/{wargaMusiman}', [\App\Http\Controllers\WargaMusimanController::class, 'show'])->name('warga-musiman.show');
    });
    
    // User Management routes with permissions
    Route::middleware('permission:user_read')->group(function () {
        Route::get('users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
    });
    
    Route::middleware('permission:user_create')->group(function () {
        Route::get('users/create', [\App\Http\Controllers\UserController::class, 'create'])->name('users.create');
        Route::post('users', [\App\Http\Controllers\UserController::class, 'store'])->name('users.store');
    });
    
    Route::middleware('permission:user_edit')->group(function () {
        Route::get('users/{user}/edit', [\App\Http\Controllers\UserController::class, 'edit'])->name('users.edit');
        Route::put('users/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('users.update');
        Route::patch('users/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('users.update');
        Route::patch('users/{user}/toggle-status', [\App\Http\Controllers\UserController::class, 'toggleStatus'])
            ->name('users.toggle-status');
    });
    
    Route::middleware('permission:user_delete')->group(function () {
        Route::delete('users/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])->name('users.destroy');
    });
    
    Route::middleware('permission:user_read')->group(function () {
        Route::get('users/{user}', [\App\Http\Controllers\UserController::class, 'show'])->name('users.show');
    });
    
    // Role Management routes
    Route::middleware('permission:user_edit')->group(function () {
        Route::get('roles', [\App\Http\Controllers\RoleController::class, 'index'])->name('roles.index');
        Route::post('roles/assign-to-user', [\App\Http\Controllers\RoleController::class, 'assignToUser'])->name('roles.assign-to-user');
        Route::post('roles/remove-from-user', [\App\Http\Controllers\RoleController::class, 'removeFromUser'])->name('roles.remove-from-user');
    });
    
    // User Activity Logs routes
    Route::middleware('permission:user_activity_log_read')->group(function () {
        Route::get('user-activity-logs', [\App\Http\Controllers\UserActivityLogController::class, 'index'])->name('user-activity-logs.index');
        Route::get('user-activity-logs/{userActivityLog}', [\App\Http\Controllers\UserActivityLogController::class, 'show'])->name('user-activity-logs.show');
    });
    
    // API routes for activity statistics
    Route::get('api/activity-statistics', [\App\Http\Controllers\UserActivityLogController::class, 'getStatistics']);
    
    // API routes for role management
    Route::get('api/users-with-roles', [\App\Http\Controllers\RoleController::class, 'getUsersWithRoles']);
    Route::get('api/roles', [\App\Http\Controllers\RoleController::class, 'getRoles']);
    
    // Test role system
    Route::get('test-roles', [\App\Http\Controllers\TestRoleController::class, 'testRoles']);
    
    // Debug route for kartu keluarga
    Route::post('debug-kartu-keluarga', function(\Illuminate\Http\Request $request) {
        \Log::info('Debug route called with data:', $request->all());
        return response()->json([
            'success' => true,
            'data' => $request->all(),
            'message' => 'Debug route working'
        ]);
    });
    
    // Database check route
    Route::get('check-database', function() {
        try {
            $count = \App\Models\KartuKeluarga::count();
            $latest = \App\Models\KartuKeluarga::latest()->limit(3)->get();
            return response()->json([
                'total_records' => $count,
                'latest_records' => $latest,
                'message' => 'Database accessible'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'Database error'
            ]);
        }
    });
    
    // Test route for regional data
    Route::get('test-regional', function () {
        try {
            $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table'");
            return response()->json($tables);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
