<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\HomeController::class, 'canRegister'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/kelola-kendaraan', [\App\Http\Controllers\VehicleController::class, 'index'])->name('vehicles.index');

    Route::prefix('vehicle')->group(function () {
        Route::post('/', [\App\Http\Controllers\VehicleController::class, 'store'])->name('vehicles.store');
        Route::get('/{vehicle}', [\App\Http\Controllers\VehicleController::class, 'show'])->name('vehicles.show');
        Route::put('/{vehicle}', [\App\Http\Controllers\VehicleController::class, 'update'])->name('vehicles.update');
        Route::delete('/{vehicle}', [\App\Http\Controllers\VehicleController::class, 'destroy'])->name('vehicles.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
