<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            // Pastikan semua kolom yang diperlukan ada
            
            // Cek apakah kolom lama masih ada dan drop jika perlu
            if (Schema::hasColumn('anggota_keluarga', 'is_belum_memiliki_bpjs_kesehatan')) {
                $table->dropColumn([
                    'is_belum_memiliki_bpjs_kesehatan',
                    'is_bpjs_kesehatan_pbi_non_aktif',
                    'is_belum_memiliki_bpjs_ketenagakerjaan',
                    'is_belum_memiliki_e_ktp',
                    'is_e_ktp_rusak',
                    'is_belum_memiliki_kk',
                    'is_kk_belum_diperbarui',
                    'is_belum_memiliki_akta_kelahiran'
                ]);
            }
            
            // Tambah/update kolom sesuai struktur form yang benar
            if (!Schema::hasColumn('anggota_keluarga', 'has_bpjs_kesehatan')) {
                $table->boolean('has_bpjs_kesehatan')->default(false)->after('is_masyarakat_miskin');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'status_bpjs_kesehatan')) {
                $table->enum('status_bpjs_kesehatan', ['PBI_NEGARA', 'NON_PBI'])->nullable()->after('has_bpjs_kesehatan');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'jenis_bpjs_kesehatan')) {
                $table->enum('jenis_bpjs_kesehatan', ['PPU', 'PBPU', 'BP', 'PBI_DAERAH'])->nullable()->after('status_bpjs_kesehatan');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'detail_nonpbi_bpjs')) {
                $table->enum('detail_nonpbi_bpjs', ['PPU', 'PBPU', 'BP', 'PBI_DAERAH'])->nullable()->after('jenis_bpjs_kesehatan');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'is_bpjs_kesehatan_aktif')) {
                $table->boolean('is_bpjs_kesehatan_aktif')->default(false)->after('detail_nonpbi_bpjs');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'has_bpjs_ketenagakerjaan')) {
                $table->boolean('has_bpjs_ketenagakerjaan')->default(false)->after('is_bpjs_kesehatan_aktif');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'status_e_ktp')) {
                $table->enum('status_e_ktp', ['BELUM_PUNYA', 'SUDAH_PUNYA_BAGUS', 'SUDAH_PUNYA_RUSAK'])->nullable()->after('has_bpjs_ketenagakerjaan');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'status_kk_update')) {
                $table->enum('status_kk_update', ['PERLU_UPDATE', 'TIDAK_PERLU_UPDATE'])->nullable()->after('status_e_ktp');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'has_akta_kelahiran')) {
                $table->boolean('has_akta_kelahiran')->default(false)->after('status_kk_update');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            $table->dropColumn([
                'has_bpjs_kesehatan',
                'status_bpjs_kesehatan',
                'jenis_bpjs_kesehatan',
                'detail_nonpbi_bpjs',
                'is_bpjs_kesehatan_aktif',
                'has_bpjs_ketenagakerjaan',
                'status_e_ktp',
                'status_kk_update',
                'has_akta_kelahiran'
            ]);
        });
    }
};
