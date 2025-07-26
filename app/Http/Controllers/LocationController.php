<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        $locations = \App\Models\Location::with('type')->get();
        $locationTypes = \App\Models\LocationType::all();

        return Inertia::render('locations/ManageLocationPage', [
            'locations' => $locations,
            'locationTypes' => $locationTypes,
        ]);
    }

    public function create()
    {
        $locationTypes = \App\Models\LocationType::all();

        return Inertia::render('locations/CreateLocationPage', [
            'locationTypes' => $locationTypes,
        ]);
    }

    public function show($id)
    {
        return redirect()->route('locations.edit', $id);
    }

    public function edit($id)
    {
        $location = \App\Models\Location::with('type')->findOrFail($id);
        $locationTypes = \App\Models\LocationType::all();

        return Inertia::render('locations/EditLocationPage', [
            'location' => $location,
            'locationTypes' => $locationTypes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'location_type_id' => 'required|exists:location_types,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $location = \App\Models\Location::create($request->all());

        $location->type()->associate($request->input('location_type_id'));
        $location->save();

        return redirect()->route('locations.index')->with('success', 'Location created successfully.');
    }

    public function update(Request $request, $id)
    {
        $location = \App\Models\Location::findOrFail($id);

        $request->validate([
            'location_type_id' => 'required|exists:location_types,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $location->update($request->all());

        $location->type()->associate($request->input('location_type_id'));
        $location->save();

        return redirect()->route('locations.index')->with('success', 'Location updated successfully.');
    }

    public function destroy($id)
    {
        $location = \App\Models\Location::findOrFail($id);
        $location->delete();
        return redirect()->route('locations.index')->with('success', 'Location deleted successfully.');
    }
}
