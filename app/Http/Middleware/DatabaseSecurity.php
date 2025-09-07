<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DatabaseSecurity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Blokir akses langsung ke file database
        if ($request->is('*.sqlite') || $request->is('*.sqlite3') || $request->is('*.db')) {
            abort(403, 'Access denied to database files');
        }

        // Monitor query yang mencurigakan
        DB::listen(function ($query) {
            $suspiciousPatterns = [
                'DROP TABLE',
                'DELETE FROM users',
                'UPDATE users SET',
                'TRUNCATE',
                'ALTER TABLE',
                'CREATE TABLE',
            ];

            foreach ($suspiciousPatterns as $pattern) {
                if (stripos($query->sql, $pattern) !== false) {
                    Log::warning('Suspicious database query detected', [
                        'sql' => $query->sql,
                        'bindings' => $query->bindings,
                        'time' => $query->time,
                        'user_id' => auth()->id(),
                        'ip' => request()->ip(),
                        'user_agent' => request()->userAgent(),
                    ]);
                }
            }
        });

        return $next($request);
    }
}
