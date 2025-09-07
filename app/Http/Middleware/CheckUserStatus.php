<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            
            // Check if user status is disabled/inactive
            if ($user->status === 'disabled' || $user->status === 'inactive') {
                Auth::logout();
                
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Akun Anda tidak aktif. Silakan hubungi administrator.'
                    ], 403);
                }
                
                return redirect()->route('login')->withErrors([
                    'email' => 'Akun Anda tidak aktif. Silakan hubungi administrator.'
                ]);
            }
        }

        return $next($request);
    }
}
