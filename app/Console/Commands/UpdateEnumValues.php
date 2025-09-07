<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Exception;

class UpdateEnumValues extends Command
{
    protected $signature = 'db:update-enum';
    protected $description = 'Update detail_nonpbi_bpjs enum values to support new BPJS categories';

    public function handle()
    {
        $this->info('Starting database schema update...');
        
        try {
            // Start transaction
            DB::beginTransaction();
            
            // Create a backup of the data
            DB::statement('CREATE TABLE anggota_keluarga_temp AS SELECT * FROM anggota_keluarga');
            $this->info('Created backup table...');
            
            // Drop the original table
            DB::statement('DROP TABLE anggota_keluarga');
            $this->info('Dropped original table...');
            
            // Recreate the table with updated enum values
            $sql = "
                CREATE TABLE anggota_keluarga (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    no_kk VARCHAR(16) NOT NULL,
                    no_urut INTEGER NOT NULL,
                    nama_lengkap VARCHAR(100) NOT NULL,
                    nik VARCHAR(16) UNIQUE NOT NULL,
                    jenis_kelamin TEXT CHECK(jenis_kelamin IN ('LAKI-LAKI', 'PEREMPUAN')),
                    tempat_lahir VARCHAR(100),
                    tanggal_lahir DATE,
                    agama VARCHAR(50),
                    pendidikan VARCHAR(100),
                    jenis_pekerjaan VARCHAR(100),
                    golongan_darah VARCHAR(5),
                    status_perkawinan TEXT CHECK(status_perkawinan IN ('KAWIN TERCATAT', 'BELUM KAWIN', 'CERAI HIDUP', 'CERAI MATI')),
                    tanggal_perkawinan DATE,
                    status_hubungan_dalam_keluarga VARCHAR(50),
                    kewarganegaraan TEXT CHECK(kewarganegaraan IN ('WNI', 'WNA')),
                    no_paspor VARCHAR(50),
                    no_kitap VARCHAR(50),
                    nama_ayah VARCHAR(100),
                    nama_ibu VARCHAR(100),
                    is_masyarakat_miskin BOOLEAN DEFAULT 0,
                    has_bpjs_kesehatan BOOLEAN DEFAULT 0,
                    status_bpjs_kesehatan_aktif BOOLEAN DEFAULT 0,
                    jenis_keanggotaan_bpjs TEXT CHECK(jenis_keanggotaan_bpjs IN ('pbi', 'non-pbi')),
                    detail_nonpbi_bpjs TEXT CHECK(detail_nonpbi_bpjs IN ('PPU', 'PBPU', 'BP', 'PBI_DAERAH', 'penerima-upah', 'bukan-penerima-upah')),
                    has_e_ktp BOOLEAN DEFAULT 0,
                    kondisi_e_ktp TEXT CHECK(kondisi_e_ktp IN ('baik', 'rusak', 'hilang')),
                    perlu_update_kk BOOLEAN DEFAULT 0,
                    has_akta_kelahiran BOOLEAN DEFAULT 0,
                    catatan_sosial TEXT,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP,
                    FOREIGN KEY (no_kk) REFERENCES kartu_keluarga(no_kk) ON DELETE CASCADE
                )
            ";
            
            DB::statement($sql);
            $this->info('Created new table with updated enum values...');
            
            // Copy data back, converting old enum values to new ones
            $copySQL = "
                INSERT INTO anggota_keluarga 
                SELECT 
                    id, no_kk, no_urut, nama_lengkap, nik, jenis_kelamin, 
                    tempat_lahir, tanggal_lahir, agama, pendidikan, jenis_pekerjaan, 
                    golongan_darah, status_perkawinan, tanggal_perkawinan, 
                    status_hubungan_dalam_keluarga, kewarganegaraan, no_paspor, no_kitap, 
                    nama_ayah, nama_ibu, is_masyarakat_miskin, has_bpjs_kesehatan, 
                    status_bpjs_kesehatan_aktif, jenis_keanggotaan_bpjs,
                    CASE 
                        WHEN detail_nonpbi_bpjs = 'penerima-upah' THEN 'PPU'
                        WHEN detail_nonpbi_bpjs = 'bukan-penerima-upah' THEN 'PBPU'
                        ELSE detail_nonpbi_bpjs 
                    END as detail_nonpbi_bpjs,
                    has_e_ktp, kondisi_e_ktp, perlu_update_kk, has_akta_kelahiran, 
                    catatan_sosial, created_at, updated_at
                FROM anggota_keluarga_temp
            ";
            
            DB::statement($copySQL);
            $this->info('Copied data back with converted enum values...');
            
            // Drop the backup table
            DB::statement('DROP TABLE anggota_keluarga_temp');
            $this->info('Dropped backup table...');
            
            // Commit the transaction
            DB::commit();
            
            $this->info('Database schema updated successfully!');
            $this->info('New detail_nonpbi_bpjs enum values: PPU, PBPU, BP, PBI_DAERAH, penerima-upah, bukan-penerima-upah');
            
            return self::SUCCESS;
            
        } catch (Exception $e) {
            // Rollback on error
            DB::rollback();
            $this->error('Error updating database: ' . $e->getMessage());
            
            // Try to restore from backup if it exists
            try {
                $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name='anggota_keluarga_temp'");
                if (count($tables) > 0) {
                    DB::statement('DROP TABLE IF EXISTS anggota_keluarga');
                    DB::statement('ALTER TABLE anggota_keluarga_temp RENAME TO anggota_keluarga');
                    $this->info('Restored from backup table.');
                }
            } catch (Exception $restoreError) {
                $this->error('Error restoring backup: ' . $restoreError->getMessage());
            }
            
            return self::FAILURE;
        }
    }
}
