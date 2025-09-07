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
        Schema::table('kartu_keluarga', function (Blueprint $table) {
            $table->string('province_id')->nullable()->after('provinsi');
            $table->string('regency_id')->nullable()->after('kabupaten_kota');
            $table->string('district_id')->nullable()->after('kecamatan');
            $table->string('village_id')->nullable()->after('desa_kelurahan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kartu_keluarga', function (Blueprint $table) {
            $table->dropColumn(['province_id', 'regency_id', 'district_id', 'village_id']);
        });
    }
};
