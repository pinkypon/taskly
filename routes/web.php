<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\PreventBackHistory;
use Illuminate\Support\Facades\Auth;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });
Route::get('/test-auth', function () {
    return response()->json(['auth' => Auth::check(), 'user' => Auth::user()]);
});

Route::middleware(['web'])->group(function () {
    // Public API endpoints for login and registration
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);

    // Apply NoCacheHeaders to your SPA entrypoint
    Route::middleware('nocache')->group(function () {
        Route::get('/{any}', function () {
            return view('app'); // React SPA entrypoint (resources/views/app.blade.php)
        })->where('any', '.*');
    });
});


