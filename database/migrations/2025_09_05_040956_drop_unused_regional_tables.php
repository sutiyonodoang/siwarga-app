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
        // Drop unused regional tables that were created by create_regional_tables migration
        // These tables are not used by the application - the app uses reg_* tables instead
        
        // Drop in reverse order due to foreign key constraints
        Schema::dropIfExists('villages');
        Schema::dropIfExists('districts');
        Schema::dropIfExists('regencies');
        Schema::dropIfExists('provinces');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate tables if needed (based on original create_regional_tables migration)
        
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
    }
};
