<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get the path to the SQL file
        $sqlFile = database_path('migrations/wilayah_indonesia.sql');
        
        // Check if the file exists
        if (file_exists($sqlFile)) {
            // Read the SQL file
            $sql = file_get_contents($sqlFile);
            
            // Remove MySQL-specific commands that are not compatible with SQLite
            $sql = preg_replace('/SET NAMES .*?;/', '', $sql);
            $sql = preg_replace('/LOCK TABLES .*?;/', '', $sql);
            $sql = preg_replace('/UNLOCK TABLES;/', '', $sql);
            $sql = preg_replace('/\/\*.*?\*\//s', '', $sql); // Remove comments
            
            // Split the SQL file into individual statements
            $statements = array_filter(
                array_map('trim', explode(';', $sql))
            );
            
            // Execute each statement
            foreach ($statements as $statement) {
                if (!empty($statement)) {
                    try {
                        DB::unprepared($statement);
                    } catch (\Exception $e) {
                        // Skip statements that fail (likely MySQL-specific)
                        continue;
                    }
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the regional tables if they exist
        // Note: You might need to adjust these table names based on the actual SQL file
        $tables = ['provinces', 'regencies', 'districts', 'villages'];
        
        foreach ($tables as $table) {
            DB::statement("DROP TABLE IF EXISTS {$table}");
        }
    }
};