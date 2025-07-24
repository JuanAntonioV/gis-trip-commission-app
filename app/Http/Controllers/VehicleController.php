<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = \App\Models\Vehicle::all();
        return Inertia::render('vehicles/ManageVehiclePage', [
            'vehicles' => Inertia::defer(fn() => $vehicles)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'license_plate' => 'required|string|max:255|unique:vehicles',
            'capacity' => 'required|integer|min:0',
            'available' => 'boolean',
        ]);

        \App\Models\Vehicle::create($request->all());

        return redirect()->route('vehicles.index')->with('success', 'Vehicle created successfully.');
    }

    public function update(Request $request, $vehicle)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'license_plate' => 'required|string|max:255|unique:vehicles,license_plate,' . $vehicle,
            'capacity' => 'required|integer|min:0',
            'available' => 'boolean',
        ]);

        $vehicle = \App\Models\Vehicle::findOrFail($vehicle);
        $vehicle->update($request->all());

        return redirect()->route('vehicles.index')->with('success', 'Vehicle updated successfully.');
    }

    public function destroy($vehicle)
    {
        $vehicle = \App\Models\Vehicle::findOrFail($vehicle);
        $vehicle->delete();

        return redirect()->route('vehicles.index')->with('success', 'Vehicle deleted successfully.');
    }
}
