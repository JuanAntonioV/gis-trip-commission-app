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
use Termwind\Components\Raw;

class TripController extends Controller
{
    public function index()
    {
        $trips = \App\Models\Trip::with(['delivery.vehicle', 'delivery.driver', 'delivery.helper', 'delivery.status', 'status', 'destinationLocation'])
            ->withCount('items as total_items')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('trips/ManageTripPage', [
            'trips' => $trips
        ]);
    }

    public function show($id)
    {
        $isAdmin = Auth::user()->hasRole('admin') || Auth::user()->hasRole('super admin');

        $trip = \App\Models\Trip::with(['delivery.vehicle', 'delivery.driver', 'delivery.helper', 'delivery.status', 'status', 'destinationLocation', 'items.location'])
            ->withCount('items as total_items')
            ->where('id', $id)
            ->firstOrFail();

        return Inertia::render('trips/TripDetailPage', [
            'trip' => $trip,
            'isAdmin' => $isAdmin,
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
            'destination_location_id' => $selectedTrips->isNotEmpty() ? $selectedTrips->first()->location->id : 'Unknown',
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

    public function cancelTrip(Request $request)
    {
        $request->validate([
            'trip_id' => 'required|exists:trips,id',
            'cancel_reason' => 'required|string|max:255',
        ]);

        $id = $request->input('trip_id');

        $trip = \App\Models\Trip::findOrFail($id);

        DB::beginTransaction();
        try {
            $trip->status = TripStatusEntities::CANCELLED;
            $trip->cancellation_reason = 'Dibatalkan oleh pengguna. Alasan: ' . $request->input('cancel_reason');
            $trip->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['message' => 'Failed to cancel trip: ' . $e->getMessage()]);
        }

        return redirect()->route('deliveries.showDetailMaps', [
            'delivery' => $trip->delivery_id,
            'tripId' => $trip->id,
        ])->with('success', 'Trip cancelled successfully.');
    }

    public function completeTrip(Request $request)
    {
        $request->validate([
            'trip_id' => 'required|exists:trips,id',
            'latitude' => 'required|string',
            'longitude' => 'required|string',
            'notes' => 'nullable|string|max:255',
            'ending_km' => 'required|numeric',
        ]);

        $id = $request->input('trip_id');
        $endingKm = $request->input('ending_km');
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');
        $notes = $request->input('notes');

        $trip = \App\Models\Trip::findOrFail($id);

        if ($endingKm < $trip->starting_km) {
            return redirect()->back()->withErrors(['ending_km' => 'Kilometer akhir tidak boleh kurang dari kilometer awal.']);
        }

        DB::beginTransaction();
        try {
            $startingKm = $trip->starting_km;

            $trip->trip_duration = Carbon::parse($trip->start_time)->diffInSeconds(now());
            $trip->trip_distance = round($endingKm - $startingKm, 2);
            $trip->status = TripStatusEntities::COMPLETED;
            $trip->destination_latitude = $latitude;
            $trip->destination_longitude = $longitude;
            $trip->notes = $notes;
            $trip->ending_km = $endingKm;
            $trip->end_time = now();
            $trip->save();

            // Update delivery status if necessary
            $totalDeliveryItems = $trip->delivery->items->count();
            $completedItems = \App\Models\TripItem::whereHas('trip', function ($query) use ($trip) {
                $query
                    ->where('delivery_id', $trip->delivery_id)
                    ->where('status', TripStatusEntities::COMPLETED);
            })->count();

            if ($totalDeliveryItems === $completedItems) {
                $trip->delivery->status = DeliveryStatusEntities::COMPLETED;
                $trip->delivery->finished_at = now();
                $trip->delivery->save();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['message' => 'Failed to complete trip: ' . $e->getMessage()]);
        }

        return redirect()->route('deliveries.showDetailMaps', [
            'delivery' => $trip->delivery_id,
            'tripId' => $trip->id,
        ])->with('success', 'Trip completed successfully.');
    }
}
