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
            // Check and drop columns only if they exist
            if (Schema::hasColumn('anggota_keluarga', 'is_belum_memiliki_bpjs_kesehatan')) {
                $table->dropColumn('is_belum_memiliki_bpjs_kesehatan');
            }
            if (Schema::hasColumn('anggota_keluarga', 'is_bpjs_kesehatan_pbi_non_aktif')) {
                $table->dropColumn('is_bpjs_kesehatan_pbi_non_aktif');
            }
            if (Schema::hasColumn('anggota_keluarga', 'is_belum_memiliki_bpjs_ketenagakerjaan')) {
                $table->dropColumn('is_belum_memiliki_bpjs_ketenagakerjaan');
            }
            if (Schema::hasColumn('anggota_keluarga', 'is_belum_memiliki_e_ktp')) {
                $table->dropColumn('is_belum_memiliki_e_ktp');
            }
            if (Schema::hasColumn('anggota_keluarga', 'is_e_ktp_rusak')) {
                $table->dropColumn('is_e_ktp_rusak');
            }
            if (Schema::hasColumn('anggota_keluarga', 'is_belum_memiliki_kk')) {
                $table->dropColumn('is_belum_memiliki_kk');
            }
            if (Schema::hasColumn('anggota_keluarga', 'is_kk_belum_diperbarui')) {
                $table->dropColumn('is_kk_belum_diperbarui');
            }
            if (Schema::hasColumn('anggota_keluarga', 'is_belum_memiliki_akta_kelahiran')) {
                $table->dropColumn('is_belum_memiliki_akta_kelahiran');
            }
            
            // Tambah kolom baru dengan struktur yang lebih baik (only if they don't exist)
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
            // Restore kolom lama
            $table->boolean('is_belum_memiliki_bpjs_kesehatan')->default(false);
            $table->boolean('is_bpjs_kesehatan_pbi_non_aktif')->default(false);
            $table->boolean('is_belum_memiliki_bpjs_ketenagakerjaan')->default(false);
            $table->boolean('is_belum_memiliki_e_ktp')->default(false);
            $table->boolean('is_e_ktp_rusak')->default(false);
            $table->boolean('is_belum_memiliki_kk')->default(false);
            $table->boolean('is_kk_belum_diperbarui')->default(false);
            $table->boolean('is_belum_memiliki_akta_kelahiran')->default(false);
            
            // Drop kolom baru
            $table->dropColumn([
                'has_bpjs_kesehatan',
                'status_bpjs_kesehatan',
                'jenis_bpjs_kesehatan',
                'has_e_ktp',
                'kondisi_e_ktp',
                'kk_perlu_update',
                'has_akta_kelahiran'
            ]);
        });
    }
};
