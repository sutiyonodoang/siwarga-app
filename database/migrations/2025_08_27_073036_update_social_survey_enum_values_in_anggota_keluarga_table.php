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
        // Drop and recreate the table with new enum values
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            // Drop columns with enum constraints
            $table->dropColumn(['jenis_keanggotaan_bpjs', 'detail_nonpbi_bpjs', 'kondisi_e_ktp']);
        });
        
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            // Recreate columns with new enum values
            $table->enum('jenis_keanggotaan_bpjs', ['pbi', 'non-pbi'])->nullable()->after('status_bpjs_kesehatan_aktif')->comment('Jenis keanggotaan BPJS');
            $table->enum('detail_nonpbi_bpjs', ['penerima-upah', 'bukan-penerima-upah'])->nullable()->after('jenis_keanggotaan_bpjs')->comment('Detail kategori Non-PBI');
            $table->enum('kondisi_e_ktp', ['baik', 'rusak', 'hilang'])->nullable()->after('has_e_ktp')->comment('Kondisi E-KTP');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            // Drop new columns
            $table->dropColumn(['jenis_keanggotaan_bpjs', 'detail_nonpbi_bpjs', 'kondisi_e_ktp']);
        });
        
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            // Restore old enum values
            $table->enum('jenis_keanggotaan_bpjs', ['PBI_NEGARA', 'NON_PBI'])->nullable()->after('status_bpjs_kesehatan_aktif')->comment('Jenis keanggotaan BPJS');
            $table->enum('detail_nonpbi_bpjs', ['PPU', 'PBPU', 'BP', 'PBI_PEMDA'])->nullable()->after('jenis_keanggotaan_bpjs')->comment('Detail kategori Non-PBI');
            $table->enum('kondisi_e_ktp', ['BAGUS', 'RUSAK_PERLU_PEMBARUAN'])->nullable()->after('has_e_ktp')->comment('Kondisi E-KTP');
        });
    }
};
