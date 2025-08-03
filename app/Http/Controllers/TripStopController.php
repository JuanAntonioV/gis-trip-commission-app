<?php

namespace App\Http\Controllers;

use App\Entities\TripStatusEntities;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TripStopController extends Controller
{
    public function startTripStop(Request $request)
    {
        $request->validate([
            'delivery_id' => 'required|exists:deliveries,id',
            'destination_name' => 'required|string|max:255',
            'latitude' => 'required|string',
            'longitude' => 'required|string',
            'starting_km' => 'required|numeric',
            'notes' => 'nullable|string|max:500',
        ]);

        $deliveryId = $request->input('delivery_id');
        $destinationName = $request->input('destination_name');
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');
        $startingKm = $request->input('starting_km');
        $notes = $request->input('notes', '');

        $delivery = \App\Models\Delivery::findOrFail($deliveryId);

        $lastTrip = $delivery->trips()->latest()->first();

        $data = [
            'delivery_id' => $deliveryId,
            'destination_name' => $destinationName,
            'origin_latitude' => $latitude,
            'origin_longitude' => $longitude,
            'starting_km' => $startingKm,
            'start_time' => now(),
            'notes' => $notes,
            'status' => TripStatusEntities::IN_PROGRESS,
            'before_trip_id' => $lastTrip ? $lastTrip->id : null,
        ];

        DB::beginTransaction();
        try {
            $tripStop = \App\Models\TripStop::create($data);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['message' => 'Failed to start trip stop: ' . $e->getMessage()]);
        }

        return redirect()->route('deliveries.showStopDetailMaps', [
            'delivery' => $delivery->id,
            'tripStopId' => $tripStop->id,
        ])->with('success', 'Trip stop started successfully.');
    }

    public function cancelTripStop(Request $request)
    {
        $request->validate([
            'trip_stop_id' => 'required|exists:trip_stops,id',
        ]);

        $tripStopId = $request->input('trip_stop_id');

        $tripStop = \App\Models\TripStop::findOrFail($tripStopId);
        $tripStop->status = TripStatusEntities::CANCELLED;
        $tripStop->save();

        return redirect()->back()->with('success', 'Trip stop cancelled successfully.');
    }

    public function completeTripStop(Request $request)
    {
        $request->validate([
            'trip_stop_id' => 'required|exists:trip_stops,id',
            'ending_km' => 'required|numeric',
            'latitude' => 'required|string',
            'longitude' => 'required|string',
        ]);

        $tripStopId = $request->input('trip_stop_id');
        $endingKm = $request->input('ending_km');
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');

        $tripStop = \App\Models\TripStop::findOrFail($tripStopId);
        $tripStop->status = TripStatusEntities::COMPLETED;
        $tripStop->ending_km = $endingKm;
        $tripStop->destination_latitude = $latitude;
        $tripStop->destination_longitude = $longitude;
        $tripStop->trip_distance = $endingKm - $tripStop->starting_km;
        $tripStop->trip_duration = Carbon::parse($tripStop->start_time)->diffInSeconds(now());
        $tripStop->end_time = now();
        $tripStop->save();

        return redirect()->back()->with('success', 'Trip stop completed successfully.');
    }
}
