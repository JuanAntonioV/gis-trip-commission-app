<?php

namespace App\Http\Controllers;

use App\Entities\DeliveryStatusEntities;
use App\Entities\TripStatusEntities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function startTrip(Request $request)
    {
        $request->validate([
            'delivery_id' => 'required|exists:deliveries,id',
            'location_id' => 'nullable|exists:delivery_items,location_id',
            'latitude' => 'required|string',
            'longitude' => 'required|string',
            'starting_km' => 'required|numeric',
        ]);

        $deliveryId = $request->input('delivery_id');
        $locationId = $request->input('location_id');
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');
        $startingKm = $request->input('starting_km');

        $delivery = \App\Models\Delivery::with('items')->findOrFail($deliveryId);

        $selectedTrips = [];
        $totalWeight = 0;

        if ($locationId) {
            $selectedTrips = $delivery->items->where('location_id', $locationId);

            if ($selectedTrips->isEmpty()) {
                return redirect()->back()->withErrors(['message' => 'Trip not found for the selected delivery item.']);
            }

            $totalWeight = $selectedTrips->sum('weight');
        }

        $data = [
            'delivery_id' => $delivery->id,
            'destination_name' => $selectedTrips->isNotEmpty() ? $selectedTrips->first()->location->name : 'Unknown',
            'origin_latitude' => $latitude,
            'origin_longitude' => $longitude,
            'starting_km' => $startingKm,
            'start_time' => now(),
            'trip_weight' => $totalWeight,
            'status' => TripStatusEntities::IN_PROGRESS,
        ];

        DB::beginTransaction();
        try {
            $trip = \App\Models\Trip::create($data);

            if ($selectedTrips->isNotEmpty()) {
                foreach ($selectedTrips as $item) {
                    $trip->items()->attach($item->id);
                }
            }

            if ($delivery->status !== DeliveryStatusEntities::IN_PROGRESS) {
                $delivery->status = DeliveryStatusEntities::IN_PROGRESS;
                $delivery->started_at = now();
                $delivery->save();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['message' => 'Failed to start trip: ' . $e->getMessage()]);
        }

        return redirect()->route('deliveries.showDetailMaps', [
            'delivery' => $delivery->id,
            'tripId' => $trip->id,
        ])->with('success', 'Trip started successfully.');
    }
}
