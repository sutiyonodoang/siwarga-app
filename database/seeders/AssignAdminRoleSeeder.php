<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssignAdminRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the first user or create one if none exists
        $user = User::first();
        
        if (!$user) {
            $user = User::create([
                'name' => 'Administrator',
                'email' => 'admin@siwarga.com',
                'password' => bcrypt('password'),
                'status' => 'enabled',
                'email_verified_at' => now(),
            ]);
        }

        // Find admin role
        $adminRole = Role::where('name', 'admin')->first();
        
        if ($adminRole && $user) {
            // Remove any existing roles and assign admin role
            $user->roles()->detach();
            $user->assignRole($adminRole);
            
            $this->command->info("Admin role assigned to user: {$user->email}");
        } else {
            $this->command->error('Admin role not found. Please run RolePermissionSeeder first.');
        }
    }
}
