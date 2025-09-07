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
            // 1. Kategori Miskin
            if (!Schema::hasColumn('anggota_keluarga', 'is_masyarakat_miskin')) {
                $table->boolean('is_masyarakat_miskin')->default(false)->after('nama_ibu')->comment('Apakah masuk kategori miskin');
            }
            
            // 2. BPJS Kesehatan
            if (!Schema::hasColumn('anggota_keluarga', 'has_bpjs_kesehatan')) {
                $table->boolean('has_bpjs_kesehatan')->default(false)->after('is_masyarakat_miskin')->comment('Memiliki BPJS Kesehatan');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'status_bpjs_kesehatan_aktif')) {
                $table->boolean('status_bpjs_kesehatan_aktif')->nullable()->after('has_bpjs_kesehatan')->comment('Status BPJS aktif atau tidak');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'jenis_keanggotaan_bpjs')) {
                $table->enum('jenis_keanggotaan_bpjs', ['PBI_NEGARA', 'NON_PBI'])->nullable()->after('status_bpjs_kesehatan_aktif')->comment('Jenis keanggotaan BPJS');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'detail_nonpbi_bpjs')) {
                $table->enum('detail_nonpbi_bpjs', ['PPU', 'PBPU', 'BP', 'PBI_PEMDA'])->nullable()->after('jenis_keanggotaan_bpjs')->comment('Detail kategori Non-PBI');
            }
            
            // 3. KTP/E-KTP
            if (!Schema::hasColumn('anggota_keluarga', 'has_e_ktp')) {
                $table->boolean('has_e_ktp')->default(false)->after('detail_nonpbi_bpjs')->comment('Sudah memiliki E-KTP');
            }
            
            if (!Schema::hasColumn('anggota_keluarga', 'kondisi_e_ktp')) {
                $table->enum('kondisi_e_ktp', ['BAGUS', 'RUSAK_PERLU_PEMBARUAN'])->nullable()->after('has_e_ktp')->comment('Kondisi E-KTP');
            }
            
            // 4. Kartu Keluarga
            if (!Schema::hasColumn('anggota_keluarga', 'perlu_update_kk')) {
                $table->boolean('perlu_update_kk')->default(false)->after('kondisi_e_ktp')->comment('Perlu update Kartu Keluarga');
            }
            
            // 5. Akta Kelahiran
            if (!Schema::hasColumn('anggota_keluarga', 'has_akta_kelahiran')) {
                $table->boolean('has_akta_kelahiran')->default(false)->after('perlu_update_kk')->comment('Memiliki Akta Kelahiran');
            }
            
            // Kolom tambahan untuk catatan
            if (!Schema::hasColumn('anggota_keluarga', 'catatan_sosial')) {
                $table->text('catatan_sosial')->nullable()->after('has_akta_kelahiran')->comment('Catatan tambahan terkait kondisi sosial');
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
                'is_masyarakat_miskin',
                'has_bpjs_kesehatan',
                'status_bpjs_kesehatan_aktif',
                'jenis_keanggotaan_bpjs',
                'detail_nonpbi_bpjs',
                'has_e_ktp',
                'kondisi_e_ktp',
                'perlu_update_kk',
                'has_akta_kelahiran',
                'catatan_sosial'
            ]);
        });
    }
};
