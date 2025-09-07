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
            // Drop kolom lama yang tidak sesuai
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
        });

        Schema::table('anggota_keluarga', function (Blueprint $table) {
            // 1. Kategori miskin (sudah ada: is_masyarakat_miskin)
            
            // 2. BPJS Kesehatan
            $table->enum('jenis_bpjs_kesehatan', [
                'PBI-Negara', 
                'PPU', 
                'PBPU', 
                'BP', 
                'PBI-Daerah'
            ])->nullable()->after('is_masyarakat_miskin');
            $table->enum('status_bpjs_kesehatan', ['Aktif', 'Tidak Aktif'])->nullable()->after('jenis_bpjs_kesehatan');
            
            // 3. BPJS Ketenagakerjaan
            $table->boolean('has_bpjs_ketenagakerjaan')->default(false)->after('status_bpjs_kesehatan');
            
            // 4. E-KTP
            $table->boolean('has_e_ktp')->default(false)->after('has_bpjs_ketenagakerjaan');
            $table->enum('kondisi_e_ktp', ['Bagus', 'Rusak/Perlu Pembaruan'])->nullable()->after('has_e_ktp');
            
            // 5. Kartu Keluarga
            $table->boolean('has_kartu_keluarga')->default(false)->after('kondisi_e_ktp');
            $table->enum('kondisi_kartu_keluarga', ['Terbaru', 'Perlu Pembaruan'])->nullable()->after('has_kartu_keluarga');
            
            // 6. Akta Kelahiran
            $table->boolean('has_akta_kelahiran')->default(false)->after('kondisi_kartu_keluarga');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            // Drop kolom baru
            $table->dropColumn([
                'jenis_bpjs_kesehatan',
                'status_bpjs_kesehatan',
                'has_bpjs_ketenagakerjaan',
                'has_e_ktp',
                'kondisi_e_ktp',
                'has_kartu_keluarga',
                'kondisi_kartu_keluarga',
                'has_akta_kelahiran'
            ]);
        });

        Schema::table('anggota_keluarga', function (Blueprint $table) {
            // Restore kolom lama
            $table->boolean('is_belum_memiliki_bpjs_kesehatan')->default(false)->after('is_masyarakat_miskin');
            $table->boolean('is_bpjs_kesehatan_pbi_non_aktif')->default(false)->after('is_belum_memiliki_bpjs_kesehatan');
            $table->boolean('is_belum_memiliki_bpjs_ketenagakerjaan')->default(false)->after('is_bpjs_kesehatan_pbi_non_aktif');
            $table->boolean('is_belum_memiliki_e_ktp')->default(false)->after('is_belum_memiliki_bpjs_ketenagakerjaan');
            $table->boolean('is_e_ktp_rusak')->default(false)->after('is_belum_memiliki_e_ktp');
            $table->boolean('is_belum_memiliki_kk')->default(false)->after('is_e_ktp_rusak');
            $table->boolean('is_kk_belum_diperbarui')->default(false)->after('is_belum_memiliki_kk');
            $table->boolean('is_belum_memiliki_akta_kelahiran')->default(false)->after('is_kk_belum_diperbarui');
        });
    }
};
