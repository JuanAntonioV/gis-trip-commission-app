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

    Route::get('/kelola-lokasi', [\App\Http\Controllers\LocationController::class, 'index'])->name('locations.index');
    Route::get('/kelola-lokasi/buat', [\App\Http\Controllers\LocationController::class, 'create'])->name('locations.create');
    Route::get('/kelola-lokasi/{location}', [\App\Http\Controllers\LocationController::class, 'show'])->name('locations.show');
    Route::get('/kelola-lokasi/{location}/edit', [\App\Http\Controllers\LocationController::class, 'edit'])->name('locations.edit');

    Route::prefix('locations')->group(function () {
        Route::post('/', [\App\Http\Controllers\LocationController::class, 'store'])->name('locations.store');
        Route::put('/{location}', [\App\Http\Controllers\LocationController::class, 'update'])->name('locations.update');
        Route::delete('/{location}', [\App\Http\Controllers\LocationController::class, 'destroy'])->name('locations.destroy');
    });

    Route::get('/kelola-pengiriman', [\App\Http\Controllers\DeliveryController::class, 'index'])->name('deliveries.index');
    Route::get('/kelola-pengiriman/buat', [\App\Http\Controllers\DeliveryController::class, 'create'])->name('deliveries.create');
    Route::get('/kelola-pengiriman/{delivery}', [\App\Http\Controllers\DeliveryController::class, 'show'])->name('deliveries.show');

    Route::prefix('deliveries')->group(function () {
        Route::post('/', [\App\Http\Controllers\DeliveryController::class, 'store'])->name('deliveries.store');
        Route::patch('/{delivery}/cancel', [\App\Http\Controllers\DeliveryController::class, 'cancel'])->name('deliveries.cancel')->middleware('password.confirm');
    });

    Route::get('/kelola-karyawan', [\App\Http\Controllers\EmployeeController::class, 'index'])->name('employees.index');
    Route::get('/kelola-karyawan/buat', [\App\Http\Controllers\EmployeeController::class, 'create'])->name('employees.create');
    Route::get('/kelola-karyawan/{employee}/edit', [\App\Http\Controllers\EmployeeController::class, 'edit'])->name('employees.edit');

    Route::prefix('employees')->group(function () {
        Route::post('/', [\App\Http\Controllers\EmployeeController::class, 'store'])->name('employees.store');
        Route::put('/{employee}', [\App\Http\Controllers\EmployeeController::class, 'update'])->name('employees.update');
        Route::put('/{employee}/change-password', [\App\Http\Controllers\EmployeeController::class, 'changePassword'])->name('employees.change-password')
            ->middleware('password.confirm');
        Route::delete('/{employee}', [\App\Http\Controllers\EmployeeController::class, 'destroy'])->name('employees.destroy')
            ->middleware('password.confirm');
    });

    Route::get('/kelola-trips', [\App\Http\Controllers\TripController::class, 'index'])->name('trips.index');
    Route::get('/kelola-trips/buat', [\App\Http\Controllers\TripController::class, 'create'])->name('trips.create');
    Route::get('/kelola-trips/{trip}', [\App\Http\Controllers\TripController::class, 'show'])->name('trips.show');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
