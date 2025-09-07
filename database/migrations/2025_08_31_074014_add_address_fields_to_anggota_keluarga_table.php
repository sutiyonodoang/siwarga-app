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
            $table->unsignedBigInteger('province_id')->nullable()->after('alamat_asal');
            $table->unsignedBigInteger('regency_id')->nullable()->after('province_id');
            $table->unsignedBigInteger('district_id')->nullable()->after('regency_id');
            $table->unsignedBigInteger('village_id')->nullable()->after('district_id');
            $table->string('rt')->nullable()->after('village_id');
            $table->string('rw')->nullable()->after('rt');

            $table->foreign('province_id')->references('id')->on('reg_provinces')->onDelete('set null');
            $table->foreign('regency_id')->references('id')->on('reg_regencies')->onDelete('set null');
            $table->foreign('district_id')->references('id')->on('reg_districts')->onDelete('set null');
            $table->foreign('village_id')->references('id')->on('reg_villages')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            $table->dropForeign(['province_id']);
            $table->dropForeign(['regency_id']);
            $table->dropForeign(['district_id']);
            $table->dropForeign(['village_id']);

            $table->dropColumn(['province_id', 'regency_id', 'district_id', 'village_id', 'rt', 'rw']);
        });
    }
};
