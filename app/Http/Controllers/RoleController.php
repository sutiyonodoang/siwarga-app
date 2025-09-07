<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index()
    {
        $roles = Role::with('permissions')->orderBy('name')->get();
        
        return Inertia::render('Roles/Index', [
            'roles' => $roles->map(function($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'display_name' => $role->display_name,
                    'description' => $role->description,
                    'permissions_count' => $role->permissions->count(),
                    'users_count' => $role->users()->count(),
                    'created_at' => $role->created_at?->format('Y-m-d H:i:s'),
                ];
            })
        ]);
    }

    /**
     * Assign role to user.
     */
    public function assignToUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $role = Role::findOrFail($request->role_id);

        // Remove existing roles and assign new one
        $user->roles()->detach();
        $user->assignRole($role);

        return redirect()->back()->with('message', "Role '{$role->display_name}' berhasil diberikan kepada {$user->name}");
    }

    /**
     * Remove role from user.
     */
    public function removeFromUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $role = Role::findOrFail($request->role_id);

        $user->removeRole($role);

        return redirect()->back()->with('message', "Role '{$role->display_name}' berhasil dihapus dari {$user->name}");
    }

    /**
     * Get users with their roles.
     */
    public function getUsersWithRoles()
    {
        $users = User::with('roles')->orderBy('name')->get();
        
        return response()->json([
            'users' => $users->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status,
                    'roles' => $user->roles->map(function($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name,
                            'display_name' => $role->display_name,
                        ];
                    }),
                ];
            })
        ]);
    }

    /**
     * Get available roles.
     */
    public function getRoles()
    {
        $roles = Role::orderBy('name')->get(['id', 'name', 'display_name', 'description']);
        
        return response()->json(['roles' => $roles]);
    }
}
