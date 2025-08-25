<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Carbon;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use AuthorizesRequests;
    // public function index(Request $request)
    // {
    //     $query = Task::where('user_id', Auth::id());

    //     if ($request->status === 'active') {
    //         $query->where('completed', false);
    //     } elseif ($request->status === 'completed') {
    //         $query->where('completed', true);
    //     }

    //     // 🔍 Apply search before paginating
    //     if ($request->has('search') && $request->search !== '') {
    //         $query->where('title', 'like', '%' . $request->search . '%');
    //     }

    //     return $query->orderBy('created_at', 'desc')->paginate(5);
    // }

    public function index(Request $request)
    {
        $userId = Auth::id();

        $query = Task::where('user_id', $userId);

        // Filter
        if ($request->status === 'active') {
            $query->where('completed', false);
        } elseif ($request->status === 'completed') {
            $query->where('completed', true);
        }

        // Search
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (!in_array($sortBy, ['title', 'due_date', 'priority', 'completed', 'created_at'])) {
            $sortBy = 'created_at';
        }
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        $tasks = $query
            ->with('user') // eager load to prevent N+1
            ->orderBy($sortBy, $sortOrder)
            ->get();

        return response()->json($tasks);
    }







    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:Low,Medium,High', // ✅ validate priority
        ]);

        $task = $request->user()->tasks()->create($validated);

        return response()->json($task, 201);
    }


    public function show(Task $task)
    {
        $this->authorize('view', $task);
        return response()->json($task);
    }

    // public function update(Request $request, Task $task)
    // {
    //     $this->authorize('update', $task); // Make sure the user owns the task

    //     $task->update($request->validate([
    //         'title' => 'sometimes|required|string|max:255',
    //         'description' => 'nullable|string',
    //         'due_date' => 'sometimes|required|date', // ✅ like title & priority
    //         'completed' => 'sometimes|required|boolean',
    //         'priority' => 'sometimes|required|in:Low,Medium,High',
    //     ]));

    //     return response()->json($task);
    // }
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        // Your existing validation
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'sometimes|required|date',
            'completed' => 'sometimes|required|boolean',
            'priority' => 'sometimes|required|in:Low,Medium,High',
        ]);

        // Store original completed status before update
        $wasCompleted = $task->completed;

        $task->update($validated);

        // If task was marked as completed, update user's streak
        if (isset($validated['completed']) && $validated['completed'] && !$wasCompleted) {
            $user = Auth::user();
            $user->updateStreak();
        }

        return response()->json($task->fresh());
    }


    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();

        return response()->noContent();
    }

    // chart
    public function getTaskStatusCounts()
    {
        $today = Carbon::today();
        $userId = Auth::id();

        $completed = Task::where('user_id', $userId)
            ->where('completed', true)
            ->count();

        $overdue = Task::where('user_id', $userId)
            ->where('completed', false)
            ->whereDate('due_date', '<', $today)
            ->count();

        $pending = Task::where('user_id', $userId)
            ->where('completed', false)
            ->where(function ($query) use ($today) {
                $query->whereNull('due_date')
                    ->orWhereDate('due_date', '>=', $today);
            })->count();

        return response()->json([
            'Completed' => $completed,
            'Pending' => $pending,
            'Overdue' => $overdue,
        ]);
    }


    public function priorityCounts()
    {
        $userId = Auth::id(); // get logged-in user's ID

        $counts = Task::where('user_id', $userId)
            ->selectRaw('priority, COUNT(*) as total')
            ->groupBy('priority')
            ->get();

        // Ensure all priorities are present even if count is 0
        $priorities = ['Low', 'Medium', 'High'];
        $data = collect($priorities)->map(function ($priority) use ($counts) {
            return [
                'priority' => $priority,
                'total' => $counts->firstWhere('priority', $priority)->total ?? 0
            ];
        });

        return response()->json($data);
    }

    public function barChart()
    {
        $userId = Auth::id();

        // SQLite uses strftime, PostgreSQL uses EXTRACT
        if (config('database.default') === 'sqlite') {
            $createdData = Task::where('user_id', $userId)
                ->selectRaw("strftime('%m', created_at) as month_num, COUNT(*) as created")
                ->groupBy('month_num')
                ->pluck('created', 'month_num')
                ->toArray();

            $completedData = Task::where('user_id', $userId)
                ->where('completed', true)
                ->selectRaw("strftime('%m', created_at) as month_num, COUNT(*) as completed")
                ->groupBy('month_num')
                ->pluck('completed', 'month_num')
                ->toArray();
        } else {
            // For PostgreSQL/MySQL later
            $createdData = Task::where('user_id', $userId)
                ->selectRaw("EXTRACT(MONTH FROM created_at) as month_num, COUNT(*) as created")
                ->groupBy('month_num')
                ->pluck('created', 'month_num')
                ->toArray();

            $completedData = Task::where('user_id', $userId)
                ->where('completed', true)
                ->selectRaw("EXTRACT(MONTH FROM created_at) as month_num, COUNT(*) as completed")
                ->groupBy('month_num')
                ->pluck('completed', 'month_num')
                ->toArray();
        }

        // Month mapping
        $months = [
            '01' => 'Jan', '02' => 'Feb', '03' => 'Mar', '04' => 'Apr',
            '05' => 'May', '06' => 'Jun', '07' => 'Jul', '08' => 'Aug',
            '09' => 'Sep', '10' => 'Oct', '11' => 'Nov', '12' => 'Dec'
        ];

        // Combine into one array for chart
        $result = [];
        foreach ($months as $num => $name) {
            $result[] = [
                'month'     => $name,
                'created'   => $createdData[$num] ?? 0,
                'completed' => $completedData[$num] ?? 0,
            ];
        }

        return response()->json($result);
    }

    // Updated productivityStats method in TaskController.php
    public function productivityStats(Request $request)
    {
        $user = $request->user();

        // Count total tasks and completed tasks for this user
        $totalTasks = $user->tasks()->count();
        $completedTasks = $user->tasks()->where('completed', true)->count();

        if ($totalTasks === 0) {
            $productivity = 0;
        } else {
            $productivity = round(($completedTasks / $totalTasks) * 100);
        }

        // Today's tasks
        $todayTasks = $user->tasks()->count();
        $todayCompleted = $user->tasks()->where('completed', true)->count();

        // Define target
        $target = 85;

        // Status label based on ranges
        if ($productivity >= $target) {
            $status = 'Excellent';
        } elseif ($productivity >= 70) {
            $status = 'Very Good';
        } elseif ($productivity >= 50) {
            $status = 'Good';
        } else {
            $status = 'Needs Improvement';
        }

        // Calculate remaining message
        $remaining = $this->calculateRemaining($productivity, $target);

        return response()->json([
            'productivity' => $productivity,
            'target' => $target,
            'status' => $status,
            'remaining' => $remaining,
            'streak' => $user->current_streak ?? 0,
            'longestStreak' => $user->longest_streak ?? 0,
            'todayCompleted' => $todayCompleted,
            'todayTotal' => $todayTasks,
            'streakStatus' => $user->streak_status ?? null,
            'nextMilestone' => $user->next_milestone ?? null,
        ]);
    }

    // Helper method for calculating remaining message
    private function calculateRemaining($productivity, $target)
    {
        if ($productivity >= $target) {
            return 'Target achieved! 🎯';
        }

        $remaining = $target - $productivity;
        return "{$remaining}% to target";
    }

    // Update your task completion method to trigger streak update


    // Alternative: If you have a separate complete task endpoint
    public function complete(Task $task)
    {
        $task->update(['completed' => true]);

        // Update user's streak
        $newStreak = auth()->user()->updateStreak();

        return response()->json([
            'message' => 'Task completed successfully! 🎉',
            'streak' => $newStreak,
            'task' => $task->fresh()
        ]);
    }


}
