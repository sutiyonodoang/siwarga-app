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
            $table->boolean('is_warga_musiman')->default(false)->after('pekerjaan');
            $table->date('tanggal_mulai')->nullable()->after('is_warga_musiman');
            $table->date('tanggal_selesai')->nullable()->after('tanggal_mulai');
            $table->string('alamat_asal')->nullable()->after('tanggal_selesai');
            $table->text('alasan_kedatangan')->nullable()->after('alamat_asal');
            $table->string('nomor_telepon_darurat')->nullable()->after('alasan_kedatangan');
            $table->string('nama_kontak_darurat')->nullable()->after('nomor_telepon_darurat');
            $table->string('hubungan_kontak_darurat')->nullable()->after('nama_kontak_darurat');
            $table->boolean('status_aktif')->default(true)->after('hubungan_kontak_darurat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            $table->dropColumn([
                'is_warga_musiman',
                'tanggal_mulai',
                'tanggal_selesai',
                'alamat_asal',
                'alasan_kedatangan',
                'nomor_telepon_darurat',
                'nama_kontak_darurat',
                'hubungan_kontak_darurat',
                'status_aktif'
            ]);
        });
    }
};
