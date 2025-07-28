<?php

namespace App\Http\Controllers;

use App\Entities\DeliveryStatusEntities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function create()
    {
        $vehicles = \App\Models\Vehicle::all();
        $drivers = \App\Models\User::role('driver')->get();
        $helpers = \App\Models\User::role('helper')->get();
        $locations = \App\Models\Location::all();

        return Inertia::render('deliveries/CreateDeliveryPage', [
            'vehicles' => $vehicles,
            'drivers' => $drivers,
            'helpers' => $helpers,
            'locations' => $locations,
        ]);
    }

    public function show($id)
    {
        $delivery = \App\Models\Delivery::with(['vehicle', 'driver', 'helper', 'status', 'items.location'])
            ->findOrFail($id);

        return Inertia::render('deliveries/DeliveryDetailPage', [
            'delivery' => $delivery,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:users,id',
            'helper_id' => 'nullable|exists:users,id',
            'scheduled_at' => 'required|date',
            'items' => 'required|array',
            'items.*.location_id' => 'required|exists:locations,id',
            'items.*.invoice_number' => 'required|string|max:255',
            'items.*.weight' => 'required|numeric',
        ]);

        $data['created_by'] = Auth::id();
        $data['status'] = DeliveryStatusEntities::PENDING;

        $delivery = \App\Models\Delivery::create($data);

        foreach ($data['items'] as $item) {
            $delivery->items()->create($item);
        }

        return redirect()->route('deliveries.index')->with('success', 'Delivery created successfully.');
    }

    public function cancel(Request $request, $id)
    {
        $data = $request->validate([
            'cancel_reason' => 'required|string|max:255',
        ]);

        $delivery = \App\Models\Delivery::findOrFail($id);

        if ($delivery->status !== DeliveryStatusEntities::PENDING) {
            return redirect()->back()->with('error', 'Only pending deliveries can be canceled.');
        }

        $delivery->update([
            'status' => DeliveryStatusEntities::CANCELLED,
            'cancel_reason' => $data['cancel_reason'],
            'canceled_by' => Auth::id(),
        ]);

        return redirect()->route('deliveries.index')->with('success', 'Delivery canceled successfully.');
    }
}
