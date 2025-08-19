<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;

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



Route::middleware('auth:sanctum')->group(function () {
    // ✅ Get the authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

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
