<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\HomeController::class, 'canRegister'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/kelola-kendaraan', [\App\Http\Controllers\VehicleController::class, 'index'])->name('vehicles.index');

    Route::prefix('vehicles')->group(function () {
        Route::post('/', [\App\Http\Controllers\VehicleController::class, 'store'])->name('vehicles.store');
        Route::put('/{vehicle}', [\App\Http\Controllers\VehicleController::class, 'update'])->name('vehicles.update');
        Route::delete('/{vehicle}', [\App\Http\Controllers\VehicleController::class, 'destroy'])->name('vehicles.destroy');
    });

    Route::get('/kelola-tipe-lokasi', [\App\Http\Controllers\LocationTypeController::class, 'index'])->name('location-types.index');

    Route::prefix('location-types')->group(function () {
        Route::post('/', [\App\Http\Controllers\LocationTypeController::class, 'store'])->name('location-types.store');
        Route::put('/{locationType}', [\App\Http\Controllers\LocationTypeController::class, 'update'])->name('location-types.update');
        Route::delete('/{locationType}', [\App\Http\Controllers\LocationTypeController::class, 'destroy'])->name('location-types.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
