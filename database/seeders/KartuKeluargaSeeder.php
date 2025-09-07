<?php

namespace Database\Seeders;

use App\Models\KartuKeluarga;
use Illuminate\Database\Seeder;

class KartuKeluargaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        KartuKeluarga::create([
            'no_kk' => '3171012345678901',
            'nama_kepala_keluarga' => 'Budi Santoso',
            'alamat' => 'Jl. Merdeka No. 123',
            'rt' => '001',
            'rw' => '002',
            'kode_pos' => '12345',
            'desa_kelurahan' => 'Menteng',
            'kecamatan' => 'Menteng',
            'kabupaten_kota' => 'Jakarta Pusat',
            'provinsi' => 'DKI Jakarta',
        ]);

        KartuKeluarga::create([
            'no_kk' => '3171012345678902',
            'nama_kepala_keluarga' => 'Siti Nurhaliza',
            'alamat' => 'Jl. Sudirman No. 456',
            'rt' => '003',
            'rw' => '004',
            'kode_pos' => '12346',
            'desa_kelurahan' => 'Senayan',
            'kecamatan' => 'Kebayoran Baru',
            'kabupaten_kota' => 'Jakarta Selatan',
            'provinsi' => 'DKI Jakarta',
        ]);

        KartuKeluarga::create([
            'no_kk' => '3171012345678903',
            'nama_kepala_keluarga' => 'Ahmad Wijaya',
            'alamat' => 'Jl. Gatot Subroto No. 789',
            'rt' => '005',
            'rw' => '006',
            'kode_pos' => '12347',
            'desa_kelurahan' => 'Kuningan',
            'kecamatan' => 'Setiabudi',
            'kabupaten_kota' => 'Jakarta Selatan',
            'provinsi' => 'DKI Jakarta',
        ]);
    }
}
