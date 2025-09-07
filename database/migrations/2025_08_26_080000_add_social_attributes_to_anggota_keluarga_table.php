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
            // Atribut sosial untuk kategori warga
            $table->boolean('is_masyarakat_miskin')->default(false)->after('nama_ibu');
            $table->boolean('is_belum_memiliki_bpjs_kesehatan')->default(false)->after('is_masyarakat_miskin');
            $table->boolean('is_bpjs_kesehatan_pbi_non_aktif')->default(false)->after('is_belum_memiliki_bpjs_kesehatan');
            $table->boolean('is_belum_memiliki_bpjs_ketenagakerjaan')->default(false)->after('is_bpjs_kesehatan_pbi_non_aktif');
            $table->boolean('is_belum_memiliki_e_ktp')->default(false)->after('is_belum_memiliki_bpjs_ketenagakerjaan');
            $table->boolean('is_e_ktp_rusak')->default(false)->after('is_belum_memiliki_e_ktp');
            $table->boolean('is_belum_memiliki_kk')->default(false)->after('is_e_ktp_rusak');
            $table->boolean('is_kk_belum_diperbarui')->default(false)->after('is_belum_memiliki_kk');
            $table->boolean('is_belum_memiliki_akta_kelahiran')->default(false)->after('is_kk_belum_diperbarui');
            
            // Field tambahan untuk keterangan
            $table->text('catatan_sosial')->nullable()->after('is_belum_memiliki_akta_kelahiran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            $table->dropColumn([
                'is_masyarakat_miskin',
                'is_belum_memiliki_bpjs_kesehatan',
                'is_bpjs_kesehatan_pbi_non_aktif',
                'is_belum_memiliki_bpjs_ketenagakerjaan',
                'is_belum_memiliki_e_ktp',
                'is_e_ktp_rusak',
                'is_belum_memiliki_kk',
                'is_kk_belum_diperbarui',
                'is_belum_memiliki_akta_kelahiran',
                'catatan_sosial'
            ]);
        });
    }
};
