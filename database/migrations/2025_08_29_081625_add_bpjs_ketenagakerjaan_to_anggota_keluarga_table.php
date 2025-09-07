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
            // Add BPJS Ketenagakerjaan column
            if (!Schema::hasColumn('anggota_keluarga', 'has_bpjs_ketenagakerjaan')) {
                $table->boolean('has_bpjs_ketenagakerjaan')->default(false)->after('has_bpjs_kesehatan')->comment('Memiliki BPJS Ketenagakerjaan');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('anggota_keluarga', function (Blueprint $table) {
            $table->dropColumn('has_bpjs_ketenagakerjaan');
        });
    }
};
