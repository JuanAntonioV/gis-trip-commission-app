<?php

namespace App\Http\Controllers;

use App\Entities\DeliveryStatusEntities;
use App\Entities\TripStatusEntities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $userRole = Auth::user()->roles->first()->name;
        $isAdmin = $userRole === 'admin' || $userRole === 'super admin';
        $isDriver = $userRole === 'driver' || $userRole === 'helper';

        $totalDeliveries = \App\Models\Delivery::when(!$isAdmin, function ($query) use ($userId) {
            return $query->where('driver_id', $userId)
                ->orWhere('helper_id', $userId)
                ->whereDate('scheduled_at', now());
        })->count();

        $totalAvailableVehicles = \App\Models\Vehicle::whereDoesntHave('deliveries', function ($query) {
            $query->whereDate('scheduled_at', now());
        })->count();

        $totalProgressTrips = \App\Models\Delivery::when(!$isAdmin, function ($query) use ($userId) {
            return $query->where('driver_id', $userId)
                ->orWhere('helper_id', $userId);
        })->whereHas('trips', function ($query) {
            $query->where('status', TripStatusEntities::IN_PROGRESS);
        })->count();

        $totalCompletedTrips = \App\Models\Trip::when(!$isAdmin, function ($query) use ($userId) {
            return $query->whereHas('delivery', function ($query) use ($userId) {
                $query->where('driver_id', $userId)
                    ->orWhere('helper_id', $userId);
            });
        })->where('status', TripStatusEntities::COMPLETED)->count();

        $latestDeliveries = \App\Models\Delivery::with(['vehicle', 'driver', 'helper', 'status', 'items.location'])
            ->where('scheduled_at', '>=', now()->subDays(7))
            ->withCount('items as total_items')
            ->when(!$isAdmin, function ($query) use ($userId) {
                return $query->where('driver_id', $userId)->orWhere('helper_id', $userId);
            })->latest()->take(5)->get();

        $latestTrips = \App\Models\Trip::with(['delivery.vehicle', 'delivery.driver', 'delivery.helper', 'destinationLocation', 'status'])
            ->withCount('items as total_items')
            ->when(!$isAdmin, function ($query) use ($userId) {
                return $query->whereHas('delivery', function ($query) use ($userId) {
                    $query->where('driver_id', $userId)
                        ->orWhere('helper_id', $userId);
                });
            })->latest()->take(5)->get();

        $fastestDurationOfTrip = \App\Models\Trip::when(!$isAdmin, function ($query) use ($userId) {
            return $query->whereHas('delivery', function ($query) use ($userId) {
                $query->where('driver_id', $userId)
                    ->orWhere('helper_id', $userId);
            });
        })->where('status', TripStatusEntities::COMPLETED)
            ->orderBy('trip_duration', 'asc')
            ->orderBy('created_at', 'desc')
            ->selectRaw('TIMESTAMPDIFF(MINUTE, start_time, end_time) as duration_in_minutes')
            ->get()
            ->map(function ($trip) {
                $hours = intdiv($trip->duration_in_minutes, 60);
                $minutes = $trip->duration_in_minutes % 60;
                $trip->hours = $hours;
                $trip->minutes = $minutes;
                return $trip;
            })
            ->first();

        return Inertia::render('dashboard', [
            'is_admin' => $isAdmin,
            'is_driver' => $isDriver,
            'user_role' => $userRole,
            'total_deliveries' => Inertia::defer(fn() => $totalDeliveries ?? 0),
            'total_available_vehicles' => Inertia::defer(fn() => $totalAvailableVehicles ?? 0),
            'total_progress_trips' => Inertia::defer(fn() => $totalProgressTrips ?? 0),
            'total_completed_trips' => Inertia::defer(fn() => $totalCompletedTrips ?? 0),
            'latest_deliveries' => Inertia::defer(fn() => $latestDeliveries ?? []),
            'latest_trips' => Inertia::defer(fn() => $latestTrips ?? []),
            'fastest_duration_of_trip' => Inertia::defer(fn() => $fastestDurationOfTrip ?? ['hours' => 0, 'minutes' => 0]),
        ]);
    }
}
