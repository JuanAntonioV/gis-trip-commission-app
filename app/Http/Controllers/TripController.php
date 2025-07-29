<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TripController extends Controller
{
    public function index()
    {
        $trips = \App\Models\Trip::with(['delivery.vehicle', 'delivery.driver', 'delivery.helper'])
            ->withCount('items as items_items')
            ->get();

        return Inertia::render('trips/ManageTripPage', [
            'trips' => $trips
        ]);
    }
}
