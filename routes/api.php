<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are prefixed automatically with `/api` and use the "api"
| middleware group. For Sanctum session-based auth, `auth:sanctum` is required.
|
*/

// ✅ These routes require the user to be logged in via session

// // Test validation error
// Route::post('/test/validation', function (Request $request) {
//     $request->validate([
//         'required_field' => 'required|string|min:5',
//         'email_field' => 'required|email',
//     ]);
//     return response()->json(['message' => 'Validation passed']);
// });

// // Test authentication error (✅ Fixed - uses Request instead of auth() helper)
// Route::get('/test/auth', function (Request $request) {
//     return $request->user(); // ✅ Will throw AuthenticationException if not logged in
// })->middleware('auth:sanctum');

// // Test authorization error
// Route::get('/test/forbidden', function () {
//     abort(403, 'You cannot access this resource');
// });

// // Test not found error
// Route::get('/test/not-found', function () {
//     $task = \App\Models\Task::findOrFail(99999); // Non-existent ID
//     return $task;
// })->middleware('auth:sanctum');

// // Test generic server error
// Route::get('/test/server-error', function () {
//     throw new \Exception('This is a test server error');
// });

// // Test database error (if you want to test DB connection issues)
// Route::get('/test/database-error', function () {
//     DB::statement('SELECT * FROM non_existent_table');
// });

// // Test throttle error (very restrictive limit for testing)
// Route::get('/test/throttle', function () {
//     return response()->json(['message' => 'This endpoint has strict rate limiting']);
// })->middleware('throttle:2,1'); // Only 2 requests per minute

Route::get('/user', function (Request $request) {
    return $request->user() ?? null;
});


Route::middleware(['auth:sanctum'])->group(function () {
    // ✅ Get the authenticated user

    // ✅ Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // ✅ Task CRUD
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/bar-chart', [TaskController::class, 'barChart']); // <— New method here
    Route::get('/tasks/status-counts', [TaskController::class, 'getTaskStatusCounts']); // ✅ MOVE THIS ABOVE
    Route::get('/tasks/priority-counts', [TaskController::class, 'priorityCounts']);
    Route::get('/tasks/productivity', [TaskController::class, 'productivityStats']);
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);


});
