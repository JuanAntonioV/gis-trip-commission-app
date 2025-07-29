<?php

namespace App\Http\Controllers;

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

        $totalDeliveries = \App\Models\Delivery::when(!$isAdmin, function ($query) use ($userId) {
            return $query->where('user_id', $userId);
        })->count();

        // $totalTrips = \App\Models\Trip::when(!$isAdmin, function ($query) use ($userId) {
        //     return $query->where('user_id', $userId);
        // })->count();

        return Inertia::render('dashboard', [
            'total_deliveries' => Inertia::defer(fn() => $totalDeliveries),
            // 'total_trips' => $totalTrips,
        ]);
    }
}
