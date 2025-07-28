<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'name',
        'license_plate',
        'type',
        'capacity',
        'available',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'available' => 'boolean',
    ];

    public function deliveries()
    {
        return $this->hasMany(Delivery::class);
    }
}
