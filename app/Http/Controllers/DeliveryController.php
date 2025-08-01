<?php

namespace App\Http\Controllers;

use App\Entities\DeliveryStatusEntities;
use App\Entities\TripStatusEntities;
use App\Models\Trip;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    public function index()
    {
        $deliveries = \App\Models\Delivery::with(['vehicle', 'driver', 'helper', 'status', 'items.location'])
            ->withCount('items as total_items')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('deliveries/ManageDeliveryPage', [
            'deliveries' => Inertia::defer(fn() => $deliveries),
        ]);
    }

    public function showMaps($id)
    {
        $userRole = Auth::user()->roles->first()->name;
        $isAdmin = $userRole === 'admin' || $userRole === 'super admin';

        $delivery = \App\Models\Delivery::with(['vehicle', 'driver', 'helper', 'status', 'staff', 'cancelledStaff', 'items.location'])
            ->with(['items' => function ($query) {
                $query->select('delivery_items.*', DB::raw('COUNT(*) as item_count'))
                    ->whereDoesntHave('tripItem')->orWhereHas('tripItem.trip', function ($q) {
                        $q->whereIn('status', [TripStatusEntities::CANCELLED]);
                    })->groupBy('location_id');
            }])
            ->withCount('items as total_items')
            ->findOrFail($id);

        return Inertia::render('deliveries/DeliveryMapsPage', [
            'delivery' => $delivery,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function showDetailMaps($id, $tripId)
    {
        $userRole = Auth::user()->roles->first()->name;
        $isAdmin = $userRole === 'admin' || $userRole === 'super admin';

        $delivery = \App\Models\Delivery::with(['vehicle', 'driver', 'helper', 'status', 'items.location', 'staff', 'cancelledStaff'])
            ->withCount('items as total_items')
            ->findOrFail($id);

        $trip = Trip::with(['delivery.vehicle', 'delivery.driver', 'delivery.helper', 'delivery.status', 'status'])
            ->withCount('items as total_items')
            ->where('id', $tripId)
            ->where('delivery_id', $id)
            ->orderBy('created_at', 'desc')
            ->firstOrFail();

        return Inertia::render('deliveries/DeliveryDetailMapsPage', [
            'delivery' => $delivery,
            'tripId' => $tripId,
            'isAdmin' => $isAdmin,
            'trip' => $trip,
        ]);
    }

    public function showStopDetailMaps($id, $tripStopId)
    {
        $userRole = Auth::user()->roles->first()->name;
        $isAdmin = $userRole === 'admin' || $userRole === 'super admin';

        $delivery = \App\Models\Delivery::with(['vehicle', 'driver', 'helper', 'status', 'items.location', 'staff', 'cancelledStaff'])
            ->withCount('items as total_items')
            ->findOrFail($id);

        $tripStop = \App\Models\TripStop::with(['delivery'])
            ->where('id', $tripStopId)
            ->where('delivery_id', $id)
            ->firstOrFail();

        return Inertia::render('deliveries/TripStopDetailMapsPage', [
            'delivery' => $delivery,
            'tripStop' => $tripStop,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create()
    {
        $vehicles = \App\Models\Vehicle::all();
        $drivers = \App\Models\User::role('driver')->get();
        $helpers = \App\Models\User::role('helper')->get();
        $locations = \App\Models\Location::all();
        $generatedId = \App\Models\Delivery::generateId();

        return Inertia::render('deliveries/CreateDeliveryPage', [
            'generatedId' => $generatedId,
            'vehicles' => $vehicles,
            'drivers' => $drivers,
            'helpers' => $helpers,
            'locations' => $locations,
        ]);
    }

    public function show($id)
    {
        $userRole = Auth::user()->roles->first()->name;
        $isAdmin = $userRole === 'admin' || $userRole === 'super admin';

        $delivery = \App\Models\Delivery::with(['vehicle', 'driver', 'helper', 'status', 'items.location', 'staff', 'cancelledStaff'])
            ->withCount('items as total_items')
            ->findOrFail($id);

        return Inertia::render('deliveries/DeliveryDetailPage', [
            'delivery' => $delivery,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:users,id',
            'helper_id' => 'nullable|exists:users,id',
            'scheduled_at' => 'required|date',
            'items' => 'required|array',
            'items.*.location_id' => 'required|exists:locations,id',
            'items.*.invoice_number' => 'nullable|string|max:255',
            'items.*.weight' => 'nullable|numeric|min:0',
        ]);

        $data['created_by'] = Auth::id();
        $data['status'] = DeliveryStatusEntities::PENDING;
        $data['scheduled_at'] = $data['scheduled_at'] ? Carbon::parse($data['scheduled_at'])->toDateTimeString() : null;

        if (!isset($data['id'])) {
            $data['id'] = \App\Models\Delivery::generateId();
        }

        // check vehicle availability at the scheduled time
        $vehicle = \App\Models\Vehicle::findOrFail($data['vehicle_id']);
        $isAvailable = $vehicle->deliveries()
            ->where('status', DeliveryStatusEntities::PENDING)
            ->where(function ($query) use ($data) {
                $query->whereBetween('scheduled_at', [
                    Carbon::parse($data['scheduled_at'])->startOfDay(),
                    Carbon::parse($data['scheduled_at'])->endOfDay(),
                ]);
            })->doesntExist();

        if (!$isAvailable) {
            return redirect()->back()->withErrors(['vehicle_id' => 'Vehicle is not available at the scheduled time.']);
        }

        // check driver availability at the scheduled time
        $driver = \App\Models\User::findOrFail($data['driver_id']);
        $isDriverAvailable = $driver->deliveries()
            ->where('status', DeliveryStatusEntities::PENDING)
            ->where(function ($query) use ($data) {
                $query->whereBetween('scheduled_at', [
                    Carbon::parse($data['scheduled_at'])->startOfDay(),
                    Carbon::parse($data['scheduled_at'])->endOfDay(),
                ]);
            })->doesntExist();

        if (!$isDriverAvailable) {
            return redirect()->back()->withErrors(['driver_id' => 'Driver is not available at the scheduled time.']);
        }

        // check helper availability at the scheduled time
        if (isset($data['helper_id'])) {
            $helper = \App\Models\User::findOrFail($data['helper_id']);
            $isHelperAvailable = $helper->deliveries()
                ->where('status', DeliveryStatusEntities::PENDING)
                ->where(function ($query) use ($data) {
                    $query->whereBetween('scheduled_at', [
                        Carbon::parse($data['scheduled_at'])->startOfDay(),
                        Carbon::parse($data['scheduled_at'])->endOfDay(),
                    ]);
                })->doesntExist();
            if (!$isHelperAvailable) {
                return redirect()->back()->withErrors(['helper_id' => 'Helper is not available at the scheduled time.']);
            }
        }


        DB::beginTransaction();
        try {
            $delivery = \App\Models\Delivery::create($data);
            foreach ($data['items'] as $item) {
                DB::table('delivery_items')->insert([
                    'delivery_id' => $delivery->id,
                    'location_id' => $item['location_id'],
                    'invoice_number' => $item['invoice_number'] ?? null,
                    'weight' => $item['weight'] ?? 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['items' => 'Failed to create delivery items.']);
        }

        return redirect()->route('deliveries.index')->with('success', 'Delivery created successfully.');
    }
}
