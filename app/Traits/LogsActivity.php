<?php

namespace App\Traits;

use App\Models\UserActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait LogsActivity
{
    /**
     * Log user activity.
     */
    public static function logActivity(
        string $activityType,
        string $module,
        string $description,
        $oldData = null,
        $newData = null,
        $userId = null
    ) {
        UserActivityLog::create([
            'user_id' => $userId ?? Auth::id(),
            'activity_type' => $activityType,
            'module' => $module,
            'description' => $description,
            'old_data' => $oldData,
            'new_data' => $newData,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    /**
     * Log create activity.
     */
    public static function logCreate(string $module, string $description, $newData = null)
    {
        static::logActivity('create', $module, $description, null, $newData);
    }

    /**
     * Log update activity.
     */
    public static function logUpdate(string $module, string $description, $oldData = null, $newData = null)
    {
        static::logActivity('update', $module, $description, $oldData, $newData);
    }

    /**
     * Log delete activity.
     */
    public static function logDelete(string $module, string $description, $oldData = null)
    {
        static::logActivity('delete', $module, $description, $oldData, null);
    }

    /**
     * Log view activity.
     */
    public static function logView(string $module, string $description)
    {
        static::logActivity('view', $module, $description);
    }

    /**
     * Log login activity.
     */
    public static function logLogin(string $description, $userId = null)
    {
        static::logActivity('login', 'auth', $description, null, null, $userId);
    }

    /**
     * Log logout activity.
     */
    public static function logLogout(string $description, $userId = null)
    {
        static::logActivity('logout', 'auth', $description, null, null, $userId);
    }
}
