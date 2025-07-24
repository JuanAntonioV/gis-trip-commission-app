<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationTypeController extends Controller
{
    public function index()
    {
        $locationTypes = \App\Models\LocationType::all();
        return Inertia::render('locationTypes/ManageLocationTypePage', [
            'locationTypes' => Inertia::defer(fn() => $locationTypes)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        \App\Models\LocationType::create($request->all());

        return redirect()->route('location-types.index')->with('success', 'LocationType created successfully.');
    }

    public function update(Request $request, $locationType)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $locationType = \App\Models\LocationType::findOrFail($locationType);
        $locationType->update($request->all());

        return redirect()->route('location-types.index')->with('success', 'LocationType updated successfully.');
    }

    public function destroy($locationType)
    {
        $locationType = \App\Models\LocationType::findOrFail($locationType);
        $locationType->delete();

        return redirect()->route('location-types.index')->with('success', 'LocationType deleted successfully.');
    }
}
