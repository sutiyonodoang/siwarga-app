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
        // Create provinces table
        Schema::create('provinces', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // Create regencies table
        Schema::create('regencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('province_id')->constrained('provinces')->onDelete('cascade');
            $table->string('name');
            $table->timestamps();
        });

        // Create districts table
        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('regency_id')->constrained('regencies')->onDelete('cascade');
            $table->string('name');
            $table->timestamps();
        });

        // Create villages table
        Schema::create('villages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('district_id')->constrained('districts')->onDelete('cascade');
            $table->string('name');
            $table->timestamps();
        });

        // Insert sample data for testing
        $this->insertSampleData();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('villages');
        Schema::dropIfExists('districts');
        Schema::dropIfExists('regencies');
        Schema::dropIfExists('provinces');
    }

    /**
     * Insert sample regional data for testing
     */
    private function insertSampleData(): void
    {
        // Insert sample provinces
        $provinces = [
            ['id' => 1, 'name' => 'DKI Jakarta', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Jawa Barat', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Jawa Tengah', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Jawa Timur', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Yogyakarta', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('provinces')->insert($provinces);

        // Insert sample regencies for DKI Jakarta
        $regencies = [
            ['id' => 1, 'province_id' => 1, 'name' => 'Jakarta Pusat', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'province_id' => 1, 'name' => 'Jakarta Utara', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'province_id' => 1, 'name' => 'Jakarta Selatan', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'province_id' => 1, 'name' => 'Jakarta Timur', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'province_id' => 1, 'name' => 'Jakarta Barat', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('regencies')->insert($regencies);

        // Insert sample districts for Jakarta Pusat
        $districts = [
            ['id' => 1, 'regency_id' => 1, 'name' => 'Gambir', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'regency_id' => 1, 'name' => 'Tanah Abang', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'regency_id' => 1, 'name' => 'Menteng', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'regency_id' => 1, 'name' => 'Senen', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'regency_id' => 1, 'name' => 'Cempaka Putih', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('districts')->insert($districts);

        // Insert sample villages for Gambir
        $villages = [
            ['id' => 1, 'district_id' => 1, 'name' => 'Gambir', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'district_id' => 1, 'name' => 'Cideng', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'district_id' => 1, 'name' => 'Petojo Utara', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'district_id' => 1, 'name' => 'Petojo Selatan', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'district_id' => 1, 'name' => 'Duri Pulo', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('villages')->insert($villages);
    }
};
