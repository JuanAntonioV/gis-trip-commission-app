<?php

namespace App\Http\Controllers;

use App\Entities\DeliveryStatusEntities;
use App\Entities\TripStatusEntities;
use App\Models\Delivery;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->query('from', Carbon::now()->subDays(30)->startOfDay()->toDateString());
        $to = $request->query('to', Carbon::now()->endOfDay()->toDateString());

        $reports = DB::table('trips')
            ->join('deliveries', 'trips.delivery_id', '=', 'deliveries.id')
            ->join('users as drivers', 'deliveries.driver_id', '=', 'drivers.id')
            ->leftJoin('users as helpers', 'deliveries.helper_id', '=', 'helpers.id')
            ->where('deliveries.status', DeliveryStatusEntities::COMPLETED)
            ->where('trips.status', TripStatusEntities::COMPLETED)
            ->whereBetween('deliveries.created_at', [$from, $to])
            ->select(
                DB::raw('COUNT(trips.id) as total_trips'),
                DB::raw('SUM(trips.trip_distance) as total_distance'),
                DB::raw('SUM(trips.trip_duration) as total_duration'),
                'drivers.id as driver_id',
                'drivers.name as driver_name',
                'helpers.name as helper_name',
                'helpers.id as helper_id',
                DB::raw('SUM(trips.trip_duration) * 200 as total_commission'),
                DB::raw('MAX(trips.created_at) as last_trip_date')
            )
            ->groupBy('deliveries.driver_id')
            // ->groupBy('deliveries.helper_id')
            ->get();

        return Inertia::render('reports/ManageReportPage', [
            'reports' => Inertia::defer(fn() => $reports),
        ]);
    }

    public function show(Request $request, $id)
    {
        $from = $request->query('from', Carbon::now()->subDays(30)->startOfDay()->toDateString());
        $to = $request->query('to', Carbon::now()->endOfDay()->toDateString());

        $report = DB::table('trips')
            ->join('deliveries', 'trips.delivery_id', '=', 'deliveries.id')
            ->join('users as drivers', 'deliveries.driver_id', '=', 'drivers.id')
            ->leftJoin('users as helpers', 'deliveries.helper_id', '=', 'helpers.id')
            ->where('deliveries.status', DeliveryStatusEntities::COMPLETED)
            ->whereBetween('deliveries.created_at', [$from, $to])
            ->where('drivers.id', $id)
            ->orWhere('helpers.id', $id)
            ->select(
                'drivers.id as driver_id',
                'helpers.id as helper_id',
                'drivers.name as driver_name',
                'helpers.name as helper_name',
                DB::raw('COUNT(trips.id) as total_trips'),
                DB::raw('SUM(trips.trip_distance) as total_distance'),
                DB::raw('SUM(trips.trip_duration) as total_duration'),
                DB::raw('SUM(trips.trip_duration) * 200 as total_commission'),
                DB::raw('MAX(trips.created_at) as last_trip_date')
            )
            ->first();

        $allTrips =  \App\Models\Trip::with(['delivery.vehicle', 'delivery.driver', 'delivery.helper', 'delivery.status', 'status', 'destinationLocation'])
            ->whereHas('delivery', function ($query) use ($id) {
                $query->where('driver_id', $id)
                    ->orWhere('helper_id', $id)
                    ->where('status', DeliveryStatusEntities::COMPLETED);
            })
            ->where('status', TripStatusEntities::COMPLETED)
            ->whereBetween('created_at', [$from, $to])
            ->withCount('items as total_items')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('reports/ReportDetailPage', [
            'report' => Inertia::defer(fn() => $report),
            'allTrips' => Inertia::defer(fn() => $allTrips),
        ]);
    }
}
