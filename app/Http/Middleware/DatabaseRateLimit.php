<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DatabaseRateLimit
{
    private const MAX_QUERIES_PER_MINUTE = 100; // Max queries per minute per IP
    private const MAX_ADMIN_QUERIES_PER_MINUTE = 500; // Higher limit for admin users
    private const SUSPICIOUS_THRESHOLD = 50; // Threshold untuk aktivitas mencurigakan

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        $userId = auth()->id();
        $userRole = auth()->user()?->roles?->first()?->name ?? 'guest';
        
        // Key untuk tracking
        $cacheKey = "db_queries:{$ip}:{$userId}";
        $suspiciousKey = "suspicious_activity:{$ip}";
        
        // Get current query count
        $currentCount = Cache::get($cacheKey, 0);
        $suspiciousCount = Cache::get($suspiciousKey, 0);
        
        // Determine rate limit based on user role
        $maxQueries = $this->getMaxQueries($userRole);
        
        // Check if user exceeded rate limit
        if ($currentCount >= $maxQueries) {
            Log::warning('Database rate limit exceeded', [
                'ip' => $ip,
                'user_id' => $userId,
                'user_role' => $userRole,
                'query_count' => $currentCount,
                'max_allowed' => $maxQueries,
                'request_url' => $request->url(),
                'user_agent' => $request->userAgent(),
            ]);
            
            return response()->json([
                'error' => 'Rate limit exceeded. Too many database requests.',
                'retry_after' => 60
            ], 429);
        }
        
        // Check for suspicious activity patterns
        if ($suspiciousCount >= self::SUSPICIOUS_THRESHOLD) {
            Log::critical('Suspicious database activity detected', [
                'ip' => $ip,
                'user_id' => $userId,
                'suspicious_count' => $suspiciousCount,
                'request_url' => $request->url(),
                'user_agent' => $request->userAgent(),
            ]);
            
            // Block for longer period if suspicious
            return response()->json([
                'error' => 'Suspicious activity detected. Access temporarily blocked.',
                'retry_after' => 300
            ], 429);
        }
        
        $response = $next($request);
        
        // Increment counters after successful request
        $this->incrementCounters($cacheKey, $suspiciousKey, $request);
        
        return $response;
    }
    
    /**
     * Get maximum queries allowed based on user role
     */
    private function getMaxQueries(string $role): int
    {
        return match ($role) {
            'Super Admin', 'admin' => self::MAX_ADMIN_QUERIES_PER_MINUTE,
            'viewer' => 30, // Lower limit for viewers
            default => self::MAX_QUERIES_PER_MINUTE,
        };
    }
    
    /**
     * Increment request counters
     */
    private function incrementCounters(string $cacheKey, string $suspiciousKey, Request $request): void
    {
        // Increment main counter (expires in 1 minute)
        Cache::increment($cacheKey, 1);
        Cache::put($cacheKey, Cache::get($cacheKey), now()->addMinute());
        
        // Check for suspicious patterns
        if ($this->isSuspiciousRequest($request)) {
            Cache::increment($suspiciousKey, 1);
            Cache::put($suspiciousKey, Cache::get($suspiciousKey), now()->addMinutes(5));
        }
    }
    
    /**
     * Check if request pattern is suspicious
     */
    private function isSuspiciousRequest(Request $request): bool
    {
        $suspiciousPatterns = [
            // SQL injection attempts
            'union', 'select', 'drop', 'delete', 'truncate',
            'update', 'insert', 'alter', 'create', 'replace',
            // XSS attempts
            '<script', 'javascript:', 'onload=', 'onerror=',
            // Directory traversal
            '../', '..\\', '.htaccess', '.env',
            // Common attack patterns
            'wget', 'curl', 'system', 'exec', 'eval',
        ];
        
        $requestString = strtolower($request->fullUrl() . json_encode($request->all()));
        
        foreach ($suspiciousPatterns as $pattern) {
            if (strpos($requestString, $pattern) !== false) {
                return true;
            }
        }
        
        return false;
    }
}
