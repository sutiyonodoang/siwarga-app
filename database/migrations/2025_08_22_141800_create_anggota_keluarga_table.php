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
            $table->timestamps();
            
            $table->foreign('no_kk')->references('no_kk')->on('kartu_keluarga')->onDelete('cascade');
            $table->unique(['no_kk', 'no_urut']);
            $table->index('nik');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anggota_keluarga');
    }
};