<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Roles - only if they don't exist
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Full access to all system features',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'operator',
                'display_name' => 'Operator',
                'description' => 'Can manage data but limited access to user management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'viewer',
                'display_name' => 'Viewer',
                'description' => 'Read-only access to system data',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($roles as $roleData) {
            DB::table('roles')->updateOrInsert(
                ['name' => $roleData['name']],
                $roleData
            );
        }

        // Create Permissions
        $permissions = [
            // User management permissions
            ['name' => 'user_read', 'display_name' => 'View Users', 'description' => 'Can view user list', 'module' => 'users'],
            ['name' => 'user_create', 'display_name' => 'Create Users', 'description' => 'Can create new users', 'module' => 'users'],
            ['name' => 'user_edit', 'display_name' => 'Edit Users', 'description' => 'Can edit user details', 'module' => 'users'],
            ['name' => 'user_delete', 'display_name' => 'Delete Users', 'description' => 'Can delete users', 'module' => 'users'],
            
            // Kartu Keluarga permissions
            ['name' => 'kartu_keluarga_read', 'display_name' => 'View Kartu Keluarga', 'description' => 'Can view kartu keluarga list', 'module' => 'kartu_keluarga'],
            ['name' => 'kartu_keluarga_create', 'display_name' => 'Create Kartu Keluarga', 'description' => 'Can create new kartu keluarga', 'module' => 'kartu_keluarga'],
            ['name' => 'kartu_keluarga_edit', 'display_name' => 'Edit Kartu Keluarga', 'description' => 'Can edit kartu keluarga', 'module' => 'kartu_keluarga'],
            ['name' => 'kartu_keluarga_delete', 'display_name' => 'Delete Kartu Keluarga', 'description' => 'Can delete kartu keluarga', 'module' => 'kartu_keluarga'],
            
            // Anggota Keluarga permissions
            ['name' => 'anggota_keluarga_read', 'display_name' => 'View Anggota Keluarga', 'description' => 'Can view anggota keluarga list', 'module' => 'anggota_keluarga'],
            ['name' => 'anggota_keluarga_create', 'display_name' => 'Create Anggota Keluarga', 'description' => 'Can create new anggota keluarga', 'module' => 'anggota_keluarga'],
            ['name' => 'anggota_keluarga_edit', 'display_name' => 'Edit Anggota Keluarga', 'description' => 'Can edit anggota keluarga', 'module' => 'anggota_keluarga'],
            ['name' => 'anggota_keluarga_delete', 'display_name' => 'Delete Anggota Keluarga', 'description' => 'Can delete anggota keluarga', 'module' => 'anggota_keluarga'],
            
            // Warga Musiman permissions
            ['name' => 'warga_musiman_read', 'display_name' => 'View Warga Musiman', 'description' => 'Can view warga musiman list', 'module' => 'warga_musiman'],
            ['name' => 'warga_musiman_create', 'display_name' => 'Create Warga Musiman', 'description' => 'Can create new warga musiman', 'module' => 'warga_musiman'],
            ['name' => 'warga_musiman_edit', 'display_name' => 'Edit Warga Musiman', 'description' => 'Can edit warga musiman', 'module' => 'warga_musiman'],
            ['name' => 'warga_musiman_delete', 'display_name' => 'Delete Warga Musiman', 'description' => 'Can delete warga musiman', 'module' => 'warga_musiman'],
            
            // Role management permissions
            ['name' => 'role_read', 'display_name' => 'View Roles', 'description' => 'Can view role list', 'module' => 'roles'],
            ['name' => 'role_edit', 'display_name' => 'Edit Roles', 'description' => 'Can edit role permissions', 'module' => 'roles'],
            
            // User Activity Log permissions
            ['name' => 'user_activity_log_read', 'display_name' => 'View Activity Logs', 'description' => 'Can view user activity logs', 'module' => 'activity_logs'],
        ];

        foreach ($permissions as $permissionData) {
            $permissionData['created_at'] = now();
            $permissionData['updated_at'] = now();
            DB::table('permissions')->updateOrInsert(
                ['name' => $permissionData['name']],
                $permissionData
            );
        }

        // Assign permissions to roles
        $adminRole = DB::table('roles')->where('name', 'admin')->first();
        $operatorRole = DB::table('roles')->where('name', 'operator')->first();
        $viewerRole = DB::table('roles')->where('name', 'viewer')->first();

        $allPermissions = DB::table('permissions')->get();
        
        // Admin gets all permissions
        foreach ($allPermissions as $permission) {
            DB::table('role_permissions')->updateOrInsert([
                'role_id' => $adminRole->id,
                'permission_id' => $permission->id,
            ], [
                'role_id' => $adminRole->id,
                'permission_id' => $permission->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Operator gets data management permissions (no user management)
        $operatorPermissions = [
            'kartu_keluarga_read', 'kartu_keluarga_create', 'kartu_keluarga_edit', 'kartu_keluarga_delete',
            'anggota_keluarga_read', 'anggota_keluarga_create', 'anggota_keluarga_edit', 'anggota_keluarga_delete',
            'warga_musiman_read', 'warga_musiman_create', 'warga_musiman_edit', 'warga_musiman_delete',
        ];

        foreach ($operatorPermissions as $permissionName) {
            $permission = DB::table('permissions')->where('name', $permissionName)->first();
            if ($permission) {
                DB::table('role_permissions')->updateOrInsert([
                    'role_id' => $operatorRole->id,
                    'permission_id' => $permission->id,
                ], [
                    'role_id' => $operatorRole->id,
                    'permission_id' => $permission->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Viewer gets NO permissions - only access to dashboard
        // Remove any existing permissions for viewer role
        DB::table('role_permissions')->where('role_id', $viewerRole->id)->delete();
    }
}
