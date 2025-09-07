<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;

class TestRoleController extends Controller
{
    public function testRoles()
    {
        $rolesCount = Role::count();
        $permissionsCount = Permission::count();
        
        $roles = Role::with('permissions')->get();
        
        return response()->json([
            'roles_count' => $rolesCount,
            'permissions_count' => $permissionsCount,
            'roles' => $roles->map(function($role) {
                return [
                    'name' => $role->name,
                    'display_name' => $role->display_name,
                    'permissions_count' => $role->permissions->count(),
                    'permissions' => $role->permissions->pluck('name')
                ];
            })
        ]);
    }
}
