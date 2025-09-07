<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();
        
        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('login');
        }

        // Check if user has admin role (full access)
        if ($user->hasRole('admin')) {
            return $next($request);
        }

        if (!$user->hasPermission($permission)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Insufficient permissions.'], 403);
            }
            
            abort(403, 'Insufficient permissions.');
        }

        return $next($request);
    }
}
