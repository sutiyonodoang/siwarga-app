<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, we need to recreate the entire table since it doesn't support ALTER COLUMN
        
        // Create backup table
        DB::statement('CREATE TABLE anggota_keluarga_backup AS SELECT * FROM anggota_keluarga');
        
        // Drop the original table
        Schema::dropIfExists('anggota_keluarga');
        
        // Recreate the table with new enum values
        Schema::create('anggota_keluarga', function (Blueprint $table) {
            $table->id();
            $table->string('no_kk', 16);
            $table->integer('no_urut');
            $table->string('nama_lengkap', 100);
            $table->string('nik', 16)->unique();
            $table->enum('jenis_kelamin', ['LAKI-LAKI', 'PEREMPUAN'])->nullable();
            $table->string('tempat_lahir', 100)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('agama', 50)->nullable();
            $table->string('pendidikan', 100)->nullable();
            $table->string('jenis_pekerjaan', 100)->nullable();
            $table->string('golongan_darah', 5)->nullable();
            $table->enum('status_perkawinan', ['KAWIN TERCATAT', 'BELUM KAWIN', 'CERAI HIDUP', 'CERAI MATI'])->nullable();
            $table->date('tanggal_perkawinan')->nullable();
            $table->string('status_hubungan_dalam_keluarga', 50)->nullable();
            $table->enum('kewarganegaraan', ['WNI', 'WNA'])->nullable();
            $table->string('no_paspor', 50)->nullable();
            $table->string('no_kitap', 50)->nullable();
            $table->string('nama_ayah', 100)->nullable();
            $table->string('nama_ibu', 100)->nullable();
            
            // Atribut sosial survey
            $table->boolean('is_masyarakat_miskin')->default(false);
            $table->boolean('has_bpjs_kesehatan')->default(false);
            $table->boolean('status_bpjs_kesehatan_aktif')->default(false);
            $table->enum('jenis_keanggotaan_bpjs', ['pbi', 'non-pbi'])->nullable();
            // Updated enum values - now includes both old and new values for compatibility
            $table->enum('detail_nonpbi_bpjs', ['PPU', 'PBPU', 'BP', 'PBI_DAERAH', 'penerima-upah', 'bukan-penerima-upah'])->nullable();
            $table->boolean('has_e_ktp')->default(false);
            $table->enum('kondisi_e_ktp', ['baik', 'rusak', 'hilang'])->nullable();
            $table->boolean('perlu_update_kk')->default(false);
            $table->boolean('has_akta_kelahiran')->default(false);
            $table->text('catatan_sosial')->nullable();
            
            $table->timestamps();
            
            $table->foreign('no_kk')->references('no_kk')->on('kartu_keluarga')->onDelete('cascade');
        });
        
        // Copy data back, converting old enum values to new ones
        DB::statement("
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
            FROM anggota_keluarga_backup
        ");
        
        // Drop the backup table
        DB::statement('DROP TABLE anggota_keluarga_backup');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to old enum values
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            $table->dropColumn('detail_nonpbi_bpjs');
        });
        
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            $table->enum('detail_nonpbi_bpjs', ['penerima-upah', 'bukan-penerima-upah'])
                  ->nullable()
                  ->after('jenis_keanggotaan_bpjs')
                  ->comment('Detail kategori Non-PBI');
        });
    }
};
