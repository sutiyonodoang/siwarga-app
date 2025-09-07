<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First, seed roles and permissions
        $this->call(RolePermissionSeeder::class);

        // Create or get admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@siwarga.com'],
            [
                'name' => 'Admin SIWarga',
                'password' => bcrypt('password123'),
            ]
        );

        // Create or get operator user
        $operatorUser = User::firstOrCreate(
            ['email' => 'operator@siwarga.com'],
            [
                'name' => 'Operator SIWarga',
                'password' => bcrypt('password123'),
            ]
        );

        // Create or get viewer user
        $viewerUser = User::firstOrCreate(
            ['email' => 'viewer@siwarga.com'],
            [
                'name' => 'Viewer SIWarga',
                'password' => bcrypt('password123'),
            ]
        );

        // Assign roles (updateOrInsert to avoid duplicates)
        $adminRole = \Illuminate\Support\Facades\DB::table('roles')->where('name', 'admin')->first();
        $operatorRole = \Illuminate\Support\Facades\DB::table('roles')->where('name', 'operator')->first();
        $viewerRole = \Illuminate\Support\Facades\DB::table('roles')->where('name', 'viewer')->first();

        if ($adminRole) {
            \Illuminate\Support\Facades\DB::table('user_roles')->updateOrInsert(
                ['user_id' => $adminUser->id, 'role_id' => $adminRole->id],
                [
                    'user_id' => $adminUser->id,
                    'role_id' => $adminRole->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        if ($operatorRole) {
            \Illuminate\Support\Facades\DB::table('user_roles')->updateOrInsert(
                ['user_id' => $operatorUser->id, 'role_id' => $operatorRole->id],
                [
                    'user_id' => $operatorUser->id,
                    'role_id' => $operatorRole->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        if ($viewerRole) {
            \Illuminate\Support\Facades\DB::table('user_roles')->updateOrInsert(
                ['user_id' => $viewerUser->id, 'role_id' => $viewerRole->id],
                [
                    'user_id' => $viewerUser->id,
                    'role_id' => $viewerRole->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // Seed Kartu Keluarga (only if not already seeded)
        $existingKartuKeluarga = \Illuminate\Support\Facades\DB::table('kartu_keluarga')->count();
        if ($existingKartuKeluarga === 0) {
            $this->call(KartuKeluargaSeeder::class);
        }
    }
}
