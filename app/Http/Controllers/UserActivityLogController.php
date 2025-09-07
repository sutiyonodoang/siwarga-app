<?php

namespace App\Http\Controllers;

use App\Models\UserActivityLog;
use App\Traits\HasDataOwnership;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserActivityLogController extends Controller
{
    use HasDataOwnership;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = UserActivityLog::with('user')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->has('activity_type') && $request->activity_type !== '') {
            $query->where('activity_type', $request->activity_type);
        }

        if ($request->has('module') && $request->module !== '') {
            $query->where('module', $request->module);
        }

        if ($request->has('user_id') && $request->user_id !== '') {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('date_from') && $request->date_from !== '') {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to !== '') {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search functionality
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('module', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $activityLogs = $query->paginate(15)->withQueryString();

        // Get filter options
        $activityTypes = UserActivityLog::distinct('activity_type')
            ->pluck('activity_type')
            ->mapWithKeys(function ($type) {
                return [$type => ucfirst(str_replace('_', ' ', $type))];
            });

        $modules = UserActivityLog::distinct('module')
            ->pluck('module')
            ->mapWithKeys(function ($module) {
                return [$module => ucfirst(str_replace('_', ' ', $module))];
            });

        return Inertia::render('user-activity-logs/index', [
            'activityLogs' => $activityLogs,
            'filters' => $request->only(['activity_type', 'module', 'user_id', 'date_from', 'date_to', 'search']),
            'activityTypes' => $activityTypes,
            'modules' => $modules,
            'can' => [
                'view_all' => $this->canAccessAllData(),
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserActivityLog $userActivityLog)
    {
        $userActivityLog->load('user');

        return Inertia::render('user-activity-logs/show', [
            'activityLog' => $userActivityLog,
        ]);
    }

    /**
     * Get activity statistics for dashboard.
     */
    public function getStatistics()
    {
        $today = now()->startOfDay();
        $thisWeek = now()->startOfWeek();
        $thisMonth = now()->startOfMonth();

        $stats = [
            'today' => [
                'total' => UserActivityLog::whereDate('created_at', $today)->count(),
                'login' => UserActivityLog::whereDate('created_at', $today)->where('activity_type', 'login')->count(),
                'create' => UserActivityLog::whereDate('created_at', $today)->where('activity_type', 'create')->count(),
                'update' => UserActivityLog::whereDate('created_at', $today)->where('activity_type', 'update')->count(),
                'delete' => UserActivityLog::whereDate('created_at', $today)->where('activity_type', 'delete')->count(),
            ],
            'this_week' => [
                'total' => UserActivityLog::where('created_at', '>=', $thisWeek)->count(),
                'by_day' => UserActivityLog::where('created_at', '>=', $thisWeek)
                    ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
            ],
            'this_month' => [
                'total' => UserActivityLog::where('created_at', '>=', $thisMonth)->count(),
                'by_module' => UserActivityLog::where('created_at', '>=', $thisMonth)
                    ->selectRaw('module, COUNT(*) as count')
                    ->groupBy('module')
                    ->orderByDesc('count')
                    ->get(),
                'by_type' => UserActivityLog::where('created_at', '>=', $thisMonth)
                    ->selectRaw('activity_type, COUNT(*) as count')
                    ->groupBy('activity_type')
                    ->orderByDesc('count')
                    ->get(),
            ],
            'recent_activities' => UserActivityLog::with('user')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json($stats);
    }
}
